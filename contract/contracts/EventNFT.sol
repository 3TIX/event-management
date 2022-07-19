pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventNFT is ERC721URIStorage, Ownable {

    address payable public eventOwner;
    uint16 public mintedCount;
    uint16 public maxTokens;
    string public commonTokenURI;
    address public currency;
    uint256 public price;

    constructor(address payable _eventOwner, string memory tokenName, string memory tokenSymbol, string memory _tokenURI, uint16 _maxTokens, address _currency, uint256 _price) ERC721(tokenName, tokenSymbol) {
        eventOwner = _eventOwner;
        commonTokenURI = _tokenURI;
        maxTokens = _maxTokens;
        currency = _currency;
        price = _price;
    }

    function mintToken(address tokenOwner) public onlyOwner returns (uint16) {
        require(mintedCount < maxTokens, "all tickets sold out");
        mintedCount += 1;

        uint16 newItemId = mintedCount;

        _safeMint(tokenOwner, newItemId);
        _setTokenURI(newItemId, commonTokenURI);
        return newItemId;
    }

    function burnToken(address tokenOwner, uint16 tokenId) public onlyOwner {
        require(_isApprovedOrOwner(tokenOwner, tokenId), "not an owner to burn the token");
        _burn(tokenId);
    }
}
