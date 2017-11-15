pragma solidity ^0.4.11;

import "./SetherBaseCrowdsale.sol";


/**
 * @title SetherMultiStepCrowdsale
 * @dev Multi-step payment policy contract that extends SetherBaseCrowdsale
 */
contract SetherMultiStepCrowdsale is SetherBaseCrowdsale {
    uint256 public constant PRESALE_LIMIT = 25 * (10 ** 6);
    uint256 public constant CROWDSALE_LIMIT = 55 * (10 ** 6);

    uint public constant PRESALE_DISCOUNT1 = 135;
    uint public constant PRESALE_DISCOUNT2 = 140;
    uint public constant CROWD_WEEK1_DISCOUNT = 130;
    uint public constant CROWD_WEEK2_DISCOUNT = 120;
    uint public constant CROWD_WEEK3_DISCOUNT = 110;

    uint256 public limitDatePresale;
    uint256 public limitDateCrowdWeek1;
    uint256 public limitDateCrowdWeek2;
    uint256 public limitDateCrowdWeek3;

    uint256 public presaleDiscountLimit1;
    uint256 public presaleDiscountLimit2;

    function SetherMultiStepCrowdsale(uint256 _limitDatePresale, uint256 _limitDateCrowdWeek1, 
            uint256 _limitDateCrowdWeek2, uint256 _limitDateCrowdWeek3, uint256 _presaleDiscountLimit1, 
            uint256 _presaleDiscountLimit2) {

        limitDatePresale = _limitDatePresale;
        limitDateCrowdWeek1 = _limitDateCrowdWeek1;
        limitDateCrowdWeek2 = _limitDateCrowdWeek2;
        limitDateCrowdWeek3 = _limitDateCrowdWeek3;
        presaleDiscountLimit1 = _presaleDiscountLimit1;
        presaleDiscountLimit2 = _presaleDiscountLimit2;
    }

    function isWithinPresaleTimeLimit() internal returns (bool) {
        return now < limitDatePresale;
    }

    function isWithinCrowdWeek1TimeLimit() internal returns (bool) {
        return now < limitDateCrowdWeek1;
    }

    function isWithinCrowdWeek2TimeLimit() internal returns (bool) {
        return now < limitDateCrowdWeek2;
    }

    function isWithinCrowdWeek3TimeLimit() internal returns (bool) {
        return now < limitDateCrowdWeek3;
    }

    function isWithinCrodwsaleTimeLimit() internal returns (bool) {
        return now < endTime;
    }

    function isWithinPresaleLimit(uint256 _tokens) internal returns (bool) {
        return token.getTotalSupply().add(_tokens) <= PRESALE_LIMIT;
    }

    function isWithinCrowdsaleLimit(uint256 _tokens) internal returns (bool) {
        return token.getTotalSupply().add(_tokens) <= CROWDSALE_LIMIT;
    }

    function validPurchase() internal constant returns (bool) {
        return super.validPurchase() &&
            !(isWithinPresaleTimeLimit() && msg.value < presaleDiscountLimit1);
    }

    function isWithinTokenAllocLimit(uint256 _tokens) internal returns (bool) {
        return (isWithinPresaleTimeLimit() && isWithinPresaleLimit(_tokens)) ||
                        (isWithinCrowdsaleLimit(_tokens) && isWithinCrodwsaleTimeLimit());
    }

    function computeTokens(uint256 weiAmount) internal returns (uint256) {
        uint256 currentRate = rate;
        if (isWithinPresaleTimeLimit()) {
            if (msg.value < presaleDiscountLimit2) {
                currentRate = rate.mul(PRESALE_DISCOUNT1.div(100));
            } else {
                currentRate = rate.mul(PRESALE_DISCOUNT2.div(100));
            }
        } else if (isWithinCrowdWeek1TimeLimit()) {
            currentRate = rate.mul(CROWD_WEEK1_DISCOUNT.div(100));
        } else if (isWithinCrowdWeek2TimeLimit()) {
            currentRate = rate.mul(CROWD_WEEK2_DISCOUNT.div(100));
        } else if (isWithinCrowdWeek3TimeLimit()) {
            currentRate = rate.mul(CROWD_WEEK3_DISCOUNT.div(100));
        }

        return weiAmount.mul(currentRate);
    }
}
