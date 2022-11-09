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
  function getBalanceWalletFrance() public view returns (uint256) {
    uint256 balanceFranceToken = ERC20(FranceTokenAddress).balanceOf(
      msg.sender
    );
    return (balanceFranceToken);
  }

  function getBalanceWalletBrasil() public view returns (uint256) {
    uint256 balanceBrasilToken = ERC20(BrasilTokenAddress).balanceOf(
      msg.sender
    );
    return (balanceBrasilToken);
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
   *@notice: Allow the User to bet on one team (1/2).
   *@dev: Allow the user to deposit some ETH/Matic
   *@dev: Mint some tokens in the User's wallet.
   */
  function deposit() public payable {
    require(msg.value > 0, "You didn't provide any funds");
    France(FranceTokenAddress).mint(msg.sender, msg.value);
    Brasil(BrasilTokenAddress).mint(msg.sender, msg.value);
  }

  /*
   *@notice: Allow the User to bet on one team (2/2).
   *@dev: Allow the User to make a SWAP.
   *@dev: Need to approve the Contract address from each Tokens Contract before calling the function.
   */
  //Wei
  function swapBRAtoFR(uint256 _braAmount) public {
    ERC20(BrasilTokenAddress).transferFrom(
      msg.sender,
      address(this),
      _braAmount
    );

    uint256 franceTokenReserve = getReserveFrance();
    uint256 brasilTokenReserve = getReserveBrasil() - _braAmount;
    uint256 frReturn = (_braAmount * franceTokenReserve) /
      (brasilTokenReserve + _braAmount);

    ERC20(FranceTokenAddress).transfer(msg.sender, frReturn);
  }

  function swapFRtoBRA(uint256 _frAmount) public {
    ERC20(FranceTokenAddress).transferFrom(
      msg.sender,
      address(this),
      _frAmount
    );
    uint256 brasilTokenReserve = getReserveBrasil();
    uint256 franceTokenReserve = getReserveFrance() - _frAmount;
    uint256 braReturn = (_frAmount * brasilTokenReserve) /
      (franceTokenReserve + _frAmount);

    ERC20(BrasilTokenAddress).transfer(msg.sender, braReturn);
  }

  function walletBalance() public view returns (uint256) {
    return (msg.sender.balance);
  }

  function contractBalance() public view returns (uint256) {
    return address(this).balance;
  }

  //Will be 1 for France win, 2 for Draw and 3 for Brasil's win.
  //Will be send a value at the end of the match.
  uint256 public FinalResult = 1;

  // Allow us to test the final result before connecting to the Chainlink Node
  function setFinalResult(uint256 _winner) public {
    FinalResult = _winner;
  }

  /*
   *@notice: User send back the Token and Swap it for some ETH/MATIC If the User wins his bet.
   *@notice: User send back the token but don't swap it If he losses.
   *@dev: Function to be call when the game is over.
   */

  function gameOver() public {
    require(FinalResult > 0, "The match is not finish yet");

    uint256 balanceFranceToken = getBalanceWalletFrance();
    uint256 balanceBrasilToken = getBalanceWalletBrasil();

    if (FinalResult == 1) {
      require(
        balanceFranceToken >= contractBalance(),
        "There is not Enought Matic in the Contract"
      );
      ERC20(FranceTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceFranceToken
      );
      (bool sent, ) = payable(msg.sender).call{ value: contractBalance() }("");
      require(sent, "Failed to send Ether");
    } else if (FinalResult == 3) {
      require(
        balanceBrasilToken >= contractBalance(),
        "There is not Enought Matic in the Contract"
      );
      ERC20(BrasilTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceBrasilToken
      );
      (bool sent, ) = payable(msg.sender).call{ value: contractBalance() }("");
      require(sent, "Failed to send Ether");
    }
    //In case of a draw, EXPERIMENTAL
    // else if (FinalResult == 2) {
    //   ERC20(FranceTokenAddress).transferFrom(
    //     msg.sender,
    //     address(this),
    //     balanceFranceToken
    //   );
    //   ERC20(BrasilTokenAddress).transferFrom(
    //     msg.sender,
    //     address(this),
    //     balanceBrasilToken
    //   );
    //   (bool sent, ) = payable(msg.sender).call{ value: contractBalance() }("");
    //   require(sent, "Failed to send Ether");
    // }
  }
}
