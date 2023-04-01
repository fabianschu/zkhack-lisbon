const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { generateTree, Tree } = require("./utils/tree.js");
const { sha256 } = require("ethers/lib/utils.js");

const {
  utils: { formatBytes32String },
} = ethers;

const values = [
  "0xECE8E251DBA5FEB04FBA59219B2FC23A97D0961C77FDBF41EC7CFF56114AB41E",
  "0x89D61B9326BE82B709A8148719683429F55D5D19E1F85A6AED1A79B62BB718E4",
  "0x0D6DA3212D21396B89A11C2C1135702259FBC346559218EAC61586A5D1B931C6",
  "0x749F764C8D2972D4DC3BE7572576DA28A1C319FFD1C5981C31494DD689679A59",
  "0xC4EA58544A91E6A0B6E4E0DE2900492AC9B48555DA95963F5637BD73A8F30DC3",
  "0xB21DB6051F5FDD290745849402E1604C025D2674E846B0E80DF5BEFDBDA9205B",
  "0xE8815DD62EBE2ADD2C6945F95B5E5B312F35BB98D82F0E3B914E1286B21244B6",
  "0xA5D0354462C8004C19DE17273AC17ED43D818C282494C97DBD215A378B5542F4",
];

const repuations = ["2", "5", "1", "6", "8", "10", "3", "7"];

// We define a fixture to reuse the same setup in every test.
// We use loadFixture to run this setup once, snapshot that state,
// and reset Hardhat Network to that snapshot in every test.
async function deployOneYearLockFixture() {
  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount] = await ethers.getSigners();
  const Sha256Tree = await ethers.getContractFactory("Sha256Tree");
  const sha256Tree = await Sha256Tree.deploy();
  return { sha256Tree, owner, otherAccount };
}

const TREE_DEPTH = 3;

function sortLeafValues(values) {
  return values.sort();
}

