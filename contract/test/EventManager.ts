import {expect} from "chai";
import {ethers} from "hardhat";
import {EventManager, EventNFT} from "../typechain-types";

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
            await expect(eventManagerContract.createEvent("some name", "someURI", cid, 10, 100, {value: ethers.utils.parseEther("0.01")}))
                .revertedWith("too small fee");
        });
        it("Should perform new event creation and emit event", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy() as EventManager;
            const [requestor] = await ethers.getSigners();

            const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
            const eventName = "some name";
            const imageURI = "someURI";
            const ticketsTotal = 100;
            const toDate = 123456;

            // when
            const transaction = await eventManagerContract.createEvent(eventName, imageURI, cid, ticketsTotal, toDate, {value: ethers.utils.parseEther("0.1")});

            // then
            const eventAddress = await eventManagerContract.createdEvents(0);
            await expect(transaction).to.emit(eventManagerContract, 'EventCreated')
                .withArgs(eventAddress);

            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;
            expect(await eventContract.eventOwner()).to.be.equal(requestor.address);
            expect(await eventContract.mintedCount()).to.be.equal(0);
            expect(await eventContract.maxTokens()).to.be.equal(ticketsTotal);
            expect(await eventContract.commonTokenURI()).to.be.equal(imageURI);
            expect(await eventContract.cid()).to.be.equal(cid);
            expect(await eventContract.endDate()).to.be.equal(toDate);
            expect(await eventContract.name()).to.be.equal(eventName);
            expect(await eventContract.symbol()).to.be.equal("EVNT1");
        });
    });
    describe("Ticket buy", async () => {
        it("Should successfully buy a ticket", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy() as EventManager;
            const [requestor] = await ethers.getSigners();

            const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
            const eventName = "some name";
            const imageURI = "someURI";
            const ticketsTotal = 100;
            const toDate = 123456;
            await eventManagerContract.createEvent(eventName, imageURI, cid, ticketsTotal, toDate, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await eventManagerContract.createdEvents(0);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;

            // when
            await eventManagerContract.buyTicket(eventAddress);

            // then
            expect(await eventContract.mintedCount()).to.be.equal(1);
            expect(await eventContract.ownerOf(1)).to.be.equal(requestor.address);
        });
        it("Should fail to buy if sold out", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy() as EventManager;

            const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
            const eventName = "some name";
            const imageURI = "someURI";
            const ticketsTotal = 1;
            const toDate = 123456;
            await eventManagerContract.createEvent(eventName, imageURI, cid, ticketsTotal, toDate, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await eventManagerContract.createdEvents(0);
            await eventManagerContract.buyTicket(eventAddress);

            // then
            await expect(eventManagerContract.buyTicket(eventAddress))
                .revertedWith("all tickets sold out");
        })
    });
    describe("Claim QR", async () => {
        it("Should successfully burn NFT and claim QR code", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy() as EventManager;
            const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
            const eventName = "some name";
            const imageURI = "someURI";
            const ticketsTotal = 1;
            const toDate = 123456;
            const qrId = "someIdString";
            await eventManagerContract.createEvent(eventName, imageURI, cid, ticketsTotal, toDate, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await eventManagerContract.createdEvents(0);
            await eventManagerContract.buyTicket(eventAddress);

            // when
            const transaction = await eventManagerContract.claimQrCode(eventAddress, 1, qrId);

            // then
            await expect(transaction).to.emit(eventManagerContract, 'QrCodeClaimed')
                .withArgs(qrId);
        });
        it("Should not allow to burn NFT if not an owner", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy() as EventManager;
            const cid = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("QmZkMq9PCMPbzu54recZKjr54qm4gVJJ8TnRjqP7Q4SBsA"));
            const eventName = "some name";
            const imageURI = "someURI";
            const ticketsTotal = 1;
            const toDate = 123456;
            const qrId = "someIdString";
            await eventManagerContract.createEvent(eventName, imageURI, cid, ticketsTotal, toDate, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await eventManagerContract.createdEvents(0);
            await eventManagerContract.buyTicket(eventAddress);

            const eventManagerContractFromAnotherSigner = eventManagerContract.connect((await ethers.getSigners())[1]);

            // then
            await expect(eventManagerContractFromAnotherSigner.claimQrCode(eventAddress, 1, qrId))
                .revertedWith("not an owner to burn the token");
        });
    });
});
