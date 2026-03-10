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
  { id: "mountain", label: "爬山", emoji: "⛰️", done: false },
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
  const [notes, setNotes] = useState({}); // 存備註的功能
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      try {
        const m = localStorage.getItem("tracker-m");
        const y = localStorage.getItem("tracker-y");
        const n = localStorage.getItem("tracker-n");
        if (m) setData(JSON.parse(m));
        if (y) setYearlyData(JSON.parse(y));
        if (n) setNotes(JSON.parse(n));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const saveM = (nd) => { setData(nd); localStorage.setItem("tracker-m", JSON.stringify(nd)); };
  const saveY = (ny) => { setYearlyData(ny); localStorage.setItem("tracker-y", JSON.stringify(ny)); };
  const saveN = (nn) => { setNotes(nn); localStorage.setItem("tracker-n", JSON.stringify(nn)); };

  const getVal = (m, id) => data[`m${m}`]?.[id] ?? 0;
  const setVal = (m, id, val) => {
    const mk = `m${m}`;
    saveM({ ...data, [mk]: { ...(data[mk] || {}), [id]: val } });
  };

  if (loading) return <div style={{ background: "#0f0f13", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>;

  const btnS = { width: 32, height: 32, borderRadius: "50%", border: "1px solid #ffffff30", background: "#ffffff10", color: "#f0ede8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#f0ede8", fontFamily: "sans-serif", paddingBottom: 60 }}>
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
            }}>{t === "daily" ? "日/週" : t === "monthly" ? "每月" : "年度"}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        {tab === "daily" && (
          <>
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
          </>
        )}

        {tab === "yearly" && (
          <>
            {YEARLY.map(g => {
              const val = yearlyData[g.id] || 0;
              const note = notes[g.id] || "";
              
              if (g.type === "counter") {
                const pct = Math.min(Math.round((val / g.target) * 100), 100);
                return (
                  <div key={g.id} style={{ marginBottom: 20, background: "#ffffff08", padding: 15, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span>{g.emoji} {g.label}</span>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnS}>-</button>
                        <span style={{ color: "#e0c97f", fontSize: 14 }}>{val} / {g.target}</span>
                        <button onClick={() => saveY({ ...yearlyData, [g.id]: val + 1 })} style={btnS}>+</button>
                      </div>
                    </div>
                    {/* 進度條 */}
                    <div style={{ height: 6, background: "#333", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #e0c97f, #b89b4d)", transition: "width 0.5s ease" }} />
                    </div>
                    {/* 備註框 */}
                    <input 
                      placeholder="點此寫下備註（如：爬了哪座山）..."
                      value={note}
                      onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })}
                      style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #ffffff20", color: "#8b8fa8", fontSize: 12, outline: "none", paddingTop: 5 }}
                    />
                  </div>
                );
              }
              const done = !!yearlyData[g.id];
              return (
                <div key={g.id} style={{ marginBottom: 15, background: done ? "#6fcf9715" : "#ffffff08", padding: 15, borderRadius: 12, border: "1px solid", borderColor: done ? "#6fcf9740" : "transparent" }}>
                  <div onClick={() => saveY({ ...yearlyData, [g.id]: !done })} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #e0c97f", background: done ? "#e0c97f" : "transparent" }} />
                    <span style={{ color: done ? "#8b8fa8" : "#f0ede8", textDecoration: done ? "line-through" : "none" }}>{g.emoji} {g.label}</span>
                  </div>
                  <input 
                    placeholder="點此寫下備註..."
                    value={note}
                    onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #ffffff15", color: "#8b8fa8", fontSize: 12, outline: "none", paddingLeft: 28 }}
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
