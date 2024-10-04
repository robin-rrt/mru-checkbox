/**
 * A struct representing the global state of the micro-rollup.
 */



export type CheckboxGridState = {
    admins: string[]; // list of admin addresses (that can send STFs)
    checkBoxGrid:  Uint8Array[];// mapping b/w flag hash and points
    isGameStart: boolean;
    numBits: number
  };
  
  /**
   * A struct representing the input type of `setBit` STF.
   */
  export type checkedUserState = {
    address: string;
    checkedBoxes: number[];
  };
  
