const { expect } = require("chai");
const { ethers } = require("hardhat");
const { utils } = ethers;
const { bigNumber } = ethers;
const { network } = require("hardhat");

describe(" NFT marketplace contract testing", async function () {
    var NFT = null; // original contract
    var attack = null; // attacker contract
    var ACCOUNTS = null; // total account provide by hardhat
    const defaultAccount = 0;
    const User1 = 1; // user account index
    const User2 = 2;
    var Provider = null;

    beforeEach("deploy NFT smart contract", async function () {
        ACCOUNTS = await ethers.getSigners();
        Provider = await ethers.provider;

        // deploy NFT smart contract from default address
        const ContractFactory = await ethers.getContractFactory("NFTmarketplace");

        NFT = await ContractFactory.connect(ACCOUNTS[defaultAccount]).deploy();
        await NFT.deployed();

        // console.log("details of nft contract ",NFT)


        //////////////////////////// for time deplay function
        function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }
        /////////////////////////////////////////////////////////////////

        const priceofnft = await ethers.utils.parseEther("100");

        for (i = 0; i < 10; i++) {

            // call function to mint nft on blockchain
            const tx1 = await NFT.connect(ACCOUNTS[i]).creatToken(
                `anand${i}kumar-->${i}`,
                priceofnft,
                { value: ethers.utils.parseEther("1") }
            );
            console.log(`gas fee for continous miniting for token ${i + 1}`, tx1.gasPrice);
        }
        console.log("total token in market place", await NFT.GetCurrentToken());
    });




    it("should be mint", async function () {
        const tx1 = await NFT.connect(ACCOUNTS[12]).creatToken(
            `anandkumar-->${i}`,
            100,
            { value: ethers.utils.parseEther("1") }
        );

        console.log("details of gas fee of miniting function", tx1.gasPrice);
        //BigNumber { value: "1211184246" }   previous contract
        // Bignumber { value: "1210678066" } by my datastructure

        expect(await NFT.GetCurrentToken()).to.be.equal(11);
        // mint function
        console.log(
            "balance of NFT",
            await NFT.balanceOf(ACCOUNTS[User1]).address
        );
    });

    it("get all tokenUri/ hash value of store data on ipfs", async function () {

        console.log("total token id ", await NFT.GetCurrentToken());
        const totalToken = await NFT.GetCurrentToken();
        console.log("total token uri");
        for (i = 0; i < totalToken; i++) {
            try {
                // to get token uri of crrosponding token
                console.log(await NFT.tokenURI(i));
            } catch (error) {
                console.log(`get error to find token uri of ${i}`);
                console.error();
            }
        }
        // console.log("total token uri", await NFT.tokenURI(10))
    });


    it("get  details of all nft", async function () {
        const totalToken = await NFT.GetCurrentToken();
        console.log("get details of all nft by using javascript");
        for (i = 0; i < totalToken; i++) {
            try {
                // call function to get details of nft 
                console.log(await NFT.GetNFTDetails(i));
            } catch (error) {
                console.log(`get error to find token details of ${i}`);
            }
        }
    });

    it("get owner of particular tokenId", async function () {
        const totalToken = await NFT.GetCurrentToken();
        console.log("get Owner of all nft by tokenId  ");
        for (i = 0; i < totalToken; i++) {
            // for testing purpose
            const det1 = await NFT.GetNFTDetails(i);
            try {

                // call this function to get current owner of NFT
                console.log(await NFT.ownerOf(i));
                expect(await NFT.ownerOf(i)).to.be.equal(await det1.owner);
            } catch (error) {
                console.log(`get error to find owner of token ${i}`);
            }
        }

        console.log("address of nft contract", NFT.address);
    });

    it("get my all NFTs", async function () {
        const totalToken = await NFT.GetCurrentToken();
        console.log("get My all NFTs ");
        const tx1 = await NFT.connect(ACCOUNTS[2]).buy(1, {
            value: ethers.utils.parseEther("100"),
        });

        // let's user is account[2] // fetch from metamask
        user = 2;
        for (i = 0; i < totalToken; i++) {
            try {
                // console.log(await NFT.GetNFTDetails(i))
                const det1 = await NFT.GetNFTDetails(i);

                // compare address with metamask address for current user
                if (det1.owner == ACCOUNTS[user].address || det1.creator == ACCOUNTS[user].address) {
                    console.log(
                        "****************************successfully get my all nft ******************************"
                    );
                    console.log(await NFT.GetNFTDetails(i));
                }
            } catch (error) {
                console.log(`get error to find token details of ${i}`);
            }
        }
    });

    it("get my all created nft", async function () {
        const totalToken = await NFT.GetCurrentToken;
        console.log("get my created all nft");
        user = 2;
        for (i = 0; i < totalToken; i++) {
            try {
                // console.log(await NFT.GetNFTDetails(i))
                const det1 = await NFT.GetNFTDetails(i);

                // compare address with metamask for current user
                if (det1.creator == ACCOUNTS[user].address) {
                    console.log(
                        "##################successfully get my all created nft #####################################"
                    );

                    // creator of nft
                    console.log(await det1.creator);
                }
            } catch (error) {
                console.log(`get error to find my nft  of token === ${i}`);
            }
        }
    });


    it("get price of ALL NFts", async function () {
        const totalToken = await NFT.GetCurrentToken();
        console.log("get price of  all NFTs ");

        for (i = 0; i < totalToken; i++) {
            try {


                console.log(
                    `price of nft for tokenId==${i} is equal to`,
                    // call this function to get price of nft
                    await NFT.GetNftPrice(i)
                );
            } catch (error) {
                console.log(`get error to find token details of ${i}`);
            }
        }
    });


    it("ownership testing of each nft", async function () {
        const tx1 = await NFT.connect(ACCOUNTS[2]).buy(1, {
            value: ethers.utils.parseEther("100"),
        });
        console.log(
            "ownership testing of each nft comaparing struct and original ownership by oppenzapplien"
        );
        const totalToken = await NFT.GetCurrentToken;
        for (i = 0; i < totalToken; i++) {
            const det1 = await NFT.GetNFTDetails(i);
            try {
                console.log(await NFT.ownerOf(i));
                expect(await NFT.ownerOf(i)).to.be.equal(await det1.owner);
            } catch (error) {
                console.log(`ownership conflicting of token value== ${i}`);
            }
        }
    });

    it("testing buy function of nft contract", async function () {
        // gasPrice: BigNumber { value: "1000002114" },
        //   gasPrice: BigNumber { value: "1000002114" }, use openzapplien owner
        const nftdetails = await NFT.GetNFTDetails(1);
        console.log("details of token 1 nft before buy", nftdetails);
        const tx1 = await NFT.connect(ACCOUNTS[10]).buy(1, {
            value: ethers.utils.parseEther("100"),
        });
        console.log("details of token 1 nft after buy", nftdetails);

        console.log("gas fee details of buy nft", await tx1.gasPrice);
        // expect(await NFT.ownerOf(1)).to.be.equal(await nftdetails.owner);
    });


    it("get transaction history of NFT", async function () {

        for (i = 0; i < 5; i++) {
            const tx1 = await NFT.connect(ACCOUNTS[i + 2]).buy(1, {
                value: ethers.utils.parseEther("100"),
            });
        }

        console.log("creator of nft of token 1", await NFT.GetCreatorOfNft(1));

        // call this function to get transaction history of particular nft
        const txHis = await NFT.GetTransactionHistory(1);
        console.log("get transaction history of nft gas fee", txHis.gasPrice)
        console.log(txHis);


    })



    it("get latest nft listed", async function () {

        console.log("get latest nft listed on market place");

        // call this function to get latest token(nft ) value
        const latestToken = await NFT.GetCurrentToken();
        console.log(await NFT.GetNFTDetails(latestToken - 1));

    })


    it("update nft price vlaue", async function () {
        console.log(NFT);

        // call this function to update NFT price(reverted if owner unathorised)
        const tx1 = await NFT.connect(ACCOUNTS[0]).UpdateNftPrice(
            1,
            utils.parseEther("200")
        );
        expect(await NFT.GetNftPrice(1)).to.be.equal(utils.parseEther("200"));

    })
});
