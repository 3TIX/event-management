import { expect } from "chai";
import { ethers } from "hardhat";
import {EventManager} from "../typechain-types";

describe("EventManager", async () => {
  describe("Deployment", async () => {
    it("Should set the right owner", async function () {
      // given
      const [owner] = await ethers.getSigners();
      const contract = await ethers.getContractFactory("EventManager");
      const eventManagerContract = await contract.deploy();

      // then
      expect(await eventManagerContract.owner()).to.equal(owner.address);
    });
  });
  describe("Event creation", async () => {
    it("Should revert if fee is too low", async () => {
      // given
      const contract = await ethers.getContractFactory("EventManager");
      const eventManagerContract = await contract.deploy() as EventManager;
      const cid = ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA");

      // then
      await expect(eventManagerContract.createEvent(cid, 10, 100, { value: ethers.utils.parseEther("0.01") }))
          .revertedWith("too small fee");
    });
    it("Should perform new event creation and emit event", async () => {
      // given
      const contract = await ethers.getContractFactory("EventManager");
      const eventManagerContract = await contract.deploy() as EventManager;
      const [requestor] = await ethers.getSigners();

      const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
      const ticketsTotal = 100;
      const toDate = 123456;

      // when
      const transaction = await eventManagerContract.createEvent(cid, ticketsTotal, toDate, { value: ethers.utils.parseEther("0.1") });

      // then
      await expect(transaction).to.emit(eventManagerContract, 'EventCreated')
          .withArgs(requestor.address, toDate);

      const event = await eventManagerContract.events(requestor.address, 0);
      expect(event.cid).to.be.equal(cid);
      expect(event.ticketsTotal).to.be.equal(ticketsTotal);
      expect(event.endDate).to.be.equal(toDate);
    });
  });
});
