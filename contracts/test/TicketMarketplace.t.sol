// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";
import {TicketMarketplace} from "../src/TicketMarketplace.sol";

contract TicketMarketplaceTest is Test {
    EventTicket public ticket;
    IdentityRegistry public registry;
    TicketMarketplace public marketplace;

    address public organizer;
    address public seller;
    address public buyer;

    uint256 public eventDate;
    uint256 public basePrice = 0.1 ether;
    uint256 public resalePrice = 0.15 ether;

    function setUp() public {
        organizer = makeAddr("organizer");
        seller = makeAddr("seller");
        buyer = makeAddr("buyer");

        eventDate = block.timestamp + 30 days;

        registry = new IdentityRegistry();
        marketplace = new TicketMarketplace();

        EventTicket.ResaleConfig memory config = EventTicket.ResaleConfig({
            maxPriceMultiplier: 150,
            minHoldPeriod: 1 days,
            maxTransfers: 2,
            royaltyBps: 500
        });

        ticket = new EventTicket("Concert Ticket", "TIX", "Summer Festival", eventDate, basePrice, address(registry), organizer, config);

        ticket.setMarketplace(address(marketplace));

        registry.verifyAddress(seller);
        registry.verifyAddress(buyer);

        vm.deal(seller, 10 ether);
        vm.deal(buyer, 10 ether);

        vm.prank(seller);
        ticket.mintTicket{value: basePrice}(seller, "Section A, Row 1, Seat 1");
    }

    function test_ListTicket() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        (address listedSeller, uint256 price, bool active) = marketplace.listings(address(ticket), 0);

        assertEq(listedSeller, seller);
        assertEq(price, resalePrice);
        assertTrue(active);
    }

    function test_RevertWhen_ListBeforeHoldPeriod() public {
        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        vm.expectRevert("Hold period not met");
        marketplace.listTicket(address(ticket), 0, resalePrice);
    }

    function test_RevertWhen_ListAbovePriceCap() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        uint256 tooHighPrice = (basePrice * 200) / 100;

        vm.prank(seller);
        vm.expectRevert("Price exceeds cap");
        marketplace.listTicket(address(ticket), 0, tooHighPrice);
    }

    function test_RevertWhen_ListWithoutApproval() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        vm.expectRevert("Marketplace not approved");
        marketplace.listTicket(address(ticket), 0, resalePrice);
    }

    function test_BuyTicket() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        uint256 sellerBalanceBefore = seller.balance;
        uint256 organizerBalanceBefore = organizer.balance;

        vm.prank(buyer);
        marketplace.buyTicket{value: resalePrice}(address(ticket), 0);

        assertEq(ticket.ownerOf(0), buyer);

        uint256 expectedRoyalty = (resalePrice * 500) / 10000;
        uint256 expectedSellerAmount = resalePrice - expectedRoyalty;

        assertEq(seller.balance, sellerBalanceBefore + expectedSellerAmount);
        assertEq(organizer.balance, organizerBalanceBefore + expectedRoyalty);
    }

    function test_BuyTicketWithRefund() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        uint256 buyerBalanceBefore = buyer.balance;

        vm.prank(buyer);
        marketplace.buyTicket{value: 0.2 ether}(address(ticket), 0);

        assertEq(buyer.balance, buyerBalanceBefore - resalePrice);
    }

    function test_RevertWhen_BuyNotListed() public {
        vm.prank(buyer);
        vm.expectRevert("Not listed");
        marketplace.buyTicket{value: resalePrice}(address(ticket), 0);
    }

    function test_RevertWhen_BuyInsufficientPayment() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        vm.prank(buyer);
        vm.expectRevert("Insufficient payment");
        marketplace.buyTicket{value: 0.05 ether}(address(ticket), 0);
    }

    function test_CancelListing() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        vm.prank(seller);
        marketplace.cancelListing(address(ticket), 0);

        (,, bool active) = marketplace.listings(address(ticket), 0);
        assertFalse(active);
    }

    function test_RevertWhen_NonSellerCancels() public {
        vm.warp(block.timestamp + 1 days + 1);

        vm.prank(seller);
        ticket.setApprovalForAll(address(marketplace), true);

        vm.prank(seller);
        marketplace.listTicket(address(ticket), 0, resalePrice);

        vm.prank(buyer);
        vm.expectRevert("Not seller");
        marketplace.cancelListing(address(ticket), 0);
    }
}
