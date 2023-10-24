// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {EventTicket} from "./EventTicket.sol";

contract TicketMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event TicketListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event TicketSold(
        address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price
    );
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId);

    function listTicket(address nftContract, uint256 tokenId, uint256 price) external nonReentrant {
        EventTicket ticket = EventTicket(nftContract);
        require(ticket.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");
        require(price <= ticket.getMaxResalePrice(tokenId), "Price exceeds cap");

        (, uint256 purchaseTime, uint8 transferCount,,) = ticket.tickets(tokenId);
        (, uint256 minHoldPeriod, uint256 maxTransfers,) = ticket.resaleConfig();
        require(block.timestamp >= purchaseTime + minHoldPeriod, "Hold period not met");
        require(transferCount < maxTransfers, "Max transfers exceeded");

        require(
            IERC721(nftContract).isApprovedForAll(msg.sender, address(this))
                || IERC721(nftContract).getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[nftContract][tokenId] = Listing({seller: msg.sender, price: price, active: true});

        emit TicketListed(nftContract, tokenId, msg.sender, price);
    }

    function buyTicket(address nftContract, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        EventTicket ticket = EventTicket(nftContract);
        require(ticket.ownerOf(tokenId) == listing.seller, "Seller no longer owns ticket");

        listings[nftContract][tokenId].active = false;

        (,,, uint256 royaltyBps) = ticket.resaleConfig();
        uint256 royaltyAmount = (listing.price * royaltyBps) / 10000;
        uint256 sellerAmount = listing.price - royaltyAmount;

        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);

        payable(listing.seller).transfer(sellerAmount);
        if (royaltyAmount > 0) {
            payable(ticket.organizer()).transfer(royaltyAmount);
        }

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit TicketSold(nftContract, tokenId, msg.sender, listing.seller, listing.price);
    }

    function cancelListing(address nftContract, uint256 tokenId) external {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.active, "Not active");

        listing.active = false;

        emit ListingCancelled(nftContract, tokenId);
    }

    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        return listings[nftContract][tokenId];
    }
}
