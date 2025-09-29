import React from "react";

export default function RewardCard({ reward, onClaim, isClaiming }) {
  const disabled = isClaiming || reward.status !== "claimable";

  return (
    <article style={{
      border: "1px solid #444",
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      backgroundColor: "#121224",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, color: "#cfd8dc" }}>Type: {reward.type}</p>
        <p style={{ margin: "6px 0 0 0", color: "#cfd8dc" }}>
          Amount: {reward.amount?.value} {reward.amount?.symbol || "UFO"}
        </p>
        <p style={{ margin: "6px 0 0 0", color: "#8aa0a8" }}>
          Date: {new Date(reward.date).toLocaleDateString()}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        <span style={{
          fontSize: 12,
          padding: "4px 8px",
          borderRadius: 999,
          background: reward.status === "claimable" ? "rgba(0,204,136,0.15)" :
                     reward.status === "claimed" ? "rgba(127,219,255,0.15)" :
                     "rgba(255,56,96,0.15)",
          color: reward.status === "claimable" ? "#00cc88" :
                 reward.status === "claimed" ? "#7FDBFF" : "#ff3860"
        }}>
          {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
        </span>

        <button
          disabled={disabled}
          onClick={() => onClaim(reward.id)}
          style={{
            backgroundColor: disabled ? "#2a2a3a" : "#00cc88",
            color: "white",
            padding: "8px 14px",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            borderRadius: 6,
            minWidth: 130
          }}
        >
          {isClaiming ? "Claiming..." : "Claim"}
        </button>
      </div>
    </article>
  );
}