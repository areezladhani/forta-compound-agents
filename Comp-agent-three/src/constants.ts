import { createAddress } from "forta-agent-tools";

export const COMP_CONTRACT = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";

export const BUY_COLLATERAL_EVENT =
  "event BuyCollateral(address indexed buyer, address indexed asset, uint baseAmount, uint collateralAmount)";
export const ABSORB_COLLATERAL_EVENT =
  "event AbsorbCollateral(address indexed absorber, address indexed borrower, address indexed asset, uint collateralAbsorbed, uint usdValue)";

export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
export const COMP = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
export const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
export const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

//Test File helpers
export const assetInfoETH: [
  number,
  string,
  string,
  number,
  number,
  number,
  number,
  number
] = [
  2,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  100000000,
  825000000000,
  895000000000,
  950000000000,
  1500000000000,
];
export const assetInfoBTC: [
  number,
  string,
  string,
  number,
  number,
  number,
  number,
  number
] = [
  1,
  "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
  100000000,
  700000000000000,
  770000000000000,
  950000000000000,
  600000000000,
];

export const buyCollParamsETH = {
  buyer: createAddress("0x22"),
  asset: WETH,
  baseAmount: 1107262546029,
  collateralAmount: 6559878667,
};
export const buyCollParamsFailETH = {
  buyer: createAddress("0x22"),
  asset: WETH,
  baseAmount: 9999,
  collateralAmount: 6559878667,
};
export const buyCollParamsETHFormatted = {
  buyer: createAddress("0x22"),
  asset: "WETH",
  baseAmount: "1,107,262.546029",
  collateralAmount: "65.59878667",
};
export const buyCollParamsBTC = {
  buyer: createAddress("0x22"),
  asset: WBTC,
  baseAmount: 1107262546029,
  collateralAmount: 6559878667,
};
export const buyCollParamsBTCFormatted = {
  buyer: createAddress("0x22"),
  asset: "WBTC",
  baseAmount: "1,107,262.546029",
  collateralAmount: "65.59878667",
};
//address indexed absorber, address indexed borrower, address indexed asset, uint collateralAbsorbed, uint usdValue
export const AbsorbCollParams = {
  absorber: createAddress("0x33"),
  borrower: createAddress("0x44"),
  asset: WETH,
  collateralAbsorbed: 6559878667,
  usdValue: 1107262546029,
};
