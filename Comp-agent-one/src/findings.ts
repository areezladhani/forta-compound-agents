import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createPropCreatedFinding = (proposalId: string) => {
  return Finding.fromObject({
    name: `A new Compound proposal has been created: Id ${proposalId}`,
    description: `This proposal will have a two-day voting period; to learn more about it, go to https://compound.finance/governance/proposals/${proposalId}.`,
    alertId: "COMP-PROPI",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      proposalId: proposalId,
    },
  });
};
export const createPropQueuedFinding = (proposalId: string) => {
  return Finding.fromObject({
    name: "A new Compound proposal has been queued: Id ${proposalId}",
    description: `This proposal will be executed in two days; to learn more about it, go to https://compound.finance/governance/proposals/${proposalId}`,
    alertId: "COMP-PROPII",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      proposalId: proposalId,
    },
  });
};
