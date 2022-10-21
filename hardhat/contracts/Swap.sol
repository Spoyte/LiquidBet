// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 *@Author: Paul Birnbaum.
 *@title: Swap Contract.
 *@notice: Creation of the Swap Smart Contract.
 *@dev: Allow the user to Bet on a specific Soccer team.
 */
contract Swap is ERC20, Ownable {
  address public FranceTokenAddress;
  address public BrasilTokenAddress;

  constructor(address _FranceTokenAddress, address _BrasilTokenAddress)
    ERC20("Liquidity Token", "LPT")
  {
    FranceTokenAddress = _FranceTokenAddress;
    BrasilTokenAddress = _BrasilTokenAddress;
  }

  /*
   *@notice: Public function that show the balance of France Tokens in the contract
   *@return: Balance of the France Token in this contract.
   */
  function getReserveFrance() public view returns (uint256) {
    uint256 FranceReserve = ERC20(FranceTokenAddress).balanceOf(address(this));
    return (FranceReserve);
  }

  /*
   *@notice: Public function that show the balance of Brasil Tokens in the contract
   *@return: Balance of the Brasil Token in this contract.
   */
  function getReserveBrasil() public view returns (uint256) {
    uint256 BrasilReserve = ERC20(BrasilTokenAddress).balanceOf(address(this));
    return (BrasilReserve);
  }

  /*
   *@notice: Public function that show the balance of Tokens in the User's Wallet
   *@return: Balance of the France and Brasil Token in the User's Wallet.
   */
  function getBalanceWallet() public view returns (uint256, uint256) {
    uint256 balanceFranceToken = ERC20(FranceTokenAddress).balanceOf(
      msg.sender
    );
    uint256 balanceBrasilToken = ERC20(BrasilTokenAddress).balanceOf(
      msg.sender
    );

    return (balanceFranceToken, balanceBrasilToken);
  }

  /*
   *@notice: Allow the Owner to add Liquidity in the Pool for the upcomming Users.
   *@dev: This function is restricted to the Owner of the Contract.
   */
  function addLiquidity(uint256 _amount) public onlyOwner {
    ERC20(FranceTokenAddress).transferFrom(msg.sender, address(this), _amount);
    ERC20(BrasilTokenAddress).transferFrom(msg.sender, address(this), _amount);
  }

  /*
   *@notice: Allow the Owner to remove Liquidity in the Pool when the Bet is Over.
   *@dev: This function is restricted to the Owner of the Contract.
   */
  function removeLiquidity() public onlyOwner {
    ERC20(FranceTokenAddress).transferFrom(
      address(this),
      msg.sender,
      getReserveFrance()
    );
    ERC20(BrasilTokenAddress).transferFrom(
      address(this),
      msg.sender,
      getReserveBrasil()
    );
  }
}
