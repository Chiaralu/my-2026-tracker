import React, { useState, useEffect } from "react";

const MONTHS_ZH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const DAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DAILY_ITEMS = [
  { id: "gratitude", label: "感恩日記", emoji: "📖" },
  { id: "meditate", label: "冥想", emoji: "🧘" },
  { id: "water", label: "喝水 2000ml", emoji: "💧" },
  { id: "budget", label: "記帳", emoji: "💰" },
];

const MONTHLY_ITEMS = [
  { id: "new_things", label: "嘗試新事物", emoji: "🌟" },
  { id: "lifecoach", label: "Life coach 諮詢", emoji: "🎯" },
  { id: "dislike_thing", label: "挑戰一件討厭的事", emoji: "😤" },
];

const YEARLY_ITEMS = [
  { id: "books", label: "閱讀書籍", emoji: "📚", target: 6, type: "counter" },
  { id: "articles", label: "撰寫文章", emoji: "✍️", target: 6, type: "counter" },
  { id: "movies", label: "觀看電影", emoji: "🎬", target: 12, type: "counter" },
  { id: "marathon", label: "跑 10K 馬拉松", emoji: "🏃" },
  { id: "scuba", label: "潛水", emoji: "🤿" },
  { id: "ski", label: "滑雪", emoji: "⛷️" },
  { id: "mountain", label: "爬山", emoji: "⛰️" },
  { id: "volunteer", label: "做志工", emoji: "💚" },
  { id: "spanish_b1", label: "西文 B1", emoji: "🇪🇸" },
  { id: "income2", label: "第二收入來源", emoji: "💸" },
  { id: "invest", label: "投資轉帳", emoji: "📈" },
  { id: "bodyfat", label: "體脂肪 14% ↓", emoji: "💪" },
  { id: "qlr", label: "4場 QLR", emoji: "🧳" },
  { id: "ai", label: "AI 提升生產力", emoji: "🤖" },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const [showReview, setShowReview] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); 
  const [mSelect, setMSelect] = useState(new Date().getMonth());
  const [dailyHistory, setDailyHistory] = useState({});
  const [mValues, setMValues] = useState({});
  const [yValues, setYValues] = useState({});
  const [notes, setNotes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      try {
        setDailyHistory(JSON.parse(localStorage.getItem("t-dh") || "{}"));
        setMValues(JSON.parse(localStorage.getItem("t-m") || "{}"));
        setYValues(JSON.parse(localStorage.getItem("t-y") || "{}"));
        setNotes(JSON.parse(localStorage.getItem("t-n") || "{}"));
      } catch (e) {}
      setLoading(false);
    };
    load();
  }, []);

  const saveDH = (v) => { setDailyHistory(v); localStorage.setItem("t-dh", JSON.stringify(v)); };
  const saveM = (v) => { setMValues(v); localStorage.setItem("t-m", JSON.stringify(v)); };
  const saveY = (v) => { setYValues(v); localStorage.setItem("t-y", JSON.stringify(v)); };
  const saveN = (v) => { setNotes(v); localStorage.setItem("t-n", JSON.stringify(v)); };

  const dateKey = viewDate.toISOString().split('T')[0];
  const formattedDate = `${DAYS_EN[viewDate.getDay()]}, ${MONTHS_EN[viewDate.getMonth()]} ${viewDate.getDate()}`;

  const calculateStreak = (id) => {
    let s = 0; let c = new Date();
    for (let i = 0; i < 365; i++) {
      const d = c.toISOString().split('T')[0];
      if (dailyHistory[d]?.includes(id)) { s++; c.setDate(c.getDate() - 1); } else break;
    }
    return s;
  };

  // 統計功能
  const getMonthlyStats = () => {
    const stats = {};
    DAILY_ITEMS.forEach(item => stats[item.id] = 0);
    Object.keys(dailyHistory).forEach(date => {
      if (new Date(date).getMonth() === mSelect) {
        dailyHistory[date].forEach(id => { if (stats[id] !== undefined) stats[id]++; });
      }
    });
    return stats;
  };

  if (loading) return null;

  const cardStyle = { background: "#fff", padding: "18px 20px", borderRadius: "16px", marginBottom: "12px", border: "1px solid #f2f2f2" };
  const btnStyle = { width: 32, height: 32, borderRadius: "50%", border: "1px solid #eee", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", color: "#2d2d2d", fontFamily: "-apple-system, sans-serif", paddingBottom: "60px" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "60px 25px 25px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#aaa", marginBottom: "8px", fontWeight: "600" }}>2026 LIFE BLUEPRINT</div>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>{showReview ? "REVIEW" : tab.toUpperCase()}</h1>
          </div>
          <button onClick={() => setShowReview(!showReview)} style={{ background: "none", border: "1.5px solid #000", padding: "4px 12px", borderRadius: "12px", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>
            {showReview ? "BACK" : "REVIEW"}
          </button>
        </div>
        {!showReview && (
          <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
            {["daily", "monthly", "yearly"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "8px 20px", borderRadius: "20px", border: "1px solid",
                borderColor: tab === t ? "#000" : "#eee", background: tab === t ? "#000" : "transparent",
                color: tab === t ? "#fff" : "#888", fontSize: "12px", fontWeight: "600"
              }}>{t === "daily" ? "日/週" : t === "monthly" ? "每月" : "年度"}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "25px" }}>
        {showReview ? (
          /* REVIEW MODE */
          <>
            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>{MONTHS_ZH[mSelect]} 統計回顧</h3>
            {DAILY_ITEMS.map(h => {
              const count = getMonthlyStats()[h.id];
              return (
                <div key={h.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between" }}>
                  <span>{h.emoji} {h.label}</span>
                  <span style={{ fontWeight: "600" }}>本月完成 {count} 天</span>
                </div>
              );
            })}
            <div style={{ marginTop: "30px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px" }}>年度大目標進度</h3>
              {YEARLY_ITEMS.map(g => {
                const val = yValues[g.id] || 0;
                const status = g.type === "counter" ? `${val}/${g.target}` : (yValues[g.id] ? "已達成 ✅" : "進行中 ⏳");
                return (
                  <div key={g.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span>{g.label}</span>
                    <span style={{ fontWeight: "600" }}>{status}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* REGULAR MODE */
          <>
            {tab === "daily" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <button onClick={() => {const d = new Date(viewDate); d.setDate(d.getDate()-1); setViewDate(d);}} style={{ background: "none", border: "none", color: "#ccc", fontSize: "20px" }}>‹</button>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "15px", fontWeight: "600" }}>{formattedDate}</div>
                  </div>
                  <button onClick={() => {const d = new Date(viewDate); d.setDate(d.getDate()+1); setViewDate(d);}} style={{ background: "none", border: "none", color: "#ccc", fontSize: "20px" }}>›</button>
                </div>
                {DAILY_ITEMS.map(h => {
                  const done = dailyHistory[dateKey]?.includes(h.id);
                  const streak = calculateStreak(h.id);
                  return (
                    <div key={h.id} onClick={() => {
                      const list = dailyHistory[dateKey] || [];
                      const newList = list.includes(h.id) ? list.filter(i => i !== h.id) : [...list, h.id];
                      saveDH({ ...dailyHistory, [dateKey]: newList });
                    }} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: done ? "#000" : "#f2f2f2" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "5px", border: "1.5px solid #000", background: done ? "#000" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {done && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
                        </div>
                        <span style={{ fontSize: "15px" }}>{h.emoji} {h.label}</span>
                      </div>
                      {streak > 0 && <span style={{ fontSize: "11px", color: "#bbb" }}>🔥 {streak} 天</span>}
                    </div>
                  );
                })}
              </>
            )}

            {tab === "monthly" && (
              <>
                <select value={mSelect} onChange={(e) => setMSelect(parseInt(e.target.value))} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #eee", marginBottom: "20px", fontSize: "14px", background: "#fff", outline: "none" }}>
                  {MONTHS_ZH.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                {MONTHLY_ITEMS.map(m => {
                  const val = mValues[`m${mSelect}_${m.id}`] || 0;
                  const note = notes[`m${mSelect}_${m.id}`] || "";
                  return (
                    <div key={m.id} style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>{m.emoji} {m.label}</span>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <button onClick={() => saveM({ ...mValues, [`m${mSelect}_${m.id}`]: Math.max(0, val - 1) })} style={btnStyle}>-</button>
                          <span style={{ fontSize: "14px", fontWeight: "600", minWidth: "20px", textAlign: "center" }}>{val}</span>
                          <button onClick={() => saveM({ ...mValues, [`m${mSelect}_${m.id}`]: val + 1 })} style={btnStyle}>+</button>
                        </div>
                      </div>
                      <input placeholder="寫下紀錄（如：挑戰了什麼...）" value={note} onChange={(e) => saveN({ ...notes, [`m${mSelect}_${m.id}`]: e.target.value })}
                        style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #f5f5f5", color: "#aaa", fontSize: "13px", outline: "none", padding: "4px 0" }} 
                      />
                    </div>
                  );
                })}
              </>
            )}

            {tab === "yearly" && (
              <>
                {YEARLY_ITEMS.map(g => {
                  const val = yValues[g.id] || 0;
                  const note = notes[g.id] || "";
                  const pct = g.type === "counter" ? Math.min(Math.round((val / g.target) * 100), 100) : 0;
                  return (
                    <div key={g.id} style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <span style={{ fontSize: "15px", fontWeight: "500" }}>{g.emoji} {g.label}</span>
                        {g.type === "counter" ? (
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <button onClick={() => saveY({ ...yValues, [g.id]: Math.max(0, val - 1) })} style={btnStyle}>-</button>
                            <span style={{ fontSize: "13px", fontWeight: "600" }}>{val}/{g.target}</span>
                            <button onClick={() => saveY({ ...yValues, [g.id]: val + 1 })} style={btnStyle}>+</button>
                          </div>
                        ) : (
                          <div onClick={() => saveY({ ...yValues, [g.id]: !yValues[g.id] })} style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #000", background: yValues[g.id] ? "#000" : "transparent" }} />
                        )}
                      </div>
                      {g.type === "counter" && (
                        <div style={{ height: "2px", background: "#f5f5f5", width: "100%", marginBottom: "12px" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#000", transition: "0.5s" }} />
                        </div>
                      )}
                      <input placeholder="備註..." value={note} onChange={(e) => saveN({ ...notes, [g.id]: e.target.value })}
                        style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid #f5f5f5", color: "#bbb", fontSize: "12px", outline: "none" }} />
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
