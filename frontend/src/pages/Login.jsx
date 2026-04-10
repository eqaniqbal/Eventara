import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [errors,setErrors]=useState({email:"",password:""}); const [loading,setLoading]=useState(false); const [focus,setFocus]=useState("");
  const navigate = useNavigate();

  const validate=()=>{let v=true,e={email:"",password:""};if(!email){e.email="Required";v=false;}else if(!/\S+@\S+\.\S+/.test(email)){e.email="Invalid email";v=false;}if(!password){e.password="Required";v=false;}setErrors(e);return v;};
  const handleSubmit=async(ev)=>{ev.preventDefault();if(!validate())return;setLoading(true);try{const res=await fetch("http://98.93.67.65:8000/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const data=await res.json();if(!res.ok){alert(data.detail||"Invalid credentials");setLoading(false);return;}localStorage.setItem("user",JSON.stringify(data.user));if(data.user.role==="owner"){localStorage.setItem("ownerId",data.user.id);navigate("/ownerdashboard");}else{localStorage.setItem("userId",data.user.id);navigate("/userdashboard");}}catch(err){alert("Server error: "+err.message);}finally{setLoading(false);}};

  const inp = field => ({
    width:"100%", padding:"13px 16px", borderRadius:12,
    border:`2px solid ${focus===field?"var(--orange)":errors[field]?"#FB7185":"rgba(249,115,22,0.15)"}`,
    fontSize:15, background: focus===field?"#FFFBF7":"#fff", color:"var(--text)",
    boxShadow: focus===field?"0 0 0 4px rgba(249,115,22,0.1)":"none",
    transition:"all 0.2s", boxSizing:"border-box",
  });

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"linear-gradient(160deg,#FFF7ED,#fff,#FFF0F5)" }}>
      {/* Left — form */}
      <div style={{ width:"min(480px,100%)", display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px 48px", background:"#fff", boxShadow:"4px 0 40px rgba(249,115,22,0.07)" }}>
        <Link to="/" style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:24, color:"var(--orange)", marginBottom:44, display:"block" }}>Eventara ✨</Link>
        <h1 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:36, color:"var(--text)", marginBottom:6, letterSpacing:"-1px" }}>Welcome back! 👋</h1>
        <p style={{ color:"var(--text3)", marginBottom:36, fontSize:15 }}>Don't have an account? <Link to="/register" style={{ color:"var(--orange)", fontWeight:700 }}>Sign up free →</Link></p>

        <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {[{l:"Email address",f:"email",t:"email",ph:"you@example.com",v:email,s:setEmail},{l:"Password",f:"password",t:"password",ph:"Your password",v:password,s:setPassword}].map(({l,f,t,ph,v,s})=>(
            <div key={f}>
              <label style={{ fontSize:13, fontWeight:700, color:"var(--text2)", display:"block", marginBottom:8 }}>{l}</label>
              <input type={t} placeholder={ph} value={v} onChange={e=>s(e.target.value)} onFocus={()=>setFocus(f)} onBlur={()=>setFocus("")} style={inp(f)} />
              {errors[f] && <p style={{ color:"#FB7185", fontSize:12, marginTop:5, fontWeight:500 }}>⚠ {errors[f]}</p>}
            </div>
          ))}
          <button type="submit" disabled={loading} style={{
            marginTop:8, padding:"14px", borderRadius:12, fontWeight:800, fontSize:15,
            background:loading?"#e5e7eb":"linear-gradient(135deg,var(--orange),var(--orange-deep))",
            color:loading?"#9ca3af":"#fff", border:"none",
            boxShadow:loading?"none":"0 6px 24px rgba(249,115,22,0.35)", transition:"all 0.25s",
          }}
          onMouseEnter={e=>{if(!loading){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(249,115,22,0.45)";}}}
          onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=loading?"none":"0 6px 24px rgba(249,115,22,0.35)";}}>
            {loading ? "Signing in..." : "Sign In 🚀"}
          </button>
        </form>
        <p style={{ marginTop:28, fontSize:13, color:"var(--text3)", textAlign:"center" }}>
          <Link to="/" style={{ color:"var(--orange)", fontWeight:600 }}>← Back to Home</Link>
        </p>
      </div>

      {/* Right — branding */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", padding:"60px 5%", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"10%", right:"5%", width:300, height:300, borderRadius:"60% 40% 30% 70%/60% 30% 70% 40%", background:"linear-gradient(135deg,#FED7AA,#FDBA74)", opacity:0.5, animation:"blobMove 9s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"10%", left:"5%", width:200, height:200, borderRadius:"50%", background:"linear-gradient(135deg,#BAE6FD,#7DD3FC)", opacity:0.45, animation:"float 7s ease-in-out infinite" }} />
        <div style={{ position:"relative", zIndex:1, textAlign:"center", maxWidth:420 }}>
          <div style={{ fontSize:72, marginBottom:20 }}>🎉</div>
          <h2 style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:40, color:"var(--text)", letterSpacing:"-1.5px", marginBottom:16 }}>
            Great events<br /><em style={{ color:"var(--orange)", fontWeight:300 }}>start here</em>
          </h2>
          <p style={{ color:"var(--text2)", fontSize:16, lineHeight:1.75, marginBottom:36 }}>From cosy workshops to massive festivals — discover and book events you'll never forget.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {["🎟️ Instant ticket booking","📍 Events across Pakistan","⭐ 98% satisfaction rate"].map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 18px", background:"white", borderRadius:12, boxShadow:"0 2px 12px rgba(249,115,22,0.08)" }}>
                <span style={{ fontSize:18 }}>{item.split(" ")[0]}</span>
                <span style={{ fontWeight:600, color:"var(--text2)", fontSize:14 }}>{item.slice(item.indexOf(" ")+1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