describe.only("Sha256Tree: Unsorted", function () {
  describe("#computeRoot", function () {
    context("with depth == 1", () => {
      context("with one leaf", () => {
        const leafValues = values.slice(0, 1);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          const input = leafValues.map((a) => ethers.utils.sha256(a));

          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });

      context("with two leafs", () => {
        const leafValues = values.slice(0, 2);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          const input = leafValues.map((a) => ethers.utils.sha256(a));

          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });
    });

    context("with depth == 2", () => {
      context("with three leafs", () => {
        const leafValues = values.slice(0, 3);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const input = leafValues.map((a) => ethers.utils.sha256(a));
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });

      context("with four leafs", () => {
        const leafValues = values.slice(0, 4);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const input = leafValues.map((a) => ethers.utils.sha256(a));
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });
    });

    context("with depth == 3", () => {
      context("with five leafs", () => {
        const leafValues = values.slice(0, 5);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const input = leafValues.map((a) => ethers.utils.sha256(a));
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });

      context("with six leafs", () => {
        const leafValues = values.slice(0, 6);

        it("computes the root", async function () {
          const tree = new Tree(leafValues, TREE_DEPTH);
          const input = leafValues.map((a) => ethers.utils.sha256(a));
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          expect(await sha256Tree.computeRoot(input)).to.equal(tree.root);
        });
      });
    });
  });

  describe("#validateProof", () => {
    context("with two leafs", () => {
      const leafValues = values.slice(0, 2);

      it("validates the proof", async () => {
        const tree = new Tree(leafValues, TREE_DEPTH);
        const merkleProof = tree.getProof(leafValues[1]);
        const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
        const root = await sha256Tree.verifyProof(tree.leafs[1], merkleProof);
        expect(root).to.equal(tree.root);
      });
    });

    context("with three leafs", () => {
      const leafValues = values.slice(0, 3);

      it("validates the proof", async () => {
        const tree = new Tree(leafValues, TREE_DEPTH);
        const merkleProof = tree.getProof(leafValues[2]);
        const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
        const root = await sha256Tree.verifyProof(tree.leafs[2], merkleProof);
        expect(root).to.equal(tree.root);
      });
    });
  });
});
describe("Sha256Tree: Sorted", function () {
  describe("#computeRoot", function () {
    context("with depth == 1", () => {
      context("with one leaf", () => {
        const rawValues = values.slice(0, 1);
        const repuationValues = repuations.slice(0, 1);

        it("computes the root", async function () {
          // const tree = new Tree(rawValues, TREE_DEPTH, repuationValues);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await sha256Tree.computeSortedRawValues(
            rawValues,
            repuationValues.map((a) => formatBytes32String(a))
          );
          //   expect(
          //     await sha256Tree.computeSortedRawValues(rawValues, repuationValues)
          //   ).to.equal(tree.root);
        });
      });

      context("with two leafs", () => {
        const rawValues = values.slice(0, 2);
        const repuationValues = repuations.slice(0, 2);

        it("should fail because not sorted", async () => {
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await expect(
            sha256Tree.computeSortedRawValues(
              rawValues,
              repuationValues.map((a) => formatBytes32String(a))
            )
          ).to.be.revertedWith("Not sorted");
        });
        it("computes the root", async function () {
          const sortedLeafValues = sortLeafValues(rawValues);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
          const tree = new Tree(sortedLeafValues, TREE_DEPTH);

          expect(
            await sha256Tree.computeSortedRawValues(
              sortedLeafValues,
              repuationValues.map((a) => formatBytes32String(a))
            )
          ).to.equal(tree.root);
        });
      });
    });

    context("with depth == 2", () => {
      context("with three leafs", () => {
        const rawValues = values.slice(0, 3);

        it("should fail because not sorted", async () => {
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await expect(
            sha256Tree.computeSortedRawValues(rawValues)
          ).to.be.revertedWith("Not sorted");
        });
        it("computes the root", async function () {
          const sortedLeafValues = sortLeafValues(rawValues);
          const tree = new Tree(rawValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          expect(
            await sha256Tree.computeSortedRawValues(sortedLeafValues)
          ).to.equal(tree.root);
        });
      });

      context("with four leafs", () => {
        const rawValues = values.slice(0, 4);

        it("should fail because not sorted", async () => {
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await expect(
            sha256Tree.computeSortedRawValues(rawValues)
          ).to.be.revertedWith("Not sorted");
        });

        it("computes the root", async function () {
          const sortedLeafValues = sortLeafValues(rawValues);
          const tree = new Tree(sortedLeafValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          expect(
            await sha256Tree.computeSortedRawValues(sortedLeafValues)
          ).to.equal(tree.root);
        });
      });
    });

    context("with depth == 3", () => {
      context("with five leafs", () => {
        const rawValues = values.slice(0, 5);

        it("should fail because not sorted", async () => {
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await expect(
            sha256Tree.computeSortedRawValues(rawValues)
          ).to.be.revertedWith("Not sorted");
        });

        it("computes the root", async function () {
          const sortedLeafValues = sortLeafValues(rawValues);
          const tree = new Tree(sortedLeafValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          expect(
            await sha256Tree.computeSortedRawValues(sortedLeafValues)
          ).to.equal(tree.root);
        });
      });

      context("with six leafs", () => {
        const rawValues = values.slice(0, 6);

        it("should fail because not sorted", async () => {
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          await expect(
            sha256Tree.computeSortedRawValues(rawValues)
          ).to.be.revertedWith("Not sorted");
        });

        it("computes the root", async function () {
          const sortedLeafValues = sortLeafValues(rawValues);

          const tree = new Tree(sortedLeafValues, TREE_DEPTH);
          const { sha256Tree } = await loadFixture(deployOneYearLockFixture);

          expect(
            await sha256Tree.computeSortedRawValues(sortedLeafValues)
          ).to.equal(tree.root);
        });
      });
    });
  });

  describe("#validateProof", () => {
    context("with two leafs", () => {
      const leafValues = sortLeafValues(values.slice(0, 2));

      it("validates the proof", async () => {
        const tree = new Tree(leafValues, TREE_DEPTH);
        const merkleProof = tree.getProof(leafValues[1]);
        const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
        const root = await sha256Tree.verifyProof(tree.leafs[1], merkleProof);
        expect(root).to.equal(tree.root);
      });
    });

    context("with three leafs", () => {
      const leafValues = sortLeafValues(values.slice(0, 3));

      it("validates the proof", async () => {
        const tree = new Tree(leafValues, TREE_DEPTH);
        const merkleProof = tree.getProof(leafValues[2]);
        const { sha256Tree } = await loadFixture(deployOneYearLockFixture);
        const root = await sha256Tree.verifyProof(tree.leafs[2], merkleProof);
        expect(root).to.equal(tree.root);
      });
    });
  });
});
