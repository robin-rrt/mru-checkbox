import { ActionConfirmationStatus } from "@stackr/sdk";
import { Wallet } from "ethers";

import { mru } from "./stackr/mru.ts";
import { signMessage } from "./utils.ts";

const main = async () => {
  const inputs = {
    timestamp: Date.now(),
  };

  // Create a random wallet
  const wallet = Wallet.createRandom();
  const name1 = "startGame";
  const name2 = "toggleBit";
  const domain = mru.config.domain;

  //startGame
  const types = mru.getStfSchemaMap()[name1];
  const signature = await signMessage(wallet, domain, types, { name: name1, inputs });
  const ActionParams = {
    name: name1,
    inputs,
    signature,
    msgSender: wallet.address,
  };
  const ack = await mru.submitAction(ActionParams);
  console.log(ack.hash);

  // leverage the ack to wait for C1 and access logs & error from STF execution
  const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1);
  console.log({ logs, errors });


  //toggleBit
  const types2 = mru.getStfSchemaMap()[name2];
  const signature2 = await signMessage(wallet, domain, types, { name: name2, inputs });
  const ActionParams2 = {
    name: name2,
    inputs,
    signature: signature2,
    msgSender: wallet.address,
  };
  const ack2 = await mru.submitAction(ActionParams2);
  console.log(ack2.hash);

  // leverage the ack to wait for C1 and access logs & error from STF execution
  const { logs: logs2, errors: errors2 } = await ack2.waitFor(ActionConfirmationStatus.C1);
  console.log({ logs2, errors2 });

};

main();
