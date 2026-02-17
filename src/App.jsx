import { useState, useEffect, useMemo, useCallback } from "react";
import { COURSES, DEFAULT_PLAYERS, calcDay, getStrokes, netScore, grossLabel } from "./data";
import { useFirestoreSync } from "./useFirestoreSync";
import { isConfigured } from "./firebase";
import { C, medal, bdg, scC, Chev } from "./ui.jsx";

export default function App() {
  const [view, setView] = useState("leaderboard");
  const [day, setDay] = useState(0);
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const [scores, setScores] = useState({});
  const [nine, setNine] = useState("front");
  const courses = COURSES;

  const fbActive = isConfigured();
  const { status: fbStatus, lastSync, debouncedSync } = useFirestoreSync(scores, players, setScores, setPlayers);

  // Local backup
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("golf26") || "null");
      if (s) { if (s.scores) setScores(s.scores); if (s.players) setPlayers(s.players); }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("golf26", JSON.stringify({ scores, players })); } catch {}
  }, [scores, players]);

  const allR = useMemo(() => courses.map((c, i) => calcDay(c, players, scores[i] || {})), [courses, players, scores]);
  const board = useMemo(() => {
    const t = {};
    players.forEach(p => { t[p.name] = { pars:0,birdies:0,eagles:0,skins:0,lowNet:0,total:0,parPts:0,birdiePts:0,eaglePts:0 }; });
    allR.forEach(dr => dr.forEach(r => {
      const x = t[r.player]; if (!x) return;
      x.pars+=r.pars; x.birdies+=r.birdies; x.eagles+=r.eagles; x.skins+=r.skins; x.lowNet+=r.lowNet;
      x.parPts+=r.parPts; x.birdiePts+=r.birdiePts; x.eaglePts+=r.eaglePts; x.total+=r.totalPoints;
    }));
    return Object.entries(t).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.total - a.total);
  }, [allR, players]);

  const setScore = useCallback((di, pn, hn, v) => {
    const val = parseInt(v) || 0;
    setScores(prev => {
      const next = { ...prev, [di]: { ...prev[di], [pn]: { ...(prev[di]?.[pn] || {}), [hn]: val } } };
      if (fbActive) debouncedSync(next, players);
      return next;
    });
  }, [debouncedSync, players, fbActive]);

  const updatePlayers = useCallback((np) => {
    setPlayers(np);
    if (fbActive) debouncedSync(scores, np);
  }, [debouncedSync, scores, fbActive]);

  const handleExport = () => { const b = new Blob([JSON.stringify({players,scores},null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="myrtle-2026.json"; a.click(); };
  const handleImport = e => { const f=e.target.files[0]; if(!f)return; const r=new FileReader(); r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.players)setPlayers(d.players);if(d.scores)setScores(d.scores);if(fbActive)debouncedSync(d.scores||scores,d.players||players);}catch{alert("Bad JSON")}}; r.readAsText(f); };

  // ─── STATUS DOT ─────────────────────────────────────────────────────────
  const StatusDot = () => {
    if (!fbActive) return <div style={{fontSize:"10px",fontWeight:700,color:C.muted}}>Local only</div>;
    const colors = { connected:"#4ade80", connecting:"#fbbf24", offline:C.muted, error:"#ef4444" };
    const labels = { connected:"Live", connecting:"Connecting...", offline:"Offline", error:"Error" };
    return <div style={{display:"flex",alignItems:"center",gap:"5px",fontSize:"10px",fontWeight:700,color:colors[fbStatus]}}>
      <div style={{width:"6px",height:"6px",borderRadius:"50%",background:colors[fbStatus],boxShadow:fbStatus==="connected"?`0 0 6px ${colors.connected}`:"none"}}/>
      {labels[fbStatus]}
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // LEADERBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  const Board = () => {
    const pod = board.length >= 3 ? [board[1], board[0], board[2]] : board;
    return <div>
      <div style={{textAlign:"center",padding:"20px 0 6px"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.2em",color:C.muted}}>2026 Myrtle Beach</div>
        <h1 style={{fontSize:"26px",fontWeight:900,letterSpacing:"-0.04em",color:C.text,margin:"4px 0 0"}}>Leaderboard</h1>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:"10px",padding:"20px 0",alignItems:"flex-end"}}>
        {pod.map(p => { const rank=board.indexOf(p),col=medal[rank]||C.dim,ht=["130px","100px","80px"][rank];
          return <div key={p.name} style={{display:"flex",flexDirection:"column",alignItems:"center",width:rank===0?"120px":"95px"}}>
            <div style={{fontSize:rank===0?"15px":"13px",fontWeight:800,color:C.text,marginBottom:"2px"}}>{p.name}</div>
            <div style={{fontSize:rank===0?"28px":"22px",fontWeight:900,color:col,fontFamily:"'JetBrains Mono',monospace",marginBottom:"6px"}}>{p.total}</div>
            <div style={{width:"100%",height:ht,borderRadius:"10px 10px 0 0",background:`linear-gradient(to top,${col}12,${col}06)`,border:`1px solid ${col}30`,borderBottom:"none",display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:"10px",fontSize:"22px",fontWeight:900,color:col+"80"}}>#{rank+1}</div>
          </div>})}
      </div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"16px",marginBottom:"14px",overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["","PAR×1","BIR×2","EAG×4","SKINS","LOW NET","TOTAL"].map((h,i)=><th key={i} style={{padding:"8px 6px",fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.08em",color:i===6?C.accent:C.muted,textAlign:i===0?"left":"center",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{board.map((p,i)=><tr key={p.name} style={{background:i===0?C.accent+"06":"transparent"}}>
            <td style={{padding:"10px 6px",fontWeight:800,fontSize:"14px",whiteSpace:"nowrap"}}><span style={{color:medal[i]||C.muted,marginRight:"8px",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px"}}>{i+1}</span>{p.name}<span style={{fontSize:"11px",color:C.muted,marginLeft:"6px"}}>({players.find(x=>x.name===p.name)?.handicap})</span></td>
            <td style={{textAlign:"center",padding:"8px 4px"}}><span style={bdg(C.par)}>{p.pars}<span style={{opacity:0.5,fontSize:"9px",marginLeft:"2px"}}>={p.parPts}</span></span></td>
            <td style={{textAlign:"center",padding:"8px 4px"}}><span style={bdg(C.birdie)}>{p.birdies}<span style={{opacity:0.5,fontSize:"9px",marginLeft:"2px"}}>={p.birdiePts}</span></span></td>
            <td style={{textAlign:"center",padding:"8px 4px"}}><span style={bdg(C.eagle)}>{p.eagles}<span style={{opacity:0.5,fontSize:"9px",marginLeft:"2px"}}>={p.eaglePts}</span></span></td>
            <td style={{textAlign:"center",padding:"8px 4px"}}><span style={bdg(C.skin)}>{p.skins}</span></td>
            <td style={{textAlign:"center",padding:"8px 4px"}}><span style={bdg(C.gold)}>{p.lowNet}</span></td>
            <td style={{textAlign:"center",padding:"8px 4px",fontWeight:900,fontSize:"20px",fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{p.total}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"10px",paddingLeft:"4px"}}>Daily Results</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"10px"}}>
        {courses.map((c,di)=>{const dr=[...allR[di]].sort((a,b)=>b.totalPoints-a.totalPoints);const has=dr.some(r=>r.holes.length>0);return <div key={di} onClick={()=>{setDay(di);setView("scorecard")}} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"12px",padding:"14px",cursor:"pointer",opacity:has?1:0.4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"10px"}}>
            <div><div style={{fontSize:"10px",color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em"}}>{["Sun","Mon","Tue","Wed","Thu","Fri"][di]} · Day {di+1}</div><div style={{fontSize:"14px",fontWeight:700,color:C.text,marginTop:"2px"}}>{c.name.split(" - ")[1]}</div></div>
            <Chev dir="right"/>
          </div>
          {has?<div style={{display:"flex",gap:"6px"}}>{dr.map((r,i)=><div key={r.player} style={{flex:1,padding:"6px",borderRadius:"8px",textAlign:"center",background:i===0?C.accent+"10":"transparent",border:`1px solid ${i===0?C.accent+"25":C.border}`}}>
            <div style={{fontSize:"10px",color:C.dim,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.player}</div>
            <div style={{fontSize:"17px",fontWeight:900,fontFamily:"'JetBrains Mono',monospace",color:i===0?C.accent:C.text}}>{r.totalPoints}</div>
          </div>)}</div>:<div style={{color:C.muted,fontSize:"12px"}}>No scores yet</div>}
        </div>})}
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SCORECARD
  // ═══════════════════════════════════════════════════════════════════════════
  const Scores = () => {
    const c = courses[day], ds = scores[day] || {}, dr = allR[day];
    const dh = nine === "front" ? c.holes.slice(0, 9) : c.holes.slice(9, 18);
    return <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
        <button onClick={()=>day>0&&setDay(day-1)} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"7px",color:C.dim,cursor:"pointer",opacity:day===0?0.3:1}}><Chev dir="left"/></button>
        <div style={{textAlign:"center"}}><div style={{fontSize:"10px",color:C.muted,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em"}}>Day {day+1}</div><div style={{fontSize:"17px",fontWeight:800,letterSpacing:"-0.02em"}}>{c.name}</div><div style={{fontSize:"11px",color:C.dim}}>Par {c.holes.reduce((s,h)=>s+h.par,0)}</div></div>
        <button onClick={()=>day<5&&setDay(day+1)} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"7px",color:C.dim,cursor:"pointer",opacity:day===5?0.3:1}}><Chev dir="right"/></button>
      </div>
      <div style={{display:"flex",justifyContent:"center",marginBottom:"14px"}}><div style={{display:"flex",gap:"2px",background:C.bg2,borderRadius:"10px",padding:"3px",border:`1px solid ${C.border}`}}>
        {["front","back"].map(r=><button key={r} onClick={()=>setNine(r)} style={{padding:"6px 16px",borderRadius:"8px",border:"none",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",background:nine===r?C.accentDim:"transparent",color:nine===r?C.accentBr:C.dim}}>{r==="front"?"Front 9":"Back 9"}</button>)}
      </div></div>
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"10px",marginBottom:"14px",overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:"580px"}}>
          <thead>
            <tr><th style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"left",borderBottom:`1px solid ${C.border}`,position:"sticky",left:0,background:C.bg2,zIndex:2,minWidth:"70px"}}>Hole</th>
              {dh.map(h=><th key={h.number} style={{padding:"6px 3px",fontSize:"12px",fontWeight:800,color:C.dim,textAlign:"center",borderBottom:`1px solid ${C.border}`,minWidth:"40px"}}>{h.number}</th>)}
              <th style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.accent,textAlign:"center",borderBottom:`1px solid ${C.border}`,minWidth:"45px"}}>{nine==="front"?"OUT":"IN"}</th>
            </tr>
            <tr><td style={{padding:"4px 6px",fontSize:"10px",fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}20`,position:"sticky",left:0,background:C.bg2,zIndex:2}}>Par</td>
              {dh.map(h=><td key={h.number} style={{padding:"4px",fontSize:"12px",color:C.dim,fontWeight:700,textAlign:"center",borderBottom:`1px solid ${C.border}20`}}>{h.par}</td>)}
              <td style={{padding:"4px",fontSize:"12px",fontWeight:800,color:C.dim,textAlign:"center",borderBottom:`1px solid ${C.border}20`}}>{dh.reduce((s,h)=>s+h.par,0)}</td>
            </tr>
            <tr><td style={{padding:"4px 6px",fontSize:"10px",fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`,position:"sticky",left:0,background:C.bg2,zIndex:2}}>HCP</td>
              {dh.map(h=><td key={h.number} style={{padding:"4px",fontSize:"10px",color:C.muted,textAlign:"center",borderBottom:`1px solid ${C.border}`}}>{h.hcp}</td>)}
              <td style={{borderBottom:`1px solid ${C.border}`}}></td>
            </tr>
          </thead>
          <tbody>{players.map(player=>{const pr=dr.find(r=>r.player===player.name)||{};const ng=dh.reduce((s,h)=>s+(ds[player.name]?.[h.number]||0),0);
            return <tr key={player.name}>
              <td style={{padding:"6px",textAlign:"left",borderBottom:`1px solid ${C.border}15`,position:"sticky",left:0,background:C.bg2,zIndex:2}}><div style={{fontWeight:800,fontSize:"13px",lineHeight:1.1}}>{player.name}</div><div style={{fontSize:"9px",color:C.muted,fontWeight:600}}>HCP {player.handicap}</div></td>
              {dh.map(hole=>{const g=ds[player.name]?.[hole.number]||"";const det=pr.holes?.find(d=>d.hole===hole.number);const str=getStrokes(player.handicap,hole.hcp);const cc=det?scC(det.nvp):{bg:"transparent",bd:C.border};
                return <td key={hole.number} style={{padding:"3px 1px",textAlign:"center",borderBottom:`1px solid ${C.border}15`,position:"relative"}}>
                  {str>0&&<div style={{position:"absolute",top:"2px",right:"3px",width:"4px",height:"4px",borderRadius:"50%",background:C.accent}}/>}
                  <input type="number" min="1" max="15" value={g} onChange={e=>setScore(day,player.name,hole.number,e.target.value)} onFocus={e=>e.target.select()}
                    style={{background:cc.bg,border:`1.5px solid ${cc.bd}`,borderRadius:"6px",padding:"4px 2px",color:C.text,fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",outline:"none",width:"36px",textAlign:"center",fontWeight:700}}/>
                </td>})}
              <td style={{padding:"6px",textAlign:"center",fontWeight:900,fontSize:"15px",fontFamily:"'JetBrains Mono',monospace",color:C.accent,borderBottom:`1px solid ${C.border}15`}}>{ng||"–"}</td>
            </tr>})}</tbody>
        </table>
      </div>
      {/* Day Points */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"14px",marginBottom:"14px",overflowX:"auto"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"10px"}}>Day {day+1} Points</div>
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>
          {["","GROSS","NET","PAR×1","BIR×2","EAG×4","SKINS","LOW","PTS"].map((h,i)=><th key={i} style={{padding:"6px 4px",fontSize:"9px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.05em",color:i===8?C.accent:C.muted,textAlign:i===0?"left":"center",borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap"}}>{h}</th>)}
        </tr></thead><tbody>
          {[...dr].sort((a,b)=>b.totalPoints-a.totalPoints).map((r,i)=><tr key={r.player} style={{background:i===0&&r.totalPoints>0?C.accent+"06":"transparent"}}>
            <td style={{padding:"8px 4px",fontWeight:800,fontSize:"13px"}}>{r.player}</td>
            <td style={{padding:"6px 4px",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",color:C.dim,fontSize:"13px"}}>{r.totalGross||"–"}</td>
            <td style={{padding:"6px 4px",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",color:C.text,fontSize:"13px",fontWeight:700}}>{r.totalNet||"–"}</td>
            <td style={{padding:"6px 4px",textAlign:"center"}}>{r.pars>0&&<span style={bdg(C.par)}>{r.pars}</span>}</td>
            <td style={{padding:"6px 4px",textAlign:"center"}}>{r.birdies>0&&<span style={bdg(C.birdie)}>{r.birdies}</span>}</td>
            <td style={{padding:"6px 4px",textAlign:"center"}}>{r.eagles>0&&<span style={bdg(C.eagle)}>{r.eagles}</span>}</td>
            <td style={{padding:"6px 4px",textAlign:"center"}}>{r.skins>0&&<span style={bdg(C.skin)}>{r.skins}</span>}</td>
            <td style={{padding:"6px 4px",textAlign:"center"}}>{r.lowNet>0&&<span style={bdg(C.gold)}>{r.lowNet}</span>}</td>
            <td style={{padding:"6px 4px",textAlign:"center",fontWeight:900,fontSize:"18px",fontFamily:"'JetBrains Mono',monospace",color:C.accent}}>{r.totalPoints}</td>
          </tr>)}
        </tbody></table>
      </div>
      {/* Skins */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"14px",overflowX:"auto"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.skin,marginBottom:"10px"}}>Skins Detail</div>
        <SkinsTbl course={c} players={players} ds={ds}/>
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SKINS TABLE
  // ═══════════════════════════════════════════════════════════════════════════
  const SkinsTbl = ({course, players, ds}) => {
    let carry = 0; const rows = [];
    course.holes.forEach(hole => {
      const hs = players.map(p => { const g=ds[p.name]?.[hole.number]||0; if(!g)return{name:p.name,g:0,n:0,gl:null}; const n=netScore(g,p.handicap,hole.hcp); return{name:p.name,g,n,gl:grossLabel(g-hole.par)}; });
      const v = hs.filter(s => s.g > 0); let w = null, m = null;
      if (v.length > 0) {
        const gw = hs.filter(s => s.gl && s.g > 0);
        if (gw.length > 0) { const b=Math.min(...gw.map(s=>s.g)); const bs=gw.filter(s=>s.g===b); if(bs.length===1){w=bs[0].name;m=`Gross ${bs[0].gl}`;} }
        else { const bn=Math.min(...v.map(s=>s.n)); const bs=v.filter(s=>s.n===bn); if(bs.length===1){w=bs[0].name;m="Best NET";} }
      }
      const worth = w ? 1 + carry : 0; rows.push({hole:hole.number,par:hole.par,scores:hs,w,m,carry,worth}); if(w)carry=0; else if(v.length>0)carry++;
    });
    return <table style={{width:"100%",borderCollapse:"collapse",minWidth:"380px"}}>
      <thead><tr><th style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"left",borderBottom:`1px solid ${C.border}`}}>#</th>
        {players.map(p=><th key={p.name} style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"center",borderBottom:`1px solid ${C.border}`}}>{p.name}</th>)}
        <th style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"center",borderBottom:`1px solid ${C.border}`}}>Winner</th>
        <th style={{padding:"6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"center",borderBottom:`1px solid ${C.border}`}}>Pts</th>
      </tr></thead>
      <tbody>{rows.map(row=><tr key={row.hole} style={{background:row.w?C.skin+"06":"transparent"}}>
        <td style={{padding:"5px 6px",fontWeight:800,fontSize:"12px",color:C.dim,borderBottom:`1px solid ${C.border}10`}}>{row.hole} <span style={{fontSize:"9px",color:C.muted}}>P{row.par}</span></td>
        {row.scores.map(sc=><td key={sc.name} style={{padding:"5px 4px",textAlign:"center",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",fontWeight:sc.name===row.w?900:400,color:sc.name===row.w?C.skin:C.dim,borderBottom:`1px solid ${C.border}10`}}>
          {sc.g>0?<>{sc.g}{sc.gl&&<span style={{fontSize:"8px",marginLeft:"1px",color:C.accent}}>★</span>}</>:"–"}
        </td>)}
        <td style={{padding:"5px 4px",textAlign:"center",fontSize:"11px",fontWeight:700,color:row.w?C.skin:C.muted,borderBottom:`1px solid ${C.border}10`}}>
          {row.w?<><div>{row.w}</div><div style={{fontSize:"8px",color:C.muted}}>{row.m}</div></>:row.scores.some(s=>s.g>0)?<span style={{color:C.eagle}}>Carry →</span>:"–"}
        </td>
        <td style={{padding:"5px 4px",textAlign:"center",fontWeight:900,fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",color:row.worth>1?C.gold:row.worth>0?C.skin:C.muted,borderBottom:`1px solid ${C.border}10`}}>
          {row.worth>0?row.worth:row.carry>0?<span style={{fontSize:"10px",color:C.eagle}}>+{row.carry}</span>:"–"}
        </td>
      </tr>)}</tbody>
    </table>;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SETUP
  // ═══════════════════════════════════════════════════════════════════════════
  const Setup = () => {
    const [ec, setEc] = useState(null);
    return <div>
      <h2 style={{fontSize:"20px",fontWeight:900,letterSpacing:"-0.03em",marginBottom:"16px"}}>Setup</h2>

      {/* Firebase status */}
      <div style={{background:C.bg2,border:`1px solid ${fbStatus==="connected"?C.accent+"40":C.border}`,borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
          <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:"#ff6b35"}}>🔥 Firestore Sync</div>
          <StatusDot/>
        </div>
        {fbActive
          ? <div style={{fontSize:"12px",color:C.dim,lineHeight:1.6}}>
              {fbStatus==="connected"?<span style={{color:C.accent}}>✓ Connected — scores sync in real-time across all devices</span>
                :fbStatus==="connecting"?<span style={{color:C.gold}}>Connecting...</span>
                :<span style={{color:C.bogey}}>Connection issue — scores saved locally</span>}
              {lastSync&&<div style={{fontSize:"10px",color:C.muted,marginTop:"4px"}}>Last sync: {lastSync.toLocaleTimeString()}</div>}
            </div>
          : <div style={{fontSize:"12px",color:C.dim,lineHeight:1.6}}>
              To enable real-time sync, paste your Firebase config into <code style={{background:C.bg3,padding:"1px 4px",borderRadius:"3px",fontSize:"11px"}}>src/firebase.js</code> and redeploy.
            </div>}
      </div>

      {/* Players */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"12px"}}>Players & Handicaps</div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {players.map((p,i)=><div key={i} style={{display:"flex",gap:"8px",alignItems:"center"}}>
            <input value={p.name} onChange={e=>{const np=[...players];np[i]={...np[i],name:e.target.value};updatePlayers(np);}} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:"8px",padding:"8px 10px",color:C.text,fontSize:"14px",fontFamily:"inherit",outline:"none"}}/>
            <span style={{fontSize:"10px",color:C.muted,fontWeight:700}}>HCP</span>
            <input type="number" min="0" max="54" step="0.5" value={p.handicap} onChange={e=>{const np=[...players];np[i]={...np[i],handicap:parseFloat(e.target.value)||0};updatePlayers(np);}} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:"6px",padding:"6px",color:C.text,fontSize:"13px",fontFamily:"'JetBrains Mono',monospace",outline:"none",width:"56px",textAlign:"center"}}/>
            {players.length>2&&<button onClick={()=>updatePlayers(players.filter((_,j)=>j!==i))} style={{padding:"6px 10px",borderRadius:"6px",border:"1px solid #7f1d1d",background:"#7f1d1d30",color:"#fca5a5",fontSize:"13px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>×</button>}
          </div>)}
          <button onClick={()=>updatePlayers([...players,{name:`Player ${players.length+1}`,handicap:15}])} style={{padding:"8px 16px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.bg2,color:C.text,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ Add Player</button>
        </div>
      </div>

      {/* Courses */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"12px"}}>Courses</div>
        {courses.map((c,ci)=><div key={ci} style={{marginBottom:"6px"}}>
          <div onClick={()=>setEc(ec===ci?null:ci)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:"10px",cursor:"pointer",background:ec===ci?C.accent+"10":C.bg3,border:`1px solid ${ec===ci?C.accent+"30":C.border}`}}>
            <div><div style={{fontSize:"10px",color:C.muted,fontWeight:700}}>Day {ci+1}</div><div style={{fontSize:"14px",fontWeight:700}}>{c.name}</div><div style={{fontSize:"11px",color:C.dim}}>Par {c.holes.reduce((s,h)=>s+h.par,0)}</div></div>
            <Chev dir={ec===ci?"up":"down"}/>
          </div>
          {ec===ci&&<div style={{padding:"10px 4px",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:"500px"}}>
              <thead><tr><th style={{padding:"4px 6px",fontSize:"10px",fontWeight:800,color:C.muted,textAlign:"left"}}>Hole</th>{c.holes.map(h=><th key={h.number} style={{padding:"4px 2px",fontSize:"11px",fontWeight:800,color:C.dim,textAlign:"center"}}>{h.number}</th>)}</tr></thead>
              <tbody>
                <tr><td style={{padding:"4px 6px",fontSize:"10px",fontWeight:700,color:C.muted}}>PAR</td>{c.holes.map(h=><td key={h.number} style={{padding:"2px",textAlign:"center",fontSize:"12px",color:C.dim,fontWeight:700}}>{h.par}</td>)}</tr>
                <tr><td style={{padding:"4px 6px",fontSize:"10px",fontWeight:700,color:C.muted}}>HCP</td>{c.holes.map(h=><td key={h.number} style={{padding:"2px",textAlign:"center",fontSize:"11px",color:C.muted}}>{h.hcp}</td>)}</tr>
              </tbody>
            </table>
          </div>}
        </div>)}
      </div>

      {/* Import/Export */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"10px"}}>Import / Export</div>
        <div style={{display:"flex",gap:"8px"}}><button onClick={handleExport} style={{padding:"8px 16px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.bg2,color:C.text,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Export JSON</button><label style={{padding:"8px 16px",borderRadius:"8px",border:`1px solid ${C.border}`,background:C.bg2,color:C.text,fontSize:"13px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Import JSON<input type="file" accept=".json" onChange={handleImport} style={{display:"none"}}/></label></div>
      </div>

      {/* Rules */}
      <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:"14px",padding:"16px"}}>
        <div style={{fontSize:"10px",fontWeight:800,textTransform:"uppercase",letterSpacing:"0.15em",color:C.muted,marginBottom:"10px"}}>Scoring Rules</div>
        <div style={{fontSize:"12px",color:C.dim,lineHeight:2}}>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 12px",alignItems:"center"}}>
            <span style={bdg(C.par)}>NET Par</span><span>1 point</span>
            <span style={bdg(C.birdie)}>NET Birdie</span><span>2 points</span>
            <span style={bdg(C.eagle)}>NET Eagle+</span><span>4 points</span>
            <span style={bdg(C.skin)}>Skin</span><span>1 pt/hole (carries on ties)</span>
            <span style={bdg(C.gold)}>Low Net</span><span>3 pts (1.5 if 2-way, 1 if 3-way)</span>
          </div>
          <div style={{marginTop:"12px",padding:"10px",borderRadius:"8px",background:C.skin+"08",border:`1px solid ${C.skin}20`,fontSize:"11px",lineHeight:1.8}}>
            <div style={{fontWeight:800,color:C.skin,marginBottom:"2px"}}>SKINS PRIORITY</div>
            <div>1. Gross par/birdie/eagle/albatross/HIO <strong>always wins</strong></div>
            <div>2. No gross par-or-better → Best NET wins</div>
            <div>3. Ties → Carry over</div>
          </div>
        </div>
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SHELL
  // ═══════════════════════════════════════════════════════════════════════════
  return <div style={{fontFamily:"'DM Sans','Helvetica Neue',sans-serif",color:C.text,minHeight:"100vh",background:C.bg}}>
    <div style={{background:C.bg2,backdropFilter:"blur(20px)",borderBottom:`1px solid ${C.border}`,padding:"10px 14px",position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"6px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"7px",fontWeight:800,fontSize:"14px",color:C.accent,whiteSpace:"nowrap",letterSpacing:"-0.02em"}}>⛳ Myrtle '26</div>
      <div style={{display:"flex",gap:"2px",background:C.bg2,borderRadius:"10px",padding:"3px",border:`1px solid ${C.border}`}}>
        {[{k:"leaderboard",l:"🏆 Board"},{k:"scorecard",l:"📋 Scores"},{k:"setup",l:"⚙️"}].map(t=><button key={t.k} onClick={()=>setView(t.k)} style={{padding:"5px 12px",borderRadius:"8px",border:"none",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",background:view===t.k?C.accentDim:"transparent",color:view===t.k?C.accentBr:C.dim,whiteSpace:"nowrap"}}>{t.l}</button>)}
      </div>
      <StatusDot/>
    </div>
    <div style={{padding:"14px",maxWidth:"1100px",margin:"0 auto"}}>
      {view==="leaderboard"&&<Board/>}
      {view==="scorecard"&&<Scores/>}
      {view==="setup"&&<Setup/>}
    </div>
  </div>;
}
