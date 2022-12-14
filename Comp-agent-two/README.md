# Comp pause tracker bot

## Description

This agent monitors when the Compound protocol's pause guardian is changed or the pause global/market function is called. Since the pause function is typically used only in critical situations, an alert could indicate that something has gone wrong and it is important to be aware of the problem as soon as possible.

## Supported Chains

- Ethereum

## Alerts

Describe each of the type of alerts fired by this agent

- COMP-PAUSEI

  - Fired when the new pause guardian event is emitted
  - Severity is always set to "Info"
  - Type is always set to "info"
  - Metadata: {
    oldPauseGuardian: The old pause guardian,
    newPauseGuardian: The new pause guardian,
    }

- COMP-PAUSEII

  - Fired when the pause market event is emitted
  - Severity is always set to "Critcial"
  - Type is always set to "Suspicious"
  - Metadata: {
    cToken: The token that the pause function was called on
    action: The function that was paused (e.g. mint function)
    pauseState: bool that returns true or false
    }

- COMP-PAUSEIII
  - Fired when the pause global event is emitted
  - Severity is always set to "Critical"
  - Type is always set to "Suspicious"
  - Metadata: {
    action: The function that was paused (e.g. mint function)
    pauseState: bool that returns true or false
    }

## Test Data

The agent behaviour can be verified with the following transactions:

- Test for market pause: tx 0x98144f1dcc9d916563041f68d11444925f817d4a857357fce73978a335a9a06b
