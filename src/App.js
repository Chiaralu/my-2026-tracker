import React, { useState, useEffect } from "react";

const MONTHS_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAILY = [
  { id: "gratitude", label: "Gratitude Journal", emoji: "📖" },
  { id: "meditate", label: "Meditation", emoji: "🧘" },
  { id: "water", label: "Hydration 2000ml", emoji: "💧" },
  { id: "budget", label: "Expense Tracking", emoji: "💰" },
];

const MONTHLY_GOALS = [
  { id: "new_things", label: "Try something new", emoji: "🌟" },
  { id: "lifecoach", label: "Life coach session", emoji: "🎯" },
  { id: "dislike_thing", label: "Conquer one dislike", emoji: "😤" },
];

const YEARLY = [
  { id: "books", label: "Read books", emoji: "📚", target: 6, type: "counter" },
  { id: "articles", label: "Produce articles", emoji: "✍️", target: 6, type: "counter" },
  { id: "movies", label: "Watch movies", emoji: "🎬", target: 12, type: "counter" },
  { id: "marathon", label: "10K Marathon", emoji: "🏃" },
  { id: "scuba", label: "Scuba Diving", emoji: "🤿" },
  { id: "ski", label: "Skiing", emoji: "⛷️" },
  { id: "mountain", label: "Mountain Climbing", emoji: "⛰️" },
  { id: "volunteer", label: "Volunteering", emoji: "💚" },
  { id: "spanish_b1", label: "Spanish B1", emoji: "🇪🇸" },
  { id: "income2", label: "Second Income", emoji: "💸" },
  { id: "invest", label: "Investment", emoji: "📈" },
  { id: "bodyfat", label: "Body Fat 14%", emoji: "💪" },
  { id: "qlr", label: "4 Sessions QLR", emoji: "🧳" },
  { id: "ai", label: "AI Productivity", emoji: "🤖" },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const [viewDate, setViewDate] = useState(new Date()); // 用於切換查看日期
  const [dailyHistory, setDailyHistory] = useState({});
  const [data, setData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const dateKey = viewDate.toISOString().split('T')[0];
  const formattedDate = `${DAYS_EN[viewDate.getDay()]}, ${MONTHS_EN[viewDate.getMonth()]} ${viewDate.getDate()}`;

  useEffect(() => {
    const load = () => {
      try {
        setDailyHistory(JSON.parse(localStorage.getItem("t-dh") || "{}"));
        setData(JSON.parse(localStorage.getItem("t-m") || "{}"));
        setYearlyData(JSON.parse(localStorage.getItem("t-y") || "{}"));
        setNotes(JSON.parse(localStorage.getItem("t-n") || "{}"));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const saveDH = (v) => { setDailyHistory(v); localStorage.setItem("t-dh", JSON.stringify(v)); };
  const saveM = (v) => { setData(v); localStorage.setItem("t-m", JSON.stringify(v)); };
  const saveY = (v) => { setYearlyData(v); localStorage.setItem("t-y", JSON.stringify(v)); };
  const saveN = (v) => { setNotes(v); localStorage.setItem("t-n", JSON.stringify(v)); };

  const calculateStreak = (id) => {
    let s = 0; let c = new Date();
    for (let i = 0; i < 365; i++) {
      const d = c.toISOString().split('T')[0];
      if (dailyHistory[d]?.includes(id)) { s++; c.setDate(c.getDate() - 1); } else break;
    }
    return s;
  };

  const changeDate = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + offset);
    setViewDate(newDate);
  };

  if (loading) return null;

  const cardStyle = { background: "#fff", padding: "18px 20px", borderRadius: "16px", marginBottom: "12px", border: "1px solid #f2f2f2", display: "flex", justifyContent: "space-between", alignItems: "center" };
  const btnStyle = { width: 32, height: 32, borderRadius: "50%", border: "1px solid #eee", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#2d2d2d", fontFamily: "Helvetica, Arial, sans-serif", paddingBottom: "50px" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "60px 25px 25px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", marginBottom: "8px", fontWeight: "600" }}>2026 LIFE BLUEPRINT</div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>{tab.toUpperCase()}</h1>
        
        <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
          {["daily", "monthly", "yearly"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 20px", borderRadius: "20px", border: "1px solid",
              borderColor: tab === t ? "#000" : "#eee",
              background: tab === t ? "#000" : "transparent",
              color: tab === t ? "#fff" : "#888", fontSize: "12px", fontWeight: "600", transition: "0.2s"
            }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "25px" }}>
        {/* Daily Section */}
        {tab === "daily" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <button onClick={() => changeDate(-1)} style={{ background: "none", border: "none", color: "#ccc", fontSize: "20px" }}>‹</button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: "600" }}>{formattedDate}</div>
                <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>{((dailyHistory[dateKey]?.length || 0) / DAILY.length * 100).toFixed(0)}% Completed</div>
              </div>
              <button onClick={() => changeDate(1)} style={{ background: "none", border: "none", color: "#ccc", fontSize: "20px" }}>›</button>
            </div>

            {DAILY.map(h => {
              const done = dailyHistory[dateKey]?.includes(h.id);
              const streak = calculateStreak(h.id);
              return (
                <div key={h.id} onClick={() => {
                  const list = dailyHistory[dateKey] || [];
                  const newList = list.includes(h.id) ? list.filter(i => i !== h.id) : [...list, h.id];
                  saveDH({ ...dailyHistory, [dateKey]: newList });
                }} style={{ ...cardStyle, borderColor: done ? "#000" : "#f2f2f2", opacity: done ? 1 : 0.8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "6px", border: "1.5px solid #000", background: done ? "#000" : "transparent", transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {done && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>{h.label}</span>
                  </div>
                  {streak > 0 && <span style={{ fontSize: "12px", color: "#bbb" }}>🔥 {streak}</span>}
                </div>
              );
            })}
          </>
        )}

        {/* Monthly Section */}
        {tab === "monthly" && (
          <>
            <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "20px", color: "#000" }}>{MONTHS_ZH[selectedMonth]} Goals</div>
            {MONTHLY_GOALS.map(m => {
              const val = data[`m${selectedMonth}_${m.id}`] || 0;
              const note = notes[`m${selectedMonth}_${m.id}`] || "";
              return (
                <div key={m.id} style={{ ...cardStyle, flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "12px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>{m.emoji} {m.label}</span>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <button onClick={() => saveM({ ...data, [`m${selectedMonth}_${m.id}`]: Math.max(0, val - 1) })} style={btnStyle}>-</button>
                      <span style={{ fontSize: "14px", fontWeight: "700" }}>{val}</span>
                      <button onClick={() => saveM({ ...data, [`m${selectedMonth}_${m.id}`]: val + 1 })} style={btnStyle}>+</button>
                    </div>
                  </div>
                  <input 
                    placeholder="Add a note..." 
                    value={note} 
                    onChange={(e) => saveN({ ...notes, [`m${selectedMonth}_${m.id}`]: e.target.value })}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #f0f0f0", color: "#999", fontSize: "13px", outline: "none", padding: "6px 0" }} 
                  />
                </div>
              );
            })}
          </>
        )}

        {/* Yearly Section */}
        {tab === "yearly" && (
          <>
            {YEARLY.map(g => {
              const val = yearlyData[g.id] || 0;
              const note = notes[g.id] || "";
              const pct = g.type === "counter" ? Math.min(Math.round((val / g.target) * 100), 100) : 0;
              return (
                <div key={g.id} style={{ ...cardStyle, flexDirection: "column", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>{g.label}</span>
                    {g.type === "counter" ? (
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnStyle}>-</button>
                        <span style={{ fontSize: "13px", fontWeight: "700" }}>{val}/{g.target}</span>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: val + 1 })} style={btnStyle}>+</button>
                      </div>
                    ) : (
                      <div onClick={() => saveY({ ...yearlyData, [g.id]: !yearlyData[g.id] })} style={{ width: "20px", height: "20px", borderRadius: "50%", border: "1.5px solid #000", background: yearlyData[g.id] ? "#000" : "transparent", transition: "0.2s" }} />
                    )}
                  </div>
                  {g.type === "counter" && (
                    <div style={{ height: "2px", background: "#f0f0f0", width: "100%", borderRadius: "1px", marginBottom: "12px" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#000", transition: "0.5s ease" }} />
                    </div>
                  )}
                  <input placeholder="Memo..." value={note} onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #f0f0f0", color: "#aaa", fontSize: "12px", outline: "none" }} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
