const path = require("path");

let HDWalletProvider = require("truffle-hdwallet-provider");
let privateKey = "1E25C8731DE51F919A23EF70749251BB4F57D80BFD6468FC450FD79D39E3B87C"; // testnet
let skale = "http://ethboston1.skalenodes.com:10145";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    skale: {
      provider: () => new HDWalletProvider(privateKey, skale),
      gasPrice: 0,
      network_id: "*"
    }
  }
};
