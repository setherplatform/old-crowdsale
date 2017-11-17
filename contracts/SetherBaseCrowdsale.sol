pragma solidity ^0.4.11;

import "./SetherToken.sol";
import "../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title SetherBaseCrowdsale
 * @dev SetherBaseCrowdsale is a base contract for managing a sether token crowdsale.
 */
contract SetherBaseCrowdsale {
    using SafeMath for uint256;

    // The token being sold
    SetherToken public token;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public startTime;
    uint256 public endTime;

    // address where funds are collected
    address public wallet;

    // how many finney per token
    uint256 public rate;

    // amount of raised money in wei
    uint256 public weiRaised;

    /**
    * event for token purchase logging
    * @param purchaser who paid for the tokens
    * @param beneficiary who got the tokens
    * @param value weis paid for purchase
    * @param amount amount of tokens purchased
    */
    event SethTokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    function SetherBaseCrowdsale(uint256 _rate, address _wallet) {
        require(_rate > 0);
        require(_wallet != address(0));

        token = createTokenContract();
        rate = _rate;
        wallet = _wallet;
    }

    // fallback function can be used to buy tokens
    function () payable {
        buyTokens(msg.sender);
    }

    // low level token purchase function
    function buyTokens(address beneficiary) public payable {
        require(beneficiary != address(0));
        require(validPurchase());

        uint256 weiAmount = msg.value;

        // calculate token amount to be created
        uint256 tokens = computeTokens(weiAmount);

        require(isWithinTokenAllocLimit(tokens));

        // update state
        weiRaised = weiRaised.add(weiAmount);

        token.mint(beneficiary, tokens);

        SethTokenPurchase(msg.sender, beneficiary, weiAmount, tokens);

        forwardFunds();
    }

    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        return now > endTime;
    }

    // @return true if crowdsale event has started
    function hasStarted() public constant returns (bool) {
        return now < startTime;
    }

    // send ether to the fund collection wallet
    function forwardFunds() internal {
        wallet.transfer(msg.value);
    }

    // @return true if the transaction can buy tokens
    function validPurchase() internal constant returns (bool) {
        bool withinPeriod = now >= startTime && now <= endTime;
        bool nonZeroPurchase = msg.value != 0;
        return withinPeriod && nonZeroPurchase;
    }
    
    //Override this method with token distribution strategy
    function computeTokens(uint256 weiAmount) internal returns (uint256) {
        //To be overriden
    }

    //Override this method with token limitation strategy
    function isWithinTokenAllocLimit(uint256 _tokens) internal returns (bool) {
        //To be overriden
    }
    
    // creates the token to be sold.
    function createTokenContract() internal returns (SetherToken) {
        return new SetherToken();
    }
}