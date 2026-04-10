import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TICKER = ["🎵 Live Concerts","🎨 Art Shows","💼 Summits","🏃 Sports","🍕 Food Fests","🎭 Theatre","💡 Tech Talks","🎪 Festivals","🌟 Workshops","🎉 Parties"];

const FEATURES = [
  { emoji:"🎟️", title:"Book in Seconds",   desc:"Find an event you love, grab your tickets, done. Checkout takes under 30 seconds.",   bg:"#FFF7ED", border:"#FED7AA" },
  { emoji:"📍", title:"Events Near You",    desc:"Discover what's happening in your city — concerts, workshops, food fests and more.",   bg:"#F0F9FF", border:"#BAE6FD" },
  { emoji:"🔒", title:"Safe & Trusted",     desc:"Every booking is secure. Cancel up to 24 hours before your event, no questions asked.", bg:"#F0FDF4", border:"#A7F3D0" },
];

const CATS = [
  { e:"🎵", l:"Music",    c:"#FFF7ED", b:"#F97316" },
  { e:"🎨", l:"Arts",     c:"#FDF4FF", b:"#A855F7" },
  { e:"💼", l:"Business", c:"#EFF6FF", b:"#3B82F6" },
  { e:"🏃", l:"Sports",   c:"#F0FDF4", b:"#22C55E" },
  { e:"🍕", l:"Food",     c:"#FFF1F2", b:"#FB7185" },
  { e:"💡", l:"Tech",     c:"#F0FDFA", b:"#14B8A6" },
];

const TESTIMONIALS = [
  { name:"Ayesha Khan",  role:"Event Organiser", text:"Managing my summit went from stressful to smooth. The dashboard is so intuitive!", avatar:"AK", color:"#F97316" },
  { name:"Bilal Raza",   role:"Music Lover",     text:"Booked festival tickets in under a minute. Honestly the best event app I've used.", avatar:"BR", color:"#FB7185" },
  { name:"Sara Malik",   role:"Community Lead",  text:"Our local events are so much better organised now. Attendees love the smooth experience!", avatar:"SM", color:"#38BDF8" },
];

