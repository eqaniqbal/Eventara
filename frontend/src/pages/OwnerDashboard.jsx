import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashNav from "../components/DashNav";
import defaultEventImg from "../assets/event.jpg";

export default function OwnerDashboard() {
  const navigate=useNavigate(); const location=useLocation();
  const [reservations,setReservations]=useState([]); const [events,setEvents]=useState([]);
  const [activeTab,setActiveTab]=useState("events"); const [searchQuery,setSearchQuery]=useState("");
  const [cancelRequests,setCancelRequests]=useState([]);
  const BACKEND_URL="http://47.128.219.68:9000";
  const ownerId=Number(localStorage.getItem("ownerId"));
  const user=JSON.parse(localStorage.getItem("user")); const ownerName=user?.name||"Owner";

  const fetchEvents=()=>fetch(`${BACKEND_URL}/events`).then(r=>r.json()).then(d=>{ const m=d.events.filter(e=>e.host_id===ownerId); setEvents(m); }).catch(console.error);
  useEffect(()=>{ if(!ownerId){alert("Please login again.");navigate("/login");return;} fetchEvents(); fetch(`${BACKEND_URL}/refunds/pending/${ownerId}`).then(r=>r.json()).then(d=>setCancelRequests(d.requests||[])).catch(console.error); fetch(`${BACKEND_URL}/reservations/owner/${ownerId}`).then(r=>r.json()).then(d=>setReservations(d.reservations||[])).catch(console.error); },[ownerId,navigate]);
  useEffect(()=>{ if(location.state?.refresh){fetchEvents();navigate(location.pathname,{replace:true,state:{}});} },[location.state]);

  const filteredEvents=useMemo(()=>events.filter(ev=>ev.title.toLowerCase().includes(searchQuery.toLowerCase())||ev.location.toLowerCase().includes(searchQuery.toLowerCase())),[searchQuery,events]);
  const approve=async(id)=>{ await fetch(`${BACKEND_URL}/refunds/${id}/approve`,{method:"POST"}).catch(console.error); setCancelRequests(p=>p.filter(r=>r.id!==id)); };
  const reject=async(id)=>{ await fetch(`${BACKEND_URL}/refunds/${id}/reject`,{method:"POST"}).catch(console.error); setCancelRequests(p=>p.filter(r=>r.id!==id)); };
  const deleteEvent=(id)=>{ if(!window.confirm("Delete this event?"))return; fetch(`${BACKEND_URL}/events/${id}`,{method:"DELETE"}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(()=>setEvents(p=>p.filter(e=>e.id!==id))).catch(console.error); };

  const tabs=[{id:"events",label:"🎯 My Events",count:events.length},{id:"reservations",label:"📋 Reservations",count:reservations.length},{id:"cancel",label:"⚠️ Cancel Requests",count:cancelRequests.length}];

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <DashNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} userName={ownerName} role="Event Owner" onLogout={()=>navigate("/")} />

      <main style={{ padding:"36px 40px", maxWidth:1400, margin:"0 auto" }}>
        {/* Banner */}
        <div style={{ marginBottom:36, padding:"28px 36px", borderRadius:24, background:"linear-gradient(135deg,#1C1410,#3A2818)", boxShadow:"0 8px 40px rgba(28,20,16,0.2)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:200, height:200, borderRadius:"50%", background:"rgba(249,115,22,0.12)" }} />
          <div style={{ position:"absolute", bottom:-30, right:120, width:140, height:140, borderRadius:"50%", background:"rgba(251,113,133,0.1)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:1 }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:600, letterSpacing:"1px", textTransform:"uppercase", marginBottom:8 }}>🎯 OWNER CONSOLE</p>
              <h2 style={{ fontFamily:"'Fraunces',serif", color:"#fff", fontSize:28, fontWeight:700, margin:"0 0 6px", letterSpacing:"-0.5px" }}>
                {ownerName.split(" ")[0]}'s Dashboard 🚀
              </h2>
              <p style={{ color:"rgba(255,255,255,0.55)", margin:0, fontSize:14 }}>Manage events · Track reservations · Handle requests</p>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[["🎯","Events",events.length,"#F97316"],["💰","Revenue",reservations.reduce((s,r)=>s+(r.amount_paid||0),0),"#34D399"],["⚠️","Requests",cancelRequests.length,"#FBBF24"]].map(([e,l,v,c])=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.07)", backdropFilter:"blur(10px)", borderRadius:16, padding:"14px 20px", textAlign:"center", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize:20, marginBottom:2 }}>{e}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:26, color:c }}>{l==="Revenue"?`PKR ${v}`:v}</div>
                  <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab==="events"&&(
          <div>
            <div style={{ display:"flex", gap:10, marginBottom:28 }}>
              <input type="text" placeholder="🔍 Search your events..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                style={{ flex:1, padding:"13px 18px", borderRadius:12, border:"2px solid rgba(249,115,22,0.15)", fontSize:14, background:"#fff", color:"var(--text)" }}
                onFocus={e=>{e.target.style.borderColor="var(--orange)";e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.1)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(249,115,22,0.15)";e.target.style.boxShadow="none";}} />
              <button onClick={()=>navigate("/addevent")} style={{ padding:"13px 24px", borderRadius:12, fontWeight:700, fontSize:14, background:"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(249,115,22,0.3)", cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>+ Add Event</button>
            </div>
            {filteredEvents.length===0?(
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:60, marginBottom:16 }}>🎯</div>
                <h3 style={{ fontFamily:"'Fraunces',serif", color:"var(--text)", fontSize:28, marginBottom:10 }}>No events yet!</h3>
                <p style={{ color:"var(--text3)", marginBottom:28 }}>Create your first event and start selling tickets 🎟️</p>
                <button onClick={()=>navigate("/addevent")} style={{ padding:"13px 28px", borderRadius:12, fontWeight:700, fontSize:15, background:"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(249,115,22,0.3)", cursor:"pointer" }}>Create First Event →</button>
              </div>
            ):(
              <div style={{ display:"flex", flexWrap:"wrap", gap:24 }}>
                {filteredEvents.map(ev=>(
                  <div key={ev.id} style={{ width:290, borderRadius:20, overflow:"hidden", background:"#fff", boxShadow:"0 4px 20px rgba(28,20,16,0.08)", border:"1.5px solid rgba(249,115,22,0.06)", transition:"all 0.3s" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 48px rgba(249,115,22,0.14)";e.currentTarget.style.borderColor="rgba(249,115,22,0.2)";}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="0 4px 20px rgba(28,20,16,0.08)";e.currentTarget.style.borderColor="rgba(249,115,22,0.06)";}}>
                    <div style={{ height:160, overflow:"hidden", position:"relative" }}>
                      <img src={ev.banner_url?`${BACKEND_URL}${ev.banner_url}`:defaultEventImg} alt={ev.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(28,20,16,0.4) 0%,transparent 55%)" }} />
                      <div style={{ position:"absolute", top:12, right:12, background:"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", padding:"4px 12px", borderRadius:999, fontSize:12, fontWeight:800 }}>${ev.price}</div>
                    </div>
                    <div style={{ padding:"16px 18px 18px" }}>
                      <h3 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:17, color:"var(--text)", margin:"0 0 10px", letterSpacing:"-0.3px" }}>{ev.title}</h3>
                      <p style={{ fontSize:12, color:"var(--text3)", margin:"0 0 3px" }}>📅 {ev.date}</p>
                      <p style={{ fontSize:12, color:"var(--text3)", margin:"0 0 3px" }}>📍 {ev.location}</p>
                      <p style={{ fontSize:12, color:"var(--text3)", margin:"0 0 14px" }}>👥 {ev.capacity} seats</p>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={()=>navigate(`/updateevent/${ev.id}`)} style={{ flex:1, padding:"9px", borderRadius:9, border:"2px solid rgba(249,115,22,0.2)", background:"var(--orange-pale)", color:"var(--orange-deep)", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>e.currentTarget.style.background="var(--orange-soft)"}
                          onMouseLeave={e=>e.currentTarget.style.background="var(--orange-pale)"}>✏️ Edit</button>
                        <button onClick={()=>deleteEvent(ev.id)} style={{ flex:1, padding:"9px", borderRadius:9, border:"2px solid rgba(251,113,133,0.2)", background:"var(--coral-pale)", color:"#E11D48", fontWeight:700, fontSize:12, cursor:"pointer", transition:"all 0.2s" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#FB7185";e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="var(--coral-pale)";e.currentTarget.style.color="#E11D48";}}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reservations */}
        {activeTab==="reservations"&&(
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:26, color:"var(--text)", marginBottom:24, letterSpacing:"-0.5px" }}>📋 Reservations</h2>
            {reservations.length===0?(
              <div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:48, marginBottom:12 }}>📋</div><p style={{ color:"var(--text3)", fontSize:15 }}>No reservations yet</p></div>
            ):(
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {reservations.map(res=>(
                  <div key={res.id} style={{ background:"#fff", borderRadius:16, padding:"18px 24px", border:"1px solid rgba(249,115,22,0.08)", boxShadow:"0 2px 12px rgba(28,20,16,0.05)", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.2)";e.currentTarget.style.boxShadow="0 6px 24px rgba(249,115,22,0.1)";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.08)";e.currentTarget.style.boxShadow="0 2px 12px rgba(28,20,16,0.05)";}}>
                    <div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:17, color:"var(--text)", marginBottom:4 }}>{res.event_title}</div>
                      <div style={{ fontSize:13, color:"var(--text3)" }}>👤 {res.user_name} · 🎟️ {res.quantity} tickets</div>
                    </div>
                    <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:24, color:"var(--orange)" }}>${res.amount_paid}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancel Requests */}
        {activeTab==="cancel"&&(
          <div>
            <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:26, color:"var(--text)", marginBottom:24, letterSpacing:"-0.5px" }}>⚠️ Cancel Requests</h2>
            {cancelRequests.length===0?(
              <div style={{ textAlign:"center", padding:"60px 0" }}><div style={{ fontSize:48, marginBottom:12 }}>🎉</div><p style={{ color:"var(--text3)", fontSize:15 }}>No pending cancel requests — all clear!</p></div>
            ):(
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {cancelRequests.map(req=>(
                  <div key={req.id} style={{ background:"#fff", borderRadius:16, padding:"20px 24px", border:"1.5px solid rgba(251,191,36,0.25)", boxShadow:"0 2px 12px rgba(28,20,16,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center", gap:20 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:17, color:"var(--text)", marginBottom:4 }}>{req.event_title}</div>
                      <div style={{ fontSize:13, color:"var(--text3)", marginBottom:10 }}>👤 {req.user_name}</div>
                      <div style={{ background:"var(--amber-pale)", borderRadius:10, padding:"8px 14px", borderLeft:"3px solid var(--amber)", fontSize:13, color:"#78350F" }}>
                        📝 <strong>Reason:</strong> {req.reason}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={()=>approve(req.id)} style={{ padding:"10px 20px", borderRadius:10, border:"2px solid rgba(52,211,153,0.3)", background:"rgba(52,211,153,0.08)", color:"#059669", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#34D399";e.currentTarget.style.color="#fff";e.currentTarget.style.boxShadow="0 4px 14px rgba(52,211,153,0.35)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(52,211,153,0.08)";e.currentTarget.style.color="#059669";e.currentTarget.style.boxShadow="none";}}>✓ Approve</button>
                      <button onClick={()=>reject(req.id)} style={{ padding:"10px 20px", borderRadius:10, border:"2px solid rgba(251,113,133,0.3)", background:"rgba(251,113,133,0.08)", color:"#E11D48", fontWeight:700, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}
                        onMouseEnter={e=>{e.currentTarget.style.background="#FB7185";e.currentTarget.style.color="#fff";e.currentTarget.style.boxShadow="0 4px 14px rgba(251,113,133,0.35)";}}
                        onMouseLeave={e=>{e.currentTarget.style.background="rgba(251,113,133,0.08)";e.currentTarget.style.color="#E11D48";e.currentTarget.style.boxShadow="none";}}>✕ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
