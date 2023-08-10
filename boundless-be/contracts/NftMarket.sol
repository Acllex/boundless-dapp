// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
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

    // 设置挂牌价
    function setListingPrice(uint price) external onlyOwner {
        require(price > 0, "Price must be greater than 0");
        listingPrice = price;
    }
    // 销毁NFT
    function burnTokenId(uint tokenId) public {
        _burn(tokenId);
    }
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
    // 获取调用地址的所有NFT
    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint ownedNftsCount = balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedNftsCount);

        for (uint i = 0; i < ownedNftsCount; i++) {
            uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
            NftItem storage item = _nftItems[tokenId];
            items[i] = item;
        }

        return items;
    }
    // 获取所有nft数量
    function totalSupply() public view returns (uint) {
        return _allNfts.length;
    }
    // 通过index获取token
    function tokenByIndex(uint index) public view returns (uint) {
        require(index < totalSupply(), "Index must be less than total supply");
        return _allNfts[index];
    }
    // 通过地址和index获取token
    function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
        require(index < balanceOf(owner), "Index must be less than owner balance");
        return _ownedTokens[owner][index];
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

    // 出售Nft
    function placeNftOnSale(uint tokenId, uint price) public payable {
        require(msg.sender == ERC721.ownerOf(tokenId), "You are not the owner of this NFT");
        require(_nftItems[tokenId].isListed == false, "This NFT is already listed");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        _nftItems[tokenId].isListed = true;
        _nftItems[tokenId].price = price;
        _listedItems.increment();
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
        }else if (from != to) {
            _removeTokenFromOwnerEnumeration(from, tokenId);
        }
        if(to == address(0)){
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else if (to != from) {
            _addTokenToOwnerEnumeration(to, tokenId);
        }
    }

    function _addTokenToAllTokensEnumeration(uint tokenId) private {
        _nftItemIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }
    // 将tokenId添加所有者的枚举中
    function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
        // to拥有的NFT数量
        uint length = balanceOf(to);
        // 将tokenId添加到to拥有的NFT数组中
        _ownedTokens[to][length] = tokenId;
        // tokenId在to拥有的NFT数组中的index
        _idToOwnerIndex[tokenId] = length;
    }
    // 将tokenId从所有者的枚举中删除
    function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
        // from拥有的NFT数量
        uint lastTokenIndex = balanceOf(from) - 1;
        // tokenId在from拥有的NFT数组中的index
        uint tokenIndex = _idToOwnerIndex[tokenId];
        /**
         * 如果要删除的toukeId不是from拥有的NFT数组中的最后一个NFT
         * 则把from拥有的NFT数组中的最后一个NFT移到要删除的tokenId的位置
         */
        if(tokenIndex != lastTokenIndex){
            // from拥有的NFT数组中的最后一个NFT的tokenId
            uint lastTokenId = _ownedTokens[from][lastTokenIndex];
            // 将from拥有的NFT数组中的最后一个NFT移到要删除的tokenId的位置
            _ownedTokens[from][tokenIndex] = lastTokenId;
            // 将要最后的TokenId和index对应起来
            _idToOwnerIndex[lastTokenId] = tokenIndex;
        }
        // 删除tokenId在from拥有的NFT数组中的index
        delete _idToOwnerIndex[tokenId];
        // 删除from拥有的NFT数组中的最后一个NFT
        delete _ownedTokens[from][lastTokenIndex];
    }
    // 删除NFT
    function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
        uint lastTokenIndex = _allNfts.length - 1;
        uint tokenIndex = _nftItemIndex[tokenId];
        uint lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _nftItemIndex[lastTokenId] = tokenIndex;

        delete _nftItemIndex[tokenId];
        _allNfts.pop();
    }
}