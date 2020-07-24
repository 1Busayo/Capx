const HDWalletProvider = require("@truffle/hdwallet-provider");

//load single private key as string
// let provider = new HDWalletProvider("", "http://localhost:8545");
 

const privateKeys =["f1de50d87bdeb4252db8e700e7e7ed95872b4d9524453eb57dfb7367e1847d26","70155300d88f13a24d06758b9bd08237eb111022e08d903fd4411e9707939853"] 
module.exports = {

networks: {
  development: {
  	host: "127.0.0.1",
	  port: "7545",
	  network_id: "*" //match any network id
  },
  rinkeby: {
	provider: function() { 
	 return new HDWalletProvider(privateKeys, "https://rinkeby.infura.io/v3/28a6496106794a969ed1b9ccfa5b5081",
	 0, 2);
	},
	network_id: 4,
	gas: 4500000,
	gasPrice: 10000000000,
}



},plugins: [
    'truffle-verify'
  ],
  api_keys: {
    etherscan: 'AMYQZ6AN3URESGFCCEWMUK55I8HAMZDT4V'
  }

};