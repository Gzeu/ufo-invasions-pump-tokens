import React from "react";
import { useRewards } from "../context/RewardsContext";
import RewardCard from "./RewardCard";

export default function RewardsSection() {
  const { rewards, loading, claimReward, claiming, error, toastMsg } = useRewards();

  return (
    <section style={{ padding: "1rem" }}>
      <h2 style={{ color: "#7FDBFF" }}>Your Rewards</h2>
      {loading && <p>Loading rewards...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message || error.toString()}</p>}
      {rewards.length === 0 && !loading && <p>No rewards available</p>}
      {rewards.map(reward => (
        <RewardCard
          key={reward.id}
          reward={reward}
          onClaim={claimReward}
          isClaiming={claiming}
        />
      ))}
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#00cc88",
          color: "white",
          padding: "12px 24px",
          borderRadius: 8,
          boxShadow: "0 0 8px rgba(0,0,0,0.3)"
        }}>
          {toastMsg}
        </div>
      )}
    </section>
  );
}