import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { HandleTransaction } from "forta-agent";
import { provideHandleTransaction } from "./agent";
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

const randAddr = createAddress("0x1");

const newPauseGuardParams = {
  oldPauseGuardian: createAddress("0x2"),
  newPauseGuardian: createAddress("0x3"),
};

const pauseGlobalParams = {
  action: "Mint",
  state: "true",
};

const pauseMarketParams = {
  cToken: createAddress("0x4"),
  action: "Mint",
  state: "true",
};

describe("Compound-pause-monitor-bot", () => {
  let handleTransaction: HandleTransaction;

  beforeEach(() => {
    handleTransaction = provideHandleTransaction();
  });

  it("returns an empty finding if there are no pause events", async () => {
    const txEvent = new TestTransactionEvent();
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a new pause guardian event called to the wrong address (not comptroller address)", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      NEW_PAUSE_GUARDIAN,
      randAddr,
      [
        newPauseGuardParams.oldPauseGuardian,
        newPauseGuardParams.newPauseGuardian,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a pause market event called to the wrong address (not comptroller address)", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      ACTION_PAUSED_MARKET,
      randAddr,
      [
        pauseMarketParams.cToken,
        pauseMarketParams.action,
        pauseMarketParams.state,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a pause global event called to the wrong address (not comptroller address)", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      ACTION_PAUSED_GLOBAL,
      randAddr,
      [pauseGlobalParams.action, pauseGlobalParams.state]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if the new pause guardian function is called to the comptroller contract", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      NEW_PAUSE_GUARDIAN,
      COMPTROLLER_CONTRACT,
      [
        newPauseGuardParams.oldPauseGuardian,
        newPauseGuardParams.newPauseGuardian,
      ]
    );
    const findings = await handleTransaction(txEvent);
    const expecFind = [
      createNewGuardFinding(
        newPauseGuardParams.oldPauseGuardian,
        newPauseGuardParams.newPauseGuardian
      ),
    ];
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual(expecFind);
  });

  it("returns a finding if the pause market function is called to the comptroller contract", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      ACTION_PAUSED_MARKET,
      COMPTROLLER_CONTRACT,
      [
        pauseMarketParams.cToken,
        pauseMarketParams.action,
        pauseMarketParams.state,
      ]
    );
    const findings = await handleTransaction(txEvent);
    const expecFind = [
      createPausedFindingMarket(
        pauseMarketParams.cToken,
        pauseMarketParams.action,
        pauseMarketParams.state
      ),
    ];
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual(expecFind);
  });

  it("returns multiple findings if the pause market function is called to multiple tokens", async () => {
    const txEvent = new TestTransactionEvent()
      .addEventLog(ACTION_PAUSED_MARKET, COMPTROLLER_CONTRACT, [
        createAddress("0x01"),
        pauseMarketParams.action,
        pauseMarketParams.state,
      ])
      .addEventLog(ACTION_PAUSED_MARKET, COMPTROLLER_CONTRACT, [
        createAddress("0x02"),
        pauseMarketParams.action,
        pauseMarketParams.state,
      ]);
    const findings = await handleTransaction(txEvent);
    const expecFind = [
      createPausedFindingMarket(
        createAddress("0x01"),
        pauseMarketParams.action,
        pauseMarketParams.state
      ),
      createPausedFindingMarket(
        createAddress("0x02"),
        pauseMarketParams.action,
        pauseMarketParams.state
      ),
    ];
    expect(findings.length).toEqual(2);
    expect(findings).toStrictEqual(expecFind);
  });

  it("returns a finding if the pause global function is called to the comptroller contract", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      ACTION_PAUSED_GLOBAL,
      COMPTROLLER_CONTRACT,
      [pauseMarketParams.action, pauseMarketParams.state]
    );
    const findings = await handleTransaction(txEvent);
    const expecFind = [
      createPausedFindingGlobal(
        pauseGlobalParams.action,
        pauseGlobalParams.state
      ),
    ];
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual(expecFind);
  });

  it("returns multiple findings if all functions that can be paused get paused", async () => {
    const txEvent = new TestTransactionEvent()
      .addEventLog(ACTION_PAUSED_GLOBAL, COMPTROLLER_CONTRACT, [
        "Mint",
        pauseMarketParams.state,
      ])
      .addEventLog(ACTION_PAUSED_GLOBAL, COMPTROLLER_CONTRACT, [
        "Borrow",
        pauseMarketParams.state,
      ])
      .addEventLog(ACTION_PAUSED_GLOBAL, COMPTROLLER_CONTRACT, [
        "Seize",
        pauseMarketParams.state,
      ])
      .addEventLog(ACTION_PAUSED_GLOBAL, COMPTROLLER_CONTRACT, [
        "Transfer",
        pauseMarketParams.state,
      ]);
    const findings = await handleTransaction(txEvent);
    const expecFind = [
      createPausedFindingGlobal("Mint", pauseGlobalParams.state),
      createPausedFindingGlobal("Borrow", pauseGlobalParams.state),
      createPausedFindingGlobal("Seize", pauseGlobalParams.state),
      createPausedFindingGlobal("Transfer", pauseGlobalParams.state),
    ];
    expect(findings.length).toEqual(4);
    expect(findings).toStrictEqual(expecFind);
  });
});
