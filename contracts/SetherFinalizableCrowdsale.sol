pragma solidity ^0.4.11;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SetherBaseCrowdsale.sol";


/**
 * @title SetherFinalizableCrowdsale
 * @dev Extension of SetherBaseCrowdsale where an owner can do extra work
 * after finishing.
 */
contract SetherFinalizableCrowdsale is SetherBaseCrowdsale, Ownable {
  using SafeMath for uint256;

  bool public isFinalized = false;

  event SetherFinalized();

  /**
   * @dev Must be called after crowdsale ends, to do some extra finalization
   * work. Calls the contract's finalization function.
   */
  function finalize() onlyOwner public {
    require(!isFinalized);
    require(hasEnded());

    finalization();
    SetherFinalized();

    isFinalized = true;
  }

  /**
   * @dev Can be overridden to add finalization logic. The overriding function
   * should call super.finalization() to ensure the chain of finalization is
   * executed entirely.
   */
  function finalization() internal {
    //To be overriden
  }
}
