// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Tokens.sol";

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

/*
*@Authors: Paul Birnbaum, Spoyte.

*@title: Swap Contract. 
*@notice: Creation of the Swap Smart Contract.
*@dev: Allow the user to Bet on a specific Soccer team.
*extra comment
*WARNING I removed the ownable
*/
contract Swap is ERC20, ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;

  address public FranceTokenAddress;
  address public BrasilTokenAddress;

  /* chainlink params */
  bytes32 private jobId;
  uint256 private fee;
  /* game status params */
  uint256 public homeScore;
  uint256 public awayScore;
  /* chainlink event */
  event RequestMultipleFulfilled(
    bytes32 indexed requestId,
    uint256 homeScore,
    uint256 awayScore
  );

  /*
   *@notice: Constructor.
   *@dev: Implement the two tokens contracts address at deployment.
   *_LinkToken = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB     (on mumbai)
   *_LinkOracle = 0x915dc8cbcf3F17faa33F20B88e6d5D162195E0b2    (own oracle)
   *_JobId = fa38023e44a84b6384c9411401904997                   2 results home/away based on sportdataio
   */
  constructor(
    address _FranceTokenAddress,
    address _BrasilTokenAddress,
    address _LinkToken,
    address _LinkOracle
  ) ERC20("Liquidity Token", "LPT") ConfirmedOwner(msg.sender) {
    FranceTokenAddress = _FranceTokenAddress;
    BrasilTokenAddress = _BrasilTokenAddress;
    setChainlinkToken(_LinkToken);
    setChainlinkOracle(_LinkOracle);
    jobId = "fa38023e44a84b6384c9411401904997";
    fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job) (here 0.1 link as in testnets)
  }

  /*chainlink functions*/

  /**
   * @notice Request mutiple parameters from the oracle in a single transaction
   */
  function requestMultipleParameters() public {
    Chainlink.Request memory req = buildChainlinkRequest(
      jobId,
      address(this),
      this.fulfillMultipleParameters.selector
    );
    req.add(
      "urlRESULT",
      "https://api.sportsdata.io/v3/soccer/scores/json/GamesByDate/2022-11-15?key=a5acc6cc44dc47fc9918198d29b33e00"
    );
    req.add("pathHOME", "0,HomeTeamScore");

    req.add("pathAWAY", "0,AwayTeamScore");

    sendChainlinkRequest(req, fee); // MWR API.
  }

  /**
   * @notice Fulfillment function for multiple parameters in a single request
   * @dev This is called by the oracle. recordChainlinkFulfillment must be used.
   */
  function fulfillMultipleParameters(
    bytes32 requestId,
    uint256 homeResponse,
    uint256 awayResponse
  ) public recordChainlinkFulfillment(requestId) {
    emit RequestMultipleFulfilled(requestId, homeResponse, awayResponse);
    homeScore = homeResponse;
    awayScore = awayResponse;

    // IF STATEMENT
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(
      link.transfer(msg.sender, link.balanceOf(address(this))),
      "Unable to transfer"
    );
  }

  /*end of chainlink functions*/

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

  function deposit_swapBRAtoFR() public payable {
    require(msg.value > 0, "You didn't provide any funds");
    France(FranceTokenAddress).mint(msg.sender, msg.value);
    Brasil(BrasilTokenAddress).mint(msg.sender, msg.value);

    ERC20(BrasilTokenAddress).transferFrom(
      msg.sender,
      address(this),
      msg.value
    );

    uint256 franceTokenReserve = getReserveFrance();
    uint256 brasilTokenReserve = getReserveBrasil() - msg.value;
    uint256 frReturn = (msg.value * franceTokenReserve) /
      (brasilTokenReserve + msg.value);

    ERC20(FranceTokenAddress).transfer(msg.sender, frReturn);
  }

  function deposit_swapFRtoBRA() public payable {
    require(msg.value > 0, "You didn't provide any funds");
    France(FranceTokenAddress).mint(msg.sender, msg.value);
    Brasil(BrasilTokenAddress).mint(msg.sender, msg.value);

    ERC20(BrasilTokenAddress).transferFrom(
      msg.sender,
      address(this),
      msg.value
    );

    uint256 franceTokenReserve = getReserveFrance();
    uint256 brasilTokenReserve = getReserveBrasil() - msg.value;
    uint256 frReturn = (msg.value * franceTokenReserve) /
      (brasilTokenReserve + msg.value);

    ERC20(FranceTokenAddress).transfer(msg.sender, frReturn);
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
      uint256 balanceFranceToken_after = balanceFranceToken;
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
      (bool sent, ) = payable(msg.sender).call{
        value: balanceFranceToken_after
      }("");
      require(sent, "Failed to send Ether");
    } else if (FinalResult == 3) {
      require(
        balanceBrasilToken >= contractBalance(),
        "There is not Enought Matic in the Contract"
      );
      uint256 balanceBrasilToken_after = balanceBrasilToken;
      ERC20(BrasilTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceBrasilToken
      );
      ERC20(FranceTokenAddress).transferFrom(
        msg.sender,
        address(this),
        balanceFranceToken
      );
      (bool sent, ) = payable(msg.sender).call{
        value: balanceBrasilToken_after
      }("");
      require(sent, "Failed to send Ether");
    }
    // In case of a draw, EXPERIMENTAL
    else if (FinalResult == 2) {
      uint256 balanceFranceToken_after = balanceFranceToken;
      uint256 balanceBrasilToken_after = balanceBrasilToken;
      ERC20(FranceTokenAddress).transferFrom(
        msg.sender,
        address(this),
        getBalanceWalletFrance
      );
      ERC20(BrasilTokenAddress).transferFrom(
        msg.sender,
        address(this),
        getBalanceWalletBrasil
      );

      (bool sent, ) = payable(msg.sender).call{
        value: (balanceBrasilToken_after * balanceFranceToken_after) / 2
      }("");
      require(sent, "Failed to send Ether");
    }
  }
}
