pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./EventNFT.sol";

contract EventManager {

    uint256 constant public fee = 10 ** 17;

    address[] public createdEvents;
    address payable public owner;

    event EventCreated(address eventAddress);

    constructor() {
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(msg.sender == owner, "only owner could withdraw");
        owner.transfer(address(this).balance);
    }

    function createEvent(string calldata eventName, string calldata imageURI, bytes calldata cid, uint16 ticketsTotal, uint256 endDate) public payable {
        require(msg.value >= fee, "too small fee");
        EventNFT newEvent = new EventNFT(msg.sender, eventName, string.concat("EVNT", Strings.toString(createdEvents.length + 1)), imageURI, ticketsTotal, cid, endDate);
        createdEvents.push(address(newEvent));
        emit EventCreated(address(newEvent));
    }

    function buyTicket(address eventAddress) public payable returns (uint16) {
        // TODO check ticket price against sent amount
        EventNFT eventNftContract = EventNFT(eventAddress);
        return eventNftContract.mintToken(msg.sender);
    }
}
