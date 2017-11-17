import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SetherBaseCrowdsale.sol";


/**
 * @title SetherStartableCrowdsale
 * @dev Extension of SetherBaseCrowdsale where an owner can start the crowdsale
 */
contract SetherStartableCrowdsale is SetherBaseCrowdsale, Ownable {
  using SafeMath for uint256;

  bool public isStarted = false;

  event SetherStarted();

  /**
   * @dev Must be called after crowdsale ends, to do some extra finalization
   * work. Calls the contract's finalization function.
   */
  function start() onlyOwner public {
    require(!isStarted);
    require(!hasStarted());

    starting();
    SetherStarted();

    isStarted = true;
  }

  /**
   * @dev Can be overridden to add start logic. The overriding function
   * should call super.starting() to ensure the chain of starting is
   * executed entirely.
   */
  function starting() internal {
    //To be overriden
  }
}