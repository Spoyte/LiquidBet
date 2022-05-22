pragma solidity ^0.8.7; 

import "./erc20B.sol";
import "@openzeppelin/contracts@4.6.0/access/Ownable.sol";

contract MyMarket is Ownable{

  string public name;
  string public teamA;
  string public teamB;
  string public api;

  erc20B public _token = erc20B(0x29152f111fbd03ED4866A32D81E84E493f2bC4ff);
  erc20B public erc_teamA;
  erc20B public erc_teamB;
  uint256 _winner_id = 99999;
//need to add api details in constructor + chainlink
  constructor(
    string memory _marketName,
    string memory _teamAName,
    string memory _teamBName
    //string memory _apiLink
  ) 
    public
  {

    erc_teamA = new erc20B(_teamAName, "A", 1000000);
    erc_teamB = new erc20B(_teamBName, "B", 1000000);
    name = _marketName;
    teamA = _teamAName;
    teamB = _teamBName;
  }

//need to get chainlink data
  function setWinner(uint256 winner_id) public onlyOwner{
    _winner_id = winner_id;
  }

  function mint(uint256 _amount) public {
    require(_token.transferFrom(msg.sender,address(this),_amount));
    erc_teamA.mint(msg.sender, _amount);
    erc_teamB.mint(msg.sender, _amount);    
  }

  function redeemA(uint256 _amount) public {
    require(_winner_id == 0);
    require(erc_teamA.transferFrom(msg.sender,address(this),_amount));
    _token.transfer(msg.sender, _amount);
  }
  
  function redeemB(uint256 _amount) public {
    require(_winner_id == 1);
    require(erc_teamA.transferFrom(msg.sender,address(this),_amount));
    _token.transfer(msg.sender, _amount);
  }
}
