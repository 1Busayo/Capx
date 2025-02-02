App = {
  web3Provider: null,
 contracts:{},
 account:'0x0',
 loadinf: false,
 tokenPrice:250000000000000,
 tokensSold:0,
 tokensAvailable: 1750000,


  init:function(){
   console.log("App initialized...") 
   return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();

  },

   initContracts: function() {
    $.getJSON("CapxTokenSale.json", function(capxTokenSale) {
      App.contracts.CapxTokenSale = TruffleContract(capxTokenSale);
      App.contracts.CapxTokenSale.setProvider(App.web3Provider);
      App.contracts.CapxTokenSale.deployed().then(function(capxTokenSale) {
        console.log("Capx Token Sale Address:", capxTokenSale.address);
      });
    }).done(function() {
      $.getJSON("CapxToken.json", function(capxToken) {
        App.contracts.CapxToken = TruffleContract(capxToken);
        App.contracts.CapxToken.setProvider(App.web3Provider);
        App.contracts.CapxToken.deployed().then(function(capxToken) {
          console.log("Capx Token Address:", capxToken.address);
        });

      App.listenForEvents();
        return App.render();
      });
    });
  },

listenForEvents: function (){
  App.contracts.CapxTokenSale.deployed().then(function(instance){
  instance.Sell({},{
   fromBlock: 0,
   toBlock: 'latest',
  }).watch(function(error, event){

  console.log("event triggered",event);
  App.render();
  })
  })
  },


    render: function (){
      if(App.loading){
    return ;
      }
  App.loading = true;

var loader= $('#loader');
var content = $('#content');


loader.show();
content.hide();

  //Load account Data
  web3.eth.getCoinbase(function(err,account){
    if(err === null){
      console.log("account" ,account);
      App.account = account;
      $('#accountAddress').html("Your Account:" + account);
    }
 })
 
 //.done(function(){

 App.contracts.CapxTokenSale.deployed().then(function(instance){
capxTokenSaleInstance = instance;
return capxTokenSaleInstance.tokenPrice();
 }).then(function(tokenPrice){
   console.log("tokenPrice",tokenPrice);
App.tokenPrice= tokenPrice;
$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
return capxTokenSaleInstance.tokenSold();
 }).then(function(tokensSold){
   App.tokensSold = tokensSold.toNumber(); 
   //App.tokensSold = 1600000; 
   $('.tokens-sold').html(App.tokensSold);
   $('.tokens-available').html(App.tokensAvailable);

   var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
   $('#progress').css('width',progressPercent +'%');

   //Load token contract
   App.contracts.CapxToken.deployed().then(function(instance){
     capxTokenInstance = instance;
     return  capxTokenInstance.balanceOf(App.account);

   }).then(function(balance){
     $('.capx-balance').html(balance.toNumber());

     App.loading = false;
    loader.hide();
    content.show();
   })
   
});
    
 // });
},
buyTokens: function(){
  $('#content').hide();
  $('#loader').show();
  var numberOfTokens = $('#numberOfTokens').val();
  App.contracts.CapxTokenSale.deployed().then(function(instance){
 return instance.buyTokens(numberOfTokens,{
   from: App.account,
   value: numberOfTokens * App.tokenPrice,
   gas: 500000
 });
}).then(function(result){
console.log("Tokens bought....")
$('form').trigger('reset') // reset number of tokens in form
   //Wait for sell event
  });
}
}


$(function() {
  $(window).load(function() {
    App.init();
  })
});
