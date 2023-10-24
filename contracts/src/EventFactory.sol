// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {EventTicket} from "./EventTicket.sol";

contract EventFactory is Ownable {
    address public immutable identityRegistry;
    address public marketplace;

    address[] public events;
    mapping(address => bool) public isEvent;

    event EventCreated(address indexed eventContract, address indexed organizer, string name);
    event MarketplaceSet(address indexed marketplace);

    constructor(address _identityRegistry) Ownable(msg.sender) {
        require(_identityRegistry != address(0), "Invalid registry");
        identityRegistry = _identityRegistry;
    }

    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid marketplace");
        marketplace = _marketplace;
        emit MarketplaceSet(_marketplace);
    }

    function createEvent(
        string memory name,
        string memory symbol,
        string memory eventName,
        uint256 eventDate,
        uint256 basePrice,
        address organizer,
        EventTicket.ResaleConfig memory resaleConfig
    ) external returns (address) {
        require(organizer != address(0), "Invalid organizer");

        EventTicket newEvent = new EventTicket(
            name, symbol, eventName, eventDate, basePrice, identityRegistry, organizer, resaleConfig
        );

        if (marketplace != address(0)) {
            newEvent.setMarketplace(marketplace);
        }

        newEvent.transferOwnership(organizer);

        events.push(address(newEvent));
        isEvent[address(newEvent)] = true;

        emit EventCreated(address(newEvent), organizer, eventName);

        return address(newEvent);
    }

    function getEventCount() external view returns (uint256) {
        return events.length;
    }

    function getAllEvents() external view returns (address[] memory) {
        return events;
    }
}
