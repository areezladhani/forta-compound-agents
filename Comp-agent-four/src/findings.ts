import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createCollateralFinding = (
  assetType: any,
  event: string,
  collPrice: string,
  from: string,
  to: string
) => {
  return Finding.fromObject({
    name: `${event} was called on the compound protocol in excess of $100,000`,
    description: `${event} was called on the compound protocol with ${collPrice} ${assetType}`,
    alertId: "COMP-I",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      assetType: assetType,
      event: event,
      collPrice: collPrice,
      from: from,
      to: to,
    },
  });
};
export const createAssetFinding = (
  event: string,
  collPrice: string,
  from: string,
  to: string
) => {
  return Finding.fromObject({
    name: `${event} was called on the compound protocol in excess of $100,000`,
    description: `${event} was called on the compound protocol with ${collPrice} USD`,
    alertId: "COMP-II",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      event: event,
      collPrice: collPrice,
      from: from,
      to: to,
    },
  });
};
