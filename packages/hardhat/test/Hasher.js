const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hasher", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Hasher = await ethers.getContractFactory("Hasher");
    const hasher = await Hasher.deploy();

    return { hasher, owner, otherAccount };
  }

  const addresses = [
    "0x9cA70B93CaE5576645F5F069524A9B9c3aef5006",
    "0xb5aE5169F4D750e802884d81b4f9eC66c525396F",
  ];
  const b32 = addresses.map((a) => ethers.utils.sha256(a));

  describe("#hash", function () {
    it("equals ethers sha256", async function () {
      // const zero = ethers.utils.hexlify([]);
      const zero = ethers.utils.arrayify(ethers.constants.HashZero);
      // console.log(zero);
      const { hasher } = await loadFixture(deployOneYearLockFixture);
      // console.log(ethers.utils.arrayify(ethers.constants.HashZero));
      const solidityHash = await hasher.hash(zero);
      const ethersHash = await ethers.utils.sha256(zero);
      console.log(ethersHash);
      console.log(ethers.utils.arrayify(ethersHash));
      // Uint8Array(32) [
      //   102, 104, 122, 173, 248,  98, 189, 119,
      //   108, 143, 193, 139, 142, 159, 142,  32,
      //     8, 151,  20, 133, 110, 226,  51, 179,
      //   144,  42,  89,  29,  13,  95,  41,  37
      // ]
      expect(solidityHash).to.equal(ethersHash);
    });

    it("equals ethers sha256", async function () {
      const address = "0x9cA70B93CaE5576645F5F069524A9B9c3aef5006";
      const { hasher } = await loadFixture(deployOneYearLockFixture);

      const solidityHash = await hasher.hash(address);
      const ethersHash = await ethers.utils.sha256(address);

      expect(solidityHash).to.equal(ethersHash);
    });
  });

  describe("#concatBytes", function () {
    it("produces same hash as ethers", async () => {
      const { hasher } = await loadFixture(deployOneYearLockFixture);

      const solidityHash = await hasher.concatBytes(...addresses);
      const ethersHash = await ethers.utils.solidityPack(
        ["bytes", "bytes"],
        addresses
      );

      expect(solidityHash).to.equal(ethersHash);
    });
  });

  describe("#concatBytes32", function () {
    it("produces same hash as ethers", async () => {
      const { hasher } = await loadFixture(deployOneYearLockFixture);

      const solidityHash = await hasher.concatBytes(...b32);
      const ethersHash = await ethers.utils.solidityPack(
        ["bytes32", "bytes32"],
        b32
      );

      expect(solidityHash).to.equal(ethersHash);
    });
  });

  describe("#concatBytes32Hash", () => {
    it("produces same hash as ethers", async () => {
      const { hasher } = await loadFixture(deployOneYearLockFixture);

      const solidityHash = await hasher.concatBytes32Hash(...b32);
      const ethersHash = ethers.utils.sha256(
        await ethers.utils.solidityPack(["bytes32", "bytes32"], b32)
      );

      expect(solidityHash).to.equal(ethersHash);
    });
  });
});
