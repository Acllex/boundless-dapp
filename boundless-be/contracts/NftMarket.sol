// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
    using Counters for Counters.Counter;
    struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;
    // 保存所有的tokenIds
    uint256[] private _allNfts;
    // 保存所有的tokenURI
    mapping(string => bool) private _usedTokenURIs;
    // 保存所有的NFT,通过tokenId获取NFT
    mapping(uint => NftItem) private _nftItems;
    // 以tokenId为key,以_allNfts.length为value
    mapping(uint => uint) private _nftItemIndex;
    mapping(address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnerIndex;
    // 挂牌价
    uint public listingPrice = 0.025 ether;
    
    event NftItemCreated(uint tokenId, uint price, address creator, bool isListed);
    constructor() ERC721("NftMarket", "NFTM") {}
    // 铸造NFT
    function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
        require(!tokenURIExists(tokenURI), "This token URI already exists");
        // 价格必须等于挂牌价
        require(msg.value == listingPrice, "Price must be equal to listing price");
        _tokenIds.increment();
        _listedItems.increment();

        uint newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;
        return newTokenId;
    }
    // nft信息
    function _createNftItem(uint tokenId, uint price) private {
        require(price > 0, "Price must be greater than 0");
        _nftItems[tokenId] = NftItem(tokenId, price, msg.sender, true);
        emit NftItemCreated(tokenId, price, msg.sender, true);
    }
    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }
    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index must be less than total supply");
        return _allNfts[index];
    }
    // 获取在售NFT列表
    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        uint allItemsCounts = totalSupply();
        uint currentIndex = 0;
        NftItem[] memory items = new NftItem[](_listedItems.current());

        for (uint i = 0; i < allItemsCounts; i++) {
            uint tokenId = tokenByIndex(i);
            NftItem storage item = _nftItems[tokenId];

            if (item.isListed) {
                items[currentIndex] = item;
                currentIndex++;
            }
        }

        return items;
    }
    
    // 买入NFT
    function buyNft(uint tokenId) public payable {
        // 获取NFT价格
        uint price = _nftItems[tokenId].price;
        // 获取NFT所有者
        address owner = ERC721.ownerOf(tokenId);
        require(msg.sender != owner, "You already the owner of this NFT");
        require(msg.value == price, "Price must be equal to the NFT price");
        _nftItems[tokenId].isListed = false;
        // nft数量减一
        _listedItems.decrement();
        // 转移NFT
        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }
    // 获取指定的NFT
    function getNftItem(uint tokenId) public view returns (NftItem memory) {
        return _nftItems[tokenId];
    }
    // 获取当前市场nft数量
    function listedItemsCount() public view returns (uint) {
        return _listedItems.current();
    }
    // 判断tokenURI是否存在
    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI]==true;
    }

    function _beforeTokenTransfer(address from, address to, uint tokenId,uint256 batchSize) internal virtual override{
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        }
        if (from != to) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _nftItemIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }

    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        // to拥有的NFT数量
        uint length = balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _idToOwnerIndex[tokenId] = length;
    }
}