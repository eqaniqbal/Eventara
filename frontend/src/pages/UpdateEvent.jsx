import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateEvent() {
  const navigate=useNavigate(); const{id}=useParams(); const BACKEND_URL="http://47.128.219.68:9000";
  const[fields,setFields]=useState({title:"",description:"",date:"",time:"",location:"",capacity:"",price:""});
  const[image,setImage]=useState(null); const[loading,setLoading]=useState(false); const[fetching,setFetching]=useState(true); const[focus,setFocus]=useState("");
  const set=k=>e=>setFields(p=>({...p,[k]:e.target.value}));
  useEffect(()=>{ fetch(`${BACKEND_URL}/events`).then(r=>r.json()).then(d=>{ const ev=d.events.find(e=>e.id.toString()===id); if(ev)setFields({title:ev.title||"",description:ev.description||"",date:ev.date||"",time:ev.time||"",location:ev.location||"",capacity:ev.capacity||"",price:ev.price||""}); setFetching(false); }).catch(()=>setFetching(false)); },[id]);
  const handleSubmit=async(e)=>{ e.preventDefault(); setLoading(true); const fd=new FormData(); Object.entries(fields).forEach(([k,v])=>fd.append(k,v)); if(image)fd.append("image",image); try{ const res=await fetch(`${BACKEND_URL}/events/${id}`,{method:"PUT",body:fd}); const data=await res.json(); if(!res.ok)alert(data.detail||"Failed to update."); else{alert("Event updated! ✅");navigate("/ownerdashboard",{state:{refresh:true}});} }catch{alert("Server error");} setLoading(false); };

  const inp=k=>({width:"100%",padding:"12px 16px",borderRadius:12,border:`2px solid ${focus===k?"var(--orange)":"rgba(249,115,22,0.15)"}`,fontSize:14,background:focus===k?"#FFFBF7":"#fff",color:"var(--text)",boxShadow:focus===k?"0 0 0 4px rgba(249,115,22,0.08)":"none",transition:"all 0.2s",boxSizing:"border-box"});
  const flds=[{l:"Event Title",k:"title",t:"text",p:"Event name"},{l:"Location",k:"location",t:"text",p:"City, venue"},{l:"Date",k:"date",t:"date"},{l:"Time",k:"time",t:"time"},{l:"Capacity",k:"capacity",t:"number",p:"Max attendees"},{l:"Ticket Price (PKR)",k:"price",t:"number",p:"0 for free"}];

  if(fetching)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--cream)"}}><div style={{width:44,height:44,border:"3px solid var(--orange)",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/></div>);

  return (
    <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <header style={{ background:"#fff", borderBottom:"1px solid rgba(249,115,22,0.1)", padding:"0 40px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 2px 12px rgba(249,115,22,0.06)", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:22, color:"var(--orange)" }}>Eventara ✨</div>
        <button onClick={()=>navigate("/ownerdashboard")} style={{ padding:"8px 18px", borderRadius:10, border:"1.5px solid rgba(249,115,22,0.2)", background:"transparent", color:"var(--text2)", fontWeight:600, fontSize:13, cursor:"pointer" }}>← Back</button>
      </header>
      <main style={{ maxWidth:720, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ marginBottom:36 }}>
          <span style={{ background:"var(--orange-pale)", color:"var(--orange-deep)", padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:700 }}>EDIT EVENT</span>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:42, color:"var(--text)", letterSpacing:"-1.5px", margin:"12px 0 6px" }}>Update Event ✏️</h1>
          <p style={{ color:"var(--text3)", fontSize:15 }}>Make your changes and save to update the listing.</p>
        </div>
        <div style={{ background:"#fff", borderRadius:24, padding:40, boxShadow:"0 4px 24px rgba(249,115,22,0.08)", border:"1px solid rgba(249,115,22,0.08)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
              {flds.map(({l,k,t,p})=>(<div key={k}><label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>{l}</label><input type={t} placeholder={p} value={fields[k]} onChange={set(k)} onFocus={()=>setFocus(k)} onBlur={()=>setFocus("")} min={t==="number"?"0":undefined} style={inp(k)} /></div>))}
            </div>
            <div style={{ marginBottom:20 }}><label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>Description</label><textarea placeholder="Describe your event..." value={fields.description} onChange={set("description")} onFocus={()=>setFocus("description")} onBlur={()=>setFocus("")} rows={4} style={{...inp("description"),resize:"vertical"}} /></div>
            <div style={{ marginBottom:32 }}><label style={{ fontSize:12, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.3px" }}>New Banner (Optional)</label><div style={{ border:"2px dashed rgba(249,115,22,0.25)", borderRadius:14, padding:"24px 20px", textAlign:"center", background:"var(--orange-pale)", cursor:"pointer", position:"relative" }}><div style={{ fontSize:28, marginBottom:6 }}>🖼️</div><p style={{ fontWeight:700, color:image?"var(--orange-deep)":"var(--text2)", margin:0, fontSize:14 }}>{image?`✅ ${image.name}`:"Upload a new banner image"}</p><input type="file" accept="image/*" onChange={e=>setImage(e.target.files[0])} style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer" }} /></div></div>
            <button type="submit" disabled={loading} style={{ width:"100%", padding:"15px", borderRadius:14, fontWeight:800, fontSize:16, background:loading?"#E5E7EB":"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:loading?"#9CA3AF":"#fff", border:"none", boxShadow:loading?"none":"0 6px 28px rgba(249,115,22,0.35)", cursor:loading?"default":"pointer", transition:"all 0.25s" }}>
              {loading?"Saving changes...":"💾 Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
