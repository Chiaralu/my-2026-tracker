import React, { useState, useEffect } from "react";

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
  { id: "mountain", label: "爬山", emoji: "⛰️", done: false }, // 這裡修正了！
  { id: "volunteer", label: "做志工", emoji: "💚", done: false },
  { id: "spanish_b1", label: "西文 B1", emoji: "🇪🇸", done: false },
  { id: "income2", label: "第 2 收入來源", emoji: "💸", done: false },
  { id: "invest", label: "投資", emoji: "📈", done: false },
  { id: "bodyfat", label: "體脂肪 14% ↓", emoji: "💪", done: false },
  { id: "qcr", label: "4場 QCR", emoji: "🧳", done: false },
  { id: "ai", label: "AI 提升生產力", emoji: "🤖", done: false },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [data, setData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      try {
        const m = localStorage.getItem("tracker-monthly");
        const y = localStorage.getItem("tracker-yearly");
        if (m) setData(JSON.parse(m));
        if (y) setYearlyData(JSON.parse(y));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const saveM = (nd) => { setData(nd); localStorage.setItem("tracker-monthly", JSON.stringify(nd)); };
  const saveY = (ny) => { setYearlyData(ny); localStorage.setItem("tracker-yearly", JSON.stringify(ny)); };

  const getVal = (m, id) => data[`m${m}`]?.[id] ?? 0;
  const setVal = (m, id, val) => {
    const mk = `m${m}`;
    saveM({ ...data, [mk]: { ...(data[mk] || {}), [id]: val } });
  };

  if (loading) return <div style={{ background: "#0f0f13", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;

  const btnS = { width: 32, height: 32, borderRadius: "50%", border: "1px solid #ffffff30", background: "#ffffff10", color: "#f0ede8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#f0ede8", fontFamily: "sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)", padding: "40px 20px 20px" }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: "#8b8fa8", marginBottom: 5 }}>2026 LIFE BLUEPRINT</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: "bold" }}>年度計畫追蹤</h1>
        <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
          {["daily", "monthly", "yearly"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "8px 16px", borderRadius: 20, border: "1px solid",
              borderColor: tab === t ? "#e0c97f" : "#ffffff30",
              background: tab === t ? "#e0c97f22" : "transparent",
              color: tab === t ? "#e0c97f" : "#f0ede8"
            }}>{t === "daily" ? "每日/週" : t === "monthly" ? "每月目標" : "年度累計"}</button>
          ))}
        </div>
      </div>

      {/* 每日/每週內容 */}
      {tab === "daily" && (
        <div style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, color: "#8b8fa8", marginBottom: 15 }}>DAILY HABITS</h3>
          {DAILY.map(h => (
            <div key={h.id} style={{ marginBottom: 12, background: "#ffffff08", padding: "12px 15px", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{h.emoji} {h.label}</span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => setVal(selectedMonth, h.id, Math.max(0, getVal(selectedMonth, h.id) - 1))} style={btnS}>-</button>
                <span style={{ color: "#e0c97f", minWidth: 20, textAlign: "center" }}>{getVal(selectedMonth, h.id)}</span>
                <button onClick={() => setVal(selectedMonth, h.id, getVal(selectedMonth, h.id) + 1)} style={btnS}>+</button>
              </div>
            </div>
          ))}
          <h3 style={{ fontSize: 14, color: "#8b8fa8", marginTop: 25, marginBottom: 15 }}>WEEKLY GOALS</h3>
          {WEEKLY.map(w => (
            <div key={w.id} style={{ marginBottom: 12, background: "#ffffff08", padding: "12px 15px", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{w.emoji} {w.label}</span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => setVal(selectedMonth, w.id, Math.max(0, getVal(selectedMonth, w.id) - 0.5))} style={btnS}>-</button>
                <span style={{ color: "#e0c97f", minWidth: 20, textAlign: "center" }}>{getVal(selectedMonth, w.id)}</span>
                <button onClick={() => setVal(selectedMonth, w.id, getVal(selectedMonth, w.id) + 0.5)} style={btnS}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 每月目標內容 */}
      {tab === "monthly" && (
        <div style={{ padding: 20 }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#1a1a2e", color: "#fff", border: "1px solid #333", marginBottom: 20 }}>
            {MONTHS_ZH.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          {MONTHLY.map(m => (
            <div key={m.id} style={{ marginBottom: 12, background: "#ffffff08", padding: "15px", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{m.emoji} {m.label}</span>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={() => setVal(selectedMonth, m.id, Math.max(0, getVal(selectedMonth, m.id) - 1))} style={btnS}>-</button>
                <span style={{ color: "#e0c97f", minWidth: 20, textAlign: "center" }}>{getVal(selectedMonth, m.id)}</span>
                <button onClick={() => setVal(selectedMonth, m.id, getVal(selectedMonth, m.id) + 1)} style={btnS}>+</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 年度累計內容 */}
      {tab === "yearly" && (
        <div style={{ padding: 20 }}>
          {YEARLY.map(g => {
            if (g.type === "counter") {
              const val = yearlyData[g.id] || 0;
              return (
                <div key={g.id} style={{ marginBottom: 15, background: "#ffffff08", padding: 15, borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span>{g.emoji} {g.label}</span>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button onClick={() => saveY({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnS}>-</button>
                      <span style={{ color: "#e0c97f" }}>{val} / {g.target}</span>
                      <button onClick={() => saveY({ ...yearlyData, [g.id]: val + 1 })} style={btnS}>+</button>
                    </div>
                  </div>
                </div>
              );
            }
            const done = !!yearlyData[g.id];
            return (
              <div key={g.id} onClick={() => saveY({ ...yearlyData, [g.id]: !done })} style={{ marginBottom: 10, padding: 15, background: done ? "#6fcf9720" : "#ffffff08", borderRadius: 12, border: "1px solid", borderColor: done ? "#6fcf9740" : "transparent", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #e0c97f", background: done ? "#e0c97f" : "transparent" }} />
                <span style={{ color: done ? "#8b8fa8" : "#f0ede8", textDecoration: done ? "line-through" : "none" }}>{g.emoji} {g.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
