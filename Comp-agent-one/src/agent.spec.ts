// TESTS

// Failing tests (no findings)
// when no events are passesd
// correct event with wrong contract address
// wrong event with correct address

//Passing tests (findings)
// when the proposal created event is passed with the correct address
// when the proposal queued event is passed with the correct address
// when both event are passed with the correct address (should have multiple findings)

import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { HandleTransaction } from "forta-agent";
import { provideHandleTransaction } from "./agent";
import { BigNumber } from "ethers";
import {
  PROPOSAL_QUEUED,
  PROPOSAL_CREATED,
  GOVERNANCE_CONTRACT,
  VOTE_CAST_EVENT,
} from "./constants";
import { createPropCreatedFinding, createPropQueuedFinding } from "./findings";

const randAddr = createAddress("0x1");

const propCreatedParams = {
  id: BigNumber.from("137"),
  proposer: "0x38E2051B9A0BdB51FbCDa3cADd073148ac664A68",
  targets: ["0xc00e94Cb662C3520282E6f5717214004A7f26888"],
  values: [0],
  signatures: ["transfer(address,uint256)"],
  /// change calldata value to bytesarray
  calldata: [123],
  startblock: 16082309,
  endblock: 16102019,
  description: "A new proposal has been created...",
};

const propQueuedParams = {
  id: BigNumber.from("100"),
  eta: 1670420219,
};

const voteCastParams = {
  voter: createAddress("0x1"),
  proposalId: BigNumber.from("100"),
  support: 1,
  votes: 100,
  reason: "",
};

describe("Compound-governance-bot", () => {
  let handleTransaction: HandleTransaction;

  beforeEach(() => {
    handleTransaction = provideHandleTransaction();
  });

  it("returns an empty finding if there are no swap events", async () => {
    const txEvent = new TestTransactionEvent();
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a valid proposal created event with the wrong address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      PROPOSAL_CREATED,
      randAddr,
      [
        propCreatedParams.id,
        propCreatedParams.proposer,
        propCreatedParams.targets,
        propCreatedParams.values,
        propCreatedParams.signatures,
        propCreatedParams.calldata,
        propCreatedParams.startblock,
        propCreatedParams.endblock,
        propCreatedParams.description,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a valid proposal queued event with the wrong address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      PROPOSAL_QUEUED,
      randAddr,
      [propQueuedParams.id, propQueuedParams.eta]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns an empty finding if there is a invalid event with the governance address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      VOTE_CAST_EVENT,
      GOVERNANCE_CONTRACT,
      [
        voteCastParams.voter,
        voteCastParams.proposalId,
        voteCastParams.support,
        voteCastParams.votes,
        voteCastParams.reason,
      ]
    );
    const findings = await handleTransaction(txEvent);
    expect(findings.length).toEqual(0);
    expect(findings).toStrictEqual([]);
  });

  it("returns a finding if there is a proposal created event with the correct address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      PROPOSAL_CREATED,
      GOVERNANCE_CONTRACT,
      [
        propCreatedParams.id,
        propCreatedParams.proposer,
        propCreatedParams.targets,
        propCreatedParams.values,
        propCreatedParams.signatures,
        propCreatedParams.calldata,
        propCreatedParams.startblock,
        propCreatedParams.endblock,
        propCreatedParams.description,
      ]
    );

    const propIdString = propCreatedParams.id.toString();
    const findings = await handleTransaction(txEvent);
    const expectedFindings = [createPropCreatedFinding(propIdString)];
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual(expectedFindings);
  });

  it("returns a finding if there is a proposal queued event with the correct address", async () => {
    const txEvent = new TestTransactionEvent().addEventLog(
      PROPOSAL_QUEUED,
      GOVERNANCE_CONTRACT,
      [propQueuedParams.id, propQueuedParams.eta]
    );

    const propIdString = propQueuedParams.id.toString();
    const findings = await handleTransaction(txEvent);
    const expectedFindings = [createPropQueuedFinding(propIdString)];
    expect(findings.length).toEqual(1);
    expect(findings).toStrictEqual(expectedFindings);
  });

  it("returns multiple findings if there is a proposal created and proposal queued event with the correct address", async () => {
    const txEvent = new TestTransactionEvent()

      .addEventLog(PROPOSAL_CREATED, GOVERNANCE_CONTRACT, [
        propCreatedParams.id,
        propCreatedParams.proposer,
        propCreatedParams.targets,
        propCreatedParams.values,
        propCreatedParams.signatures,
        propCreatedParams.calldata,
        propCreatedParams.startblock,
        propCreatedParams.endblock,
        propCreatedParams.description,
      ])
      .addEventLog(PROPOSAL_QUEUED, GOVERNANCE_CONTRACT, [
        propQueuedParams.id,
        propQueuedParams.eta,
      ]);

    const propCreatedIdString = propCreatedParams.id.toString();
    const propQueuedIdString = propQueuedParams.id.toString();
    const findings = await handleTransaction(txEvent);
    const expectedFindings = [
      createPropCreatedFinding(propCreatedIdString),
      createPropQueuedFinding(propQueuedIdString),
    ];
    expect(findings.length).toEqual(2);
    expect(findings).toStrictEqual(expectedFindings);
  });
});
