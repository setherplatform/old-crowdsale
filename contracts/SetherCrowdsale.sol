pragma solidity ^0.4.11;

import "./SetherCappedCrowdsale.sol";
import "./SetherStartableCrowdsale.sol";
import "./SetherFinalizableCrowdsale.sol";

/**
 * @title SetherCrowdsale
 * @dev This is Sether's crowdsale contract.
 */
contract SetherCrowdsale is SetherCappedCrowdsale, SetherStartableCrowdsale, SetherFinalizableCrowdsale {

    function SetherCrowdsale(uint256 rate, address _wallet) 
        SetherCappedCrowdsale()
        SetherFinalizableCrowdsale()
        SetherStartableCrowdsale()
        SetherMultiStepCrowdsale()
        SetherBaseCrowdsale(rate, _wallet) 
    {
   
    }

    function starting() internal {
        super.starting();
        startTime = now;
        limitDatePresale = startTime + PRESALE_PERIOD;
        limitDateCrowdWeek1 = limitDatePresale + CROWD_WEEK1_PERIOD; 
        limitDateCrowdWeek2 = limitDateCrowdWeek1 + CROWD_WEEK2_PERIOD; 
        limitDateCrowdWeek3 = limitDateCrowdWeek2 + CROWD_WEEK3_PERIOD;         
        endTime = limitDateCrowdWeek3 + CROWD_WEEK4_PERIOD;
    }

    function finalization() internal {
        super.finalization();
        uint256 ownerShareTokens = token.getTotalSupply().mul(9).div(11);

        token.mint(wallet, ownerShareTokens);
    }
}