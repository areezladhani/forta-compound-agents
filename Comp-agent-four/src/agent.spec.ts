import {
  MockEthersProvider,
  TestTransactionEvent,
} from "forta-agent-tools/lib/test";
import { ethers, HandleTransaction } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import { Interface } from "ethers/lib/utils";
import "./cometAbi";
import { COMET_ABI } from "./cometAbi";
import { BigNumber } from "ethers";
import {
  assetInfoETH,
  COMP_CONTRACT,
  ETH_USD_FEED,
  SUPPLY_BASE_EVENT,
  SUPPLY_COLLATERAL_EVENT,
  WETH,
  WITHDRAW_BASE_EVENT,
  WITHDRAW_COLLATERAL_EVENT,
} from "./constants";
import { createAssetFinding, createCollateralFinding } from "./findings";

const interface_info = new ethers.utils.Interface(COMET_ABI);

const supplyParams = {
  from: "0xd8c31BfE46800DCE48e0372C77A637b945060310",
  to: "0xd8c31BfE46800DCE48e0372C77A637b945060310",
  amount: 100000000000,
};
const withdrawParams = {
  src: "0xF319661f8A3D9055acd7465Ef81583440194F91C",
  to: "0xF319661f8A3D9055acd7465Ef81583440194F91C",
  amount: 100000000000,
};
const withdrawCollateralParams = {
  src: "0x91703d683c2dc619e35dC9c6dc2b71F17f1ceEeC",
  to: "0x91703d683c2dc619e35dC9c6dc2b71F17f1ceEeC",
  asset: WETH,
  amount: BigNumber.from("142700000000000000000"),
};
const supplyCollateralParams = {
  from: "0x8652Ae3c42C0C8A30aaeE9Ae047F565311A6a0d6",
  dst: "0x8652Ae3c42C0C8A30aaeE9Ae047F565311A6a0d6",
  asset: WETH,
  amount: BigNumber.from("142700000000000000000"),
};

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

describe("Compound large deposits/withdrawals", () => {
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
  it("returns a finding if there was a supply collateral event over 100k", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );
    const txEvent = new TestTransactionEvent()
      .addEventLog(SUPPLY_COLLATERAL_EVENT, COMP_CONTRACT, [
        supplyCollateralParams.from,
        supplyCollateralParams.dst,
        supplyCollateralParams.asset,
        supplyCollateralParams.amount,
      ])
      .setBlock(10);

    MakeMockCall(
      mockProvider,
      "getPrice",
      [ETH_USD_FEED],
      [BigNumber.from("126668625058")],
      COMP_CONTRACT,
      interface_info
    );
    const findings = await handleTransaction(txEvent);
    const expectFind = createCollateralFinding(
      "WETH",
      "SupplyCollateral",
      "142.7",
      supplyCollateralParams.from,
      supplyCollateralParams.dst
    );
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual([expectFind]);
  });
  it("returns no finding if supply collateral event under 100k", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );
    const txEvent = new TestTransactionEvent()
      .addEventLog(SUPPLY_COLLATERAL_EVENT, COMP_CONTRACT, [
        supplyCollateralParams.from,
        supplyCollateralParams.dst,
        supplyCollateralParams.asset,
        BigNumber.from("100000000000"),
      ])
      .setBlock(10);
    MakeMockCall(
      mockProvider,
      "getPrice",
      [ETH_USD_FEED],
      [BigNumber.from("126668625058")],
      COMP_CONTRACT,
      interface_info
    );
    const findings = await handleTransaction(txEvent);

    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if there was a withdraw collateral event over 100k", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );
    const txEvent = new TestTransactionEvent()
      .addEventLog(WITHDRAW_COLLATERAL_EVENT, COMP_CONTRACT, [
        withdrawCollateralParams.src,
        withdrawCollateralParams.to,
        withdrawCollateralParams.asset,
        withdrawCollateralParams.amount,
      ])
      .setBlock(10);
    MakeMockCall(
      mockProvider,
      "getPrice",
      [ETH_USD_FEED],
      [BigNumber.from("126668625058")],
      COMP_CONTRACT,
      interface_info
    );
    const findings = await handleTransaction(txEvent);
    const expectFind = createCollateralFinding(
      "WETH",
      "WithdrawCollateral",
      "142.7",
      withdrawCollateralParams.src,
      withdrawCollateralParams.to
    );
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual([expectFind]);
  });
  it("returns no finding if withdrawcollateral event under 100k", async () => {
    MakeMockCall(
      mockProvider,
      "getAssetInfoByAddress",
      [WETH],
      [assetInfoETH],
      COMP_CONTRACT,
      interface_info
    );
    const txEvent = new TestTransactionEvent()
      .addEventLog(WITHDRAW_COLLATERAL_EVENT, COMP_CONTRACT, [
        withdrawCollateralParams.src,
        withdrawCollateralParams.to,
        withdrawCollateralParams.asset,
        BigNumber.from("100000000000"),
      ])
      .setBlock(10);
    MakeMockCall(
      mockProvider,
      "getPrice",
      [ETH_USD_FEED],
      [BigNumber.from("126668625058")],
      COMP_CONTRACT,
      interface_info
    );
    const findings = await handleTransaction(txEvent);

    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });
  it("returns a finding if there was a withdraw base event over 100k", async () => {
    const txEvent = new TestTransactionEvent()
      .addEventLog(WITHDRAW_BASE_EVENT, COMP_CONTRACT, [
        withdrawParams.src,
        withdrawParams.to,
        withdrawParams.amount,
      ])
      .setBlock(10);

    const findings = await handleTransaction(txEvent);
    const expectFind = createAssetFinding(
      "Withdraw",
      "100,000.0",
      withdrawParams.src,
      withdrawParams.to
    );
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual([expectFind]);
  });

  it("returns a finding if there was a supply base event over 100k", async () => {
    const txEvent = new TestTransactionEvent()
      .addEventLog(SUPPLY_BASE_EVENT, COMP_CONTRACT, [
        supplyParams.from,
        supplyParams.to,
        supplyParams.amount,
      ])
      .setBlock(10);

    const findings = await handleTransaction(txEvent);
    const expectFind = createAssetFinding(
      "Supply",
      "100,000.0",
      supplyParams.from,
      supplyParams.to
    );
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual([expectFind]);
  });
});
