import { MicroRollup } from "@stackr/sdk";

import { stackrConfig } from "../../stackr.config";
import { checkboxStateMachine } from "./machine";

type checkboxMachine = typeof checkboxStateMachine;

const mru = await MicroRollup({
  config: stackrConfig,
  stateMachines: [checkboxStateMachine]
});

await mru.init();

export { checkboxMachine, mru };