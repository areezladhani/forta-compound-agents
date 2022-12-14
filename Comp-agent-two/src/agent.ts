import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import {
  ACTION_PAUSED_GLOBAL,
  ACTION_PAUSED_MARKET,
  COMPTROLLER_CONTRACT,
  NEW_PAUSE_GUARDIAN,
} from "./constants";
import {
  createNewGuardFinding,
  createPausedFindingGlobal,
  createPausedFindingMarket,
} from "./findings";

export function provideHandleTransaction(): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    const pauseEvent = txEvent.filterLog(
      [ACTION_PAUSED_MARKET, NEW_PAUSE_GUARDIAN, ACTION_PAUSED_GLOBAL],
      COMPTROLLER_CONTRACT
    );
    pauseEvent.forEach((event) => {
      console.log(event);

      if (event.name == "NewPauseGuardian") {
        findings.push(
          createNewGuardFinding(
            event.args.oldPauseGuardian,
            event.args.newPauseGuardian
          )
        );
        return findings;
      }

      event.args.length == 3
        ? findings.push(
            createPausedFindingMarket(
              event.args.cToken,
              event.args.action,
              String(event.args.pauseState)
            )
          )
        : findings.push(
            createPausedFindingGlobal(
              event.args.action,
              String(event.args.pauseState)
            )
          );
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(),
};
