// ─── COURSE DATA ────────────────────────────────────────────────────────────
export const COURSES = [
  { name: "Sunday - True Blue", day: 1, ctpHoles: [7, 14], par3Holes: [3, 7, 11, 14, 16], holes: [
    {number:1,par:5,hcp:1},{number:2,par:4,hcp:11},{number:3,par:3,hcp:15},{number:4,par:5,hcp:5},{number:5,par:4,hcp:13},{number:6,par:4,hcp:9},{number:7,par:3,hcp:17},{number:8,par:4,hcp:7},{number:9,par:5,hcp:3},
    {number:10,par:5,hcp:8},{number:11,par:3,hcp:18},{number:12,par:4,hcp:10},{number:13,par:4,hcp:14},{number:14,par:3,hcp:16},{number:15,par:5,hcp:4},{number:16,par:3,hcp:12},{number:17,par:4,hcp:2},{number:18,par:4,hcp:6}
  ]},
  { name: "Monday - Tidewater", day: 2, ctpHoles: [9, 17], par3Holes: [3, 9, 12, 17], holes: [
    {number:1,par:5,hcp:15},{number:2,par:4,hcp:17},{number:3,par:3,hcp:13},{number:4,par:4,hcp:1},{number:5,par:4,hcp:3},{number:6,par:4,hcp:9},{number:7,par:4,hcp:7},{number:8,par:5,hcp:11},{number:9,par:3,hcp:5},
    {number:10,par:4,hcp:10},{number:11,par:4,hcp:2},{number:12,par:3,hcp:14},{number:13,par:5,hcp:6},{number:14,par:4,hcp:8},{number:15,par:4,hcp:18},{number:16,par:5,hcp:16},{number:17,par:3,hcp:12},{number:18,par:4,hcp:4}
  ]},
  { name: "Tuesday - Plantation", day: 3, ctpHoles: [7, 17], par3Holes: [3, 7, 13, 17], holes: [
    {number:1,par:4,hcp:4},{number:2,par:4,hcp:1},{number:3,par:3,hcp:15},{number:4,par:4,hcp:5},{number:5,par:4,hcp:7},{number:6,par:4,hcp:3},{number:7,par:3,hcp:17},{number:8,par:4,hcp:5},{number:9,par:4,hcp:11},
    {number:10,par:4,hcp:10},{number:11,par:5,hcp:4},{number:12,par:4,hcp:16},{number:13,par:3,hcp:18},{number:14,par:5,hcp:6},{number:15,par:4,hcp:12},{number:16,par:4,hcp:2},{number:17,par:3,hcp:14},{number:18,par:4,hcp:8}
  ]},
  { name: "Wednesday - Prestwick", day: 4, ctpHoles: [8, 16], par3Holes: [5, 8, 13, 16], holes: [
    {number:1,par:4,hcp:8},{number:2,par:4,hcp:1},{number:3,par:4,hcp:5},{number:4,par:4,hcp:7},{number:5,par:3,hcp:11},{number:6,par:5,hcp:15},{number:7,par:4,hcp:13},{number:8,par:3,hcp:17},{number:9,par:5,hcp:3},
    {number:10,par:4,hcp:10},{number:11,par:4,hcp:14},{number:12,par:5,hcp:12},{number:13,par:3,hcp:18},{number:14,par:4,hcp:4},{number:15,par:4,hcp:8},{number:16,par:3,hcp:16},{number:17,par:5,hcp:2},{number:18,par:4,hcp:6}
  ]},
  { name: "Thursday - World Tour", day: 5, ctpHoles: [7, 14], par3Holes: [3, 7, 12, 14], holes: [
    {number:1,par:4,hcp:18},{number:2,par:5,hcp:3},{number:3,par:3,hcp:7},{number:4,par:4,hcp:5},{number:5,par:5,hcp:5},{number:6,par:4,hcp:11},{number:7,par:3,hcp:9},{number:8,par:4,hcp:13},{number:9,par:4,hcp:17},
    {number:10,par:4,hcp:12},{number:11,par:5,hcp:10},{number:12,par:3,hcp:18},{number:13,par:4,hcp:2},{number:14,par:3,hcp:15},{number:15,par:5,hcp:8},{number:16,par:4,hcp:6},{number:17,par:4,hcp:16},{number:18,par:4,hcp:4}
  ]},
  { name: "Friday - Kings North", day: 6, ctpHoles: [8, 17], par3Holes: [2, 4, 8, 12, 17], holes: [
    {number:1,par:5,hcp:10},{number:2,par:3,hcp:4},{number:3,par:4,hcp:12},{number:4,par:3,hcp:16},{number:5,par:4,hcp:14},{number:6,par:5,hcp:2},{number:7,par:4,hcp:6},{number:8,par:3,hcp:18},{number:9,par:4,hcp:4},
    {number:10,par:5,hcp:13},{number:11,par:4,hcp:11},{number:12,par:3,hcp:17},{number:13,par:4,hcp:3},{number:14,par:4,hcp:9},{number:15,par:5,hcp:1},{number:16,par:4,hcp:7},{number:17,par:3,hcp:15},{number:18,par:4,hcp:5}
  ]},
];

