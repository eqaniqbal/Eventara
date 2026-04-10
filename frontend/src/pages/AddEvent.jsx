import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddEvent() {
  const navigate=useNavigate();
  const [fields,setFields]=useState({title:"",description:"",date:"",time:"",location:"",capacity:"",price:""});
  const [image,setImage]=useState(null); const [loading,setLoading]=useState(false); const [focus,setFocus]=useState("");
  const set=k=>e=>setFields(p=>({...p,[k]:e.target.value}));

  const handleSubmit=async(e)=>{ e.preventDefault(); const{title,date,time,location,capacity,price}=fields; if(!title||!date||!time||!location||!capacity||!price)return alert("All fields are required."); if(new Date(date)<new Date(new Date().toDateString()))return alert("Event date cannot be in the past."); if(Number(capacity)<=0)return alert("Capacity must be > 0."); if(Number(price)<0)return alert("Price cannot be negative."); setLoading(true); const su=JSON.parse(localStorage.getItem("user")); const hostId=su?.id; if(!hostId){alert("Not logged in.");setLoading(false);return;} const fd=new FormData(); Object.entries({...fields,host_id:hostId}).forEach(([k,v])=>fd.append(k,v)); if(image)fd.append("image",image); try{ const res=await fetch("http://98.93.67.65:8000/events",{method:"POST",body:fd}); const data=await res.json(); if(!res.ok)alert(data.detail||"Failed to create event."); else{alert("Event created! 🎉");navigate("/ownerdashboard",{state:{refresh:true}});} }catch{alert("Server error");} setLoading(false); };

  const inp=k=>({ width:"100%", padding:"12px 16px", borderRadius:12, border:`2px solid ${focus===k?"var(--orange)":"rgba(249,115,22,0.15)"}`, fontSize:14, background:focus===k?"#FFFBF7":"#fff", color:"var(--text)", boxShadow:focus===k?"0 0 0 4px rgba(249,115,22,0.08)":"none", transition:"all 0.2s", boxSizing:"border-box" });

  const flds=[{l:"Event Title",k:"title",t:"text",p:"Give your event a great name!"},{l:"Location",k:"location",t:"text",p:"City, venue name"},{l:"Date",k:"date",t:"date"},{l:"Time",k:"time",t:"time"},{l:"Capacity",k:"capacity",t:"number",p:"Max attendees"},{l:"Ticket Price (PKR)",k:"price",t:"number",p:"0 for free events"}];

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <header style={{ background:"#fff", borderBottom:"1px solid rgba(249,115,22,0.1)", padding:"0 40px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 12px rgba(249,115,22,0.06)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:22, color:"var(--orange)" }}>Eventara ✨</div>
        <button onClick={()=>navigate("/ownerdashboard",{state:{refresh:true}})} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid rgba(249,115,22,0.2)", background:"transparent", color:"var(--text2)", fontWeight:600, fontSize:13, cursor:"pointer" }}>← Back to Dashboard</button>
      </header>

      <main style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ marginBottom:36 }}>
          <span style={{ background:"var(--orange-pale)", color:"var(--orange-deep)", padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:700 }}>NEW EVENT</span>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:42, color:"var(--text)", letterSpacing:"-1.5px", margin:"12px 0 6px" }}>Create an Event 🎉</h1>
          <p style={{ color:"var(--text3)", fontSize:15 }}>Fill in the details and go live instantly.</p>
        </div>

        <div style={{ background:"#fff", borderRadius:24, padding:40, boxShadow:"0 4px 24px rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.08)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              {flds.map(({l,k,t,p})=>(
                <div key={k}>
                  <label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>{l}</label>
                  <input type={t} placeholder={p} value={fields[k]} onChange={set(k)} onFocus={()=>setFocus(k)} onBlur={()=>setFocus("")} min={t==="number"?"0":undefined} style={inp(k)} required />
                </div>
              ))}
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>Description</label>
              <textarea placeholder="Tell people what makes this event special! What can they expect? 🌟" value={fields.description} onChange={set("description")} onFocus={()=>setFocus("description")} onBlur={()=>setFocus("")} rows={4} style={{ ...inp("description"), resize:"vertical" }} />
            </div>
            <div style={{ marginBottom:36 }}>
              <label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>Event Banner Image</label>
              {/* 📁 IMAGE NOTE: Place images in src/assets/ OR let users upload via the file input below */}
              <div style={{ border:"2px dashed rgba(249,115,22,0.25)", borderRadius:14, padding:"28px 20px", textAlign:"center", background:"var(--orange-pale)", cursor:"pointer", position:"relative", transition:"all 0.2s" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--orange)";e.currentTarget.style.background="var(--orange-soft)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(249,115,22,0.25)";e.currentTarget.style.background="var(--orange-pale)";}}>
                <div style={{ fontSize:36, marginBottom:8 }}>🖼️</div>
                <p style={{ fontWeight:700, color:image?"var(--orange-deep)":"var(--text2)", margin:0, fontSize:14 }}>{image?`✅ PKR {image.name}`:"Click to upload event banner"}</p>
                <p style={{ color:"var(--text3)", fontSize:12, marginTop:4 }}>PNG, JPG — Backend stores in uploads folder</p>
                <input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer" }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width:"100%", padding:"15px", borderRadius:14, fontWeight:800, fontSize:16, background:loading?"#E5E7EB":"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:loading?"#9CA3AF":"#fff", border:"none", boxShadow:loading?"none":"0 6px 28px rgba(249,115,22,0.35)", cursor:loading?"default":"pointer", transition:"all 0.25s" }}
              onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(249,115,22,0.45)";}}}
              onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
              {loading?"Creating your event...":"🚀 Create Event"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
