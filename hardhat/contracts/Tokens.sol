// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
/*
 *@Author: Paul Birnbaum.
 *@title: France Token.
 *@notice: Creation of the France Token.
 *@dev: Will create 10000 tokens and can mint more later.
 */
contract France is ERC20 {
  constructor() ERC20("France", "FRA") {
    _mint(msg.sender, 10000 * 10**decimals());
  }

  //@notice: Allow to mint more token when the user want to make a bet
  function mint(address _address, uint256 _amount) external {
    _mint(_address, _amount);
  }
}

/*
 *@title: Brasil Token.
 *@notice: Creation of the Brasil Token.
 *@dev: Will create 10000 tokens and can mint more later.
 */
contract Brasil is ERC20 {
  constructor() ERC20("Brasil", "BRA") {
    _mint(msg.sender, 10000 * 10**decimals());
  }

  //@notice: Allow to mint more token when the user want to make a bet
  function mint(address _address, uint256 _amount) external {
    _mint(_address, _amount);
  }
}
