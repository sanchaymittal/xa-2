# XA^2

Scaling any Dapp to cross-chain + account abstraction solutions in mins!!!

**FEATURES**

- cross-chain + account abstraction
- Simplify DEXs for Contract Calls with feature to update the variable at quotes.
- Modular Stack
- Make any DApp → Cross-chain in Mins…

- Modular stack which allows any dapp to leverage cross-chain functionality in mins!!
- **SwapAdapter**: contract aggregator for dexs and swaps, which allows modifying the params on contract level:

  - Insipration: cross-chain arbitrage or swap faces issue while swapping at destination:
    - As swap doesn’t happen under same block in case of cross-chain actions, there is always possibility of having a slippage.
    - To avoid the failure at destination, Aggregator or DApp fetches quote from dex, with worst possible slippage.
    - Which means most of the time, there is some clutter remains over the top of swap…
    - And also the calculation of the amount bridge receiving prior to transfer is variable as well.
    EXAMPLE:
    - Alice wants to bridge 1000 USDC and receive an alt coin “DUCKS”
    - Alice initiates transfer from Chain A and selects for worst slippage being 1%.
    - Bridge/Aggregator/DAPP will choose the 990 USDC as amountIn and fetch the quote for destination.
    - Once the bridging is completed, and Swap happens, <10 USDC remains as clutter
    - Which is sent to the user’s address with ToAsset(DUCKS).
    - And most of the time when the slippage is low, remaining aren’t of any use to USER.

- Solution:
  - Update the quote with the price received at the destination via Bridge. Quite simple!!!

# Setting up environment

### 1. Node.js environment - Prerequisite

You can `skip` this step if you are using node.js version `>=16.0`
command to check your node.js version

```
node -v
```

- `Installing Node.js`: https://hardhat.org/tutorial/setting-up-the-environment#installing-node.js
- `Upgrading your Node.js installation`: https://hardhat.org/tutorial/setting-up-the-environment#upgrading-your-node.js-installation

### 2. Install Dependencies - Prerequisite

```
yarn
```

# Reference

- https://hardhat.org/tutorial/setting-up-the-environment
