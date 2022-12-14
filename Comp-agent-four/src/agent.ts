import { providers } from "ethers";
import {
  Finding,
  HandleTransaction,
  TransactionEvent,
  getEthersProvider,
} from "forta-agent";
import {
  COMP_CONTRACT,
  SUPPLY_BASE_EVENT,
  SUPPLY_COLLATERAL_EVENT,
  WITHDRAW_BASE_EVENT,
  WITHDRAW_COLLATERAL_EVENT,
} from "./constants";
import { baseAsset, collateralAsset } from "./helper";

export function provideHandleTransaction(
  provider: providers.Provider
): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    //There are two supply events we will track
    // supply base
    // supply collateral
    //There are two withdraw events we will track
    // withdraw base
    // withdraw collateral

    const compEvents = txEvent.filterLog(
      [
        SUPPLY_BASE_EVENT,
        SUPPLY_COLLATERAL_EVENT,
        WITHDRAW_COLLATERAL_EVENT,
        WITHDRAW_BASE_EVENT,
      ],
      COMP_CONTRACT
    );

    for (const event of compEvents) {
      if (event.name == "Supply") {
        const { from, dst, amount } = event.args;
        baseAsset(amount, event.name, from, dst, findings);
      }
      if (event.name == "SupplyCollateral") {
        const { from, dst, asset, amount } = event.args;
        await collateralAsset(
          provider,
          txEvent.blockNumber,
          event.name,
          asset,
          amount,
          from,
          dst,
          findings
        );
      }
      //These are the two borrow cases
      if (event.name == "Withdraw") {
        const { src, to, amount } = event.args;
        baseAsset(amount, event.name, src, to, findings);
      }
      if (event.name == "WithdrawCollateral") {
        const { src, to, asset, amount } = event.args;
        await collateralAsset(
          provider,
          txEvent.blockNumber,
          event.name,
          asset,
          amount,
          src,
          to,
          findings
        );
      }
    }
    return findings;
  };
}

export default {
  handleTransaction: provideHandleTransaction(getEthersProvider()),
};
