import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Bot, User, Calculator, TrendingUp, Phone, ExternalLink } from "lucide-react";

const C = {
  primary: "#22568F", secondary: "#2389AF", dark: "#0D1B2E",
  light: "#F4F8FC", surface: "#FFFFFF", textPrimary: "#0D1B2E",
  textMuted: "#6B7E99", accent: "#39C3EF", success: "#1DB954", warning: "#F5A623",
};

// ─── All knowledge lives here — update as your website changes ───
const FAQ = [
  {
    patterns: ["hi", "hello", "hey", "namaste", "good morning", "good evening", "start", "help"],
    answer: "👋 Hello! Welcome to **Radds Capital**.\n\nI can help you with:\n• Our services & fees\n• Investment calculations (SIP, Lumpsum, EMI)\n• How to get started\n• Contact & appointments\n\nWhat would you like to know?",
  },
  {
    patterns: ["service", "what do you offer", "what do you do", "offerings", "products"],
    answer: "**Our Services:**\n• Wealth Management – Personalized portfolio management\n• Mutual Fund Advisory – Curated fund selection\n• Financial Planning – Goal-based planning\n• Tax Planning – ELSS, 80C, capital gains\n• Insurance Planning – Life, health, term\n• NRI Services – India investments for NRIs\n• Estate Planning – Wills & succession\n• Corporate Treasury – FD, liquid funds\n\nWant details on any specific service?",
  },
  {
    patterns: ["fee", "charge", "cost", "pricing", "how much do you charge", "commission"],
    answer: "**Our Fee Structure (Transparent, No Hidden Costs):**\n• Financial Planning: ₹15,000/year flat fee\n• Portfolio Management: 0.5%–1% of AUM per year\n• We are fee-only advisors — zero commissions\n\nWe believe in full transparency. Book a free consultation to discuss further.",
  },
  {
    patterns: ["minimum", "min investment", "minimum investment", "start investing", "how much to invest"],
    answer: "**Minimum Investment:**\n• Mutual Fund Portfolios: ₹50,000\n• Full Wealth Management: ₹25 Lakhs AUM\n• SIP: Start from as low as ₹500/month\n\nWe tailor solutions to your financial goals regardless of size.",
  },
  {
    patterns: ["sebi", "registered", "license", "regulated", "safe", "legitimate", "trust"],
    answer: "Radds Capital operates in accordance with applicable regulations and advisory standards. Please verify current registration details directly with the firm.\n\n",
  },
  {
    patterns: ["return", "profit", "how much return", "expected return", "performance", "cagr", "growth"],
    answer: "**Historical Returns (Not Guaranteed):**\n• Balanced Portfolios: 12–18% CAGR over 5+ years\n• Equity Heavy: 15–22% CAGR (higher risk)\n• Debt/Conservative: 7–9% CAGR\n\n⚠️ All investments carry market risk. Past performance is not a guarantee of future returns.\n\nWant me to calculate returns for a specific amount?",
  },
  {
    patterns: ["nri", "non resident", "abroad", "overseas", "foreign"],
    answer: "**NRI Services at Radds Capital:**\n• NRE/NRO account investments\n• FEMA-compliant advisory\n• Repatriation planning\n• India portfolio management from abroad\n• Tax treaty optimization\n\nWe specialize in helping NRIs invest in India seamlessly. Contact us to get started!",
  },
  {
    patterns: ["document", "kyc", "paperwork", "what do i need", "requirements", "open account"],
    answer: "**Documents Required:**\n• PAN Card (mandatory)\n• Aadhaar Card\n• Bank statement (last 3 months)\n• Passport-size photograph\n• For NRIs: Passport + overseas address proof\n\nWe handle the entire KYC process for you — hassle-free!",
  },
  {
    patterns: ["contact", "reach", "phone", "email", "address", "location", "office"],
    answer: "**Contact Radds Capital:**\n• 📍 Mumbai, Maharashtra, India\n• 📧 hello@raddscapital.com\n• 📞 +91 96641 50986\n• 💬 WhatsApp: +91 96641 50986\n• 🕐 Mon–Fri: 9AM–6PM IST\n• 🕐 Saturday: 10AM–2PM IST",
  },
  {
    patterns: ["appointment", "book", "consultation", "meet", "advisor", "schedule", "call"],
    answer: "📅 **Book a Free 60-Min Consultation:**\n\n1. Visit our Contact page\n2. Fill the consultation form\n3. Pick a time slot\n4. Or WhatsApp us directly at +91 96641 50986\n\nOur advisors will call you at your preferred time — completely free, no obligation.",
  },
  {
    patterns: ["calculator", "calculate", "calculators", "tools"],
    answer: "**Calculators on our website:**\n• SIP Calculator\n• Lumpsum Calculator\n• SWP Calculator\n• PPF Calculator\n• FD Calculator\n• EMI Calculator\n• Goal Planner\n• Retirement Calculator\n• Tax Savings Calculator\n• CAGR Calculator\n\nVisit the **Calculators** page to use them interactively!\n\nOr tell me an amount & duration — I'll calculate right here. 👇",
  },
  {
    patterns: ["mutual fund", "mf", "fund", "equity fund", "debt fund", "hybrid"],
    answer: "**Mutual Fund Advisory:**\n• We curate funds based on your risk profile & goals\n• Equity, Debt, Hybrid, ELSS, Index funds\n• Regular portfolio rebalancing\n• SIP setup & tracking\n\nWe help you pick the right funds — not just popular ones.",
  },
  {
    patterns: ["tax", "80c", "elss", "tax saving", "deduction", "tax planning"],
    answer: "**Tax Planning Services:**\n• ELSS investments for 80C deduction (up to ₹1.5L)\n• Capital gains tax optimization\n• Tax-efficient portfolio structuring\n• ITR filing advisory\n\nProper tax planning can save you lakhs annually. Book a session with our tax advisors!",
  },
  {
    patterns: ["insurance", "life insurance", "term plan", "health insurance", "ulip"],
    answer: "**Insurance Planning:**\n• Term Life Insurance – High coverage, low premium\n• Health Insurance – Family floater plans\n• ULIP – Market-linked insurance\n• Critical Illness covers\n\nWe recommend insurance based on need, not commission.",
  },
  {
    patterns: ["blog", "article", "learn", "learning", "education", "knowledge"],
    answer: "📚 **Learning Resources:**\n\nOur Blog & Learning section covers:\n• Investing basics for beginners\n• Market insights & analysis\n• Financial planning guides\n• Tax saving tips\n• Retirement planning\n\nVisit the **Blog** and **Learning** pages on our website!",
  },
  {
    patterns: ["career", "job", "hiring", "work with", "join", "vacancy"],
    answer: "🚀 **Careers at Radds Capital:**\n\nWe're always looking for passionate finance professionals.\n\nVisit our **Careers** page to see open positions or send your CV to:\n📧 careers@raddscapital.com",
  },
  {
    patterns: ["whatsapp", "wa", "chat on whatsapp"],
    answer: "💬 You can reach us directly on WhatsApp:\n\n**+91 96641 50986**\n\nClick the green **WhatsApp** button above to start chatting instantly!",
  },
];

