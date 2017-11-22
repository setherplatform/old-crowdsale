pragma solidity ^0.4.11;

import "./SetherBaseCrowdsale.sol";


/**
 * @title SetherMultiStepCrowdsale
 * @dev Multi-step payment policy contract that extends SetherBaseCrowdsale
 */
contract SetherMultiStepCrowdsale is SetherBaseCrowdsale {
    uint256 public constant PRESALE_LIMIT = 25 * (10 ** 6) * (10 ** 18);
    uint256 public constant CROWDSALE_LIMIT = 55 * (10 ** 6) * (10 ** 18);
    
    uint256 public constant PRESALE_BONUS_LIMIT = 1 * (10 ** 17);

    // Presale period (includes holidays)
    uint public constant PRESALE_PERIOD = 52 days;
    // Crowdsale first week period (constants for proper testing)
    uint public constant CROWD_WEEK1_PERIOD = 7 days;
    // Crowdsale second week period
    uint public constant CROWD_WEEK2_PERIOD = 7 days;
    //Crowdsale third week period
    uint public constant CROWD_WEEK3_PERIOD = 7 days;
    //Crowdsale last week period
    uint public constant CROWD_WEEK4_PERIOD = 7 days;

    uint public constant PRESALE_BONUS = 40;
    uint public constant CROWD_WEEK1_BONUS = 25;
    uint public constant CROWD_WEEK2_BONUS = 20;
    uint public constant CROWD_WEEK3_BONUS = 10;

    uint256 public limitDatePresale;
    uint256 public limitDateCrowdWeek1;
    uint256 public limitDateCrowdWeek2;
    uint256 public limitDateCrowdWeek3;

    function SetherMultiStepCrowdsale() {

    }

    function isWithinPresaleTimeLimit() internal returns (bool) {
        return now <= limitDatePresale;
    }

    function isWithinCrowdWeek1TimeLimit() internal returns (bool) {
        return now <= limitDateCrowdWeek1;
    }

    function isWithinCrowdWeek2TimeLimit() internal returns (bool) {
        return now <= limitDateCrowdWeek2;
    }

    function isWithinCrowdWeek3TimeLimit() internal returns (bool) {
        return now <= limitDateCrowdWeek3;
    }

    function isWithinCrodwsaleTimeLimit() internal returns (bool) {
        return now <= endTime && now > limitDatePresale;
    }

    function isWithinPresaleLimit(uint256 _tokens) internal returns (bool) {
        return token.getTotalSupply().add(_tokens) <= PRESALE_LIMIT;
    }

    function isWithinCrowdsaleLimit(uint256 _tokens) internal returns (bool) {
        return token.getTotalSupply().add(_tokens) <= CROWDSALE_LIMIT;
    }

    function validPurchase() internal constant returns (bool) {
        return super.validPurchase() &&
                 !(isWithinPresaleTimeLimit() && msg.value < PRESALE_BONUS_LIMIT);
    }

    function isWithinTokenAllocLimit(uint256 _tokens) internal returns (bool) {
        return (isWithinPresaleTimeLimit() && isWithinPresaleLimit(_tokens)) ||
                        (isWithinCrodwsaleTimeLimit() && isWithinCrowdsaleLimit(_tokens));
    }

    function computeTokens(uint256 weiAmount) internal returns (uint256) {
        uint256 appliedBonus = 0;
        if (isWithinPresaleTimeLimit()) {
            appliedBonus = PRESALE_BONUS;
        } else if (isWithinCrowdWeek1TimeLimit()) {
            appliedBonus = CROWD_WEEK1_BONUS;
        } else if (isWithinCrowdWeek2TimeLimit()) {
            appliedBonus = CROWD_WEEK2_BONUS;
        } else if (isWithinCrowdWeek3TimeLimit()) {
            appliedBonus = CROWD_WEEK3_BONUS;
        }

        return weiAmount.mul(10).mul(100 + appliedBonus).div(rate);
    }
}