const STATS = [
  { val:"10+", label:"Events", emoji:"🎉" },
  { val:"100+", label:"Attendees", emoji:"👥" },
  { val:"98%",  label:"Satisfaction", emoji:"⭐" },
  { val:"10+", label:"Cities", emoji:"📍" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const navScrolled = scrollY > 50;

  const Btn = ({ children, solid, onClick, style = {} }) => (
    <button onClick={onClick} style={{
      padding: "14px 32px", borderRadius: "var(--r-full)", fontWeight: 700,
      fontSize: 15, cursor: "pointer", transition: "all 0.25s",
      ...(solid
        ? { background: "linear-gradient(135deg, var(--orange), var(--orange-deep))", color: "#fff", border: "none", boxShadow: "0 6px 24px rgba(249,115,22,0.35)" }
        : { background: "transparent", color: "var(--orange)", border: "2px solid var(--orange)" }
      ), ...style
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = solid ? "0 12px 36px rgba(249,115,22,0.45)" : "0 8px 24px rgba(249,115,22,0.15)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = solid ? "0 6px 24px rgba(249,115,22,0.35)" : "none"; }}>
      {children}
    </button>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: "hidden", background: "var(--cream)" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 6%",
        background: navScrolled ? "rgba(254,250,246,0.95)" : "transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        boxShadow: navScrolled ? "0 2px 16px rgba(249,115,22,0.08)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(249,115,22,0.1)" : "none",
        transition: "all 0.35s",
      }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 52, color: "var(--orange)", letterSpacing: "0.7px" }}>Eventara </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={() => navigate("/login")} style={{ padding: "10px 24px", fontSize: 14 }}>Log In</Btn>
          <Btn solid onClick={() => navigate("/register")} style={{ padding: "10px 24px", fontSize: 14 }}>Get Started →</Btn>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "100px 6% 60px", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #fff 0%, #FFF7ED 40%, #FDF4EC 100%)",
      }}>
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: "8%", right: "5%", width: 380, height: 380, borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%", background: "linear-gradient(135deg,#FED7AA,#FDBA74)", opacity: 0.45, animation: "blobMove 9s ease-in-out infinite", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "5%", left: "3%", width: 260, height: 260, borderRadius: "40% 60% 70% 30%/40% 70% 30% 60%", background: "linear-gradient(135deg,#BAE6FD,#7DD3FC)", opacity: 0.35, animation: "blobMove 12s ease-in-out infinite reverse", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "40%", left: "8%", width: 140, height: 140, borderRadius: "50%", background: "linear-gradient(135deg,#FBCFE8,#F9A8D4)", opacity: 0.4, animation: "float2 7s ease-in-out infinite", zIndex: 0 }} />

        {/* Floating emoji decorations */}
        {[
          { e:"🎵", t:"14%", l:"12%", s:52, delay:"0s" },
          { e:"🎉", t:"22%", r:"12%", s:44, delay:"1s" },
          { e:"🎭", t:"70%", r:"8%",  s:38, delay:"0.5s" },
          { e:"🏆", t:"75%", l:"6%",  s:42, delay:"1.5s" },
        ].map((d, i) => (
          <div key={i} style={{
            position: "absolute", top: d.t, left: d.l, right: d.r,
            fontSize: d.s, zIndex: 1, opacity: 0.7,
            animation: `float ${6+i}s ease-in-out infinite`,
            animationDelay: d.delay,
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
          }}>{d.e}</div>
        ))}

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820 }}>
          

          <h1 className="fade-up d1" style={{
            fontFamily: "'Fraunces',serif", fontWeight: 700,
            fontSize: "clamp(48px,7.5vw,96px)", color: "var(--text)",
            letterSpacing: "-3px", lineHeight: 1.0, marginBottom: 8,
          }}>
            Life is Short.
          </h1>
          <h1 className="fade-up d2" style={{
            fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(48px,7.5vw,96px)", letterSpacing: "-3px", lineHeight: 1.0, marginBottom: 28,
            background: "linear-gradient(135deg, var(--orange), var(--coral), var(--amber))",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", animation: "gradMove 4s ease infinite",
          }}>
            Attend Great Events.
          </h1>

          <p className="fade-up d3" style={{
            fontSize: 18, fontWeight: 400, color: "var(--text2)", lineHeight: 1.75,
            maxWidth: 520, margin: "0 auto 44px", letterSpacing: "0.1px",
          }}>
            Discover concerts, conferences, food festivals and more then book your spot in seconds. Your next favourite memory is one click away.
          </p>

          <div className="fade-up d4" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn solid onClick={() => navigate("/register")}>🎉 Explore Events</Btn>
            <Btn onClick={() => navigate("/login")}>Sign In</Btn>
          </div>

          {/* Stats row */}
          <div className="fade-up d5" style={{
            display: "flex", gap: 0, marginTop: 60, background: "white",
            borderRadius: "var(--r-xl)", boxShadow: "0 8px 40px rgba(249,115,22,0.1)",
            overflow: "hidden", border: "1px solid rgba(249,115,22,0.1)",
            maxWidth: 600, margin: "60px auto 0",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "22px 16px", textAlign: "center",
                borderRight: i < 3 ? "1px solid rgba(249,115,22,0.08)" : "none",
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.emoji}</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 26, color: "var(--orange)", letterSpacing: "-0.5px" }}>{s.val}</div>
                <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: "linear-gradient(135deg,var(--orange),var(--orange-deep))", padding: "14px 0", overflow: "hidden" }}>
        <div style={{ display: "inline-flex", gap: 56, animation: "ticker 20s linear infinite", whiteSpace: "nowrap" }}>
          {[...TICKER,...TICKER].map((t,i) => (
            <span key={i} style={{ fontWeight: 600, fontSize: 14, color: "#fff", letterSpacing: "0.3px" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: "100px 6%", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ background: "var(--orange-pale)", color: "var(--orange-deep)", padding: "6px 16px", borderRadius: "var(--r-full)", fontSize: 12, fontWeight: 700, letterSpacing: "0.5px" }}>WHY EVENTARA</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "clamp(32px,4vw,52px)", color: "var(--text)", marginTop: 16, letterSpacing: "-1.5px" }}>
            Everything you need,<br /><em style={{ fontWeight: 300, color: "var(--orange)" }}>nothing you don't</em>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: "36px 32px", borderRadius: "var(--r-lg)",
              background: f.bg, border: `1.5px solid ${f.border}`,
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(249,115,22,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ fontSize: 44, marginBottom: 20 }}>{f.emoji}</div>
              <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 24, color: "var(--text)", marginBottom: 12, letterSpacing: "-0.5px" }}>{f.title}</h3>
              <p style={{ color: "var(--text2)", lineHeight: 1.7, fontSize: 15 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "80px 6% 100px", background: "var(--cream)" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ background: "var(--amber-pale)", color: "#92400E", padding: "6px 16px", borderRadius: "var(--r-full)", fontSize: 12, fontWeight: 700 }}>EXPLORE</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "clamp(28px,4vw,48px)", color: "var(--text)", marginTop: 14, letterSpacing: "-1px" }}>Find your kind of event</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", maxWidth: 880, margin: "0 auto" }}>
          {CATS.map((c, i) => (
            <button key={i} onClick={() => navigate("/register")} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 24px", borderRadius: "var(--r-full)",
              background: c.c, border: `2px solid ${c.b}22`,
              fontWeight: 600, fontSize: 15, color: "var(--text)", cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = c.b; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = `0 8px 24px ${c.b}44`; }}
            onMouseLeave={e => { e.currentTarget.style.background = c.c; e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
              <span style={{ fontSize: 22 }}>{c.e}</span> {c.l}
            </button>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "80px 6% 100px", background: "linear-gradient(160deg,#FFF7ED,#fff,#FFF0F5)" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ background: "var(--coral-pale)", color: "#BE123C", padding: "6px 16px", borderRadius: "var(--r-full)", fontSize: 12, fontWeight: 700 }}>STORIES</span>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "clamp(28px,4vw,48px)", color: "var(--text)", marginTop: 14, letterSpacing: "-1px" }}>People love Eventara 💛</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 960, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              padding: "32px 28px", borderRadius: "var(--r-lg)", background: "#fff",
              boxShadow: "0 4px 24px rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.07)",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(249,115,22,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(249,115,22,0.07)"; }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>{[...Array(5)].map((_,j) => <span key={j} style={{ fontSize: 16 }}>⭐</span>)}</div>
              <p style={{ color: "var(--text2)", lineHeight: 1.75, fontSize: 15, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${t.color},${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "90px 6%", textAlign: "center", position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg,var(--orange),var(--coral),var(--amber))",
        backgroundSize: "200% 200%", animation: "gradMove 6s ease infinite",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎊</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: "clamp(32px,5vw,64px)", color: "#fff", letterSpacing: "-2px", marginBottom: 16 }}>
            Your next favourite event<br />is waiting for you
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, marginBottom: 40, maxWidth: 460, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Join event lovers who use Eventara to discover, book and enjoy incredible experiences.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")} style={{
              padding: "15px 36px", borderRadius: "var(--r-full)", fontWeight: 800,
              fontSize: 16, background: "#fff", color: "var(--orange-deep)", border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)", cursor: "pointer", transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.18)"; }}>
              Create Free Account 🚀
            </button>
            <button onClick={() => navigate("/login")} style={{
              padding: "15px 36px", borderRadius: "var(--r-full)", fontWeight: 700, fontSize: 16,
              background: "rgba(255,255,255,0.18)", color: "#fff", border: "2px solid rgba(255,255,255,0.5)",
              backdropFilter: "blur(10px)", cursor: "pointer", transition: "all 0.25s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}>
              I Already Have an Account
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "var(--text)", padding: "36px 6%", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 22, color: "var(--orange)" }}>Eventara </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>© 2025 Eventara. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy","Terms","Contact"].map(l => (
            <span key={l} style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--orange)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
