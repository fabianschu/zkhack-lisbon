const { ethers } = require("ethers");
const { sha256, solidityPack } = require("ethers/lib/utils");

class Tree {
  depth = 5;

  constructor(addresses) {
    this.addresses = addresses;
    this.leafs = [
      ...addresses.map((a) => ethers.utils.sha256(a)),
      ...new Array(2 ** this.depth - addresses.length).fill(
        sha256(ethers.utils.hexlify([]))
      ),
    ];
    this.layers = this.getLayers();
    this.root = this.layers[this.layers.length - 1][0];
  }

  getLayers() {
    const layers = [this.leafs];
    for (let i = 0; i < this.depth; i++) {
      const currentLevel = layers[i];
      const nextLevel = [];
      for (let j = 0; j < currentLevel.length; j += 2) {
        const left = currentLevel[j];
        const right = currentLevel[j + 1];
        const hash = this.getConcatHash(left, right);
        nextLevel.push(hash);
      }
      layers.push(nextLevel);
    }
    return layers;
  }

  getProof(address) {
    const merkleProof = [];
    let currentIndex = this.addresses.findIndex((el) => el === address);

    for (const layer of this.layers) {
      if (layer.length === 1) break;
      const nodeSide = this.getNodeSide(currentIndex);
      const siblingSide = Math.abs(nodeSide - 1);
      merkleProof.push({
        value:
          nodeSide === 1 ? layer[currentIndex - 1] : layer[currentIndex + 1],
        position: siblingSide,
      });
      currentIndex = Math.floor(currentIndex / 2);
    }

    return merkleProof;
  }

  getNodeSide(nodeIdx) {
    // 0 => left
    // 1 => right
    return (nodeIdx + 10) % 2 === 0 ? 0 : 1;
  }

  getConcatHash(left, right) {
    return sha256(
      ethers.utils.solidityPack(["bytes32", "bytes32"], [left, right])
    );
  }

  getHash(left, right) {
    return ethers.utils.solidityPack(["bytes32", "bytes32"], [left, right]);
  }
}

module.exports = { Tree };
