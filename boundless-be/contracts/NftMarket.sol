// SPDX-License-Identifier: MIT
// Tells the Solidity compiler to compile only from v0.8.13 to v0.9.0
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract NftMarket is ERC721URIStorage {
 constructor() ERC721("NftMarket", "NFTM") {}    
}