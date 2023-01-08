//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTmarketplace is ERC721URIStorage {
    address payable private immutable OWNER;
    uint256 private _tokenIds;

    constructor() ERC721("Napftdev", "NAPFT") {
        OWNER = payable(msg.sender);
    }

    // store token Id to price of nft
    mapping(uint256 => uint256) private priceOfNFT;

    // percentage royality to creator
    // map token to royality fee
    mapping(uint256=>uint8) private RoyalityFees;

    event Mint(
        address indexed creator,
        uint256 indexed tokenId,
        string indexed tokenURI
    );
    event Buy(
        address indexed from,
        address indexed to,
        uint256 tokenId,
        uint256 price
    );

    // mapp token with their transaction history
    mapping(uint256 => address[]) private TransationHistory;


    function creatToken(string memory tokenURI, uint256 price, uint8 royalityfee)
        external
        returns (uint256)
    {
        require(tx.origin == msg.sender, "only by EOA can mint NFT");
        require(price > 0, "should be some valuable price of nft");
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        TransationHistory[newTokenId].push(msg.sender);
        priceOfNFT[newTokenId] = price;
        RoyalityFees[newTokenId]=royalityfee;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        emit Mint(msg.sender, newTokenId, tokenURI);

        return newTokenId;
    }

    function buy(uint256 tokenId) public payable {
        require(msg.sender == tx.origin, "only EOA can intrect");
        require(msg.sender != ownerOf(tokenId), "you can't buy own nft");
        uint256 price = priceOfNFT[tokenId];
        address seller = ownerOf(tokenId);
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        TransationHistory[tokenId].push(msg.sender);
        // transfer ether to creator of nft
        address creator= TransationHistory[tokenId][0];
        uint256 royalityfee=(price*RoyalityFees[tokenId])/100;
        uint256 actualPrice=(price*97)/100;

        // transfer money to seller
        (bool success,)=payable(seller).call{value:actualPrice}("");
        require(success);

        // transfer royality fee to creator
        (bool success2,)=payable(creator).call{value:royalityfee}("");
        require(success2);

        // transfer ownership to current buyer
        _transfer(seller, msg.sender, tokenId);
        require(ownerOf(tokenId)==msg.sender,"not transfred");
        emit Buy(seller, msg.sender, tokenId, price);
    }

    function UpdateNftPrice(uint256 tokenId, uint256 price) external {
        require(msg.sender == ownerOf(tokenId), "Owner Unauthorised");
        priceOfNFT[tokenId] = price;
    }

    function GetNFTDetails(uint256 tokenId)
        external
        view
        returns (
            address creator,
            address owner,
            uint256 price,
            string memory IpfsHash
        )
    {
        creator = TransationHistory[tokenId][0];
        owner = ownerOf(tokenId);
        price = priceOfNFT[tokenId];
        IpfsHash=tokenURI(tokenId);
    }


    
    function GetTransactionHistory(uint256 tokenId)
        external
        view
        returns (address[] memory)
    {
        return TransationHistory[tokenId];
    }

    function GetCreatorOfNft(uint256 tokenId) external view returns (address) {
        return TransationHistory[tokenId][0];
    }

    function GetCurrentToken() external view returns (uint256) {
        return _tokenIds;
    }


    function GetNftPrice(uint256 tokenId) external view   returns (uint256) {
        return priceOfNFT[tokenId];
    }

    function MyTotalNft(address user ) external view  returns(uint256){
        return this.balanceOf(user);
    }
    
    function withdraw() external {
        require(msg.sender==OWNER);
        payable (msg.sender).transfer(address(this).balance);
    }

    function getRoyalityFee(uint256 tokenId) external view returns(uint8){
        return RoyalityFees[tokenId];
    }
}