// ─── Financial calculators ───────────────────────────────────────
function calcSIP(monthly, rateAnnual, years) {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { fv: Math.round(fv), invested: monthly * n, gain: Math.round(fv - monthly * n) };
}

function calcLumpsum(principal, rateAnnual, years) {
  const fv = principal * Math.pow(1 + rateAnnual / 100, years);
  return { fv: Math.round(fv), invested: principal, gain: Math.round(fv - principal) };
}

function calcEMI(principal, rateAnnual, years) {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return { emi: Math.round(emi), total: Math.round(emi * n), interest: Math.round(emi * n - principal) };
}

function fmt(n) {
  if (n >= 1e7) return "₹" + (n / 1e7).toFixed(2) + " Cr";
  if (n >= 1e5) return "₹" + (n / 1e5).toFixed(2) + " L";
  return "₹" + n.toLocaleString("en-IN");
}

// ─── Calc detector ───────────────────────────────────────────────
function detectCalc(text) {
  const t = text.toLowerCase();
  const nums = [...text.matchAll(/[\d,]+(?:\.\d+)?/g)].map(m => parseFloat(m[0].replace(/,/g, "")));

  // SIP pattern: "5000 per month for 10 years at 12%"
  if ((t.includes("sip") || t.includes("per month") || t.includes("monthly")) && nums.length >= 2) {
    const monthly = nums[0];
    const years = nums.find(n => n >= 1 && n <= 50 && n !== monthly) || 10;
    const rate = nums.find(n => n >= 1 && n <= 30 && n !== monthly && n !== years) || 12;
    const r = calcSIP(monthly, rate, years);
    return `**SIP Calculation:**\n• Monthly SIP: ${fmt(monthly)}\n• Duration: ${years} years\n• Expected Rate: ${rate}% p.a.\n\n📊 **Results:**\n• Total Invested: ${fmt(r.invested)}\n• Estimated Returns: ${fmt(r.gain)}\n• **Maturity Value: ${fmt(r.fv)}**\n\nVisit our SIP Calculator page for interactive projections!`;
  }

  // Lumpsum pattern: "1 lakh for 5 years at 10%"
  if ((t.includes("lumpsum") || t.includes("lump sum") || t.includes("one time") || t.includes("lakh") || t.includes("crore")) && nums.length >= 2) {
    let principal = nums[0];
    if (t.includes("lakh")) principal *= 1e5;
    if (t.includes("crore")) principal *= 1e7;
    const years = nums.find(n => n >= 1 && n <= 50 && n !== principal) || 5;
    const rate = nums.find(n => n >= 1 && n <= 30 && n !== principal && n !== years) || 12;
    const r = calcLumpsum(principal, rate, years);
    return `**Lumpsum Calculation:**\n• Principal: ${fmt(principal)}\n• Duration: ${years} years\n• Expected Rate: ${rate}% p.a.\n\n📊 **Results:**\n• Total Invested: ${fmt(r.invested)}\n• Estimated Gains: ${fmt(r.gain)}\n• **Maturity Value: ${fmt(r.fv)}**\n\nVisit our Lumpsum Calculator for interactive projections!`;
  }

  // EMI pattern
  if ((t.includes("emi") || t.includes("loan") || t.includes("home loan") || t.includes("car loan")) && nums.length >= 2) {
    let principal = nums[0];
    if (t.includes("lakh")) principal *= 1e5;
    if (t.includes("crore")) principal *= 1e7;
    const years = nums.find(n => n >= 1 && n <= 30 && n !== principal) || 20;
    const rate = nums.find(n => n >= 1 && n <= 20 && n !== principal && n !== years) || 8.5;
    const r = calcEMI(principal, rate, years);
    return `**EMI Calculation:**\n• Loan Amount: ${fmt(principal)}\n• Tenure: ${years} years\n• Interest Rate: ${rate}% p.a.\n\n📊 **Results:**\n• Monthly EMI: **${fmt(r.emi)}**\n• Total Amount Payable: ${fmt(r.total)}\n• Total Interest: ${fmt(r.interest)}\n\nVisit our EMI Calculator for detailed breakdowns!`;
  }

  return null;
}

