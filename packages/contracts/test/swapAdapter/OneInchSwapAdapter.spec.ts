import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, constants, Contract, utils, Wallet } from "ethers";
import { DEFAULT_ARGS } from "../../deploy";
import { fund, deploy, ERC20_ABI } from "../helpers";
import IOneInchSwapAdapter from "../../artifacts/contracts/shared/Swap/OneInch/OneInchSwapAdapter.sol/OneInchSwapAdapter.json";

describe.only("SwapAdapter", function () {
  // Set up constants (will mirror what deploy fixture uses)
  const { WETH, USDC } = DEFAULT_ARGS[31337];
  const UNISWAP_SWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const WHALE = "0x385BAe68690c1b86e2f1Ad75253d080C14fA6e16"; // this is the address that should have weth, adapter, and random addr
  const UNPERMISSIONED = "0x7088C5611dAE159A640d940cde0a3221a4af8896";
  const RANDOM_TOKEN = "0x4200000000000000000000000000000000000042"; // this is OP
  const ASSET_DECIMALS = 6; // USDC decimals on op

  // Set up variables
  let adapter: Contract;
  let wallet: Wallet;
  let whale: Wallet;
  let unpermissioned: Wallet;
  let tokenA: Contract;
  let weth: Contract;
  let randomToken: Contract;

  before(async () => {
    // get wallet
    [wallet] = (await ethers.getSigners()) as unknown as Wallet[];
    // get whale
    whale = (await ethers.getImpersonatedSigner(WHALE)) as unknown as Wallet;
    // get unpermissioned
    unpermissioned = (await ethers.getImpersonatedSigner(UNPERMISSIONED)) as unknown as Wallet;
    // deploy contract
    const { instance } = await deploy("OneInchSwapAdapter");
    adapter = instance;
    // setup tokens
    tokenA = new ethers.Contract(USDC, ERC20_ABI, ethers.provider);
    weth = new ethers.Contract(WETH, ERC20_ABI, ethers.provider);
    randomToken = new ethers.Contract(RANDOM_TOKEN, ERC20_ABI, ethers.provider);
  });

  describe("constructor", () => {
    it("should deploy correctly", async () => {
      // Ensure all properties set correctly
      // Ensure whale is okay
      expect(whale.address).to.be.eq(WHALE);
      expect(tokenA.address).to.be.eq(USDC);
    });
  });

  describe("callSwap", () => {
    const swapData =
      "0x12aa3caf000000000000000000000000b97cd69145e5a9357b2acd6af6c5076380f17afb000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f000000000000000000000000b97cd69145e5a9357b2acd6af6c5076380f17afb000000000000000000000000eab48a633ada8565f2cdeb5cde162909fd64b749000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000000000000000002d35000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000160000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c70000000000000000000000000000000000000000000000000000a900001a40410d500b1d8e8ef31e21c99d1db9a6444d3adf1270d0e30db00c200d500b1d8e8ef31e21c99d1db9a6444d3adf127055ff76bffc3cdd9d5fdbbc2ece4528ecce45047e6ae40711b8002dc6c055ff76bffc3cdd9d5fdbbc2ece4528ecce45047e1111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000000002d350d500b1d8e8ef31e21c99d1db9a6444d3adf127000000000000000000000000000000000000000000000000000cfee7c08";

    before(async () => {
      console.log("before");
      // fund the adapter contract with eth, random token, and adapter asset
      await fund(constants.AddressZero, utils.parseEther("1"), wallet, adapter.address);

      await fund(USDC, utils.parseUnits("1", ASSET_DECIMALS), whale, adapter.address);

      await fund(randomToken.address, utils.parseUnits("1", await randomToken.decimals()), whale, adapter.address);
    });

    it("should work decorderEncoderSwapAmount", async () => {
      const tx = await adapter.connect(wallet).decoderEncoderSwapAmount("10000000000000000", swapData);
      const receipt = await tx.wait();
    });

    it("should work", async () => {
      console.log("entry");
      // get initial connext balances
      // send sweep tx

      const adapterBalance = await randomToken.balanceOf(adapter.address);
      const decimals = await randomToken.decimals();
      const normalized =
        decimals > ASSET_DECIMALS
          ? adapterBalance.div(BigNumber.from(10).pow(decimals - ASSET_DECIMALS))
          : adapterBalance.mul(BigNumber.from(10).pow(ASSET_DECIMALS - decimals));
      // use 0.1% slippage (OP is > $2, adapter = usdc)
      const lowerBound = normalized.mul(10).div(10_000);

      const tx = await adapter
        .connect(wallet)
        .callSwap(
          "10000000000000000",
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
          swapData,
        );
      const receipt = await tx.wait();

      console.log("tx", tx);
      console.log("receipt", receipt);
    });
  });
});
