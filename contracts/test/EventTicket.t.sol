// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";

contract EventTicketTest is Test {
    EventTicket public ticket;
    IdentityRegistry public registry;

    address public owner;
    address public organizer;
    address public buyer1;
    address public buyer2;

    uint256 public eventDate;
    uint256 public basePrice = 0.1 ether;

    function setUp() public {
        owner = address(this);
        organizer = makeAddr("organizer");
        buyer1 = makeAddr("buyer1");
        buyer2 = makeAddr("buyer2");

        eventDate = block.timestamp + 30 days;

        registry = new IdentityRegistry();

        EventTicket.ResaleConfig memory config = EventTicket.ResaleConfig({
            maxPriceMultiplier: 150,
            minHoldPeriod: 1 days,
            maxTransfers: 2,
            royaltyBps: 500
        });

        ticket =
            new EventTicket("Concert Ticket", "TIX", "Summer Festival", eventDate, basePrice, address(registry), organizer, config);

        vm.deal(buyer1, 10 ether);
        vm.deal(buyer2, 10 ether);
    }

    function test_MintTicket() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        assertEq(ticket.ownerOf(0), buyer1);
        assertEq(ticket.balanceOf(buyer1), 1);
    }

    function test_RevertWhen_BuyerNotVerified() public {
        vm.prank(buyer1);
        vm.expectRevert("Buyer not verified");
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");
    }

    function test_RevertWhen_AlreadyPurchased() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.prank(buyer1);
        vm.expectRevert("Already purchased");
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 2, Seat 1");
    }

    function test_RevertWhen_InsufficientPayment() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        vm.expectRevert("Insufficient payment");
        ticket.mintTicket{value: 0.05 ether}(buyer1, "Section A, Row 1, Seat 1");
    }

    function test_TransferAfterHoldPeriod() public {
        registry.verifyAddress(buyer1);
        registry.verifyAddress(buyer2);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(buyer1);
        ticket.transferFrom(buyer1, buyer2, 0);

        assertEq(ticket.ownerOf(0), buyer2);
    }

    function test_RevertWhen_TransferBeforeHoldPeriod() public {
        registry.verifyAddress(buyer1);
        registry.verifyAddress(buyer2);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.prank(buyer1);
        vm.expectRevert("Hold period not met");
        ticket.transferFrom(buyer1, buyer2, 0);
    }

    function test_RevertWhen_RecipientNotVerified() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(buyer1);
        vm.expectRevert("Buyer not verified");
        ticket.transferFrom(buyer1, buyer2, 0);
    }

    function test_RevertWhen_MaxTransfersExceeded() public {
        registry.verifyAddress(buyer1);
        registry.verifyAddress(buyer2);
        address buyer3 = makeAddr("buyer3");
        registry.verifyAddress(buyer3);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        uint256 firstTransferTime = block.timestamp + 1 days + 1;
        vm.warp(firstTransferTime);
        vm.prank(buyer1);
        ticket.transferFrom(buyer1, buyer2, 0);

        uint256 secondTransferTime = firstTransferTime + 1 days + 1;
        vm.warp(secondTransferTime);
        vm.prank(buyer2);
        ticket.transferFrom(buyer2, buyer3, 0);

        uint256 thirdTransferTime = secondTransferTime + 1 days + 1;
        vm.warp(thirdTransferTime);
        vm.prank(buyer3);
        vm.expectRevert("Max transfers exceeded");
        ticket.transferFrom(buyer3, buyer1, 0);
    }

    function test_RedeemTicket() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.prank(buyer1);
        ticket.redeemTicket(0);

        (, , , , bool redeemed) = ticket.tickets(0);
        assertTrue(redeemed);
    }

    function test_RevertWhen_TransferRedeemedTicket() public {
        registry.verifyAddress(buyer1);
        registry.verifyAddress(buyer2);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        vm.prank(buyer1);
        ticket.redeemTicket(0);

        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(buyer1);
        vm.expectRevert("Ticket redeemed");
        ticket.transferFrom(buyer1, buyer2, 0);
    }

    function test_GetMaxResalePrice() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        assertEq(ticket.getMaxResalePrice(0), (basePrice * 150) / 100);
    }

    function test_Withdraw() public {
        registry.verifyAddress(buyer1);

        vm.prank(buyer1);
        ticket.mintTicket{value: basePrice}(buyer1, "Section A, Row 1, Seat 1");

        uint256 organizerBalanceBefore = organizer.balance;

        ticket.withdraw();

        assertEq(organizer.balance, organizerBalanceBefore + basePrice);
    }
}
