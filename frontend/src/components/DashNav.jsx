import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashNav({ tabs, activeTab, setActiveTab, userName, role="Member", onLogout }) {
  const navigate = useNavigate();
  const initials = userName.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
  const avatarColors = { Member:"linear-gradient(135deg,#F97316,#EA580C)", "Event Owner":"linear-gradient(135deg,#FB7185,#F43F5E)" };

  return (
    <header style={{
      position:"sticky", top:0, zIndex:50,
      background:"rgba(255,255,255,0.95)", backdropFilter:"blur(20px)",
      borderBottom:"1px solid rgba(249,115,22,0.1)",
      boxShadow:"0 2px 16px rgba(249,115,22,0.07)",
      padding:"0 36px", height:68,
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      {/* Logo */}
      <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:22, color:"var(--orange)", cursor:"pointer", letterSpacing:"-0.5px" }} onClick={()=>navigate("/")}>Eventara ✨</div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, background:"var(--stone)", borderRadius:12, padding:4 }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            padding:"8px 18px", borderRadius:10, fontWeight:600, fontSize:13,
            background:activeTab===t.id?"#fff":"transparent",
            color:activeTab===t.id?"var(--orange)":"var(--text2)",
            boxShadow:activeTab===t.id?"0 2px 10px rgba(249,115,22,0.12)":"none",
            border:"none", cursor:"pointer", transition:"all 0.2s",
            display:"flex", alignItems:"center", gap:6,
          }}>
            {t.label}
            {t.count>0&&<span style={{ background:activeTab===t.id?"var(--orange-soft)":"rgba(249,115,22,0.1)", color:"var(--orange-deep)", borderRadius:999, padding:"1px 7px", fontSize:11, fontWeight:800 }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {/* User */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>{userName}</div>
          <div style={{ fontSize:11, color:"var(--orange)", fontWeight:600 }}>{role}</div>
        </div>
        <div style={{ width:40, height:40, borderRadius:"50%", background:avatarColors[role]||avatarColors.Member, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:15, boxShadow:"0 3px 12px rgba(249,115,22,0.3)" }}>{initials}</div>
        <button onClick={onLogout} style={{
          padding:"8px 18px", borderRadius:10, border:"1.5px solid rgba(249,115,22,0.2)",
          background:"transparent", color:"var(--text2)", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.color="var(--orange)";e.currentTarget.style.background="var(--orange-pale)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.2)";e.currentTarget.style.color="var(--text2)";e.currentTarget.style.background="transparent";}}>
          Log Out
        </button>
      </div>
    </header>
  );
}
