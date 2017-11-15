pragma solidity ^0.4.11;

import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";
import "./SetherMultiStepCrowdsale.sol";


/**
 * @title SetherCappedCrowdsale
 * @dev Extension of SetherBaseCrowdsale with a max amount of funds raised
 */
contract SetherCappedCrowdsale is SetherMultiStepCrowdsale {
    using SafeMath for uint256;

    uint256 public constant HARD_CAP = 55 * (10 ** 6);

    function SetherCappedCrowdsale() {
        
    }

    // overriding SetherBaseCrowdsale#validPurchase to add extra cap logic
    // @return true if investors can buy at the moment
    function validPurchase() internal constant returns (bool) {
        bool withinCap = weiRaised.add(msg.value) <= HARD_CAP;

        return super.validPurchase() && withinCap;
    }

    // overriding Crowdsale#hasEnded to add cap logic
    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        bool capReached = weiRaised >= HARD_CAP;
        return super.hasEnded() || capReached;
    }
}
