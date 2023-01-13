//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.10;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTmarketplace is ERC721URIStorage {
    address payable private immutable OWNER;
    uint256 private _tokenIds;
    address public Admin;
    address private PreviousAdmin;

    constructor() ERC721("Napftdev", "NAPFT") {
        OWNER = payable(msg.sender);
        Admin = msg.sender;
        PreviousAdmin = msg.sender;
    }

    // store token Id to price of nft
    mapping(uint256 => uint256) private priceOfNFT;

    // percentage royality to creator
    // map token to royality fee
    mapping(uint256 => uint8) private RoyalityFees;

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

    event LogchangeAdmin(address indexed previousAdmin, address indexed NewAdmin);

    // mapp token with their transaction history
    mapping(uint256 => address[]) private TransationHistory;

    modifier OnlyOwner() {
        require(msg.sender == OWNER, "owner unauthorized");
        _;
    }

    modifier Onlyadmin() {
        require(msg.sender == Admin, "Admin unauthorized");
        _;
    }

    function creatToken(
        string memory tokenURI,
        uint256 price,
        uint8 royalityfee
    ) external returns (uint256) {
        require(tx.origin == msg.sender, "only by EOA can mint NFT");
        require(price > 0, "should be some valuable price of nft");
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        TransationHistory[newTokenId].push(payable(msg.sender));
        priceOfNFT[newTokenId] = price;
        RoyalityFees[newTokenId] = royalityfee;
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
        address creator = TransationHistory[tokenId][0];
        uint256 royalityfee = (price * RoyalityFees[tokenId]) / 100;
        uint256 actualPrice = (price * 97) / 100;

        // transfer money to seller
        (bool success, ) = payable(seller).call{value: actualPrice}("");
        require(success, "ether transfer failed to seller");

        // transfer royality fee to creator
        (bool success2, ) = payable(creator).call{value: royalityfee}("");
        require(success2, "ether transfer failed to creator");

        // transfer ownership to current buyer
        _transfer(seller, msg.sender, tokenId);
        require(ownerOf(tokenId) == msg.sender, "NFT not transfred");
        emit Buy(seller, msg.sender, tokenId, price);
    }

    function UpdateNftPrice(uint256 tokenId, uint256 price) external {
        require(msg.sender == ownerOf(tokenId), "Owner Unauthorised");
        priceOfNFT[tokenId] = price;
    }
    
    function changeAdmin(address _newadmin) external OnlyOwner {
        PreviousAdmin = Admin;
        Admin = _newadmin;
        emit LogchangeAdmin(PreviousAdmin, Admin);
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
        IpfsHash = tokenURI(tokenId);
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

    function GetNftPrice(uint256 tokenId) external view returns (uint256) {
        return priceOfNFT[tokenId];
    }

    function MyTotalNft(address user) external view returns (uint256) {
        return this.balanceOf(user);
    }

    function withdraw() external Onlyadmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getRoyalityFee(uint256 tokenId) external view returns (uint8) {
        return RoyalityFees[tokenId];
    }
}
