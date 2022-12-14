import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createNewCollateralBuyFinding = (
  assetType: any,
  assetPrice: string,
  basePrice: string,
  buyerAddr: string
) => {
  return Finding.fromObject({
    name: `A new liquidation has occured`,
    description: `${assetPrice} ${assetType} of collateral has been purchased from the Compound protocol for ${basePrice} USD `,
    alertId: "COMP-LIQI",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Compound",
    metadata: {
      assetType: assetType,
      assetPrice: `${assetPrice} ${assetType}`,
      basePrice: `${basePrice} USD`,
      buyerAddr: buyerAddr,
    },
  });
};
