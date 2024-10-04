import { StateMachine } from "@stackr/sdk/machine";

import genesisState from "../../genesis-state.json";
import { transitions } from "./transitions";
import { CheckboxState } from "./state";

const STATE_MACHINES = {
  EPHEMERAL_CHECKBOX: "ephemeral-checkbox",
};

const checkboxStateMachine = new StateMachine({
  id: STATE_MACHINES.EPHEMERAL_CHECKBOX,
  stateClass: CheckboxState,
  initialState: genesisState.state,
  on: transitions,
});

export { STATE_MACHINES, checkboxStateMachine };