// ─── Match FAQ ───────────────────────────────────────────────────
function getAnswer(text) {
  const t = text.toLowerCase();

  // Try calculator first
  const calc = detectCalc(text);
  if (calc) return calc;

  // Match FAQ
  for (const item of FAQ) {
    if (item.patterns.some(p => t.includes(p))) return item.answer;
  }

  return "I'm not sure about that. Here's how I can help:\n• Ask about our **services or fees**\n• Ask me to **calculate SIP / EMI / Lumpsum**\n• Ask about **getting started** or **contact details**\n\nOr reach us directly on WhatsApp for personalized help! 💬";
}

// ─── Format markdown-ish text ────────────────────────────────────
function FormatText({ text }) {
  return (
    <div style={{ lineHeight: 1.6 }}>
      {text.split("\n").map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**"))
          return <strong key={i} style={{ display: "block", marginTop: i > 0 ? 5 : 0, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{line.slice(2, -2)}</strong>;
        if (line.startsWith("• ") || line.startsWith("- "))
          return <div key={i} style={{ paddingLeft: 10, marginTop: 2, display: "flex", gap: 6 }}><span style={{ color: C.secondary, flexShrink: 0 }}>•</span><span>{line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</span></div>;
        if (/^\d+\./.test(line))
          return <div key={i} style={{ paddingLeft: 4, marginTop: 2 }}>{line}</div>;
        if (line.trim() === "") return <div key={i} style={{ height: 5 }} />;
        return <span key={i} style={{ display: "block" }}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}</span>;
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.secondary, animation: `rcBounce 1.1s ${i * 0.2}s ease-in-out infinite` }} />
      ))}
    </div>
  );
}

const QUICK = [
  { label: "Our Services", icon: <TrendingUp size={11} /> },
  { label: "SIP Calculate", icon: <Calculator size={11} /> },
  { label: "Minimum Investment", icon: <TrendingUp size={11} /> },
  { label: "Book Consultation", icon: <Phone size={11} /> },
];

