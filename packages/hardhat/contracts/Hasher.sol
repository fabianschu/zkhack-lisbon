// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Hasher {
    constructor() {}

    function hash(bytes memory x) public pure returns (bytes32) {
        return sha256(x);
    }
    
    function concatHash(bytes memory x, bytes memory y) public pure returns (bytes32) {
        return sha256(abi.encodePacked(x,y));
    }

    function concatBytes(bytes memory x, bytes memory y) public pure returns (bytes memory) {
        return abi.encodePacked(x,y);
    }

    function concatBytes32(bytes32 x, bytes32 y) public pure returns (bytes memory) {
        return abi.encodePacked(x,y);
    }


    function concatBytes32Hash(bytes32 x, bytes32 y) public pure returns (bytes32) {
        return sha256(abi.encodePacked(x, y));
    }
}
