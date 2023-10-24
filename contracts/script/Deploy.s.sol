// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IdentityRegistry} from "../src/IdentityRegistry.sol";
import {TicketMarketplace} from "../src/TicketMarketplace.sol";
import {EventFactory} from "../src/EventFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        IdentityRegistry registry = new IdentityRegistry();
        console.log("IdentityRegistry deployed to:", address(registry));

        TicketMarketplace marketplace = new TicketMarketplace();
        console.log("TicketMarketplace deployed to:", address(marketplace));

        EventFactory factory = new EventFactory(address(registry));
        console.log("EventFactory deployed to:", address(factory));

        factory.setMarketplace(address(marketplace));
        console.log("Marketplace set in factory");

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("IdentityRegistry:", address(registry));
        console.log("TicketMarketplace:", address(marketplace));
        console.log("EventFactory:", address(factory));
    }
}
