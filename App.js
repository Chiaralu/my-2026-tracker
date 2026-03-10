import React, { useState, useEffect } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

const DAILY = [
  { id: "gratitude", label: "感恩日記", emoji: "📖" },
  { id: "meditate", label: "冥想", emoji: "🧘" },
  { id: "water", label: "喝水 2000ml", emoji: "💧" },
  { id: "budget", label: "記帳", emoji: "💰" },
];

const WEEKLY = [
  { id: "exercise", label: "運動 × 2", emoji: "🏋️", target: 2 },
  { id: "spanish", label: "西文課 × 1", emoji: "🇪🇸", target: 1 },
  { id: "social", label: "社交 × 1", emoji: "🤝", target: 1 },
  { id: "create", label: "創作時間 × 0.5", emoji: "✏️", target: 0.5 },
];

const MONTHLY = [
  { id: "new_things", label: "Try new things", emoji: "🌟", target: 1 },
  { id: "lifecoach", label: "Life coach", emoji: "🎯", target: 1 },
];

const YEARLY = [
  { id: "books", label: "Read books", emoji: "📚", target: 6, type: "counter" },
  { id: "articles", label: "Produce articles", emoji: "✍️", target: 6, type: "counter" },
  { id: "movies", label: "Watch movies", emoji: "🎬", target: 12, type: "counter" },
  { id: "marathon", label: "跑 10K Marathon", emoji: "🏃", done: false },
  { id: "scuba", label: "潛水", emoji: "🤿", done: false },
  { id: "ski", label: "滑雪", emoji: "⛷️", done: false },
  { id: "asahiyama", label: “爬山", emoji: "🗻", done: false },
  { id: "volunteer", label: "做志工", emoji: "💚", done: false },
  { id: "spanish_b1", label: "西文 B1", emoji: "🇪🇸", done: false },
  { id: "income2", label: "第 2 收入來源", emoji: "💸", done: false },
  { id: "invest", label: "投資", emoji: "📈", done: false },
  { id: "bodyfat", label: "體脂肪 14% ↓", emoji: "💪", done: false },
  { id: "qcr", label: "4場 QLR", emoji: "🧳", done: false },
  { id: "ai", label: "AI 提升生產力", emoji: "🤖", done: false },
];

const currentMonth = new Date().getMonth();

export default function App() {
  const [tab, setTab] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [data, setData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const m = localStorage.getItem("tracker-monthly");
        if (m) setData(JSON.parse(m));
        const y = localStorage.getItem("tracker-yearly");
        if (y) setYearlyData(JSON.parse(y));
        const n = localStorage.getItem("tracker-notes");
        if (n) setNotes(JSON.parse(n));
      } catch (e) { console.error("Load error", e); }
      setLoading(false);
    };
    loadData();
  }, []);

  const saveMonthly = (nd) => { setData(nd); localStorage.setItem("tracker-monthly", JSON.stringify(nd)); };
  const saveYearly = (ny) => { setYearlyData(ny); localStorage.setItem("tracker-yearly", JSON.stringify(ny)); };
  const saveNotes = (nn) => { setNotes(nn); localStorage.setItem("tracker-notes", JSON.stringify(nn)); };

  const getMonthlyVal = (m, id) => data[`m${m}`]?.[id] ?? 0;
  const setMonthlyVal = (m, id, val) => {
    const mk = `m${m}`;
    saveMonthly({ ...data, [mk]: { ...(data[mk] || {}), [id]: val } });
  };

  const getYearlyProgress = () => {
    return YEARLY.filter(g => g.type === "counter" ? (yearlyData[g.id] >= g.target) : yearlyData[g.id]).length;
  };

  if (loading) return <div style={{ background: "#0f0f13", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;

  const btnStyle = {
    width: 32, height: 32, borderRadius: "50%", border: "1px solid #ffffff30",
    background: "#ffffff10", color: "#f0ede8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#f0ede8", fontFamily: "sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", padding: "40px 20px 20px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#8b8fa8", marginBottom: 5 }}>2026 LIFE TRACKER</div>
        <h1 style={{ margin: 0, fontSize: 24 }}>年度目標追蹤</h1>
        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
          {["daily", "monthly", "yearly"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 20, border: "1px solid",
              borderColor: tab === t ? "#e0c97f" : "#ffffff30",
              background: tab === t ? "#e0c97f22" : "transparent",
              color: tab === t ? "#e0c97f" : "#8b8fa8"
            }}>{t === "daily" ? "每日" : t === "monthly" ? "每月" : "年度"}</button>
          ))}
        </div>
      </div>

      {/* Yearly Tab - 重點修正區 */}
      {tab === "yearly" && (
        <div style={{ padding: 20 }}>
          <div style={{ textAlign: "center", marginBottom: 20, background: "#ffffff08", borderRadius: 15, padding: 20 }}>
            <div style={{ fontSize: 12, color: "#8b8fa8" }}>總體達成率</div>
            <div style={{ fontSize: 40, color: "#e0c97f" }}>{getYearlyProgress()}<span style={{ fontSize: 18 }}>/{YEARLY.length}</span></div>
          </div>

          {YEARLY.map(g => {
            if (g.type === "counter") {
              const val = yearlyData[g.id] || 0;
              const pct = Math.min(Math.round((val / g.target) * 100), 100);
              return (
                <div key={g.id} style={{ marginBottom: 15, background: "#ffffff08", padding: 15, borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span>{g.emoji} {g.label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button onClick={() => saveYearly({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnStyle}>−</button>
                      <span style={{ minWidth: 30, textAlign: "center" }}>{val}</span>
                      <button onClick={() => saveYearly({ ...yearlyData, [g.id]: val + 1 })} style={btnStyle}>+</button>
                    </div>
                  </div>
                  <div style={{ height: 4, background: "#333", borderRadius: 2 }}><div style={{ width: `${pct}%`, height: "100%", background: "#e0c97f", transition: "0.3s" }} /></div>
                  <div style={{ fontSize: 10, color: "#8b8fa8", marginTop: 5 }}>目標 {g.target} / 已完成 {val}</div>
                </div>
              );
            }
            const done = !!yearlyData[g.id];
            return (
              <div key={g.id} onClick={() => saveYearly({ ...yearlyData, [g.id]: !done })} style={{
                marginBottom: 10, padding: 15, background: done ? "#6fcf9715" : "#ffffff08",
                borderRadius: 12, border: "1px solid", borderColor: done ? "#6fcf9740" : "transparent",
                display: "flex", alignItems: "center", gap: 10
              }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid #e0c97f", background: done ? "#e0c97f" : "transparent" }} />
                <span style={{ textDecoration: done ? "line-through" : "none", color: done ? "#8b8fa8" : "#f0ede8" }}>{g.emoji} {g.label}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* 其他 Tab 邏輯依此類推... */}
    </div>
  );
}