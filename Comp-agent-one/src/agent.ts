import { BigNumber } from "ethers";
import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import {
  PROPOSAL_QUEUED,
  PROPOSAL_CREATED,
  GOVERNANCE_CONTRACT,
} from "./constants";
import { createPropCreatedFinding, createPropQueuedFinding } from "./findings";

export function provideHandleTransaction(): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    const privEvent = txEvent.filterLog(
      [PROPOSAL_QUEUED, PROPOSAL_CREATED],
      GOVERNANCE_CONTRACT
    );
    privEvent.forEach((event) => {
      console.log(event);

      const proposalId: BigNumber = event.args["id"];
      const propIdString = proposalId.toString();
      console.log(`The proposal Id is ${proposalId}`);
      console.log(event.name);

      event.name == "ProposalQueued"
        ? findings.push(createPropQueuedFinding(propIdString))
        : findings.push(createPropCreatedFinding(propIdString));
    });

    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(),
};
