import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createNewGuardFinding = (
  oldPauseGuardian: string,
  newPauseGuardian: string
) => {
  return Finding.fromObject({
    name: `A new Compound pause guardian has been assigned`,
    description: `The pause guardian was changed from ${oldPauseGuardian} to ${newPauseGuardian} `,
    alertId: "COMP-PAUSEI",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      oldPauseGuardian: oldPauseGuardian,
      newPauseGuardian: newPauseGuardian,
    },
  });
};
export const createPausedFindingMarket = (
  cToken: string,
  action: string,
  pauseState: string
) => {
  return Finding.fromObject({
    name: "The Compound protocol has issued a pause",
    description: `The ${action} function has been paused for the following token: ${cToken}`,
    alertId: "COMP-PAUSEII",
    severity: FindingSeverity.Critical,
    type: FindingType.Suspicious,
    protocol: "Compound",
    metadata: {
      cToken: cToken,
      action: action,
      pauseState: pauseState,
    },
  });
};
export const createPausedFindingGlobal = (
  action: string,
  pauseState: string
) => {
  return Finding.fromObject({
    name: "The Compound protocol has issued a pause",
    description: `The ${action} function has been paused`,
    alertId: "COMP-PAUSEIII",
    severity: FindingSeverity.Critical,
    type: FindingType.Suspicious,
    protocol: "Compound",
    metadata: {
      action: action,
      pauseState: pauseState,
    },
  });
};
