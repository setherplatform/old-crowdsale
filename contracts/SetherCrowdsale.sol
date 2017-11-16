pragma solidity ^0.4.11;

import "./SetherCappedCrowdsale.sol";
import "./SetherFinalizableCrowdsale.sol";

/**
 * @title SetherCrowdsale
 * @dev This is Sether's crowdsale contract.
 */
contract SetherCrowdsale is SetherCappedCrowdsale, SetherFinalizableCrowdsale {

    function SetherCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet,
            uint256 _limitDatePresale, uint256 _limitDateCrowdWeek1, uint256 _limitDateCrowdWeek2, 
            uint256 _limitDateCrowdWeek3, uint256 _presaleDiscountLimit1, uint256 _presaleDiscountLimit2) 
        SetherCappedCrowdsale()
        SetherFinalizableCrowdsale()
        SetherMultiStepCrowdsale(_limitDatePresale, _limitDateCrowdWeek1, _limitDateCrowdWeek2, 
                                _limitDateCrowdWeek3, _presaleDiscountLimit1, _presaleDiscountLimit2)
        SetherBaseCrowdsale(_startTime, _endTime, _rate, _wallet) 
    {
        
        require(_limitDatePresale > _startTime);
        require(_limitDateCrowdWeek1 > _limitDatePresale);
        require(_limitDateCrowdWeek2 > _limitDateCrowdWeek1);
        require(_limitDateCrowdWeek3 > _limitDateCrowdWeek2);
   
    }

    function finalization() internal {
        uint256 ownerShareTokens = token.getTotalSupply().mul(9).div(11);
        token.mint(wallet, ownerShareTokens);
    }
}