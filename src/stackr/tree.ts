import { solidityPackedKeccak256 } from "ethers/hash";
import { MerkleTree } from "merkletreejs";

import { CheckboxGridState } from "./types";

export const constructTree = (state: CheckboxGridState): MerkleTree => {
  const adminHashes = state.admins.map((address) =>
    solidityPackedKeccak256(["string"], [address])
  );
  const checkBoxGridHashes = solidityPackedKeccak256(["uint8"], [state.checkBoxGrid]);
  const isGameStartHashes = solidityPackedKeccak256(["bool"], [state.isGameStart]);
  const numBitsHashes = solidityPackedKeccak256(["uint"], [state.numBits]);

  const adminsRoot = new MerkleTree(adminHashes).getHexRoot();
  // const checkBoxGridRoot = new MerkleTree(checkBoxGridHashes).getHexRoot();



  return new MerkleTree([
    adminsRoot,
    checkBoxGridHashes,
    isGameStartHashes,
    numBitsHashes
  ]);
};

export const getProof = (
  state: CheckboxGridState,
  data: { admins: string[], CheckboxGrid: Uint8Array[], isGameStart: boolean, numBits: number}
): string[] => {
  // Construct the Merkle Tree from the state
  const tree = constructTree(state);

  // Create the hash (leaf in merkle tree)
  const leaf = solidityPackedKeccak256(
    ["string[]", "Uint8Array[]", "bool", "number"],
    [data.admins, data.CheckboxGrid, data.isGameStart, data.numBits]
  );

  // Get the proof for the leaf
  const proof = tree.getHexProof(leaf);
  return proof;
};

export const verifyInclusion = (
  state: CheckboxGridState,
  data: { admins: string[], CheckboxGrid: Uint8Array[], isGameStart: boolean, numBits: number}
): boolean => {
  // Construct the Merkle Tree from the state
  const tree = constructTree(state);

  // Create the hash (leaf in merkle tree) for the specific address and score combination
  const leaf = solidityPackedKeccak256(
    ["string[]", "Uint8Array[]", "bool", "number"],
    [data.admins, data.CheckboxGrid, data.isGameStart, data.numBits]
  );

  // Get the proof for the leaf
  const proof = tree.getProof(leaf);

  // Verify the proof
  return tree.verify(proof, leaf, tree.getRoot());
};