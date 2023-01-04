import { BigNumber } from "ethers";

export const SUPPLY_BASE_EVENT =
  "event Supply(address indexed from, address indexed dst, uint amount)";
export const SUPPLY_COLLATERAL_EVENT =
  "event SupplyCollateral(address indexed from, address indexed dst, address indexed asset, uint amount)";

export const WITHDRAW_COLLATERAL_EVENT =
  "event WithdrawCollateral(address indexed src, address indexed to, address indexed asset, uint amount);";

export const WITHDRAW_BASE_EVENT =
  "event Withdraw(address indexed src, address indexed to, uint amount)";

export const COMP_CONTRACT = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";

export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const WBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
export const COMP = "0xc00e94Cb662C3520282E6f5717214004A7f26888";
export const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
export const LINK = "0x514910771AF9Ca656af840dff83E8264EcF986CA";

export const COMP_USD_FEED = "0xdbd020CAeF83eFd542f4De03e3cF0C28A4428bd5";
export const ETH_USD_FEED = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
export const BTC_USD_FEED = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
export const UNI_USD_FEED = "0x553303d460EE0afB37EdFf9bE42922D8FF63220e";
export const LINK_USD_FEED = "0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c";

export const assetInfoETH: [
  number,
  string,
  string,
  BigNumber,
  number,
  number,
  number,
  number
] = [
  2,
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
  BigNumber.from("1000000000000000000"),
  825000000000,
  895000000000,
  950000000000,
  1500000000000,
];
