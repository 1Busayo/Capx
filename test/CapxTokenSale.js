const CapxToken = artifacts.require("./CapxToken.sol");
const CapxTokenSale = artifacts.require("./CapxTokenSale.sol");


contract('CapxTokenSale', function(accounts) {
    var tokenInstance;
    var tokenSaleInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice= 250000000000000; // in wei
    var tokensAvailable = 1750000;
    var numberOfTokens;



    it('initializes the contract with the correct values', function(){
   return CapxTokenSale.deployed().then(function(instance){
    tokenSaleInstance = instance;
    return tokenSaleInstance.address
   }).then(function(address){
       assert.notEqual(address,0x0, 'has contract address');
        return tokenSaleInstance.tokenContract();
    }).then(function(address){
        assert.notEqual(address,0x0, 'has token contract address');
      return tokenSaleInstance.tokenPrice();
    }).then(function(price){
   assert.equal(price, tokenPrice, 'token price is correct');
    });
    
});



it ('facilitates token buying', function(){
    return CapxToken.deployed().then(function(instance){
     //first  Grab token instance 
        tokenInstance = instance;
        return CapxTokenSale.deployed();
    }).then(function(instance) {
        //Then grab token sale instance
      tokenSaleInstance = instance;
      //Provision 75% of all total supply
      return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable,{from: admin})
    }).then(function(receipt){
      numberOfTokens =10;
      var value = numberOfTokens * tokenPrice ;
     return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer , value: value})   
    }).then(function(receipt){
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
        assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
        assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
        return tokenSaleInstance.tokenSold();
    }).then(function(amount){
 assert.equal(amount.toNumber(),numberOfTokens, 'increments the number of tokens sold');
  return tokenInstance.balanceOf(buyer);
}).then(function(balance){
    assert.equal(balance.toNumber(),tokensAvailable - numberOfTokens);
    return tokenInstance.balanceOf(tokenSaleInstance.address);
    }).then(function(balance){
   assert.equal(balance.toNumber(),tokensAvailable - numberOfTokens);
    
    //Try to buy tokens different from the ether value
    return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer , value:1});
}).then(assert.fail).catch(function(error){
assert(error.message  , 'msg.value must equal number of tokens in wei');

return tokenSaleInstance.buyTokens(1800000, {from: buyer , value:1});
}).then(assert.fail).catch(function(error){

    assert(error.message  , 'Cannot purchase tokens more than available');
      
 });

});



it('ends token sale',function(){
return CapxToken.deployed().then(function(instance){
//Grab token instance first
tokenInstance = instance;
return CapxTokenSale.deployed();
}).then(function(instance){
    //Then grab token sale instance
    tokenSaleInstance=instance
    // Try to end sale from account other than the admin
    return tokenSaleInstance.endSale({from: buyer});
}).then(assert.fail).catch(function(error){
    assert(error.message,'must be  admin to end sale');
//End Sale as admin
return tokenSaleInstance.endSale({from : admin});
}).then(function(receipt){
    //receipt
    return tokenInstance.balanceOf(admin);
}).then(function(balance){
assert.equal(balance.toNumber(), 1999990, 'return all unsold CapxTokens to admin');
return tokenSaleInstance.tokenPrice();
}).then(function(price){
assert.equal(price.toNumber(), 0 , 'token price was reset');

});

});

});