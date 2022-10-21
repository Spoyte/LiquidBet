// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Swap is ERC20, Ownable {
  address public FranceTokenAddress;
  address public BrasilTokenAddress;

  constructor() ERC20("LP", "LP") {
    require(_FranceTokenAddress != address(0), "France Token Incorect");
    require(_BrasilTokenAddress != address(0), "Brasil Token Incorect");

    FranceTokenAddress = _FranceTokenAddress;
    BrasilTokenAddress = _BrasilTokenAddress;
  }

  function setAddress(address _FranceTokenAddress, address _BrasilTokenAddress)
    public
    onlyOwner
  {
    FranceTokenAddress = _FranceTokenAddress;
    BrasilTokenAddress = _BrasilTokenAddress;
  }

  function getReserveFrance() public view returns (uint256) {
    uint256 FranceReserve = ERC20(FranceTokenAddress).balanceOf(address(this));
    return (FranceReserve);
  }

  function getReserveBrasil() public view returns (uint256) {
    uint256 BrasilReserve = ERC20(BrasilTokenAddress).balanceOf(address(this));
    return (BrasilReserve);
  }

  function addLiquidity(uint256 _amount) public onlyOwner {
    ERC20 FranceToken = ERC20(FranceTokenAddress);
    ERC20 BrasilToken = ERC20(BrasilTokenAddress);

    FranceToken.transferFrom(msg.sender, address(this), _amount);
    BrasilToken.transferFrom(msg.sender, address(this), _amount);
  }

  function removeLiquidity() public onlyOwner {
    uint256 FranceReserve;
    uint256 BrasilReserve;

    ERC20(FranceTokenAddress).transfer(msg.sender, getReserveFrance());
    ERC20(BrasilTokenAddress).transfer(msg.sender, getReserveBrasil());
  }

  // @notice Explain to an end user what this does
  //  @dev Explain to a developer any extra details
  //  @param Documents a parameter just like in doxygen (must be followed by parameter name)

  function betOnFrance(uint256 _amount) public payable {
    _mint(FranceTokenAddress, _amount);
    _mint(BrasilTokenAddress, _amount);
  }
}
