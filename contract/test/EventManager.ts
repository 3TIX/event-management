import {expect} from "chai";
import {ethers} from "hardhat";
import {EventManager, EventNFT, SimpleToken} from "../typechain-types";
import {ContractTransaction} from "ethers";

describe("EventManager", async () => {

    async function getCreatedEventAddress(transaction: ContractTransaction): Promise<string> {
        const receipt = await transaction.wait();
        return  receipt.events?.filter((x) => {
            return x.event == "EventCreated"
        })[0].args?.[0];
    }

    describe("Deployment", async () => {
        it("Should set the right owner", async function () {
            // given
            const [owner] = await ethers.getSigners();
            const contract = await ethers.getContractFactory("EventManager");
            const currency1 = await ethers.Wallet.createRandom().address;
            const currency2 = await ethers.Wallet.createRandom().address;
            const eventManagerContract = await contract.deploy([currency1, currency2]);

            // then
            expect(await eventManagerContract.owner()).to.equal(owner.address);
        });
    });
     describe("Event creation", async () => {
        it("Should revert if fee is too low", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;

            // then
            await expect(eventManagerContract.createEvent("some name", "EVNT", "someURI", 10, ethers.constants.AddressZero, 12, {value: ethers.utils.parseEther("0.01")}))
                .revertedWith("too small fee");
        });
         it("Should revert if not supported currency", async () => {
             // given
             const contract = await ethers.getContractFactory("EventManager");
             const eventManagerContract = await contract.deploy([]) as EventManager;
             const currency = await ethers.Wallet.createRandom().address;

             // then
             await expect(eventManagerContract.createEvent("some name", "EVNT", "someURI", 10, currency, 12, {value: ethers.utils.parseEther("0.1")}))
                 .revertedWith("not supported currency");
         });
        it("Should perform new event creation with native token as a currency and emit an event", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;
            const [requestor] = await ethers.getSigners();

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 100;

            // when
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, 12, {value: ethers.utils.parseEther("0.1")});

            // then
            const receipt = await transaction.wait();
            const emittedEventCreatedParams = receipt.events?.filter((x) => {
                return x.event == "EventCreated"
            })[0].args;
            expect(emittedEventCreatedParams?.[1]).to.be.equal(eventURI);

            const eventContract = await ethers.getContractAt("EventNFT", emittedEventCreatedParams?.[0]) as EventNFT;
            expect(await eventContract.eventOwner()).to.be.equal(requestor.address);
            expect(await eventContract.mintedCount()).to.be.equal(0);
            expect(await eventContract.maxTokens()).to.be.equal(ticketsTotal);
            expect(await eventContract.commonTokenURI()).to.be.equal(eventURI);
            expect(await eventContract.name()).to.be.equal(eventName);
            expect(await eventContract.symbol()).to.be.equal("EVNT");
        });
         it("Should perform new event creation with non-native token as a currency and emit an event", async () => {
             // given
             const contract = await ethers.getContractFactory("EventManager");
             const currency = await ethers.Wallet.createRandom().address;
             const eventManagerContract = await contract.deploy([currency]) as EventManager;
             const [requestor] = await ethers.getSigners();

             const eventName = "some name";
             const eventSymbol = "EVNT";
             const eventURI = "someURI";
             const ticketsTotal = 100;

             // when
             const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, currency, 12, {value: ethers.utils.parseEther("0.1")});

             // then
             const receipt = await transaction.wait();
             const emittedEventCreatedParams = receipt.events?.filter((x) => {
                 return x.event == "EventCreated"
             })[0].args;
             expect(emittedEventCreatedParams?.[1]).to.be.equal(eventURI);

             const eventContract = await ethers.getContractAt("EventNFT", emittedEventCreatedParams?.[0]) as EventNFT;
             expect(await eventContract.eventOwner()).to.be.equal(requestor.address);
             expect(await eventContract.mintedCount()).to.be.equal(0);
             expect(await eventContract.maxTokens()).to.be.equal(ticketsTotal);
             expect(await eventContract.commonTokenURI()).to.be.equal(eventURI);
             expect(await eventContract.name()).to.be.equal(eventName);
             expect(await eventContract.symbol()).to.be.equal("EVNT");
         });
     });
    describe("Ticket buy", async () => {
        it("Should successfully buy a ticket with a native currency", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;
            const [requestor] = await ethers.getSigners();

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 100;
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, 1, {value: ethers.utils.parseEther("0.1")});

            const eventAddress = await getCreatedEventAddress(transaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;

            // when
            await eventManagerContract.buyTicket(eventAddress, {value: await eventContract.price()});

            // then
            expect(await eventContract.mintedCount()).to.be.equal(1);
            expect(await eventContract.ownerOf(1)).to.be.equal(requestor.address);
        });
        it("Should fail to buy if payment less than price in a native currency", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 1;
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await getCreatedEventAddress(transaction);

            // then
            await expect(eventManagerContract.buyTicket(eventAddress, {value: ethers.utils.parseEther("0.5")}))
                .revertedWith("too small amount");
        })
        it("Should successfully buy a ticket with a ERC20 currency", async () => {
            // given
            const erc20Contract = await ethers.getContractFactory("SimpleToken");
            const simpleTokenContract = await erc20Contract.deploy("SimpleToken", "SMPL", ethers.utils.parseEther("100000")) as SimpleToken;
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([simpleTokenContract.address]) as EventManager;
            const [requestor] = await ethers.getSigners();

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 100;
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, simpleTokenContract.address, 1, {value: ethers.utils.parseEther("0.1")});

            const eventAddress = await getCreatedEventAddress(transaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;

            // when
            await simpleTokenContract.approve(eventManagerContract.address, await eventContract.price());
            await eventManagerContract.buyTicket(eventAddress);

            // then
            expect(await eventContract.mintedCount()).to.be.equal(1);
            expect(await eventContract.ownerOf(1)).to.be.equal(requestor.address);
        });
        it("Should fail to buy if payment less than price in a ERC20 currency", async () => {
            // given
            const erc20Contract = await ethers.getContractFactory("SimpleToken");
            const simpleTokenContract = await erc20Contract.deploy("SimpleToken", "SMPL", ethers.utils.parseEther("100000")) as SimpleToken;
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([simpleTokenContract.address]) as EventManager;

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 1;
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, simpleTokenContract.address, ethers.utils.parseEther("1"), {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await getCreatedEventAddress(transaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;

            // then
            await simpleTokenContract.approve(eventManagerContract.address, ethers.utils.parseEther("0.5"))
            await expect(eventManagerContract.buyTicket(eventAddress))
                .revertedWith("ERC20: insufficient allowance");
        })
        it("Should fail to buy if sold out", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;

            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 1;
            const transaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, 1, {value: ethers.utils.parseEther("0.1")});

            const eventAddress = await getCreatedEventAddress(transaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;
            await eventManagerContract.buyTicket(eventAddress, {value: await eventContract.price()});

            // then
            await expect(eventManagerContract.buyTicket(eventAddress, {value: await eventContract.price()}))
                .revertedWith("all tickets sold out");
        })
    });
    describe("Claim QR", async () => {
        it("Should successfully burn NFT and claim QR code", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;
            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 100;
            const qrId = "someIdString";
            const createEventTransaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, 1, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await getCreatedEventAddress(createEventTransaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;
            await eventManagerContract.buyTicket(eventAddress, {value: await eventContract.price()});

            // when
            const transaction = await eventManagerContract.claimQrCode(eventAddress, 1, qrId);

            // then
            await expect(transaction).to.emit(eventManagerContract, 'QrCodeClaimed')
                .withArgs(eventAddress, 1, qrId);
        });
        it("Should not allow to burn NFT if not an owner", async () => {
            // given
            const contract = await ethers.getContractFactory("EventManager");
            const eventManagerContract = await contract.deploy([]) as EventManager;
            const eventName = "some name";
            const eventSymbol = "EVNT";
            const eventURI = "someURI";
            const ticketsTotal = 100;
            const qrId = "someIdString";
            const createEventTransaction = await eventManagerContract.createEvent(eventName, eventSymbol, eventURI, ticketsTotal, ethers.constants.AddressZero, 1, {value: ethers.utils.parseEther("0.1")});
            const eventAddress = await getCreatedEventAddress(createEventTransaction);
            const eventContract = await ethers.getContractAt("EventNFT", eventAddress) as EventNFT;
            await eventManagerContract.buyTicket(eventAddress, {value: await eventContract.price()});

            const eventManagerContractFromAnotherSigner = eventManagerContract.connect((await ethers.getSigners())[1]);

            // then
            await expect(eventManagerContractFromAnotherSigner.claimQrCode(eventAddress, 1, qrId))
                .revertedWith("not an owner to burn the token");
        });
    });
});
