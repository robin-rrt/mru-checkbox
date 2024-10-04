import {
  REQUIRE,
  Transitions,
  State,
  SolidityType,
} from "@stackr/sdk/machine";

import { solidityPackedKeccak256 } from "ethers/hash";

import { CheckboxState } from "./state";



const areAllBitsSet = (state: any) => {
  return state.checkBoxGrid.every((byte: any) => byte == 255); //returns true or fals
}

// 
/**
 * STF to add a new flag.
 */
const toggleBit = CheckboxState.STF({
  schema: {
    index: SolidityType.UINT,
  },
  handler: ({ state, inputs, msgSender }) => {
    // Ensure Game is active
    REQUIRE(state.isGameStart === true, "GAME_NOT_STARTED");
    const actor = msgSender.toString();
    // Ensure only admins can add flags
    REQUIRE(state.admins.includes(actor), "ACCESS_DENIED");
    const { index } = inputs;
    const byteIndex = index >> 3; // Equivalent to Math.floor(index / 8)
    const bitIndex = index & 7;    // Equivalent to index % 8

     // Toggle the bit at the specified index
     (state.checkBoxGrid[byteIndex] as any) ^= (1 << bitIndex);
     areAllBitsSet(state)? state.isGameStart == false : console.log("Game continues: " + state.checkBoxGrid)

    return state;
  },
})

/**
 * STF to submit a flag.
 */
const startGame = CheckboxState.STF({
  schema: {
    numBits: SolidityType.UINT
  },
  handler: ({ state, inputs, msgSender }) => {
    const actor = msgSender.toString();
    // Ensure only admins can add flags
    REQUIRE(state.admins.includes(actor), "ACCESS_DENIED");
    // Ensure Game is active
    REQUIRE(state.isGameStart === false, "GAME_ALREADY_RUNNING");
    state.isGameStart = true;
    const { numBits } = inputs;
    state.numBits = numBits;


    const bitArray = new Uint8Array(Math.ceil(numBits / 8));
    state.checkBoxGrid =  [bitArray];
    console.log(state.checkBoxGrid);
    return state;
  },
});



export const transitions: Transitions<CheckboxState> = {
  startGame,
  toggleBit,
};