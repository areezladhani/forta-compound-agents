import { providers, ethers, BigNumber, Contract } from "ethers";
import { COMP_CONTRACT, WETH, WBTC, COMP, UNI, LINK } from "./constants";
import "./cometAbi";
import { COMET_ABI } from "./cometAbi";

const interface_info = new ethers.utils.Interface(COMET_ABI);

export const assetType = new Map<string, string>([
  [WETH, "WETH"],
  [WBTC, "WBTC"],
  [COMP, "COMP"],
  [UNI, "UNI"],
  [LINK, "LINK"],
]);

export const getCollateralType = (asset: string) => {
  return assetType.get(asset);
};

export const getFinalAssetPrice = async (
  provider: providers.Provider,
  asset: string,
  collateralAmount: number,
  blockNumber: number
) => {
  const scale = await getAssetInfo(provider, asset, blockNumber);
  const finalAsstetPrice = collateralAmount / scale;
  const finAssetPrice = ethers.utils.commify(finalAsstetPrice);
  return finAssetPrice;
};

export const getFinbaseAmount = (baseAmount: BigNumber) => {
  const baseAmountINT = ethers.utils.formatUnits(baseAmount, 6);
  const finalBasePrice = ethers.utils.commify(baseAmountINT);
  return finalBasePrice;
};

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
  const scaleVal = scale;
  return scaleVal;
};
