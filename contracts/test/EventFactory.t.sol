// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {EventFactory} from "../src/EventFactory.sol";
import {EventTicket} from "../src/EventTicket.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";
import {TicketMarketplace} from "../src/TicketMarketplace.sol";

contract EventFactoryTest is Test {
    EventFactory public factory;
    IdentityRegistry public registry;
    TicketMarketplace public marketplace;

    address public owner;
    address public organizer;

    function setUp() public {
        owner = address(this);
        organizer = makeAddr("organizer");

        registry = new IdentityRegistry();
        marketplace = new TicketMarketplace();
        factory = new EventFactory(address(registry));

        factory.setMarketplace(address(marketplace));
    }

    function test_CreateEvent() public {
        uint256 eventDate = block.timestamp + 30 days;

        EventTicket.ResaleConfig memory config = EventTicket.ResaleConfig({
            maxPriceMultiplier: 150,
            minHoldPeriod: 1 days,
            maxTransfers: 2,
            royaltyBps: 500
        });

        address eventAddress = factory.createEvent("Concert Ticket", "TIX", "Summer Festival", eventDate, 0.1 ether, organizer, config);

        assertTrue(factory.isEvent(eventAddress));
        assertEq(factory.getEventCount(), 1);

        EventTicket ticket = EventTicket(eventAddress);
        assertEq(ticket.organizer(), organizer);
        assertEq(ticket.eventName(), "Summer Festival");
        assertEq(ticket.basePrice(), 0.1 ether);
    }

    function test_CreateMultipleEvents() public {
        uint256 eventDate = block.timestamp + 30 days;

        EventTicket.ResaleConfig memory config = EventTicket.ResaleConfig({
            maxPriceMultiplier: 150,
            minHoldPeriod: 1 days,
            maxTransfers: 2,
            royaltyBps: 500
        });

        factory.createEvent("Event 1", "EV1", "Event 1", eventDate, 0.1 ether, organizer, config);

        factory.createEvent("Event 2", "EV2", "Event 2", eventDate + 10 days, 0.2 ether, organizer, config);

        assertEq(factory.getEventCount(), 2);

        address[] memory allEvents = factory.getAllEvents();
        assertEq(allEvents.length, 2);
    }

    function test_RevertWhen_InvalidOrganizer() public {
        uint256 eventDate = block.timestamp + 30 days;

        EventTicket.ResaleConfig memory config = EventTicket.ResaleConfig({
            maxPriceMultiplier: 150,
            minHoldPeriod: 1 days,
            maxTransfers: 2,
            royaltyBps: 500
        });

        vm.expectRevert("Invalid organizer");
        factory.createEvent("Concert Ticket", "TIX", "Summer Festival", eventDate, 0.1 ether, address(0), config);
    }

    function test_SetMarketplace() public {
        address newMarketplace = makeAddr("newMarketplace");

        factory.setMarketplace(newMarketplace);

        assertEq(factory.marketplace(), newMarketplace);
    }

    function test_RevertWhen_NonOwnerSetsMarketplace() public {
        address newMarketplace = makeAddr("newMarketplace");

        vm.prank(organizer);
        vm.expectRevert();
        factory.setMarketplace(newMarketplace);
    }
}
