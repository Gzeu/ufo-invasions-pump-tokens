import React, { useMemo } from "react";
import { useRewards } from "../context/RewardsContext";
import RewardCard from "./RewardCard";

export default function RewardsSection() {
  const { rewards, loading, error, claimReward, claimAll, claimingIds, totalClaimable, loadMore } = useRewards();

  const anyClaiming = useMemo(() => claimingIds && claimingIds.size > 0, [claimingIds]);
  const claimables = useMemo(() => rewards.filter(r => r.status === "claimable"), [rewards]);

  return (
    <section style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ color: "#7FDBFF", margin: 0 }}>Your Rewards</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <strong style={{ color: "#cfd8dc" }}>
            Total: {totalClaimable} UFO
          </strong>
          <button
            onClick={claimAll}
            disabled={!claimables.length || anyClaiming}
            style={{
              backgroundColor: (!claimables.length || anyClaiming) ? "#2a2a3a" : "#00cc88",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              cursor: (!claimables.length || anyClaiming) ? "not-allowed" : "pointer"
            }}
          >
            {anyClaiming ? "Processing..." : `Claim All (${claimables.length})`}
          </button>
        </div>
      </div>

      {loading && <p>Loading rewards...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message || error.toString()}</p>}
      {!loading && rewards.length === 0 && <p>No rewards available</p>}

      {rewards.map(reward => (
        <RewardCard
          key={reward.id}
          reward={reward}
          onClaim={claimReward}
          isClaiming={claimingIds.has(reward.id)}
        />
      ))}

      {loadMore && (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#2a2a3a" : "#3a3a5a",
              color: "white",
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}