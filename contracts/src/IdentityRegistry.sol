// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityRegistry is Ownable {
    mapping(address => bool) private verified;

    event AddressVerified(address indexed user);
    event AddressUnverified(address indexed user);

    constructor() Ownable(msg.sender) {}

    function verifyAddress(address user) external onlyOwner {
        require(!verified[user], "Already verified");
        verified[user] = true;
        emit AddressVerified(user);
    }

    function verifyAddressBatch(address[] calldata users) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            if (!verified[users[i]]) {
                verified[users[i]] = true;
                emit AddressVerified(users[i]);
            }
        }
    }

    function unverifyAddress(address user) external onlyOwner {
        require(verified[user], "Not verified");
        verified[user] = false;
        emit AddressUnverified(user);
    }

    function isVerified(address user) external view returns (bool) {
        return verified[user];
    }
}
