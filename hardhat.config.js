require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
/** @type import('hardhat/config').HardhatUserConfig */
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
  solidity: "0.8.17",
  gasReporter: {
      enabled:true,
    currency: 'CHF',
    gasPrice: 21000
  },
  // defaultNetwork: "polygon_mumbai",
  //   networks: {
  //     hardhat: {},
  //     polygon_mumbai: {
  //       url: API_URL,
  //       accounts: [`0x${PRIVATE_KEY}`]
  //     }
  // },
};
