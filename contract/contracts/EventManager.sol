pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

import "./EventNFT.sol";

contract EventManager {

    uint256 constant public fee = 10 ** 17;

    mapping(address => bool) public supportedCurrencies;
    address payable public owner;

    event EventCreated(address eventAddress, string eventURI);
    event QrCodeClaimed(address eventAddress, uint16 tokenId, string qrCodeId);

    constructor(address[] memory _supportedCurrencies) {
        owner = payable(msg.sender);
        for (uint i=0; i < _supportedCurrencies.length; i++) {
            supportedCurrencies[_supportedCurrencies[i]] = true;
        }
        supportedCurrencies[address(0)] = true;
    }

    function withdraw() public {
        require(msg.sender == owner, "only owner could withdraw");
        owner.transfer(address(this).balance);
    }

    function createEvent(string calldata eventName, string calldata eventSymbol, string calldata eventURI, uint16 ticketsTotal, address currency, uint256 price) public payable {
        require(msg.value >= fee, "too small fee");
        require(supportedCurrencies[currency], "not supported currency");
        EventNFT newEvent = new EventNFT(msg.sender, eventName, eventSymbol, eventURI, ticketsTotal, currency, price);
        emit EventCreated(address(newEvent), eventURI);
    }

    function buyTicket(address eventAddress) public payable returns (uint16) {
        EventNFT eventNftContract = EventNFT(eventAddress);
        return eventNftContract.mintToken(msg.sender);
    }

    function claimQrCode(address eventAddress, uint16 tokenId, string memory qrCodeId) public {
        EventNFT eventNftContract = EventNFT(eventAddress);
        eventNftContract.burnToken(msg.sender, tokenId);
        emit QrCodeClaimed(eventAddress, tokenId, qrCodeId);
    }
}