export const DEFAULT_PLAYERS = [
  { name: "Josh", handicap: 8 },
  { name: "Johnny", handicap: 8 },
  { name: "Matt", handicap: 10.5 },
];

// ─── SCORING ENGINE ─────────────────────────────────────────────────────────
export function getStrokes(hcp, holeHcp) {
  const h = Math.round(hcp);
  if (h >= 18) return holeHcp <= (h - 18) ? 2 : 1;
  return holeHcp <= h ? 1 : 0;
}

export function netScore(gross, hcp, holeHcp) {
  return gross - getStrokes(hcp, holeHcp);
}

export function grossLabel(gvp) {
  if (gvp <= -3) return "albatross";
  if (gvp === -2) return "eagle";
  if (gvp === -1) return "birdie";
  if (gvp === 0) return "par";
  return null;
}

export function calcDay(course, players, scores, ctpWinners = {}) {
  const R = players.map(p => ({
    player: p.name, pars: 0, birdies: 0, eagles: 0, skins: 0, lowNet: 0, ctp: 0,
    totalNet: 0, totalGross: 0, holes: [],
    parPts: 0, birdiePts: 0, eaglePts: 0,
  }));

  // Per-hole scoring
  course.holes.forEach(hole => {
    players.forEach((p, pi) => {
      const g = scores?.[p.name]?.[hole.number] || 0;
      if (!g) return;
      const n = netScore(g, p.handicap, hole.hcp);
      const nvp = n - hole.par;
      const gvp = g - hole.par;
      const str = getStrokes(p.handicap, hole.hcp);
      R[pi].totalNet += n;
      R[pi].totalGross += g;
      if (nvp <= -2) { R[pi].eagles++; R[pi].eaglePts += 4; }
      else if (nvp === -1) { R[pi].birdies++; R[pi].birdiePts += 2; }
      else if (nvp === 0) { R[pi].pars++; R[pi].parPts += 1; }
      R[pi].holes.push({ hole: hole.number, par: hole.par, hcp: hole.hcp, g, n, nvp, gvp, str });
    });
  });

  // SKINS - Gross birdie/eagle beats net birdie/eagle, but gross par does NOT beat net par
  let carry = 0;
  course.holes.forEach(hole => {
    const hs = players.map((p, pi) => {
      const g = scores?.[p.name]?.[hole.number] || 0;
      if (!g) return { pi, g: 999, n: 999, nvp: 999 };
      const n = netScore(g, p.handicap, hole.hcp);
      const nvp = n - hole.par;
      return { pi, g, n, nvp };
    });

    const v = hs.filter(s => s.g < 999);
    let w = null;

    if (v.length > 0) {
      // Find best net result
      const bestNvp = Math.min(...v.map(s => s.nvp));
      
      // If best net is birdie or better (nvp < 0), check for matching gross
      if (bestNvp < 0) {
        const bestNetScores = v.filter(s => s.nvp === bestNvp);
        // Check if anyone has matching gross score (same net result achieved with gross)
        const matchingGross = bestNetScores.filter(s => (s.g - hole.par) === bestNvp);
        
        if (matchingGross.length === 1) {
          w = matchingGross[0].pi; // Gross wins
        } else if (matchingGross.length === 0 && bestNetScores.length === 1) {
          w = bestNetScores[0].pi; // Net wins (no matching gross)
        }
        // else tie = carry
      } else {
        // Best is par or worse - pure net scoring, no gross priority
        const bestNetScores = v.filter(s => s.nvp === bestNvp);
        if (bestNetScores.length === 1) w = bestNetScores[0].pi;
      }
    }

    if (w !== null) { R[w].skins += 1 + carry; carry = 0; }
    else carry++;
  });

  // Low Net bonus
  if (R.every(r => r.holes.length === 18)) {
    const nets = R.map(r => r.totalNet);
    const best = Math.min(...nets);
    const ws = R.filter(r => r.totalNet === best);
    if (ws.length === 1) ws[0].lowNet = 10;
    else if (ws.length === 2) ws.forEach(w => w.lowNet = 5);
    else ws.forEach(w => w.lowNet = 3.33);
  }

  // CTP bonus (3 points per win)
  if (course.ctpHoles && ctpWinners) {
    course.ctpHoles.forEach(holeNum => {
      const winner = ctpWinners[holeNum];
      if (winner) {
        const rIdx = R.findIndex(r => r.player === winner);
        if (rIdx !== -1) R[rIdx].ctp += 3;
      }
    });
  }

  R.forEach(r => {
    r.totalPoints = r.parPts + r.birdiePts + r.eaglePts + r.skins + r.lowNet + r.ctp;
  });
  return R;
}
