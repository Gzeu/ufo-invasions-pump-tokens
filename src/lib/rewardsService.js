import { ethers } from "ethers";
import UFOInvasionsABI from "../abis/UFOInvasionsNFT.json";
import { ensureCorrectNetwork, getWeb3Provider } from "./chain";
import { mapEthersError } from "./errors";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const API_BASE = process.env.REACT_APP_API_BASE_URL || "";
const E2E_MOCK = process.env.REACT_APP_E2E_MOCK_CHAIN === "1";

// Fake TX helper pentru e2e
function fakeTx(hash = "0xmocked") {
  return {
    hash,
    wait: async () => ({ status: 1, transactionHash: hash })
  };
}

// Helper: build contract with signer
function getContractWithSigner(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, UFOInvasionsABI.abi, signer);
}

// Normalize rewards payload
function normalizeReward(raw) {
  let amount = raw.amount;
  if (typeof amount === "string") {
    const [val, sym] = amount.split(" ");
    amount = { value: Number(val) || 0, symbol: sym || "UFO", decimals: 18 };
  }
  return {
    id: raw.id,
    type: raw.type || "Reward",
    amount,
    date: raw.date || Date.now(),
    status: raw.status || "claimable"
  };
}

export const rewardsService = {
  async listRewards({ address, cursor } = {}) {
    const base = API_BASE || "";
    const url = new URL(`${base}/api/rewards`, window.location.origin);
    if (address) url.searchParams.set("address", address);
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url.toString(), { method: "GET" });
    if (!res.ok) throw new Error(`Failed to fetch rewards: ${res.status}`);
    const json = await res.json();
    return {
      rewards: (json.rewards || []).map(normalizeReward),
      nextCursor: json.nextCursor || null,
      totalClaimable: json.totalClaimable || 0
    };
  },

  async prepareClaim({ address, rewardId }) {
    const res = await fetch(`${API_BASE}/api/rewards/prepare-claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, rewardId })
    });
    if (!res.ok) throw new Error(`Failed to prepare claim: ${res.status}`);
    const json = await res.json();
    return json;
  },

  async claimOnChainSingle({ rewardId, prepared }) {
    if (E2E_MOCK) {
      return fakeTx("0xe2e_single_" + rewardId);
    }
    if (!window.ethereum) throw new Error("Wallet not detected");
    const provider = getWeb3Provider();
    await provider.send("eth_requestAccounts", []);
    await ensureCorrectNetwork();

    const signer = provider.getSigner();
    const contract = getContractWithSigner(signer);
    const iface = contract.interface;
    let tx;

    try {
      if (prepared && iface.getFunction) {
        if (iface.functions["claimReward(uint256,bytes32[],uint256,bytes)"]) {
          tx = await contract.claimReward(
            rewardId,
            prepared.proof || [],
            prepared.amount || 0,
            prepared.signature || "0x"
          );
        } else if (iface.functions["claimReward(uint256)"]) {
          tx = await contract.claimReward(rewardId);
        } else {
          tx = await contract.claimReward(rewardId);
        }
      } else {
        tx = await contract.claimReward(rewardId);
      }
    } catch (e) {
      throw mapEthersError(e);
    }
    return tx;
  },

  async claimOnChainBatch({ rewardIds, preparedById = {} }) {
    if (E2E_MOCK) {
      return { mode: "batch", tx: fakeTx("0xe2e_batch_" + (rewardIds?.length || 0)) };
    }
    if (!window.ethereum) throw new Error("Wallet not detected");
    const provider = getWeb3Provider();
    await provider.send("eth_requestAccounts", []);
    await ensureCorrectNetwork();

    const signer = provider.getSigner();
    const contract = getContractWithSigner(signer);
    const iface = contract.interface;

    try {
      if (iface.functions && iface.functions["claimRewards(uint256[])"]) {
        const tx = await contract.claimRewards(rewardIds);
        return { mode: "batch", tx };
      }
    } catch (_) {}

    const results = [];
    for (const id of rewardIds) {
      const prepared = preparedById[id];
      const tx = await this.claimOnChainSingle({ rewardId: id, prepared });
      results.push({ id, tx, mode: "single" });
    }
    return { mode: "sequential", results };
  },

  async syncStatus({ rewardId, txHash }) {
    try {
      await fetch(`${API_BASE}/api/rewards/claimed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId, txHash })
      });
    } catch {}
  }
};