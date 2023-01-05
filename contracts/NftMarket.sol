//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTmarketplace is ERC721URIStorage {
    address payable private immutable OWNER;
    uint256 public  _tokenIds;
    // uint256 public _itemsold;
    uint256 listPrice = 1 ether;

    constructor() ERC721("nFTmarketplace", "nftm") {
        OWNER = payable(msg.sender);
    }

    // store token Id to price of nft
    mapping(uint256=>uint256) private priceOfNFT;

    event Mint(address indexed creator, uint indexed tokenId,string indexed tokenURI);
    event Buy(address indexed from, address indexed to, uint tokenId, uint price);


    // mapp token with their transaction history
        mapping(uint256=>address[]) private TransationHistory;


    function updateListPrice(uint256 _listPrice) external payable {
        require(OWNER == msg.sender, "only for owner");
        listPrice = _listPrice;
    }



    function creatToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(tx.origin==msg.sender,"only by EOA can mint NFT");
        require(msg.value == listPrice, "send enough ether");
        require(price > 0, "should be some valuable price of nft");
        uint256 newTokenId = _tokenIds;
        _tokenIds++;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        TransationHistory[newTokenId].push(msg.sender);
        priceOfNFT[_tokenIds]=price;
        emit Mint(msg.sender,newTokenId, tokenURI);

        return newTokenId;
    }


    function buy(uint256 tokenId) public payable {
        require(msg.sender!= ownerOf(tokenId),"you can't buy own nft");
        uint256 price = priceOfNFT[tokenId];
        address seller = ownerOf(tokenId);
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        _transfer(seller, msg.sender, tokenId);
        // approve(address(this), tokenId);
        TransationHistory[tokenId].push(msg.sender);


        payable(OWNER).transfer(listPrice);

        payable(seller).transfer(msg.value);
        emit Buy(seller, msg.sender, tokenId, price);
    }

    function UpdateNftPrice(uint tokenId, uint price) external {
        require(msg.sender==ownerOf(tokenId),"Owner Unauthorised");
        priceOfNFT[tokenId]=price;
    }

    function GetNFTDetails(uint tokenId)
        external
        view
        returns (address creator, address owner, uint price)
    {
        creator=TransationHistory[tokenId][0];
        owner=ownerOf(tokenId);
        price=priceOfNFT[tokenId];
    }

    function GetTransactionHistory(uint tokenId) external view  returns(address[] memory){

        return TransationHistory[tokenId];

    }

    function GetCreatorOfNft(uint tokenId) external view returns(address){
        return TransationHistory[tokenId][0];
    }

    function GetCurrentToken() external view returns (uint256) {
        return _tokenIds;
    }

    function getListPrice() external view returns (uint256) {
        return listPrice;
    }

    function GetNftPrice(uint tokenId) external view returns(uint){
        return priceOfNFT[tokenId];
    }
}
