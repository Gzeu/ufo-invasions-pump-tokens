import React from "react";
import { MissionsProvider } from "./context/MissionsContext";
import { RewardsProvider } from "./context/RewardsProvider";
import MissionsSection from "./components/MissionsSection";
import RewardsSection from "./components/RewardsSection";

export default function App() {
  return (
    <MissionsProvider>
      <RewardsProvider>
        <div style={{
          maxWidth: 720,
          margin: "auto",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#121224",
          minHeight: '100vh',
          color: '#cfd8dc',
          padding: "2rem"
        }}>
          <h1 style={{ textAlign: "center", paddingBottom: "1rem", color: "#7FDBFF" }}>
            UFO Invasions - Missions & Rewards
          </h1>
          <MissionsSection />
          <RewardsSection />
        </div>
      </RewardsProvider>
    </MissionsProvider>
  );
}