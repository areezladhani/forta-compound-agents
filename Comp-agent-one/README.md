# Compound protocol proposal Agent

## Description

This bot detects when the Compound protocol creates or queues a proposal. When a new proposal is created, holders of the compound token can vote on it. Once the voting phase is completed, and if the proposal passes, it will be queued in the timelock contract for two days, giving users who disagree with the proposal the opportunity to withdraw their positions if they so desire. The COMP-PROPI alert will notify users when the voting period for a new proposal has begun, whereas the COMP-PROPII alert will notify users when a proposal has been queued.

## Supported Chains

- Ethereum

## Alerts

- COMP-PROPI

  - Fired when a transaction contains a proposalCreated event from with the governance contract address
  - Severity is always set to "Info"
  - Type is always set to "info"
  - metadata: {
    proposalId: This is the id number of the created proposal.
    }

- COMP-PROPII
  - Fired when a transaction contains a proposalQueued event from with the governance contract address
  - Severity is always set to "Info"
  - Type is always set to "info"
  - metadata: {
    proposalId: This is the id number of the created proposal.
    }

## Test Data

The agent behaviour can be verified with the following transactions:

- Test the proposal created alert at: tx 0xa0465ed4b640c881a69410e76602f81287a051180ffa71578bd1953c4b402e1f
- Test the proposal queued alert at: tx 0x60e3889660d839c790c850e645d0eb221b3101f5f5395a56a7b6fec78516247b
