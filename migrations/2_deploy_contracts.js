const CapxToken = artifacts.require("./CapxToken.sol");
const CapxTokenSale = artifacts.require("./CapxTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(CapxToken, 2000000).then(function(){
    
    //Token price is 0.00025 ether
    var tokenPrice= 250000000000000;
    return deployer.deploy(CapxTokenSale,CapxToken.address,tokenPrice);
  })
  
};
