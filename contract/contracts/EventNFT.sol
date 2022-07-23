pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventNFT is ERC721URIStorage, ERC2981, Ownable {

    address public eventOwner;
    uint16 public mintedCount;
    uint16 public maxTokens;
    string public commonTokenURI;
    address public currency;
    uint256 public price;
    uint96 public royaltyPercentage;

    constructor(address _eventOwner, string memory tokenName, string memory tokenSymbol, string memory _tokenURI, uint16 _maxTokens, address _currency, uint256 _price, uint96 _royaltyPercentage) ERC721(tokenName, tokenSymbol) {
        eventOwner = _eventOwner;
        commonTokenURI = _tokenURI;
        maxTokens = _maxTokens;
        currency = _currency;
        price = _price;
        royaltyPercentage = _royaltyPercentage;
    }

    function mintToken(address tokenOwner) public onlyOwner returns (uint16) {
        require(mintedCount < maxTokens, "all tickets sold out");
        mintedCount += 1;

        uint16 newItemId = mintedCount;

        _safeMint(tokenOwner, newItemId);
        _setTokenURI(newItemId, commonTokenURI);
        _setTokenRoyalty(newItemId, eventOwner, royaltyPercentage);
        return newItemId;
    }

    function burnToken(address tokenOwner, uint16 tokenId) public onlyOwner {
        require(_isApprovedOrOwner(tokenOwner, tokenId), "not an owner to burn the token");
        _burn(tokenId);
    }

    function _feeDenominator() internal pure override returns (uint96) {
        return 100;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC2981, ERC721) returns (bool) {
        return ERC2981.supportsInterface(interfaceId) || ERC721.supportsInterface(interfaceId);
    }
}