function WAButton({ full }) {
  const url = `https://wa.me/919664150986?text=${encodeURIComponent("Hi! I'm interested in Radds Capital's wealth management services.")}`;
  return full ? (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "#25D366", borderRadius: 10, color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, textDecoration: "none", marginBottom: 6, transition: "background 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#1cb956"}
      onMouseLeave={e => e.currentTarget.style.background = "#25D366"}>
      <WaIcon /> Continue on WhatsApp <ExternalLink size={12} style={{ marginLeft: "auto" }} />
    </a>
  ) : (
    <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", background: "#25D366", borderRadius: 7, color: "#fff", fontSize: 11.5, fontFamily: "'DM Sans',sans-serif", fontWeight: 600, textDecoration: "none", transition: "background 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#1cb956"}
      onMouseLeave={e => e.currentTarget.style.background = "#25D366"}>
      <WaIcon size={13} /> WhatsApp
    </a>
  );
}

function WaIcon({ size = 14 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
}

// ─── Main component ──────────────────────────────────────────────
export default function RaddsChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const [messages, setMessages] = useState([{
    role: "bot",
    text: "👋 Welcome to **Radds Capital**!\n\nI can help you with:\n• Services & fees\n• SIP / Lumpsum / EMI calculations\n• Getting started\n• Booking a consultation\n\nWhat would you like to know?",
    time: now(),
  }]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

  useEffect(() => {
    if (open && !minimized) { endRef.current?.scrollIntoView({ behavior: "smooth" }); setTimeout(() => inputRef.current?.focus(), 150); setUnread(0); }
  }, [messages, open, minimized]);

  function send(text) {
    const t = (text || input).trim();
    if (!t || typing) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: t, time: now() }]);
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: getAnswer(t), time: now() }]);
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes rcPop{from{opacity:0;transform:scale(.88) translateY(18px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes rcSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rcBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes rcPulse{0%,100%{box-shadow:0 4px 18px rgba(34,86,143,.45)}50%{box-shadow:0 6px 28px rgba(34,86,143,.65);transform:scale(1.07)}}
        .rc-chip:hover{background:rgba(34,86,143,.1)!important;border-color:#22568F!important}
        .rc-send:hover:not(:disabled){background:#2389AF!important;transform:scale(1.06)}
        .rc-send:disabled{opacity:.45;cursor:not-allowed}
        .rc-input:focus{outline:none;border-color:#2389AF!important;box-shadow:0 0 0 3px rgba(35,137,175,.15)!important}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(34,86,143,.2);border-radius:4px}
      `}</style>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        {!open && (
          <div style={{ background: C.dark, color: "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,.25)", animation: "rcSlide .3s ease-out", border: "1px solid rgba(255,255,255,.08)" }}>
            💬 Ask me anything!
          </div>
        )}
        <button onClick={() => { setOpen(o => !o); setMinimized(false); setUnread(0); }} aria-label="Open chat"
          style={{ width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer", background: `linear-gradient(135deg,${C.primary},${C.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", animation: open ? "none" : "rcPulse 3s ease-in-out infinite", transition: "transform .2s", boxShadow: "0 4px 18px rgba(34,86,143,.45)", position: "relative" }}
          onMouseEnter={e => { e.currentTarget.style.animation = "none"; e.currentTarget.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.animation = "rcPulse 3s ease-in-out infinite"; e.currentTarget.style.transform = "scale(1)"; }}>
          {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
          {!open && unread > 0 && (
            <div style={{ position: "absolute", top: -2, right: -2, background: C.warning, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{unread}</div>
          )}
        </button>
      </div>

      {/* Window */}
      {open && (
        <div style={{ position: "fixed", bottom: 92, right: 24, zIndex: 9998, width: 360, maxWidth: "calc(100vw - 32px)", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(13,27,46,.3),0 4px 16px rgba(13,27,46,.15)", fontFamily: "'DM Sans',sans-serif", animation: "rcPop .3s cubic-bezier(.34,1.56,.64,1)", display: "flex", flexDirection: "column", maxHeight: minimized ? 64 : "min(580px,calc(100vh - 110px))", transition: "max-height .3s ease", border: "1px solid rgba(34,86,143,.18)" }}>

          {/* Header */}
          <div style={{ background: `linear-gradient(135deg,${C.dark} 0%,#162845 100%)`, padding: "13px 14px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid rgba(255,255,255,.07)", flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bot size={16} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: 13.5 }}>Radds Capital</div>
              <div style={{ color: C.accent, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.success }} /> Online · Instant replies
              </div>
            </div>
            <WAButton />
            <button onClick={() => setMinimized(m => !m)} style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }} title={minimized ? "Expand" : "Minimize"}>
              <Minimize2 size={13} />
            </button>
            <button onClick={() => setOpen(false)} style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 6, width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <X size={13} />
            </button>
          </div>

          {!minimized && <>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 11px 8px", background: C.light, display: "flex", flexDirection: "column" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", flexDirection: m.role === "bot" ? "row" : "row-reverse", gap: 7, alignItems: "flex-end", marginBottom: 10, animation: "rcSlide .22s ease-out" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: m.role === "bot" ? `linear-gradient(135deg,${C.primary},${C.secondary})` : C.light, display: "flex", alignItems: "center", justifyContent: "center", border: m.role === "user" ? `1.5px solid ${C.primary}` : "none" }}>
                    {m.role === "bot" ? <Bot size={13} color="#fff" /> : <User size={13} color={C.primary} />}
                  </div>
                  <div style={{ maxWidth: "76%", background: m.role === "bot" ? C.surface : `linear-gradient(135deg,${C.primary},${C.secondary})`, color: m.role === "bot" ? C.textPrimary : "#fff", borderRadius: m.role === "bot" ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding: "9px 12px", fontSize: 13, border: m.role === "bot" ? "1px solid rgba(34,86,143,.1)" : "none", boxShadow: m.role === "bot" ? "0 1px 4px rgba(0,0,0,.06)" : "0 2px 8px rgba(34,86,143,.28)" }}>
                    <FormatText text={m.text} />
                    <div style={{ fontSize: 10.5, opacity: .5, marginTop: 3, textAlign: m.role === "bot" ? "left" : "right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 7, alignItems: "flex-end", marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(135deg,${C.primary},${C.secondary})`, display: "flex", alignItems: "center", justifyContent: "center" }}><Bot size={13} color="#fff" /></div>
                  <div style={{ background: C.surface, borderRadius: "4px 12px 12px 12px", padding: "10px 14px", border: "1px solid rgba(34,86,143,.1)", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}><TypingDots /></div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* WhatsApp CTA */}
            <div style={{ padding: "8px 11px 4px", background: C.light, borderTop: "1px solid rgba(34,86,143,.08)" }}>
              <WAButton full />
            </div>

            {/* Quick replies */}
            <div style={{ display: "flex", gap: 5, padding: "5px 11px 7px", background: C.light, overflowX: "auto", scrollbarWidth: "none" }}>
              {QUICK.map(q => (
                <button key={q.label} className="rc-chip" onClick={() => send(q.label)} disabled={typing}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 9px", borderRadius: 20, border: "1px solid rgba(34,86,143,.22)", background: "#fff", color: C.primary, fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}>
                  {q.icon} {q.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: "9px 11px 11px", background: C.surface, borderTop: "1px solid rgba(34,86,143,.09)", display: "flex", gap: 7, alignItems: "flex-end" }}>
              <textarea ref={inputRef} className="rc-input" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask about SIP, services, tax saving…" disabled={typing} rows={1}
                style={{ flex: 1, resize: "none", border: "1.5px solid rgba(34,86,143,.2)", borderRadius: 10, padding: "8px 11px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", color: C.textPrimary, background: C.light, lineHeight: 1.5, maxHeight: 90, overflowY: "auto", transition: "border-color .2s,box-shadow .2s" }}
                onInput={e => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px"; }} />
              <button className="rc-send" onClick={() => send()} disabled={typing || !input.trim()}
                style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 10, background: `linear-gradient(135deg,${C.primary},${C.secondary})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", boxShadow: "0 2px 8px rgba(34,86,143,.3)" }}>
                <Send size={14} color="#fff" />
              </button>
            </div>

            <div style={{ textAlign: "center", fontSize: 10, color: C.textMuted, padding: "4px 0 7px", background: C.surface }}>
              Radds Capital · AMFI-Registered Mutual Fund Distributor. ARN-334716 | ARN-292158 | ARN- 124053
            </div>
          </>}
        </div>
      )}
    </>
  );
}
