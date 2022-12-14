import { providers, BigNumber } from "ethers";
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  getEthersProvider,
} from "forta-agent";
import { BUY_COLLATERAL_EVENT, COMP_CONTRACT } from "./constants";
import { createNewCollateralBuyFinding } from "./findings";
import {
  getCollateralType,
  getFinalAssetPrice,
  getFinbaseAmount,
} from "./helper";

export function provideHandleTransaction(
  provider: providers.Provider
): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    const liqEvents = txEvent.filterLog([BUY_COLLATERAL_EVENT], COMP_CONTRACT);
    for (const event of liqEvents) {
      const { buyer, asset, baseAmount, collateralAmount } = event.args;
      console.log(`The asset amount is ${baseAmount}`);
      const baseAmBigNum: BigNumber = baseAmount;
      console.log(baseAmBigNum);
      if (baseAmBigNum.gte(BigNumber.from("10000"))) {
        const blockNumber = txEvent.blockNumber;
        //asset type
        const assetType = getCollateralType(asset);
        //asset price
        const finAssetPrice = await getFinalAssetPrice(
          provider,
          asset,
          collateralAmount,
          blockNumber
        );
        //base price in USD
        const finBasePrice = getFinbaseAmount(baseAmount);

        findings.push(
          createNewCollateralBuyFinding(
            assetType,
            finAssetPrice,
            finBasePrice,
            buyer
          )
        );
      }
    }
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(getEthersProvider()),
};
