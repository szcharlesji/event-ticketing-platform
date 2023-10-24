// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";

contract IdentityRegistryTest is Test {
    IdentityRegistry public registry;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        registry = new IdentityRegistry();
    }

    function test_VerifyAddress() public {
        assertFalse(registry.isVerified(user1));

        registry.verifyAddress(user1);

        assertTrue(registry.isVerified(user1));
    }

    function test_VerifyAddressBatch() public {
        address[] memory users = new address[](2);
        users[0] = user1;
        users[1] = user2;

        registry.verifyAddressBatch(users);

        assertTrue(registry.isVerified(user1));
        assertTrue(registry.isVerified(user2));
    }

    function test_UnverifyAddress() public {
        registry.verifyAddress(user1);
        assertTrue(registry.isVerified(user1));

        registry.unverifyAddress(user1);
        assertFalse(registry.isVerified(user1));
    }

    function test_RevertWhen_NonOwnerVerifies() public {
        vm.prank(user1);
        vm.expectRevert();
        registry.verifyAddress(user2);
    }

    function test_RevertWhen_AlreadyVerified() public {
        registry.verifyAddress(user1);

        vm.expectRevert("Already verified");
        registry.verifyAddress(user1);
    }

    function test_RevertWhen_NotVerified() public {
        vm.expectRevert("Not verified");
        registry.unverifyAddress(user1);
    }
}
