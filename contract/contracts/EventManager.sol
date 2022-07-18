pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./EventNFT.sol";

contract EventManager {

    uint256 constant public fee = 10 ** 17;

    address[] public createdEvents;
    address payable public owner;

    event EventCreated(address eventAddress);
    event QrCodeClaimed(address eventAddress, uint16 tokenId, string qrCodeId);

    constructor() {
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(msg.sender == owner, "only owner could withdraw");
        owner.transfer(address(this).balance);
    }

    function createEvent(string calldata eventName, string calldata eventSymbol, string calldata eventURI, uint16 ticketsTotal) public payable {
        require(msg.value >= fee, "too small fee");
        EventNFT newEvent = new EventNFT(msg.sender, eventName, eventSymbol, eventURI, ticketsTotal);
        createdEvents.push(address(newEvent));
        emit EventCreated(address(newEvent));
    }

    function buyTicket(address eventAddress) public payable returns (uint16) {
        // TODO check ticket price against sent amount
        EventNFT eventNftContract = EventNFT(eventAddress);
        return eventNftContract.mintToken(msg.sender);
    }

    function claimQrCode(address eventAddress, uint16 tokenId, string memory qrCodeId) public {
        EventNFT eventNftContract = EventNFT(eventAddress);
        eventNftContract.burnToken(msg.sender, tokenId);
        emit QrCodeClaimed(eventAddress, tokenId, qrCodeId);
    }
}
