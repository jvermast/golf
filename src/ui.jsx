export const C = {
  bg: "#ffffff", bg2: "#f8fafc", bg3: "#f1f5f9", border: "#e2e8f0",
  accent: "#2563eb", accentDim: "#1e40af", accentBr: "#60a5fa",
  gold: "#eab308", silver: "#71717a", bronze: "#ea580c",
  text: "#0f172a", dim: "#475569", muted: "#64748b",
  eagle: "#f59e0b", birdie: "#3b82f6", par: "#10b981",
  bogey: "#ef4444", dbl: "#dc2626", skin: "#a855f7",
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
