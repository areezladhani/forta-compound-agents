# Liquidation buys Compound protocol

## Description

This agent detects when a user buys collateral from a liquidation in the Compound protocol and the base amount is greater then 10,000 USD. The base amount is what is used to purchase the collateral.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- COMP-LIQI
  - Fired when a user buys collateral from a liquidation in the Compound protocol and the base amount is greater then 10,000 USD
  - Severity is always set to "Info"
  - Type is always set to "info"
  - The metada contains the following information:
    - assetType: The type of asset the collateral is in
    - assetPrice: The total amount of collateral
    - basePrice: The price the collateral was purchased for in USD
    - buyerAddr: The address of the user who purchased the collateral

## Test Data

The agent behaviour can be verified with the following transactions:

- Buy collateral: tx 0x27af97c0cc40beca2170b9ad88f483956ef2a0b6c5cce25755091fb8a2e4c207
- buy collateral event topic: 0xf891b2a411b0e66a5f0a6ff1368670fefa287a13f541eb633a386a1a9cc7046b
