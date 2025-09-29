import React, { useEffect, useState } from "react";

export default function BeamEffect({ triggerKey }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    setActive(true);
    const t = setTimeout(() => setActive(false), 1200);
    return () => clearTimeout(t);
  }, [triggerKey]);

  if (!active) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 9998
    }}>
      <div style={{
        position: "absolute",
        right: 120,
        bottom: 0,
        width: 8,
        height: "60%",
        background: "linear-gradient(180deg, rgba(127,219,255,0.0) 0%, rgba(0,204,136,0.7) 60%, rgba(0,204,136,0.0) 100%)",
        filter: "blur(4px)",
        animation: "beam-fall 1.2s ease-out forwards"
      }} />
      <style>
        {`@keyframes beam-fall {
            0% { transform: translateY(-100%); opacity: 0.0; }
            20% { opacity: 1; }
            100% { transform: translateY(0%); opacity: 0; }
          }`}
      </style>
    </div>
  );
}