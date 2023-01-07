require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
/** @type import('hardhat/config').HardhatUserConfig */
const { API_URL, PRIVATE_KEY } = process.env;
// module.exports = {
//   solidity: "0.8.10",
//   gasReporter: {
//     enabled: true,
//     currency: "CHF",
//     gasPrice: 21000,
//   },
//   // defaultNetwork: "polygon_mumbai",
//   //   networks: {
//   //     hardhat: {},
//   //     polygon_mumbai: {
//   //       url: API_URL,
//   //       accounts: [`0x${PRIVATE_KEY}`]
//   //     }
//   // },
// };

module.exports = {
  solidity: "0.8.10",
  // gasReporter: {
  //   enabled: true,
  //   runs:200,
  // },
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    polygon_mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/sdwDCJvTN9o-Rw5T87Rud5BHpt_F8mzN",
      accounts: [
        `0x${privatekey}`,
      ],
      chainId: 80001,
    },
  },

  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "JTC11YU2SH7VID7DPZIVRUMD5CH6D4QPHM",
    // {
    //   polygon_mumbai: "JTC11YU2SH7VID7DPZIVRUMD5CH6D4QPHM"
    // }, //
  },
};
