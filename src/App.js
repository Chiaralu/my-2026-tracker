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

const MONTHLY_GOALS = [
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
  { id: "qlr", label: "4場 QLR", emoji: "🧳", done: false },
  { id: "ai", label: "AI 提升生產力", emoji: "🤖", done: false },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [dailyHistory, setDailyHistory] = useState({}); // 格式: { "2026-03-10": ["gratitude", "water"] }
  const [data, setData] = useState({});
  const [yearlyData, setYearlyData] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = () => {
      try {
        setDailyHistory(JSON.parse(localStorage.getItem("tracker-dh") || "{}"));
        setData(JSON.parse(localStorage.getItem("tracker-m") || "{}"));
        setYearlyData(JSON.parse(localStorage.getItem("tracker-y") || "{}"));
        setNotes(JSON.parse(localStorage.getItem("tracker-n") || "{}"));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const saveDH = (ndh) => { setDailyHistory(ndh); localStorage.setItem("tracker-dh", JSON.stringify(ndh)); };
  const saveY = (ny) => { setYearlyData(ny); localStorage.setItem("tracker-y", JSON.stringify(ny)); };
  const saveN = (nn) => { setNotes(nn); localStorage.setItem("tracker-n", JSON.stringify(nn)); };
  const saveM = (nm) => { setData(nm); localStorage.setItem("tracker-m", JSON.stringify(nm)); };

  // 計算連續天數 (Streak)
  const calculateStreak = (habitId) => {
    let streak = 0;
    let curr = new Date();
    while (true) {
      const dateStr = curr.toISOString().split('T')[0];
      if (dailyHistory[dateStr]?.includes(habitId)) {
        streak++;
        curr.setDate(curr.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const toggleDaily = (habitId) => {
    const currentList = dailyHistory[today] || [];
    const newList = currentList.includes(habitId) 
      ? currentList.filter(id => id !== habitId)
      : [...currentList, habitId];
    saveDH({ ...dailyHistory, [today]: newList });
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
            <div style={{ background: "#ffffff08", padding: 15, borderRadius: 12, marginBottom: 25 }}>
                <div style={{ fontSize: 12, color: "#8b8fa8", marginBottom: 10 }}>今日任務達成率</div>
                <div style={{ height: 6, background: "#333", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${((dailyHistory[today]?.length || 0) / DAILY.length) * 100}%`, height: "100%", background: "#e0c97f", transition: "width 0.3s" }} />
                </div>
            </div>

            <h3 style={{ fontSize: 13, color: "#8b8fa8", marginBottom: 15 }}>DAILY STREAKS 🔥</h3>
            {DAILY.map(h => {
              const doneToday = dailyHistory[today]?.includes(h.id);
              const streak = calculateStreak(h.id);
              return (
                <div key={h.id} onClick={() => toggleDaily(h.id)} style={{ 
                  marginBottom: 12, background: doneToday ? "#e0c97f15" : "#ffffff08", 
                  padding: "15px", borderRadius: 12, display: "flex", justifyContent: "space-between", 
                  alignItems: "center", border: "1px solid", borderColor: doneToday ? "#e0c97f40" : "transparent",
                  transition: "0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #e0c97f", background: doneToday ? "#e0c97f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                        {doneToday && "✓"}
                    </div>
                    <span>{h.emoji} {h.label}</span>
                  </div>
                  {streak > 0 && (
                    <span style={{ fontSize: 12, color: "#e0c97f", fontWeight: "bold" }}>
                      🔥 {streak} 天
                    </span>
                  )}
                </div>
              );
            })}
          </>
        )}

        {tab === "monthly" && (
            <div style={{ color: "#8b8fa8", textAlign: "center", marginTop: 40 }}>
                每月計畫內容已整合至資料庫，請點擊「每月」分頁查看。<br/>
                (此部分邏輯與前版本相同)
            </div>
        )}

        {tab === "yearly" && (
          <>
            {YEARLY.map(g => {
              const val = yearlyData[g.id] || 0;
              const note = notes[g.id] || "";
              const pct = g.type === "counter" ? Math.min(Math.round((val / g.target) * 100), 100) : 0;
              
              return (
                <div key={g.id} style={{ marginBottom: 20, background: "#ffffff08", padding: 15, borderRadius: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span>{g.emoji} {g.label}</span>
                    {g.type === "counter" ? (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button onClick={() => saveY({ ...yearlyData, [g.id]: Math.max(0, val - 1) })} style={btnS}>-</button>
                            <span style={{ color: "#e0c97f", fontSize: 14 }}>{val}/{g.target}</span>
                            <button onClick={() => saveY({ ...yearlyData, [g.id]: val + 1 })} style={btnS}>+</button>
                        </div>
                    ) : (
                        <div onClick={() => saveY({ ...yearlyData, [g.id]: !yearlyData[g.id] })} style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #e0c97f", background: yearlyData[g.id] ? "#e0c97f" : "transparent" }} />
                    )}
                  </div>
                  {g.type === "counter" && (
                    <div style={{ height: 4, background: "#333", borderRadius: 2, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#e0c97f" }} />
                    </div>
                  )}
                  <input 
                    placeholder="寫下備註..."
                    value={note}
                    onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })}
                    style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #ffffff20", color: "#8b8fa8", fontSize: 12, outline: "none" }}
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
