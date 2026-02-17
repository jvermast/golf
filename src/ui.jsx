export const C = {
  bg: "#0a1628", bg2: "#112240", bg3: "#1a365d", border: "#2d3748",
  accent: "#60a5fa", accentDim: "#1e3a8a", accentBr: "#93c5fd",
  gold: "#fbbf24", silver: "#94a3b8", bronze: "#f97316",
  text: "#f1f5f9", dim: "#94a3b8", muted: "#64748b",
  eagle: "#f59e0b", birdie: "#60a5fa", par: "#10b981",
  bogey: "#f87171", dbl: "#dc2626", skin: "#c084fc",
};

export const medal = [C.gold, C.silver, C.bronze];

export const bdg = (c) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "2px 7px", borderRadius: "6px", fontSize: "11px", fontWeight: 700,
  fontFamily: "'JetBrains Mono',monospace", background: c + "15", color: c, minWidth: "18px",
});

export const scC = (nvp) => {
  if (nvp == null) return { bg: "transparent", bd: C.border };
  if (nvp <= -2) return { bg: C.eagle + "25", bd: C.eagle + "50" };
  if (nvp === -1) return { bg: C.birdie + "25", bd: C.birdie + "50" };
  if (nvp === 0) return { bg: C.par + "12", bd: C.par + "30" };
  if (nvp === 1) return { bg: C.bogey + "10", bd: C.bogey + "20" };
  return { bg: C.dbl + "12", bd: C.dbl + "20" };
};

export const Chev = ({ dir = "down" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: dir==="up"?"rotate(180deg)":dir==="left"?"rotate(90deg)":dir==="right"?"rotate(-90deg)":"none" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
