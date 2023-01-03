const {expect}=require("chai");
const {ethers}=require("hardhat")
const {utils}=ethers;
const {bigNumber}=ethers;
const { network } = require("hardhat")


describe(" NFT marketplace contract testing", async function (){

    var NFT=null;      // original contract
    var attack=null;        // attacker contract
    var ACCOUNTS=null;      // total account provide by hardhat
    const defaultAccount=0;
    const User1=1     // user account index
    const User2=2
    var Provider=null;

    beforeEach("deploy NFT smart contract", async function (){
        ACCOUNTS= await ethers.getSigners();
        Provider=await ethers.provider;


        // deploy NFT smart contract from default address
        const ContractFactory=await ethers.getContractFactory("NFTmarketplace");

        NFT=await ContractFactory.connect(ACCOUNTS[defaultAccount]).deploy();
        await NFT.deployed();

        // console.log("details of deployed NFT smart contract", NFT);
        function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))}

        for(i=0;i<10;i++){
            const tx1= await NFT.connect(ACCOUNTS[i]).creatToken(`anandkumar-->${i}`,100, {value:ethers.utils.parseEther("1")});
            // console.log("return value of minting",tx1)
            // console.log("balance of NFT",await NFT.balanceOf(ACCOUNTS[User1]).address);
            // await sleep( 1000)

        }
        console.log("total token in market place",await NFT._tokenIds());


    });
    it("should be mint", async function(){
        const tx1= await NFT.connect(ACCOUNTS[12]).creatToken(`anandkumar-->${i}`,100, {value:ethers.utils.parseEther("1")});

        expect(await NFT._tokenIds()).to.be.equal(11);
        // mint function
        console.log("balance of NFT",await NFT.balanceOf(ACCOUNTS[User1]).address);

    })

    it("get all tokenUri", async function(){

        console.log("total token id ",await NFT._tokenIds());
        const totalToken=await NFT._tokenIds();
        console.log("total token uri");
        for(i=0;i<totalToken;i++){
            try {
                console.log(await NFT.tokenURI(i))

            } catch(error){
                console.log(`get error to find token uri of ${i}`)
                console.error();
            }
        }
        // console.log("total token uri", await NFT.tokenURI(10))


    })

    it("get  details of all nft", async function (){

        const totalToken=await NFT._tokenIds();
        console.log("get details of all nft by using javascript");
        for (i=0; i<totalToken;i++){
            try{
                console.log(await NFT.GetDetailsNFT(i))
                // const det1=await NFT.GetDetailsNFT(i)
                // if(det1.owner==NFT.address){
                //         console.log("successfully get my all nft ******************************")
                // }
            }catch(error){
                console.log(`get error to find token details of ${i}`)
            }
        }

    })

    it("get owner of particular tokenId", async function(){
    
        const totalToken=await NFT._tokenIds();
        console.log("get Owner of all nft by tokenId  ");
        for (i=0; i<totalToken;i++){
            try{
                console.log(await NFT.ownerOf(i))
            }catch(error){
                console.log(`get error to find owner of token ${i}`)
            }
        }

        console.log("address of nft contract", NFT.address)





    })

    it("get my NFTs", async function(){

        const totalToken=await NFT._tokenIds();
        console.log("get My all NFTs ");
        user=2
        for (i=0; i<totalToken;i++){
            try{
                // console.log(await NFT.GetDetailsNFT(i))
                const det1=await NFT.GetDetailsNFT(i)

                // compare address with metamask
                if(det1.seller==ACCOUNTS[user].address){
                        console.log("successfully get my all nft ******************************")
                        console.log(await NFT.GetDetailsNFT(i))
                }
            }catch(error){
                console.log(`get error to find token details of ${i}`)
            }
        }

    })

        it("get price of ALL NFts", async function(){
            const totalToken=await NFT._tokenIds();
            console.log("get price of  all NFTs ");

            for (i=0; i<totalToken;i++){
            try{
                // console.log(await NFT.GetDetailsNFT(i))
                const det1=await NFT.GetDetailsNFT(i)

                // compare address with metamask
                console.log(`price of nft for tokenId==${i} is equal to`,det1.price)
            }catch(error){
                console.log(`get error to find token details of ${i}`)
            }
        }
            


        })









})