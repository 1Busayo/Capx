// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import './CapxToken.sol';

contract CapxTokenSale {
  address payable admin;
  CapxToken public tokenContract;
  uint256 public tokenPrice;
  uint256 public tokenSold;
  event Sell(address _buyer , uint256 _amount);

    constructor (CapxToken _tokenContract,uint256 _tokenPrice) public {
      admin = msg.sender;
      tokenContract = _tokenContract;
      tokenPrice = _tokenPrice;
    }


//multiply
function  multiply (uint x,uint y) internal pure returns (uint z){
  require(y == 0 || (z = x * y) / y == x,'multiply function');
}


    function buyTokens(uint256 _numberOfTokens) public payable {
       require(msg.value == multiply(_numberOfTokens,tokenPrice),'Require that Value is equal to tokens');
      require(tokenContract.balanceOf(address(this)) >= _numberOfTokens,'Require that the contract has enough tokens');
      //Require that the transfer is successful
      require(tokenContract.transfer(msg.sender,_numberOfTokens),'Require that the transfer is successful');
    //keep track the number of token sold
      tokenSold += _numberOfTokens;
      //Trigger Sell Event
    emit  Sell(msg.sender, _numberOfTokens);
    }

//Ending Token CapxToken
function endSale() public{
  //Require admin
  require(msg.sender == admin,'require admin');
  require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))),'');

  //Destroy contract
selfdestruct(admin);

}


}