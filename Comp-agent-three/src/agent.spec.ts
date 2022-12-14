import {
  MockEthersProvider,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import { ethers, HandleTransaction } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import { Interface } from "ethers/lib/utils";
import {
  AbsorbCollParams,
  ABSORB_COLLATERAL_EVENT,
  assetInfoBTC,
  assetInfoETH,
  buyCollParamsBTC,
  buyCollParamsBTCFormatted,
  buyCollParamsETH,
  buyCollParamsETHFormatted,
  buyCollParamsFailETH,
  BUY_COLLATERAL_EVENT,
  COMP_CONTRACT,
  WBTC,
  WETH,
} from "./constants";
import { createAddress } from "forta-agent-tools";
import { createNewCollateralBuyFinding } from "./findings";
import "./cometAbi";
import { COMET_ABI } from "./cometAbi";

const interface_info = new ethers.utils.Interface(COMET_ABI);

const randAddr: string = createAddress("0x11");

// helper function that simulates a function call from a certain contract
// E.G for token0 function in pool contract we return the token address when called with correct params
const MakeMockCall = (
  mockProvider: MockEthersProvider,
  id: string,
  inp: any[],
  outp: any[],
  addr: string,
  intface: Interface,
  block: number = 10
) => {
  mockProvider.addCallTo(addr, block, intface, id, {
    inputs: inp,
    outputs: outp,
  });
};

describe("Liquidation buys Compound protocol", () => {
  let handleTransaction: HandleTransaction;
  let mockProvider: MockEthersProvider;
  let provider: ethers.providers.Provider;

  beforeEach(() => {
    mockProvider = new MockEthersProvider();
    provider = mockProvider as unknown as ethers.providers.Provider;
    handleTransaction = provideHandleTransaction(provider);
  });

  it("returns an empty finding if there are no valid events", async () => {
    const txEvent = new TestTransactionEvent();
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a valid event but from the incorrect address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      BUY_COLLATERAL_EVENT,
      randAddr,
      [
        buyCollParamsETH.buyer,
        buyCollParamsETH.asset,
        buyCollParamsETH.baseAmount,
        buyCollParamsETH.collateralAmount,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a invalid event from the correct address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      ABSORB_COLLATERAL_EVENT,
      randAddr,
      [
        AbsorbCollParams.absorber,
        AbsorbCollParams.borrower,
        AbsorbCollParams.asset,
        AbsorbCollParams.collateralAbsorbed,
        AbsorbCollParams.usdValue,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns no finding if there is a valid event from the correct address but base amount is under 10,000", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );

    const txEvent = new TestTransactionEvent()
      .addEventLog(BUY_COLLATERAL_EVENT, COMP_CONTRACT, [
        buyCollParamsFailETH.buyer,
        buyCollParamsFailETH.asset,
        buyCollParamsFailETH.baseAmount,
        buyCollParamsFailETH.collateralAmount,
      ])
      .setBlock(10);
    const findings = await handleTransaction(txEvent);

    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if there is a valid event from the correct address", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );

    const txEvent = new TestTransactionEvent()
      .addEventLog(BUY_COLLATERAL_EVENT, COMP_CONTRACT, [
        buyCollParamsETH.buyer,
        buyCollParamsETH.asset,
        buyCollParamsETH.baseAmount,
        buyCollParamsETH.collateralAmount,
      ])
      .setBlock(10);
    const findings = await handleTransaction(txEvent);

    const expectFind = createNewCollateralBuyFinding(
      buyCollParamsETHFormatted.asset,
      buyCollParamsETHFormatted.collateralAmount,
      buyCollParamsETHFormatted.baseAmount,
      buyCollParamsETHFormatted.buyer
    );

    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual([expectFind]);
  });

  it("returns multiple findings if there is a valid event from the correct address", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WBTC],
      [assetInfoBTC],
      COMP_CONTRACT,
      interface_info
    );

    const txEvent = new TestTransactionEvent()
      .addEventLog(BUY_COLLATERAL_EVENT, COMP_CONTRACT, [
        buyCollParamsETH.buyer,
        buyCollParamsETH.asset,
        buyCollParamsETH.baseAmount,
        buyCollParamsETH.collateralAmount,
      ])
      .addEventLog(BUY_COLLATERAL_EVENT, COMP_CONTRACT, [
        buyCollParamsBTC.buyer,
        buyCollParamsBTC.asset,
        buyCollParamsBTC.baseAmount,
        buyCollParamsBTC.collateralAmount,
      ])
      .setBlock(10);
    const findings = await handleTransaction(txEvent);

    const expectFindOne = createNewCollateralBuyFinding(
      buyCollParamsETHFormatted.asset,
      buyCollParamsETHFormatted.collateralAmount,
      buyCollParamsETHFormatted.baseAmount,
      buyCollParamsETHFormatted.buyer
    );
    const expectFindTwo = createNewCollateralBuyFinding(
      buyCollParamsBTCFormatted.asset,
      buyCollParamsBTCFormatted.collateralAmount,
      buyCollParamsBTCFormatted.baseAmount,
      buyCollParamsBTCFormatted.buyer
    );

    expect(findings.length).toEqual(2);
    expect(findings).toStrictEqual([expectFindOne, expectFindTwo]);
  });
});
