// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Tokens.sol";

/*
*@Author: Paul Birnbaum.

*@title: Swap Contract. 
*@notice: Creation of the Swap Smart Contract.
*@dev: Allow the user to Bet on a specific Soccer team.
*/
contract Swap is ERC20, Ownable {
  address public FranceTokenAddress;
  address public BrasilTokenAddress;

  //Will be 1 for France win, 2 for Draw and 3 for Brasil's win.
  //Will be send a value at the end of the match.
  uint256 FinalResult = 0;

  /*
   *@notice: Constructor.
   *@dev: Implement the two tokens contracts address at deployment.
   */
  constructor(address _FranceTokenAddress, address _BrasilTokenAddress)
    ERC20("Liquidity Token", "LPT")
  {
    FranceTokenAddress = _FranceTokenAddress;
    BrasilTokenAddress = _BrasilTokenAddress;
  }

  /*
   *@notice: Public function that shows the balance of France Tokens in the contract
   *@return: Balance of the France Token in this contract.
   */
  function getReserveFrance() public view returns (uint256) {
    uint256 FranceReserve = ERC20(FranceTokenAddress).balanceOf(address(this));
    return (FranceReserve);
  }

  /*
   *@notice: Public function that shows the balance of Brasil Tokens in the contract
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

  function ownTokenContracts() public onlyOwner {
    France(FranceTokenAddress).setSmartContractOwner();
    Brasil(BrasilTokenAddress).setSmartContractOwner();
  }

  /*
   *@notice: Allow the Owner to add Liquidity in the Pool for the upcomming Users.
   *@dev: This function is restricted to the Owner of the Contract.
   *@dev: Need to approve the Contract address from each Tokens Contract before calling the function.
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
    ERC20(BrasilTokenAddress).transfer(msg.sender, getReserveBrasil());
    ERC20(FranceTokenAddress).transfer(msg.sender, getReserveFrance());
  }

  /*
   *@notice: Allow the User to bet on one team (1/3).
   *@dev: Allow the user to deposit some ETH/Matic
   *@dev: Mint some tokens in the User's wallet.
   */
  function deposit(uint256 _amount) public payable {
    require(msg.value > 0, "You didn't provide any funds");
    France(FranceTokenAddress).mint(msg.sender, _amount);
    Brasil(BrasilTokenAddress).mint(msg.sender, _amount);
  }

  /*
   *@notice: Allow the User to bet on one team (2/3).
   *@dev: Allow the User to deposit some of the unwanted token for a swap.
   *@dev: Need to approve the Contract address from each Tokens Contract before calling the function.
   */
  function sendBRAToken(uint256 _braAmount) public {
    ERC20(BrasilTokenAddress).transferFrom(
      msg.sender,
      address(this),
      _braAmount
    );
  }

  function sendFRToken(uint256 _frAmount) public {
    ERC20(FranceTokenAddress).transferFrom(
      msg.sender,
      address(this),
      _frAmount
    );
  }

  /*
   *@notice: Allow the User to bet on one team (3/3)
   *@dev: Send wanted token from the liquidity pool back to the user.
   */

  function receivedFrToken(uint256 _braAmount) public {
    uint256 franceTokenReserve = getReserveFrance();
    uint256 brasilTokenReserve = getReserveBrasil();
    uint256 frReturn = (_braAmount * franceTokenReserve) /
      (brasilTokenReserve + _braAmount);

    ERC20(FranceTokenAddress).transfer(msg.sender, frReturn);
  }

  function receivedBraToken(uint256 _frAmount) public {
    uint256 franceTokenReserve = getReserveFrance();
    uint256 brasilTokenReserve = getReserveBrasil();
    uint256 braReturn = (_frAmount * brasilTokenReserve) /
      (franceTokenReserve + _frAmount);

    ERC20(BrasilTokenAddress).transfer(msg.sender, braReturn);
  }

  /*
   *@notice: Send back the Token and Swap it for some ETH/MATIC If the User wins his bet.
   *@notice: Send back the token but don't swap it If he losses.
   *@dev: Function to be call when the game is over.
   */

  function gameOver() public {
    require(FinalResult > 0, "The match is not finish yet");

    (uint256 balanceFranceToken, ) = getBalanceWallet();
    (, uint256 balanceBrasilToken) = getBalanceWallet();

    if (FinalResult == 1) {
      ERC20(FranceTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceFranceToken
      );
      payable(msg.sender).transfer(balanceFranceToken);
    } else if (FinalResult == 3) {
      ERC20(BrasilTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceBrasilToken
      );
      payable(msg.sender).transfer(balanceBrasilToken);
    } else if (FinalResult == 2) {
      ERC20(FranceTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceFranceToken
      );
      ERC20(BrasilTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceBrasilToken
      );
      payable(msg.sender).transfer(
        (balanceFranceToken + balanceBrasilToken) / 2
      ); //Experimental...
    }

    assert(FinalResult > 3);
  }
}
