## Compound Summary

- Compound III is an EVM-compatible Protocol that allows users to borrow the base asset using crypto assets as collateral. Users can also directly supply the base asset to earn interest on their stake. The initial deployment is on the Ethereum network, using USDC as the base asset, however this will likely extend to other networks in the future.
- The current deployment of Compound III allows you to borrow USDC using ETH, WBTC, LINK, UNI, and COMP as collateral.
- The protocol remains decentralized through its governance module, which allows comp holders and delegates to propose, vote on, and execute protocol changes.
- The Protocol implementation contracts are deployed using a proxy contract (openZeppelin's Transparent Upgradable Proxy Contract). This allows the protocol to make improvements and deal with bugs or vulnerabilities more efficiently by releasing a new contract with the suggested changes while keeping the contract's state and storage the same.

## Proposed Bots

- **COMP01: Compound-protocol-proposal-Agent**

    - This agent detects when the Compound protocol creates or queues a proposal. 
    - When a new proposal is created, holders of the compound token can vote on it. 
    - Once the voting phase is completed, and if the proposal passes, it will be queued in the timelock contract for two days, giving users who disagree with the proposal the opportunity to withdraw their positions if they so desire. 
    - The COMP-PROPI alert will notify users when the voting period for a new proposal has begun, whereas the COMP-PROPII alert will notify users when a proposal has been queued.

- **COMP02: Comp-pause-tracker-bot**
    
    - This agent monitors when the Compound protocol's pause guardian is changed or the pause global/market function is called. 
    - Since the pause function is typically used only in critical situations, an alert could indicate that something has gone wrong and it is important to be aware of the problem as soon as possible.

    - This bot will track the two addresses that have special privileges.
        - TimeLock Contract: 0x6d903f6003cca6255D85CcA4D3B5E5146dC33925
            - This contract executes transactions as the last phase of the governance process when implementing a change to the protocol.
            
        - Pause Guardian: 0xbbf3f1421D886E9b2c5D716B5192aC998af2012c
            - The pause guardian is a community multi-sig contract owned by token holders. This address has the power to halt the supply, transfer, withdraw, absorb, and buy collateral operations within Compound III.
            
    - This bot will give out two alerts, one for each address.
    
- **COMP03: Large-capital-liquidation**

    - This bot will keep an eye out for any liquidations absorbed by users that exceed a predetermined level.
    - A large enough liquidation might be the result of a sharp decline in the value of an asset or a flaw in one of the systems. For instance, an inaccurate value on the price oracle could cause significant price changes and a significant number of liquidations.
    - Although the notifications from this bot may not necessarily indicate a problem, it is nonetheless important for users who have invested in or are interested in the compound protocol to be aware of them.

- **COMP04: large-borrow/repayBorrow-bot**
    - A bot to track any large borrows/repaying borrows on the compound protocol.
        - The supply and withdraw functions will be tracked for any transaction that are larger then a set threshold.
        - This bot will will be set with a high enough threshold where alerts will not be so frequent.
        - Users may employ this bot to monitor whale activity and follow huge transactions in order to profit from price swings brought on by these transactions. Large transactions may also be used in cases of market manipulation or exploitation.
  

## Proposed Solutions (will make this section more specific during the coding process)

- **COMP01: Compound-protocol-proposal-Agent**
     - Governance contract
        - To track proposals we will monitor the proposalCreated and proposalQueued events on the governance contract address.

- **COMP02: Comp-pause-tracker-bot**

    - This agent monitors when the Compound protocol's pause guardian is changed or the pause global/market function is called. 

    - To track when a new pause guardian is elected.
      - we can track the new pause guardian event 
    - To track when a pause global is executed.
      - we can track the pause global event. 
    - To track when a pause market is executed.
      - we can track the new pause market event 
     

- **COMP03: Large-capital-liquidation**

    - For a liquidation to occur the “Absorb” function will be be called on the comet contract.
    - Once that is called a user can buy the collateral:
                
        - The “buyCollateral” function will be called
            - This indicates that a user may acquire the collateral using the base token (USDC). This will occur if the reserves do not reach the required target, so it enables users to purchase collateral with the base token so that the base token can be added to the reserves in order to reach the target.
            - This function emits the event ( emit BuyCollateral(msg.sender, asset, baseAmount, collateralAmount); )
                - By having a bot monitor the event, we can keep track of this occurrence and, if the collateral amount exceeds the predetermined threshold, send out an alert with the relevant metadata.
                

- **COMP04: large-borrow/repayBorrow-bot**

    - The supply function can be used to repay an open borrow
        - We can track any debt paid back by track the supplyCollateral event
            - emit SupplyCollateral(from, dst, asset, amount);
        - We can then filter the event by the amount and create a finding if it is above our set threshold
        
    - The withdraw function can be used to borrow the base asset if the account has supplies sufficient collateral.
        - We can track any borrow positions  from the WithdrawCollateral event
            - emit WithdrawCollateral(src, to, asset, amount);
        - We can then filter the event by the amount and create a finding if it is above our set threshold
        
