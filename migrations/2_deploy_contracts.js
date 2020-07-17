const CapxToken = artifacts.require("./CapxToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CapxToken, 2000000);
};
