// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Sha256Tree {
    uint256 constant depth = 3;

    bytes32 constant level0 = 0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; // sha256("")
    bytes32 constant level1 = 0x2dba5dbc339e7316aea2683faf839c1b7b1ee2313db792112588118df066aa35; // two empty leaf siblings produce this hash
    bytes32 constant level2 = 0x5310a330e8f970388503c73349d80b45cd764db615f1bced2801dcd4524a2ff4;
    bytes32 constant level3 = 0x80d1bf4dd6c1f75bba022337a3f0842078f5c2e7f3f59dfd33ccbb8e963367b2;
    bytes32 constant level4 = 0x1492e66e89e186840231850712161255d203b5bbf48d21242f0b51519b5eb3d4;

    enum Position {
        left,
        right
    }

    struct HashNode {
        bytes32 value;
        Position position; 
    }
    
    constructor() {}

    function validateSorting(bytes32[] memory rawValues) internal view {
        uint256 length = rawValues.length;
        for(uint i = 0; i < length; ++i) {
            if (i + 1 <= length - 1) {
                require(rawValues[i] < rawValues[i + 1], "Not sorted");
            }
        }
    }

    function hashRawValuesAndReputation(bytes32[] memory rawValues,  bytes32[] memory reputations) internal view returns (bytes32[] memory){
        require(rawValues.length == reputations.length, "Array lengths not match");

        uint256 length = rawValues.length;

        bytes32[] memory hashes = new bytes32[](length);
        for(uint i = 0; i < length; ++i) {
            string memory concatenated = string(abi.encodePacked(rawValues[i], reputations[i]));
            hashes[i] = sha256(abi.encodePacked(concatenated));
        }
        return hashes;
    }

    function computeRoot(bytes32[] memory hashes) public view returns (bytes32) {
        return _computeRoot(hashes, 0);
    }

    function computeSortedRawValues(bytes32[] memory rawValues, bytes32[] memory reputations) public view returns (bytes32) {
        validateSorting(rawValues);

        bytes32[] memory hashes = hashRawValuesAndReputation(rawValues, reputations);

        return _computeRoot(hashes, 0);
    }

    function _computeRoot(bytes32[] memory hashes, uint256 level) internal view returns (bytes32) {
        if (level == depth) return hashes[0];
        
        uint256 length = hashes.length;
        uint256 newLength = length % 2 == 0 ? length / 2 : (length + 1) / 2;
        bytes32[] memory nextLevel = new bytes32[](newLength);
        
        bytes32 left = 0;
        bytes32 right = 0;
        uint256 currentIdx = 0;
        for (uint16 i = 0; i < length; i += 2){
            left = hashes[i];
            if (i == length - 1 && length % 2 != 0) { 
                // we're at last node in a layer and left node has
                // no right sibling, so we insert a cached value
                right = _getConstant(level);
            } else {
                right = hashes[i + 1];
            }
            nextLevel[currentIdx] = sha256(abi.encodePacked(left, right));
            currentIdx++;
        }

        return _computeRoot(nextLevel, level + 1);
    }

    function _getConstant(uint256 level) internal pure returns (bytes32) {
        if(level == 0) return level0; // empty leaf
        else if(level == 1) return level1;
        else if(level == 2) return level2;
        else if(level == 3) return level3;
        else return level4;
    }

    function verifyProof(bytes32 node, HashNode[] memory proof) external pure returns (bytes32 tmpNode) {
        tmpNode = node;
        for (uint256 i = 0; i < proof.length; i++) {
            HashNode memory sibling = proof[i];
            bytes32 left;
            bytes32 right;
            if(sibling.position == Position.left) {
                right = tmpNode;
                left = sibling.value;
            } else {
                right = sibling.value;
                left = tmpNode;
            }
            tmpNode = sha256(abi.encodePacked(left, right));
        }
        return tmpNode;
    }
}
