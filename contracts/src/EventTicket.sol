// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IdentityRegistry} from "./IdentityRegistry.sol";

contract EventTicket is ERC721, ERC721Enumerable, Ownable {
    struct ResaleConfig {
        uint256 maxPriceMultiplier;
        uint256 minHoldPeriod;
        uint256 maxTransfers;
        uint256 royaltyBps;
    }

    struct TicketData {
        uint256 originalPrice;
        uint256 purchaseTime;
        uint8 transferCount;
        string seatInfo;
        bool redeemed;
    }

    IdentityRegistry public immutable identityRegistry;
    address public marketplace;
    address public organizer;

    string public eventName;
    uint256 public eventDate;
    uint256 public basePrice;
    bool public eventEnded;

    ResaleConfig public resaleConfig;

    mapping(uint256 => TicketData) public tickets;
    mapping(address => bool) public hasPurchased;

    uint256 private _nextTokenId;

    event TicketMinted(address indexed buyer, uint256 indexed tokenId, uint256 price);
    event TicketRedeemed(uint256 indexed tokenId);
    event MarketplaceSet(address indexed marketplace);
    event EventEnded();

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _eventName,
        uint256 _eventDate,
        uint256 _basePrice,
        address _identityRegistry,
        address _organizer,
        ResaleConfig memory _resaleConfig
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        require(_eventDate > block.timestamp, "Event date must be in future");
        require(_basePrice > 0, "Base price must be > 0");
        require(_identityRegistry != address(0), "Invalid registry");
        require(_organizer != address(0), "Invalid organizer");

        eventName = _eventName;
        eventDate = _eventDate;
        basePrice = _basePrice;
        identityRegistry = IdentityRegistry(_identityRegistry);
        organizer = _organizer;
        resaleConfig = _resaleConfig;
    }

    function setMarketplace(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid marketplace");
        marketplace = _marketplace;
        emit MarketplaceSet(_marketplace);
    }

    function mintTicket(address to, string calldata seatInfo) external payable {
        require(identityRegistry.isVerified(to), "Buyer not verified");
        require(!hasPurchased[to], "Already purchased");
        require(msg.value >= basePrice, "Insufficient payment");
        require(!eventEnded, "Event ended");

        uint256 tokenId = _nextTokenId++;

        tickets[tokenId] = TicketData({
            originalPrice: basePrice,
            purchaseTime: block.timestamp,
            transferCount: 0,
            seatInfo: seatInfo,
            redeemed: false
        });

        hasPurchased[to] = true;
        _safeMint(to, tokenId);

        emit TicketMinted(to, tokenId, basePrice);
    }

    function redeemTicket(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender || msg.sender == organizer, "Not authorized");
        require(!tickets[tokenId].redeemed, "Already redeemed");

        tickets[tokenId].redeemed = true;
        emit TicketRedeemed(tokenId);
    }

    function endEvent() external onlyOwner {
        eventEnded = true;
        emit EventEnded();
    }

    function getMaxResalePrice(uint256 tokenId) public view returns (uint256) {
        return tickets[tokenId].originalPrice * resaleConfig.maxPriceMultiplier / 100;
    }

    function canTransfer(uint256 tokenId, address to) public view returns (bool, string memory) {
        if (tickets[tokenId].redeemed) {
            return (false, "Ticket redeemed");
        }

        if (block.timestamp < tickets[tokenId].purchaseTime + resaleConfig.minHoldPeriod) {
            return (false, "Hold period not met");
        }

        if (tickets[tokenId].transferCount >= resaleConfig.maxTransfers) {
            return (false, "Max transfers exceeded");
        }

        if (!identityRegistry.isVerified(to)) {
            return (false, "Buyer not verified");
        }

        return (true, "");
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance");
        payable(organizer).transfer(balance);
    }

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        if (from != address(0) && to != address(0)) {
            (bool allowed, string memory reason) = canTransfer(tokenId, to);
            require(allowed, reason);

            tickets[tokenId].transferCount++;
            tickets[tokenId].purchaseTime = block.timestamp;
        }

        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
