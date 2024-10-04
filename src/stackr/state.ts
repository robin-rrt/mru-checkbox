
import { State } from "@stackr/sdk/machine";

import { CheckboxGridState } from "./types";
import { constructTree } from "./tree";

export class CheckboxState extends State<CheckboxGridState> {
  constructor(state: CheckboxGridState) {
    super(state);
  }

  getRootHash(): string {
    const tree = constructTree(this.state);
    return tree.getHexRoot();
  }
}
