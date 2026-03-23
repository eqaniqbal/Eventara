import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import DashNav from "../components/DashNav";
import eventBg from "../assets/event.jpg";

export default function UserDashboard() {
  const navigate=useNavigate();
  const [activeTab,setActiveTab]=useState("events");
  const [events,setEvents]=useState([]); const [filteredEvents,setFilteredEvents]=useState([]);
  const [bookings,setBookings]=useState([]); const [search,setSearch]=useState("");
  const [loadingBookings,setLoadingBookings]=useState(false);
  const [showModal,setShowModal]=useState(false); const [currentBooking,setCurrentBooking]=useState(null); const [cancelReason,setCancelReason]=useState("");
  const user=JSON.parse(localStorage.getItem("user")); const userId=user?.id; const userName=user?.name||"Friend";
  const BACKEND_URL="http://localhost:8000";

  useEffect(()=>{ fetch(`${BACKEND_URL}/events`).then(r=>r.json()).then(d=>{ const m=d.events.map(e=>({id:e.id,title:e.title,date:e.date,time:e.time,location:e.location,capacity:e.capacity,remainingSeats:e.remaining_seats,price:e.price,image:e.banner_url?`${BACKEND_URL}${e.banner_url}`:eventBg})); setEvents(m);setFilteredEvents(m); }).catch(console.error); },[]);
  useEffect(()=>{ if(!userId)return; const load=()=>{ setLoadingBookings(true); fetch(`${BACKEND_URL}/bookings/${userId}`).then(r=>r.json()).then(d=>{ setBookings((d.bookings||[]).map(b=>({...b,image:b.banner_url?`${BACKEND_URL}${b.banner_url}`:eventBg}))); }).catch(console.error).finally(()=>setLoadingBookings(false)); }; load(); const iv=setInterval(load,10000); return()=>clearInterval(iv); },[userId]);

  const handleSearch=()=>{ const q=search.toLowerCase(); setFilteredEvents(events.filter(ev=>ev.title.toLowerCase().includes(q)||ev.location.toLowerCase().includes(q))); };
  const handleCancel=(b)=>{ const diff=Math.ceil((new Date(b.date)-new Date())/(864e5)); if(diff<=2){alert("Cannot cancel within 2 days of event.");return;} setCurrentBooking(b);setCancelReason("");setShowModal(true); };
  const submitCancel=async()=>{ if(!cancelReason)return alert("Please enter a reason"); const fd=new FormData(); fd.append("reason",cancelReason); const res=await fetch(`${BACKEND_URL}/bookings/cancel-request/${currentBooking.id}`,{method:"POST",body:fd}); if(!res.ok){const e=await res.json();alert(e.detail||"Failed");return;} setBookings(p=>p.map(b=>b.id===currentBooking.id?{...b,status:"pending"}:b)); setShowModal(false);alert("Cancel request sent! 📩"); };

  const statusCfg={ booked:{l:"Confirmed ✅",bg:"#F0FDF4",c:"#16A34A"}, pending:{l:"Pending ⏳",bg:"#FFFBEB",c:"#D97706"}, cancelled:{l:"Cancelled",bg:"#F9FAFB",c:"#6B7280"}, rejected:{l:"Rejected",bg:"#FEF2F2",c:"#DC2626"} };
  const tabs=[{id:"events",label:"🎟️ Browse Events"},{id:"bookings",label:"📋 My Bookings",count:bookings.length}];

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <DashNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} userName={userName} role="Member" onLogout={()=>{localStorage.removeItem("user");navigate("/");}} />

      <main style={{ padding:"36px 40px", maxWidth:1400, margin:"0 auto" }}>
        {/* Welcome Banner */}
        <div style={{
          marginBottom:36, padding:"28px 36px", borderRadius:24, overflow:"hidden", position:"relative",
          background:"linear-gradient(135deg,var(--orange),var(--coral),var(--amber))",
          backgroundSize:"200% 200%", animation:"gradMove 6s ease infinite",
          boxShadow:"0 8px 40px rgba(249,115,22,0.22)",
        }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
          <div style={{ position:"absolute", bottom:-40, right:100, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:1 }}>
            <div>
              <h2 style={{ fontFamily:"'Fraunces',serif", color:"#fff", fontSize:28, fontWeight:700, margin:"0 0 6px", letterSpacing:"-0.5px" }}>
                Hey {userName.split(" ")[0]}! 👋 Ready to explore?
              </h2>
              <p style={{ color:"rgba(255,255,255,0.85)", margin:0, fontSize:15 }}>
                {activeTab==="events"?`${events.length} amazing events waiting for you!`:`You have ${bookings.length} booking${bookings.length!==1?"s":""}`}
              </p>
            </div>
            <div style={{ display:"flex", gap:12 }}>
              {[["🎟️","Events",events.length],["📋","Bookings",bookings.length]].map(([e,l,v])=>(
                <div key={l} style={{ background:"rgba(255,255,255,0.18)", backdropFilter:"blur(10px)", borderRadius:16, padding:"14px 20px", textAlign:"center" }}>
                  <div style={{ fontSize:20, marginBottom:2 }}>{e}</div>
                  <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:26, color:"#fff" }}>{v}</div>
                  <div style={{ color:"rgba(255,255,255,0.8)", fontSize:11, fontWeight:600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events Tab */}
        {activeTab==="events"&&(
          <>
            <div style={{ display:"flex", gap:10, marginBottom:28 }}>
              <input type="text" placeholder="🔍 Search events by name or city..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()}
                style={{ flex:1, padding:"13px 18px", borderRadius:12, border:"2px solid rgba(249,115,22,0.15)", fontSize:14, background:"#fff", color:"var(--text)", transition:"all 0.2s" }}
                onFocus={e=>{e.target.style.borderColor="var(--orange)";e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.1)";}}
                onBlur={e=>{e.target.style.borderColor="rgba(249,115,22,0.15)";e.target.style.boxShadow="none";}} />
              <button onClick={handleSearch} style={{ padding:"13px 28px", borderRadius:12, fontWeight:700, fontSize:14, background:"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(249,115,22,0.3)", cursor:"pointer", transition:"all 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>Search</button>
            </div>
            {filteredEvents.length>0?(
              <div style={{ display:"flex", flexWrap:"wrap", gap:24 }}>
                {filteredEvents.map(ev=><EventCard key={ev.id} {...ev} onClick={()=>navigate(`/bookingdetails/${ev.id}/${userId}`)} />)}
              </div>
            ):(
              <div style={{ textAlign:"center", padding:"80px 0" }}>
                <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
                <h3 style={{ fontFamily:"'Fraunces',serif", color:"var(--text2)", marginBottom:8 }}>No events found</h3>
                <p style={{ color:"var(--text3)" }}>Try searching with different keywords</p>
              </div>
            )}
          </>
        )}

        {/* Bookings Tab */}
        {activeTab==="bookings"&&(
          loadingBookings?(
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ width:44, height:44, border:"3px solid var(--orange)", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 16px" }} />
              <p style={{ color:"var(--text3)", fontWeight:500 }}>Loading your bookings...</p>
            </div>
          ):bookings.length===0?(
            <div style={{ textAlign:"center", padding:"80px 0" }}>
              <div style={{ fontSize:64, marginBottom:16 }}>🎟️</div>
              <h3 style={{ fontFamily:"'Fraunces',serif", color:"var(--text)", fontSize:28, marginBottom:10 }}>No bookings yet!</h3>
              <p style={{ color:"var(--text3)", marginBottom:28, fontSize:15 }}>Go explore events and book your first experience 🎉</p>
              <button onClick={()=>setActiveTab("events")} style={{ padding:"13px 32px", borderRadius:12, fontWeight:700, fontSize:15, background:"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:"#fff", border:"none", boxShadow:"0 4px 16px rgba(249,115,22,0.3)", cursor:"pointer" }}>Browse Events →</button>
            </div>
          ):(
            <div style={{ display:"flex", flexWrap:"wrap", gap:24 }}>
              {bookings.map(b=>{
                const canCancel=Math.ceil((new Date(b.date)-new Date())/864e5)>2&&b.status==="booked";
                const sc=statusCfg[b.status]||statusCfg.booked;
                const btnTxt=b.status==="pending"?"⏳ Pending Approval":b.status==="cancelled"?"Cancelled":b.status==="rejected"?"Rejected":"Cancel Booking";
                return <EventCard key={b.id} title={b.title} date={b.date} time={b.time} location={b.location} image={b.image||eventBg} showCapacity={false}
                  actionButton={
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 12px", borderRadius:999, background:sc.bg, width:"fit-content" }}>
                        <span style={{ fontSize:12, fontWeight:700, color:sc.c }}>{sc.l}</span>
                      </div>
                      <button onClick={()=>handleCancel(b)} disabled={!canCancel} style={{ padding:"10px", borderRadius:10, fontWeight:700, fontSize:13, border:canCancel?"1.5px solid rgba(251,113,133,0.4)":"1.5px solid #E5E7EB", background:canCancel?"rgba(251,113,133,0.06)":"transparent", color:canCancel?"#FB7185":"#9CA3AF", cursor:canCancel?"pointer":"not-allowed", transition:"all 0.2s" }}
                        onMouseEnter={e=>{if(canCancel){e.currentTarget.style.background="rgba(251,113,133,0.12)";}}}
                        onMouseLeave={e=>{if(canCancel){e.currentTarget.style.background="rgba(251,113,133,0.06)";}}}>
                        {btnTxt}
                      </button>
                    </div>
                  } />;
              })}
            </div>
          )
        )}
      </main>

      {/* Cancel Modal */}
      {showModal&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(28,20,16,0.5)", backdropFilter:"blur(8px)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999, animation:"fadeIn 0.2s ease" }}>
          <div style={{ background:"#fff", borderRadius:24, padding:36, width:"min(440px,92vw)", boxShadow:"0 24px 80px rgba(249,115,22,0.18)", animation:"scaleIn 0.25s ease" }}>
            <div style={{ fontSize:40, textAlign:"center", marginBottom:12 }}>😔</div>
            <h3 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:24, color:"var(--text)", marginBottom:8, textAlign:"center" }}>Cancel Booking</h3>
            <p style={{ color:"var(--text3)", fontSize:14, textAlign:"center", marginBottom:24 }}>Sorry to hear that! Please share your reason so we can help improve.</p>
            <textarea placeholder="Why are you cancelling? (e.g. schedule conflict, plans changed...)" value={cancelReason} onChange={e=>setCancelReason(e.target.value)} rows={4}
              style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:"2px solid rgba(249,115,22,0.2)", fontSize:14, resize:"none", boxSizing:"border-box", color:"var(--text)", marginBottom:20, fontFamily:"'Plus Jakarta Sans',sans-serif" }}
              onFocus={e=>{e.target.style.borderColor="var(--orange)";e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.1)";}}
              onBlur={e=>{e.target.style.borderColor="rgba(249,115,22,0.2)";e.target.style.boxShadow="none";}} />
            <div style={{ display:"flex", gap:12 }}>
              <button onClick={()=>setShowModal(false)} style={{ flex:1, padding:13, borderRadius:12, border:"2px solid rgba(249,115,22,0.2)", background:"transparent", color:"var(--text2)", fontWeight:700, fontSize:14, cursor:"pointer" }}>Keep Booking</button>
              <button onClick={submitCancel} style={{ flex:1, padding:13, borderRadius:12, border:"none", background:"linear-gradient(135deg,#FB7185,#F43F5E)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:"0 4px 16px rgba(251,113,133,0.35)" }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
