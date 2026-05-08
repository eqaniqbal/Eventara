import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [errors,setErrors]=useState({name:"",email:"",password:""}); const [loading,setLoading]=useState(false); const [focus,setFocus]=useState("");
  const navigate=useNavigate();
  const validate=()=>{let v=true,e={name:"",email:"",password:""};if(!name.trim()){e.name="Required";v=false;}if(!email){e.email="Required";v=false;}else if(!/\S+@\S+\.\S+/.test(email)){e.email="Invalid email";v=false;}if(!password){e.password="Required";v=false;}else if(password.length<6){e.password="Min 6 characters";v=false;}setErrors(e);return v;};
  const handleSubmit=async(ev)=>{ev.preventDefault();if(!validate())return;setLoading(true);try{const res=await fetch("http://47.128.219.68:9000/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});const data=await res.json();if(!res.ok){alert(data.detail||"Registration failed");setLoading(false);return;}alert("Welcome to Eventara! 🎉");navigate("/login");}catch(err){alert("Server error: "+err.message);}finally{setLoading(false);}};

  const inp=field=>({width:"100%",padding:"13px 16px",borderRadius:12,border:`2px solid ${focus===field?"var(--orange)":errors[field]?"#FB7185":"rgba(249,115,22,0.15)"}`,fontSize:15,background:focus===field?"#FFFBF7":"#fff",color:"var(--text)",boxShadow:focus===field?"0 0 0 4px rgba(249,115,22,0.1)":"none",transition:"all 0.2s",boxSizing:"border-box"});

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"linear-gradient(160deg,#FFF0F5,#fff,#FFF7ED)" }}>
      {/* Left branding */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 5%", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"8%", left:"5%", width:280, height:280, borderRadius:"40% 60% 70% 30%/40% 70% 30% 60%", background:"linear-gradient(135deg,#FBCFE8,#F9A8D4)", opacity:0.45, animation:"blobMove 10s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"8%", right:"5%", width:220, height:220, borderRadius:"50%", background:"linear-gradient(135deg,#FED7AA,#FDBA74)", opacity:0.5, animation:"float2 8s ease-in-out infinite" }} />
        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:400 }}>
          <div style={{ fontSize:72, marginBottom:20 }}>🎊</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:40, color:"var(--text)", letterSpacing:"-1.5px", marginBottom:16 }}>
            Join the fun,<br /><em style={{ color:"var(--orange)", fontWeight:300 }}>it's free!</em>
          </h2>
          <p style={{ color:"var(--text2)", fontSize:16, lineHeight:1.75, marginBottom:32 }}>Create your account and start discovering amazing events happening all around you.</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {["✅ Free to join","🎟️ Instant booking","🔒 Secure payments","↩️ Cancel anytime"].map((p,i)=>(
              <div key={i} style={{ padding:"10px 14px", background:"white", borderRadius:10, fontSize:13, fontWeight:600, color:"var(--text2)", boxShadow:"0 2px 10px rgba(249,115,22,0.07)", textAlign:"left" }}>{p}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ width:"min(480px,100%)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 48px", background:"#fff", boxShadow:"-4px 0 40px rgba(249,115,22,0.07)" }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:24, color:"var(--orange)", marginBottom:44, display:"block" }}>Eventara ✨</Link>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:34, color:"var(--text)", marginBottom:6, letterSpacing:"-1px" }}>Create Account ✨</h1>
        <p style={{ color:"var(--text3)", marginBottom:36, fontSize:15 }}>Already have one? <Link to="/login" style={{ color:"var(--orange)", fontWeight:700 }}>Sign in →</Link></p>
        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
          {[{l:"Full Name",f:"name",t:"text",ph:"Your full name",v:name,s:setName},{l:"Email Address",f:"email",t:"email",ph:"you@example.com",v:email,s:setEmail},{l:"Password",f:"password",t:"password",ph:"Min. 6 characters",v:password,s:setPassword}].map(({l,f,t,ph,v,s})=>(
            <div key={f}>
              <label style={{ fontSize:13, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:8 }}>{l}</label>
              <input type={t} placeholder={ph} value={v} onChange={e=>s(e.target.value)} onFocus={()=>setFocus(f)} onBlur={()=>setFocus("")} style={inp(f)} />
              {errors[f] && <p style={{ color:"#FB7185", fontSize:12, marginTop:5, fontWeight:500 }}>⚠ {errors[f]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ marginTop:8, padding:"14px", borderRadius:12, fontWeight:800, fontSize:15, background:loading?"#e5e7eb":"linear-gradient(135deg,var(--orange),var(--orange-deep))", color:loading?"#9ca3af":"#fff", border:"none", boxShadow:loading?"none":"0 6px 24px rgba(249,115,22,0.35)", transition:"all 0.25s" }}
          onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(249,115,22,0.45)";}}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";}}>
            {loading ? "Creating Account..." : "Create Account 🎉"}
          </button>
        </form>
        <p style={{ marginTop:24, fontSize:13, color:"var(--text3)", textAlign:"center" }}><Link to="/" style={{ color:"var(--orange)", fontWeight:600 }}>← Back to Home</Link></p>
      </div>
    </div>
  );
}
