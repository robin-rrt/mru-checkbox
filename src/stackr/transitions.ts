import { REQUIRE, SolidityType, State, Transitions } from "@stackr/sdk/machine";

import { CheckboxState } from "./state";
import { BytesLike } from "ethers";
import { STATE_MACHINES } from "./machine";

const areAllBitsSet = (state: any) => {
  return state.checkBoxGrid.every((byte: number) => byte == 255); //returns true or fals
};

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
    const byteIndex = Math.floor(index / 8); // Equivalent to Math.floor(index / 8) or index >> 3
    const bitIndex = index % 8; // Equivalent to index % 8 or index & 7

    console.log(byteIndex + " " + bitIndex);

    // Toggle the bit at the specified index
    console.log("State Before: \n" + JSON.stringify(state.checkBoxGrid[byteIndex]));
    // let stateAtBit = state.checkBoxGrid[byteIndex];
    state.checkBoxGrid[byteIndex] ^= 1 << bitIndex;
    // console.log(JSON.stringify(stateAtBit));
    console.log("State After: \n" + JSON.stringify(state.checkBoxGrid[byteIndex]));
    // areAllBitsSet(state)
    //   ? state.isGameStart == false
    //   : console.log("Game continues: " + state.checkBoxGrid);

    return state;
  },
});

/**
 * STF to submit a flag.
 */
const startGame = CheckboxState.STF({
  schema: {
    numBits: SolidityType.STRING,
  },
  handler: ({ state, inputs, msgSender }) => {
    const actor = msgSender.toString();
    // Ensure only admins can start game.
    REQUIRE(state.admins.includes(actor), "ACCESS_DENIED");
    // Ensure Game is active
    REQUIRE(state.isGameStart === false, "GAME_ALREADY_RUNNING");
    state.isGameStart = true;
    //get number of bits (checkboxes) from input and create a Uint8Array representing it.
    const { numBits } = inputs;
    state.numBits = numBits as unknown as number;
    state.checkBoxGrid = new Uint8Array(Math.ceil((state.numBits / 8));
    console.log(state.checkBoxGrid);
    return state;
  },
});

export const transitions: Transitions<CheckboxState> = {
  startGame,
  toggleBit,
};
