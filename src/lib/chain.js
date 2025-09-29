import { ethers } from "ethers";

const HEX_PREFIX = "0x";
const RAW_CHAIN_ID = process.env.REACT_APP_CHAIN_ID || "56";
const CHAIN_ID_HEX = RAW_CHAIN_ID.startsWith(HEX_PREFIX)
  ? RAW_CHAIN_ID
  : "0x" + parseInt(RAW_CHAIN_ID, 10).toString(16);

const RPC_URL = process.env.REACT_APP_RPC_URL || "";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || "BSC";
const NATIVE_CURRENCY = {
  name: process.env.REACT_APP_NATIVE_NAME || "BNB",
  symbol: process.env.REACT_APP_NATIVE_SYMBOL || "BNB",
  decimals: 18
};
const EXPLORER_URL = process.env.REACT_APP_EXPLORER_URL || "https://bscscan.com";

export function getWeb3Provider() {
  if (!window.ethereum) throw new Error("Wallet not detected");
  return new ethers.providers.Web3Provider(window.ethereum);
}

export async function ensureCorrectNetwork() {
  const provider = getWeb3Provider();
  const { chainId } = await provider.getNetwork();
  const current = "0x" + chainId.toString(16);
  if (current.toLowerCase() === CHAIN_ID_HEX.toLowerCase()) return true;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_ID_HEX }]
    });
    return true;
  } catch (switchError) {
    if (switchError?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: CHAIN_NAME,
            nativeCurrency: NATIVE_CURRENCY,
            rpcUrls: [RPC_URL].filter(Boolean),
            blockExplorerUrls: [EXPLORER_URL].filter(Boolean)
          }
        ]
      });
      return true;
    }
    throw switchError;
  }
}

export function getExplorerTxUrl(txHash) {
  return `${EXPLORER_URL}/tx/${txHash}`;
}