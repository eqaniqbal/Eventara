import React from "react";

export default function EventCard({ title,date,time,location,capacity,remainingSeats,price,image,onClick,actionButton,showCapacity=true }) {
  const [hover,setHover]=React.useState(false);
  const soldOut=showCapacity&&remainingSeats===0;
  const almostGone=showCapacity&&remainingSeats>0&&remainingSeats<=10;

  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={onClick}
      style={{
        width:290, borderRadius:20, overflow:"hidden", cursor:onClick?"pointer":"default",
        background:"#fff", display:"flex", flexDirection:"column",
        boxShadow: hover?"0 20px 60px rgba(249,115,22,0.16)":"0 4px 20px rgba(28,20,16,0.08)",
        transform: hover?"translateY(-6px) scale(1.01)":"translateY(0) scale(1)",
        transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)",
        border:`1.5px solid ${hover?"rgba(249,115,22,0.25)":"rgba(249,115,22,0.06)"}`,
      }}>
      {/* Image */}
      <div style={{ height:180, overflow:"hidden", position:"relative" }}>
        <img src={image} alt={title} style={{ width:"100%", height:"100%", objectFit:"cover", transform:hover?"scale(1.07)":"scale(1)", transition:"transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,20,16,0.4) 0%,transparent 55%)" }} />
        {price!==undefined&&showCapacity&&(
          <div style={{ position:"absolute", top:12, right:12, background: soldOut?"rgba(107,114,128,0.9)":"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", padding:"5px 13px", borderRadius:999, fontSize:12, fontWeight:800, backdropFilter:"blur(8px)" }}>
            {soldOut?"Sold Out":`PKR ${price}`}
          </div>
        )}
        {almostGone&&<div style={{ position:"absolute", bottom:12, left:12, background:"rgba(251,113,133,0.92)", color:"#fff", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700 }}>🔥 Only {remainingSeats} left!</div>}
      </div>

      {/* Content */}
      <div style={{ padding:"18px 20px 20px", display:"flex", flexDirection:"column", gap:8, flex:1 }}>
        <h3 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:18, color:"var(--text)", margin:0, lineHeight:1.25, letterSpacing:"-0.3px" }}>{title}</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--text2)" }}>📅 {date} · {time}</div>
          <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"var(--text2)" }}>📍 {location}</div>
          {showCapacity&&<div style={{ fontSize:13, color:soldOut?"#FB7185":almostGone?"var(--orange)":"var(--text3)", fontWeight:soldOut||almostGone?700:400 }}>👥 {capacity} capacity · {soldOut?"Sold out":`${remainingSeats} remaining`}</div>}
        </div>
        {actionButton&&<div style={{ marginTop:8 }}>{actionButton}</div>}
        {!actionButton&&onClick&&(
          <button disabled={soldOut} style={{
            marginTop:8, padding:"11px", borderRadius:10, fontWeight:700, fontSize:14, border:"none",
            background:soldOut?"#F3F4F6":"linear-gradient(135deg,var(--orange),var(--orange-deep))",
            color:soldOut?"#9CA3AF":"#fff",
            boxShadow:soldOut?"none":"0 4px 14px rgba(249,115,22,0.3)",
            cursor:soldOut?"not-allowed":"pointer", transition:"all 0.2s",
          }}>
            {soldOut?"Sold Out":"Book Now 🎟️"}
          </button>
        )}
      </div>
    </div>
  );
}
