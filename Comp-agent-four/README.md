# Large supply/withdraw events

## Description

This agent detects supply/withdrawal events of the base asset or collateral in excess of $100,000.

## Supported Chains

- Ethereum

## Alerts

- COMP-I

  - Fired when a transaction contains a Supply/Withdraw collateral event over $100,000 on the Compound protocol.
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
  - The metada contains the following information:
    - assetType: The type of asset the collateral is in
    - event: The name of the event that was called
    - collPrice: The price of the collateral
    - from: The address of the user who sent the transaction
    - to: The address of the user who received the transaction

- COMP-II
  - Fired when a transaction contains a Supply/Withdraw event of the base asset over $100,000 on the Compound protocol.
  - Severity is always set to "low" (mention any conditions where it could be something else)
  - Type is always set to "info" (mention any conditions where it could be something else)
    - The metada contains the following information:
    - event: The name of the event that was called
    - collPrice: The price of the base asset
    - from: The address of the user who sent the transaction
    - to: The address of the user who received the transaction

## Test Data

The agent behaviour can be verified with the following transactions:

- Supply Base Asset
  - npm run tx 0x60ffccef0a40e24369e26f4a29d30c79d7e6b965cfca7102b487af9b42dda5da
- Supply Collateral
  - npm run tx 0xed6363537886ceaff8a3d51f2a42bc53fb0b936efeb5b9ad25e7c0c80942740a
- Withdraw Base Asset
  - npm run tx 0x82c3851dddcc49ee492fe26ebafe8b959f079023e4253dffdec939fab4045c6f
- Withdraw Collateral
  - npm run tx 0xf28f8c358d21d451d2f8e0868d9de34247160cdc8c7c125a9778fa6396810b69
