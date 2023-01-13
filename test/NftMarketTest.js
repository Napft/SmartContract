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

        const priceofnft = await ethers.utils.parseEther("0.000002");

        for (i = 0; i < 10; i++) {
            // call function to mint nft on blockchain
            let tx1 = await NFT.connect(ACCOUNTS[i]).creatToken(
                `anand${i}kumar-->${i}`,
                priceofnft,
                i
            );
            // console.log(`gas fee for continous miniting for token ${i + 1}`, tx1);
        }
        console.log("total token in market place", await NFT.GetCurrentToken());
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
        for (i = 1; i < totalToken; i++) {
            // for testing purpose
            const det1 = await NFT.GetNFTDetails(i);
            console.log(await NFT.ownerOf(i));
            expect(await NFT.ownerOf(i)).to.be.equal(await det1.owner);
        }

        console.log("address of nft contract", NFT.address);
    });

    it("get my all NFTs", async function () {
        const totalToken = await NFT.GetCurrentToken();
        console.log("get My all NFTs ");
        const tx1 = await NFT.connect(ACCOUNTS[2]).buy(1, {
            value: ethers.utils.parseEther("0.000002"),
        });
        console.log("gasfee of buy nft", tx1.gasPrice);
        // let's user is account[2] // fetch from metamask
        for (i = 0; i < totalToken; i++) {
            try {
                // console.log(await NFT.GetNFTDetails(i))
                const owner = await NFT.ownerOf(i);
                // const creator = await NFT.GetCreatorOfNft(i);

                // compare address with metamask address for current user
                if (owner == ACCOUNTS[2].address) {
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
        for (i = 0; i < totalToken; i++) {
            try {
                // console.log(await NFT.GetNFTDetails(i))
                const creator = await NFT.GetCreatorOfNft(i);

                // compare address with metamask for current user
                if (creator == ACCOUNTS[2].address) {
                    console.log(
                        "##################successfully get my all created nft #####################################"
                    );

                    console.log(await creator);
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
            value: ethers.utils.parseEther("0.000002"),
        });
        console.log(
            "ownership testing of each nft comaparing struct and original ownership by oppenzapplien"
        );
        const totalToken = await NFT.GetCurrentToken;
        for (i = 0; i < totalToken; i++) {
            const det1 = await NFT.GetNFTDetails(i);
            expect(await NFT.ownerOf(i)).to.be.equal(await det1.owner);
            // try {
            //     console.log(await NFT.ownerOf(i));
            // } catch (error) {
            //     console.log(`ownership conflicting of token value== ${i}`);
            // }
        }
    });

    it("testing buy function of nft contract", async function () {
        // gasPrice: BigNumber { value: "1000002114" },
        //   gasPrice: BigNumber { value: "1000002114" }, use openzapplien owner
        const nftdetails = await NFT.GetNFTDetails(1);
        console.log("details of token 1 nft before buy", nftdetails);

        console.log("price of tokenid 1 is ", await NFT.GetNftPrice(1));
        const tx1 = await NFT.connect(ACCOUNTS[10]).buy(1, {
            value: ethers.utils.parseEther("0.000002"),
        });
        console.log("gas fee of buy function", tx1.gasPrice);
        const tx2 = await NFT.connect(ACCOUNTS[9]).buy(1, {
            value: ethers.utils.parseEther("0.000002"),
            // console.log("gas fee of buy function",tx1.gasPrice)
        });
        console.log("details of token 1 nft after buy", nftdetails);
        console.log(
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
        );
        console.log("gas fee details of buy nft@@@@@@@@@@@@@@", await tx1.gasPrice);
        // expect(await NFT.ownerOf(1)).to.be.equal(await nftdetails.owner);

        console.log(
            "transaction history of token1 is",
            await NFT.GetTransactionHistory(1)
        );
    });

    it("get transaction history of NFT", async function () {
        for (i = 0; i < 5; i++) {
            const tx1 = await NFT.connect(ACCOUNTS[i + 2]).buy(1, {
                value: ethers.utils.parseEther("0.000002"),
            });
        }

        console.log("creator of nft of token 1", await NFT.GetCreatorOfNft(1));

        // call this function to get transaction history of particular nft
        const txHis = await NFT.GetTransactionHistory(1);
        console.log("get transaction history of nft gas fee", txHis.gasPrice);
        console.log(txHis);
    });

    it("get latest nft listed", async function () {
        console.log("get latest nft listed on market place");

        // call this function to get latest token(nft ) value
        const latestToken = await NFT.GetCurrentToken();
        console.log(await NFT.GetNFTDetails(latestToken - 1));
    });

    it("update nft price vlaue", async function () {
        // console.log(NFT);

        // call this function to update NFT price(reverted if owner unathorised)
        const tx1 = await NFT.connect(ACCOUNTS[0]).UpdateNftPrice(
            1,
            utils.parseEther("200")
        );
        expect(await NFT.GetNftPrice(1)).to.be.equal(utils.parseEther("200"));
    });

    it("get my total nft", async function () {
        console.log("get my total number of nfts");
        expect(await NFT.MyTotalNft(ACCOUNTS[2].address)).to.be.equal(1);
    });

    it("withdraw all ether from contract", async function () {
        const tx1 = await NFT.connect(ACCOUNTS[0]).withdraw();
        expect(await Provider.getBalance(NFT.address)).to.be.equal(0);
    });

    it("get token id at time of minitng", async function () {
        const tx2 = await NFT.connect(ACCOUNTS[3]).callStatic.creatToken(
            "dkfjkdfjk",
            1200,
            2
        );
        console.log("tx2 details", tx2.toNumber());
        expect(await tx2.toNumber()).to.be.equal(11);
    });

    it("create and buy test", async function () {
        // console.log("tokenId==", await NFT.GetCurrentToken());
        const price = 0.0005;// take input from users
        const balanceInWei = await ethers.utils.parseEther(`${price}`);
        console.log("price in wei", balanceInWei);

        await NFT.on("Mint", (creator, tokenId, tokenURI) => {
            console.log("event details");
            console.log(creator, tokenId, tokenURI);
        });
        const tx1 = await NFT.connect(ACCOUNTS[3]).creatToken(
            "appu",
            balanceInWei,
            10
        );
        await tx1.wait()
        console.log(tx1)
        expect(await NFT.GetCurrentToken()).to.be.equal(11);


        // buy nft

        for(let i=12;i>0;i--){
            console.log(
                "transaction history of nft before buy",
                await NFT.GetTransactionHistory(i)
            );
            // const balanceInEth = await ethers.utils.formatEther(NftPrice);
            try{

                const NftPrice = await NFT.GetNftPrice(i);
                const tx2 = await NFT.connect(ACCOUNTS[2]).buy(i, {
                    value: NftPrice,
                });
                await tx2.wait();
                console.log(
                    "transaction history of nft after buy",
                    await NFT.GetTransactionHistory(i)
                );
            }catch(error){
                console.log(`error with token-->${i}`,error)
            }



        }
    });

    it("royalityfee testing of nft", async function () {

        


    });
});
// })
