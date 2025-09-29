import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import UFOInvasionsABI from "../abis/UFOInvasionsNFT.json";

const RewardsContext = createContext(null);
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

function getContract(providerOrSigner) {
  return new ethers.Contract(CONTRACT_ADDRESS, UFOInvasionsABI.abi, providerOrSigner);
}

export function RewardsProvider({ children }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Fetch rewards - mock or from backend
  useEffect(() => {
    async function fetchRewards() {
      setLoading(true);
      try {
        // TODO: Replace with real API/backend call here
        const data = [
          { id: 1, type: "Mission Reward", amount: "50 UFO", date: Date.now() - 86400000 },
          { id: 2, type: "Staking Reward", amount: "20 UFO", date: Date.now() - 172800000 }
        ];
        setRewards(data);
        setError(null);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchRewards();
  }, []);

  // Toast function
  const showToast = useCallback((msg, duration = 4000) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), duration);
  }, []);

  const claimReward = useCallback(async (rewardId) => {
    try {
      setClaiming(true);
      setError(null);
      if (!window.ethereum) throw new Error("Wallet not detected");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = getContract(signer);

      // Ex: contract.claimReward(rewardId)
      const tx = await contract.claimReward(rewardId);
      showToast("Transaction sent. Waiting confirmation...");
      await tx.wait();

      setRewards(prev => prev.filter(r => r.id !== rewardId));
      showToast("Reward claimed successfully!");
    } catch (e) {
      console.error(e);
      setError(e);
      showToast(`Error: ${e.message || e.toString()}`);
    } finally {
      setClaiming(false);
    }
  }, [showToast]);

  return (
    <RewardsContext.Provider value={{ rewards, loading, claimReward, claiming, error, toastMsg, showToast }}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error("useRewards must be used within RewardsProvider");
  }
  return context;
}