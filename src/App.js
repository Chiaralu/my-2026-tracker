import React, { useState, useEffect } from "react";

const MONTHS_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const DAILY = [
  { id: "gratitude", label: "感恩日記", emoji: "📖" },
  { id: "meditate", label: "冥想", emoji: "🧘" },
  { id: "water", label: "喝水 2000ml", emoji: "💧" },
  { id: "budget", label: "記帳", emoji: "💰" },
];

const MONTHLY_GOALS = [
  { id: "new_things", label: "Try new things", emoji: "🌟" },
  { id: "lifecoach", label: "Life coach", emoji: "🎯" },
  { id: "dislike_thing", label: "Do one thing I don't like", emoji: "😤" }, // 新增任務
];

const YEARLY = [
  { id: "books", label: "Read books", emoji: "📚", target: 6, type: "counter" },
  { id: "articles", label: "Produce articles", emoji: "✍️", target: 6, type: "counter" },
  { id: "movies", label: "Watch movies", emoji: "🎬", target: 12, type: "counter" },
  { id: "marathon", label: "跑 10K Marathon", emoji: "🏃" },
  { id: "scuba", label: "潛水", emoji: "🤿" },
  { id: "ski", label: "滑雪", emoji: "⛷️" },
  { id: "mountain", label: "爬山", emoji: "⛰️" },
  { id: "volunteer", label: "做志工", emoji: "💚" },
  { id: "spanish_b1", label: "西文 B1", emoji: "🇪🇸" },
  { id: "income2", label: "第 2 收入來源", emoji: "💸" },
  { id: "invest", label: "投資", emoji: "📈" },
  { id: "bodyfat", label: "體脂肪 14% ↓", emoji: "💪" },
  { id: "qlr", label: "4場 QLR", emoji: "🧳" },
  { id: "ai", label: "AI 提升生產力", emoji: "🤖" },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [dailyHistory, setDailyHistory] = useState({});
  const [data, setData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

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

  const getMVal = (m, id) => data[`m${m}_${id}`] || 0;
  const setMVal = (m, id, v) => saveM({ ...data, [`m${m}_${id}`]: v });
  
  const getMNote = (m, id) => notes[`m${m}_${id}`] || "";
  const setMNote = (m, id, v) => saveN({ ...notes, [`m${m}_${id}`]: v });

  const calculateStreak = (id) => {
    let s = 0; let c = new Date();
    for (let i = 0; i < 365; i++) {
      const d = c.toISOString().split('T')[0];
      if (dailyHistory[d]?.includes(id)) { s++; c.setDate(c.getDate() - 1); } else break;
    }
    return s;
  };

  if (loading) return null;

  const cardStyle = { background: "#fff", padding: 16, borderRadius: 12, marginBottom: 12, border: "1px solid #f0f0f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" };
  const btnStyle = { width: 30, height: 30, borderRadius: "50%", border: "1px solid #ddd", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", color: "#333", fontFamily: "-apple-system, sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "50px 20px 20px", borderBottom: "1px solid #eee" }}>
        <div style={{ fontSize: 11, letterSpacing: 1, color: "#999", marginBottom: 4 }}>CHIARA'S 2026</div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: "600" }}>生活追蹤</h1>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          {["daily", "monthly", "yearly"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "6px 16px", borderRadius: 18, border: "1px solid",
              borderColor: tab === t ? "#333" : "#ddd",
              background: tab === t ? "#333" : "transparent",
              color: tab === t ? "#fff" : "#666", fontSize: 13
            }}>{t === "daily" ? "每日" : t === "monthly" ? "每月" : "年度"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {/* 每日 */}
        {tab === "daily" && (
          <>
            <div style={{ ...cardStyle, background: "#f0f0f0", border: "none" }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>今日進度</div>
              <div style={{ height: 4, background: "#ddd", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${((dailyHistory[today]?.length || 0) / DAILY.length) * 100}%`, height: "100%", background: "#333", transition: "0.3s" }} />
              </div>
            </div>
            {DAILY.map(h => {
              const done = dailyHistory[today]?.includes(h.id);
              const streak = calculateStreak(h.id);
              return (
                <div key={h.id} onClick={() => {
                  const list = dailyHistory[today] || [];
                  const newList = list.includes(h.id) ? list.filter(i => i !== h.id) : [...list, h.id];
                  saveDH({ ...dailyHistory, [today]: newList });
                }} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: done ? "#333" : "#f0f0f0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid #333", background: done ? "#333" : "transparent" }} />
                    <span style={{ fontSize: 15 }}>{h.emoji} {h.label}</span>
                  </div>
                  {streak > 0 && <span style={{ fontSize: 12, color: "#999" }}>🔥 {streak}</span>}
                </div>
              );
            })}
          </>
        )}

        {/* 每月 */}
        {tab === "monthly" && (
          <>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#fff", border: "1px solid #ddd", marginBottom: 20, fontSize: 15 }}>
              {MONTHS_ZH.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            {MONTHLY_GOALS.map(m => {
              const val = getMVal(selectedMonth, m.id);
              const note = getMNote(selectedMonth, m.id);
              return (
                <div key={m.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 15 }}>{m.emoji} {m.label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button onClick={() => setMVal(selectedMonth, m.id, Math.max(0, val - 1))} style={btnStyle}>-</button>
                      <span style={{ minWidth: 20, textAlign: "center", fontWeight: "600" }}>{val}</span>
                      <button onClick={() => setMVal(selectedMonth, m.id, val + 1)} style={btnStyle}>+</button>
                    </div>
                  </div>
                  <input 
                    placeholder="寫下本月紀錄..." 
                    value={note} 
                    onChange={(e) => setMNote(selectedMonth, m.id, e.target.value)}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #eee", color: "#888", fontSize: 13, outline: "none", padding: "4px 0" }} 
                  />
                </div>
              );
            })}
          </>
        )}

        {/* 年度 */}
        {tab === "yearly" && (
          <>
            {YEARLY.map(g => {
              const val = yearlyData[g.id] || 0;
              const note = notes[g.id] || "";
              const pct = g.type === "counter" ? Math.min(Math.round((val / g.target) * 100), 100) : 0;
              return (
                <div key={g.id} style={cardStyle}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 15 }}>{g.emoji} {g.label}</span>
                    {g.type === "counter" ? (
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnStyle}>-</button>
                        <span style={{ fontSize: 13, fontWeight: "600" }}>{val}/{g.target}</span>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: val + 1 })} style={btnStyle}>+</button>
                      </div>
                    ) : (
                      <div onClick={() => saveY({ ...yearlyData, [g.id]: !yearlyData[g.id] })} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid #333", background: yearlyData[g.id] ? "#333" : "transparent" }} />
                    )}
                  </div>
                  {g.type === "counter" && (
                    <div style={{ height: 3, background: "#eee", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#333" }} />
                    </div>
                  )}
                  <input placeholder="備註..." value={note} onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #eee", color: "#888", fontSize: 12, outline: "none" }} />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
