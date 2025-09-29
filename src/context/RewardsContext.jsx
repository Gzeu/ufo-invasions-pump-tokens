import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { rewardsService } from "../lib/rewardsService";
import { useNotifications } from "./NotificationContext";
import BeamEffect from "../components/BeamEffect";

const RewardsContext = createContext(null);

export function RewardsProvider({ children }) {
  const [rewards, setRewards] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimingIds, setClaimingIds] = useState(() => new Set());
  const [error, setError] = useState(null);
  const [beamKey, setBeamKey] = useState(null);

  const { showInfo, showSuccess, showError } = useNotifications();

  const loadRewards = useCallback(async ({ cursor } = {}) => {
    setLoading(true);
    try {
      const address = await getAddressIfConnected();
      const { rewards: list, nextCursor, totalClaimable } = await rewardsService.listRewards({ address, cursor });
      setRewards((prev) => cursor ? [...prev, ...list] : list);
      setNextCursor(nextCursor);
      setError(null);
      return { totalClaimable };
    } catch (e) {
      setError(e);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const totalClaimable = useMemo(() => {
    return rewards
      .filter(r => r.status === "claimable")
      .reduce((acc, r) => acc + (Number(r.amount?.value) || 0), 0);
  }, [rewards]);

  const claimReward = useCallback(async (rewardId) => {
    if (claimingIds.has(rewardId)) return;
    setClaimingIds((prev) => new Set(prev.add(rewardId)));
    try {
      const address = await getAddressOrRequest();
      const prepared = await safePrepare({ address, rewardId });
      const tx = await rewardsService.claimOnChainSingle({ rewardId, prepared });

      showInfo("Transaction sent: awaiting confirmation…", { duration: 3000 });

      const confirmations = Number(process.env.REACT_APP_TX_CONFIRMATIONS || 2);
      await tx.wait(confirmations);

      setRewards((prev) => prev.filter(r => r.id !== rewardId));
      setBeamKey(`${rewardId}-${Date.now()}`);
      showSuccess("Reward claimed successfully!", {
        duration: 4000,
        action: {
          label: "View Tx",
          onClick: () => window.open(getExplorerUrl(tx.hash), "_blank")
        }
      });

      await rewardsService.syncStatus({ rewardId, txHash: tx.hash });
    } catch (e) {
      console.error(e);
      showError(e.message || String(e));
    } finally {
      setClaimingIds((prev) => {
        const next = new Set(prev);
        next.delete(rewardId);
        return next;
      });
    }
  }, [claimingIds, showInfo, showSuccess, showError]);

  const claimAll = useCallback(async () => {
    const ids = rewards.filter(r => r.status === "claimable").map(r => r.id);
    if (!ids.length) return;

    setClaimingIds(new Set(ids));
    try {
      const address = await getAddressOrRequest();
      const preparedById = {};
      for (const id of ids) {
        try { preparedById[id] = await safePrepare({ address, rewardId: id }); } catch { preparedById[id] = null; }
      }

      const result = await rewardsService.claimOnChainBatch({ rewardIds: ids, preparedById });

      if (result.mode === "batch") {
        const tx = result.tx;
        showInfo("Batch transaction sent: awaiting confirmation…");
        const confirmations = Number(process.env.REACT_APP_TX_CONFIRMATIONS || 2);
        await tx.wait(confirmations);
        setRewards((prev) => prev.filter(r => !ids.includes(r.id)));
        setBeamKey(`batch-${Date.now()}`);
        showSuccess(`Claimed ${ids.length} rewards`, {
          action: { label: "View Tx", onClick: () => window.open(getExplorerUrl(tx.hash), "_blank") }
        });
        await Promise.all(ids.map(id => rewardsService.syncStatus({ rewardId: id, txHash: tx.hash })));
      } else {
        const okIds = [];
        for (const { id, tx } of result.results) {
          try {
            const confirmations = Number(process.env.REACT_APP_TX_CONFIRMATIONS || 2);
            await tx.wait(confirmations);
            okIds.push(id);
            await rewardsService.syncStatus({ rewardId: id, txHash: tx.hash });
          } catch (e) {
            console.error("Sequential claim failed", id, e);
          }
        }
        if (okIds.length) {
          setRewards((prev) => prev.filter(r => !okIds.includes(r.id)));
          setBeamKey(`batch-seq-${Date.now()}`);
          showSuccess(`Claimed ${okIds.length}/${ids.length} rewards`);
        } else {
          showError("Failed to claim rewards. Please try again.");
        }
      }
    } catch (e) {
      console.error(e);
      showError(e.message || String(e));
    } finally {
      setClaimingIds(new Set());
    }
  }, [rewards, showInfo, showSuccess, showError]);

  const value = {
    rewards,
    loading,
    error,
    claimingIds,
    totalClaimable,
    loadMore: () => nextCursor ? loadRewards({ cursor: nextCursor }) : null,
    claimReward,
    claimAll
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
      <BeamEffect triggerKey={beamKey} />
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used within RewardsProvider");
  return ctx;
}

// Helpers
async function getAddressIfConnected() {
  if (!window.ethereum) return null;
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts?.[0] || null;
  } catch {
    return null;
  }
}
async function getAddressOrRequest() {
  if (!window.ethereum) throw new Error("Wallet not detected");
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || !accounts[0]) throw new Error("Wallet not connected");
  return accounts[0];
}
async function safePrepare({ address, rewardId }) {
  try {
    return await rewardsService.prepareClaim({ address, rewardId });
  } catch {
    return null;
  }
}
function getExplorerUrl(hash) {
  const base = process.env.REACT_APP_EXPLORER_URL || "https://bscscan.com";
  return `${base}/tx/${hash}`;
}