pragma solidity ^0.4.11;

import "../node_modules/zeppelin-solidity/contracts/token/MintableToken.sol";


/**
 * @title SetherToken
 * @dev Sether ERC20 Token that can be minted.
 * It is meant to be used in sether crowdsale contract.
 */
contract SetherToken is MintableToken {

    string public constant name = "Sether";
    string public constant symbol = "SETH";
    uint8 public constant decimals = 18;

    function getTotalSupply() public returns (uint256) {
        return totalSupply;
    }
}