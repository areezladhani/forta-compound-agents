import { providers, ethers, Contract, BigNumber } from "ethers";
import {
  BTC_USD_FEED,
  COMP,
  COMP_CONTRACT,
  COMP_USD_FEED,
  ETH_USD_FEED,
  LINK,
  LINK_USD_FEED,
  UNI,
  UNI_USD_FEED,
  WBTC,
  WETH,
} from "./constants";
import "./cometAbi";
import { COMET_ABI } from "./cometAbi";
import { createAssetFinding, createCollateralFinding } from "./findings";
import { Finding } from "forta-agent";

const interface_info = new ethers.utils.Interface(COMET_ABI);

export const assetType = new Map<string, string>([
  [WETH, "WETH"],
  [WBTC, "WBTC"],
  [COMP, "COMP"],
  [UNI, "UNI"],
  [LINK, "LINK"],
]);
export const PriceFeed = new Map<string, string>([
  [WETH, ETH_USD_FEED],
  [WBTC, BTC_USD_FEED],
  [COMP, COMP_USD_FEED],
  [UNI, UNI_USD_FEED],
  [LINK, LINK_USD_FEED],
]);

export const getAssetInfo = async (
  provider: providers.Provider,
  assetAddr: string,
  blockNumber: number
) => {
  const contr = new Contract(COMP_CONTRACT, interface_info, provider);
  // To test txs older then 128 blocks comment out the blockTag
  const { scale } = await contr.getAssetInfoByAddress(assetAddr, {
    blockTag: blockNumber,
  });
  const scaleVal = scale.toString().length - 1;
  return scaleVal;
};

export const getCollateralType = (asset: string) => {
  return assetType.get(asset);
};

export const getPrice = async (
  provider: providers.Provider,
  asset: string,
  blockNumber: number
) => {
  const contr = new Contract(COMP_CONTRACT, interface_info, provider);
  const feed = PriceFeed.get(asset);
  const assetPriceInUSD = await contr.getPrice(feed, {
    blockTag: blockNumber,
  });
  const finAmountAfterScale: any = ethers.utils
    .formatUnits(assetPriceInUSD, 8)
    .toString();
  return finAmountAfterScale;
};

export const scaleAmount = (amount: any, finScale: any) => {
  return ethers.utils.formatUnits(amount, finScale).toString();
};

export const checkThreshold = (amount: any) => {
  if (amount >= 10000) {
    return true;
  } else {
    return false;
  }
};
export const collateralAsset = async (
  provider: providers.Provider,
  blockNumber: number,
  event: string,
  asset: any,
  amount: any,
  from: string,
  to: string,
  findings: Finding[]
) => {
  const scale = await getAssetInfo(provider, asset, blockNumber);
  //asset type is calculated here
  const assetType = getCollateralType(asset);
  //final amount after scaled here
  const finAmount: any = scaleAmount(amount, scale);
  //price of asset in USD
  const priceInUSD = await getPrice(provider, asset, blockNumber);
  // price of collateral in USD
  const assetAmountUSD: any = priceInUSD * finAmount;
  // Lets only report deposits over 10,000
  if (checkThreshold(assetAmountUSD)) {
    findings.push(
      createCollateralFinding(assetType, event, finAmount, from, to)
    );
  }
  return findings;
};

export const baseAsset = (
  amount: any,
  event: string,
  from: string,
  to: string,
  findings: Finding[]
) => {
  const scaledAmount = scaleAmount(amount, 6);
  if (checkThreshold(scaledAmount)) {
    findings.push(
      createAssetFinding(event, ethers.utils.commify(scaledAmount), from, to)
    );
  }
  return findings;
};
