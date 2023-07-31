// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;
    mapping(string => bool) private _usedTokenURIs;
    mapping(uint => NftItem) private _nftItems;

    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    event NftItemCreated(uint tokenId, uint price, address creator, bool isListed);
    constructor() ERC721("NftMarket", "NFTM") {}

    function createItem(string memory tokenURI, uint price) public payable returns (uint) {
        require(!tokenURIExists(tokenURI), "This token URI already exists");

        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;
        return newTokenId;
    }
    function _createNftItem(uint tokenId, uint price) private {
        require(price > 0, "Price must be greater than 0");
        _nftItems[tokenId] = NftItem(tokenId, price, msg.sender, true);
        emit NftItemCreated(tokenId, price, msg.sender, true);
    }
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI]==true;
    }
}