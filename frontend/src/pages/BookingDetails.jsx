import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import eventBg from "../assets/event.jpg";

export default function BookingDetails() {
  const{eventId,userId}=useParams(); const navigate=useNavigate();
  const[event,setEvent]=useState(null); const[loading,setLoading]=useState(true);
  const[message,setMessage]=useState(""); const[quantity,setQuantity]=useState(1);
  const[booking,setBooking]=useState(false); const[success,setSuccess]=useState(false);

  useEffect(()=>{ fetch("http://98.93.67.65:8000/events").then(r=>r.json()).then(d=>{ const e=d.events.find(ev=>ev.id.toString()===eventId); setEvent(e?{...e,remainingSeats:e.remaining_seats,image:e.banner_url?`http://98.93.67.65:8000${e.banner_url}`:eventBg}:null); setLoading(false); }).catch(()=>setLoading(false)); },[eventId]);

  const handleBooking=()=>{ if(quantity>event.remainingSeats){setMessage(`Only ${event.remainingSeats} seats available`);return;} setBooking(true); const fd=new FormData(); fd.append("quantity",quantity); fetch(`http://98.93.67.65:8000/bookings/${eventId}/${userId}`,{method:"POST",body:fd}).then(r=>r.json()).then(d=>{ if(d.detail)setMessage(d.detail); else{setSuccess(true);setEvent(p=>({...p,remainingSeats:p.remainingSeats-quantity}));setQuantity(1);setMessage("");} }).catch(()=>setMessage("Error booking event")).finally(()=>setBooking(false)); };

  if(loading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--cream)",flexDirection:"column",gap:16}}><div style={{width:48,height:48,border:"3px solid var(--orange)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/><p style={{color:"var(--text3)",fontWeight:500,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Loading event...</p></div>);
  if(!event)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--cream)",fontFamily:"'Plus Jakarta Sans',sans-serif",flexDirection:"column",gap:16}}><div style={{fontSize:64}}>😕</div><h2 style={{fontFamily:"'Fraunces',serif",color:"var(--text)"}}>Event not found</h2><button onClick={()=>navigate(-1)} style={{padding:"12px 24px",borderRadius:12,background:"linear-gradient(135deg,var(--orange),var(--orange-deep))",color:"#fff",fontWeight:700,border:"none",cursor:"pointer"}}>← Go Back</button></div>);

  const soldOut=event.remainingSeats<=0;

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <header style={{ background:"#fff", borderBottom:"1px solid rgba(249,115,22,0.1)", padding:"0 40px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 12px rgba(249,115,22,0.06)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:22, color:"var(--orange)" }}>Eventara ✨</div>
        <button onClick={()=>navigate(-1)} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid rgba(249,115,22,0.2)", background:"transparent", color:"var(--text2)", fontWeight:600, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.color="var(--orange)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.2)";e.currentTarget.style.color="var(--text2)";}}>← Back</button>
      </header>

      {success&&(
        <div style={{ background:"linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderBottom:"1px solid #A7F3D0", padding:"14px 40px", display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:24 }}>🎉</span>
          <div>
            <p style={{ fontWeight:800, color:"#15803D", margin:0, fontSize:15 }}>Booking Confirmed! Your tickets are reserved.</p>
            <p style={{ color:"#16A34A", fontSize:13, margin:0 }}>Check your dashboard for details.</p>
          </div>
          <button onClick={()=>navigate("/userdashboard")} style={{ marginLeft:"auto", padding:"9px 20px", borderRadius:10, background:"#22C55E", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer" }}>View Bookings</button>
        </div>
      )}

      <main style={{ maxWidth:1060, margin:"0 auto", padding:"44px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:36, alignItems:"start" }}>
          {/* Image */}
          <div style={{ borderRadius:24, overflow:"hidden", boxShadow:"0 16px 60px rgba(249,115,22,0.14)", height:440, position:"relative" }}>
            <img src={event.image} alt={event.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,20,16,0.35) 0%,transparent 50%)" }} />
            {soldOut&&<div style={{ position:"absolute", top:16, left:16, background:"rgba(107,114,128,0.9)", color:"#fff", padding:"6px 16px", borderRadius:999, fontWeight:800, fontSize:13, backdropFilter:"blur(8px)" }}>SOLD OUT</div>}
          </div>

          {/* Details */}
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <span style={{ background:"var(--orange-pale)", color:"var(--orange-deep)", padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:700 }}>EVENT DETAILS</span>
              <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:"clamp(28px,3.5vw,44px)", color:"var(--text)", letterSpacing:"-1.5px", margin:"12px 0 0", lineHeight:1.1 }}>{event.title}</h1>
              {event.description&&<p style={{ color:"var(--text2)", lineHeight:1.75, fontSize:15, marginTop:12 }}>{event.description}</p>}
            </div>

            {/* Info cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[{e:"📅",l:"Date & Time",v:`${event.date} · ${event.time}`},{e:"📍",l:"Location",v:event.location},{e:"👥",l:"Total Capacity",v:`${event.capacity} people`},{e:"🪑",l:"Available",v:event.remainingSeats>0?`${event.remainingSeats} seats left`:"Sold Out"}].map(({e,l,v},i)=>(
                <div key={i} style={{ background:"#fff", borderRadius:14, padding:"14px 16px", border:"1px solid rgba(249,115,22,0.08)", boxShadow:"0 2px 10px rgba(249,115,22,0.05)" }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{e}</div>
                  <div style={{ fontSize:11, fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:3 }}>{l}</div>
                  <div style={{ fontWeight:600, fontSize:13, color:l==="Available"&&event.remainingSeats===0?"#FB7185":"var(--text)" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div style={{ background:"linear-gradient(135deg,#FFF7ED,#FFF0E0)", borderRadius:16, padding:"20px 24px", border:"1.5px solid rgba(249,115,22,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"var(--orange-deep)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4 }}>Per Ticket</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontWeight:520, fontSize:25, color:"var(--orange)", letterSpacing:"-1px" }}>PKR {event.price}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4 }}>Total</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontWeight:520, fontSize:25, color:"var(--text)", letterSpacing:"-1px" }}>PKR {event.price*quantity}</div>
              </div>
            </div>

            {/* Quantity */}
            {!soldOut&&!success&&(
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--text2)" }}>Tickets:</span>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:"#fff", borderRadius:12, border:"2px solid rgba(249,115,22,0.2)", overflow:"hidden" }}>
                  <button onClick={()=>setQuantity(q=>Math.max(1,q-1))} style={{ width:42, height:42, background:"transparent", color:"var(--orange)", fontSize:20, cursor:"pointer", borderRight:"2px solid rgba(249,115,22,0.1)", transition:"background 0.2s", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700 }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--orange-pale)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>−</button>
                  <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:22, color:"var(--text)", width:48, textAlign:"center" }}>{quantity}</span>
                  <button onClick={()=>setQuantity(q=>Math.min(event.remainingSeats,q+1))} style={{ width:42, height:42, background:"transparent", color:"var(--orange)", fontSize:20, cursor:"pointer", borderLeft:"2px solid rgba(249,115,22,0.1)", transition:"background 0.2s", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700 }}
                    onMouseEnter={e=>e.currentTarget.style.background="var(--orange-pale)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>+</button>
                </div>
              </div>
            )}

            {message&&<div style={{ padding:"12px 16px", background:"#FEF2F2", border:"1.5px solid #FECACA", borderRadius:12, color:"#DC2626", fontWeight:600, fontSize:13 }}>⚠️ {message}</div>}

            {!success&&(
              <button onClick={handleBooking} disabled={soldOut||booking} style={{
                padding:"15px", borderRadius:14, fontWeight:800, fontSize:15, border:"none",
                background:soldOut?"#F3F4F6":"linear-gradient(135deg,var(--orange),var(--orange-deep))",
                color:soldOut?"#9CA3AF":"#fff",
                boxShadow:soldOut?"none":"0 6px 28px rgba(249,115,22,0.35)",
                cursor:soldOut?"not-allowed":"pointer", transition:"all 0.25s",
              }}
              onMouseEnter={e=>{if(!soldOut&&!booking){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(249,115,22,0.45)";}}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
                {booking?"Processing...":soldOut?"Sold Out":`🎟️ Book ${quantity} Ticket${quantity>1?"s":""} — PKR ${event.price*quantity}`}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


