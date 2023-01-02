//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract nFTmarketplace is ERC721URIStorage{
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsold;
    uint256 listPrice = 10 wei; 
    
    constructor() ERC721 ("nFTmarketplace","nftm"){
        owner = payable(msg.sender);
    }



struct ListedToken {
    uint256 tokenId;
    address payable owner;
    address payable seller;
    uint256 price;
    bool currentlyListed;

}
mapping(uint => ListedToken) private idToListedToken;

function updateListPrice(uint256 _listPrice) public payable{
    require(owner == msg.sender,"only for owner");
    listPrice = _listPrice;
    
}
function getListPrice() public view returns (uint256){
    return listPrice;
    }
function getLatesIdToListedToken() public view returns (ListedToken memory){
    uint256 currentTokenId = _tokenIds.current();
    return idToListedToken[currentTokenId];

}
function getListedForTokenId(uint256 tokenId) public view returns (ListedToken memory){
    return idToListedToken[tokenId];
}
function getCurrentToken() public view returns (uint256) {
  return _tokenIds.current();
}
function creatToken(string memory tokenURI, uint256 price)public payable returns(uint){
    require(msg.value == listPrice,"send enough ether");
    require(price >0,"make sure the isn't negative");
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();

    _safeMint(msg.sender,newTokenId);
    
    _setTokenURI(newTokenId, tokenURI);
    
    createListedToken(newTokenId,price);

    return newTokenId;

}

function createListedToken(uint256 tokenId,uint256 price) private{
        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        _transfer(msg.sender, address(this), tokenId);
    
}

function getAllNFTs()public view returns(ListedToken[] memory){
    uint nftCount = _tokenIds.current();
    ListedToken[] memory tokens = new ListedToken[](nftCount);
    uint currentIndex =0;

    for(uint i=0;i<nftCount;i++)
        {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        
        return tokens;
    
}
function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
    
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

    
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        
        idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsold.increment();

        _transfer(address(this), msg.sender, tokenId);
        approve(address(this), tokenId);

        
        payable(owner).transfer(listPrice);
        
        payable(seller).transfer(msg.value);
    }    

}