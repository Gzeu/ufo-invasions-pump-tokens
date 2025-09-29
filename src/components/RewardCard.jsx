import React from "react";

export default function RewardCard({ reward, onClaim, isClaiming }) {
  return (
    <article style={{
      border: "1px solid #444",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      backgroundColor: "#121224"
    }}>
      <p>Type: {reward.type}</p>
      <p>Amount: {reward.amount}</p>
      <p>Date: {new Date(reward.date).toLocaleDateString()}</p>
      <button
        disabled={isClaiming}
        onClick={() => onClaim(reward.id)}
        style={{
          backgroundColor: "#00cc88",
          color: "white",
          padding: "6px 12px",
          border: "none",
          cursor: isClaiming ? "wait" : "pointer",
          marginTop: 8
        }}
      >
        {isClaiming ? "Claiming..." : "Claim Reward"}
      </button>
    </article>
  );
}