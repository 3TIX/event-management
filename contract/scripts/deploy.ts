import { ethers } from "hardhat";

async function main() {
  const EventManager = await ethers.getContractFactory("EventManager");
  const eventManager = await EventManager.deploy();

  await eventManager.deployed();

  console.log("EventManager deployed to:", eventManager.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
