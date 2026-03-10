import { useState, useEffect, useRef } from "react";

const KIDS = ["Silas", "Ezra", "Eli"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const KID_CONFIG = {
  Silas: { bg: "#FFF3E0", accent: "#CC0000", light: "#FFCDD2", emoji: "🦩", emojiLabel: "flamingo", pin: "0516", grad: "linear-gradient(135deg, #CC0000, #FF4444)" },
  Ezra:  { bg: "#FFFDE7", accent: "#F9A800", light: "#FFF176", emoji: "🐆", emojiLabel: "leopard", pin: "3218", grad: "linear-gradient(135deg, #F9A800, #FFD740)" },
  Eli:   { bg: "#E3F2FD", accent: "#1565C0", light: "#BBDEFB", emoji: "🐄", emojiLabel: "cow", pin: "1111", grad: "linear-gradient(135deg, #1565C0, #42A5F5)" },
};

const MOM_PIN = "5258";

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  if (day >= 1 && day <= 5) {
    monday.setDate(today.getDate() + (8 - day));
  } else {
    monday.setDate(today.getDate() + (day === 0 ? 1 : 2));
  }
  return DAYS.map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      name,
      date: d,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      key: d.toISOString().slice(0, 10),
    };
  });
}

const defaultMenu = () => {
  const week = getWeekDates();
  const obj = {};
  week.forEach(({ key }) => { obj[key] = { main: "", sides: "", image: "" }; });
  return obj;
};

/* Visually hidden but accessible to screen readers */
const srOnly = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

function PinPad({ onSubmit, onCancel, error, title, emoji, emojiLabel, grad, describedById }) {
  const [pin, setPin] = useState("");
  const firstBtnRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const errorId = "pin-error-msg";
  const titleId = "pin-pad-title";

  /* Move focus into the dialog when it opens */
  useEffect(() => {
    firstBtnRef.current?.focus();
  }, []);

  /* Trap focus inside modal: cycle from last element back to first */
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  const press = (val) => {
    if (pin.length < 4) {
      const next = pin + val;
      setPin(next);
      if (next.length === 4) setTimeout(() => { onSubmit(next); setPin(""); }, 120);
    }
  };

  const del = () => setPin(p => p.slice(0, -1));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={describedById}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div style={{
        background: "white", borderRadius: 28, padding: "32px 28px",
        textAlign: "center", boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
        width: 300, maxWidth: "90vw",
      }}>
        <div
          aria-hidden="true"
          style={{
            width: 72, height: 72, borderRadius: "50%",
            background: grad, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 36, margin: "0 auto 12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          }}
        >{emoji}</div>

        <h2
          id={titleId}
          style={{
            fontFamily: "'Fredoka One'", fontSize: 22, margin: "0 0 4px",
            background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >{title}</h2>
        <p id={describedById} style={{ color: "#aaa", fontSize: 13, margin: "0 0 20px" }}>
          Enter your 4-digit PIN
        </p>

        {/* PIN dot indicators */}
        <div
          role="status"
          aria-live="polite"
          aria-label={`${pin.length} of 4 digits entered`}
          style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 20 }}
        >
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                width: 18, height: 18, borderRadius: "50%",
                background: i < pin.length ? "#333" : "#eee",
                transition: "background 0.15s",
                border: error ? "2px solid #FF6B6B" : "2px solid transparent",
              }}
            />
          ))}
        </div>

        {/* Error message announced by screen readers */}
        <div
          id={errorId}
          role="alert"
          aria-live="assertive"
          style={{ minHeight: 24, marginBottom: error ? 4 : 0 }}
        >
          {error && (
            <p style={{ color: "#FF6B6B", fontSize: 13, margin: "-12px 0 12px", fontWeight: 700 }}>
              Wrong PIN! Try again
              <span aria-hidden="true"> 🔒</span>
            </p>
          )}
        </div>

        <div
          role="group"
          aria-label="PIN number pad"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n, idx) => (
            <button
              key={n}
              ref={idx === 0 ? firstBtnRef : undefined}
              onClick={() => press(String(n))}
              aria-label={`${n}`}
              style={numBtnStyle}
            >
              {n}
            </button>
          ))}
          {/* Empty cell */}
          <div aria-hidden="true" />
          <button onClick={() => press("0")} aria-label="0" style={numBtnStyle}>0</button>
          <button
            onClick={del}
            aria-label="Delete last digit"
            style={{ ...numBtnStyle, background: "#FFF3E0", color: "#FF8C00", fontSize: 20 }}
          >
            <span aria-hidden="true">⌫</span>
          </button>
        </div>

        <button
          ref={cancelBtnRef}
          onClick={onCancel}
          style={{
            width: "100%", padding: "11px", borderRadius: 14,
            border: "2px solid #eee", background: "white",
            color: "#999", fontFamily: "'Nunito'", fontWeight: 700,
            fontSize: 14, cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [activeKid, setActiveKid] = useState(null);
  const [pinTarget, setPinTarget] = useState(null);
  const [pinError, setPinError] = useState(false);
  const [menu, setMenu] = useState(defaultMenu);
  const [choices, setChoices] = useState({});
  const [editMenu, setEditMenu] = useState(null);
  const [editSource, setEditSource] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const week = getWeekDates();
  const weekKey = week[0].key;

  /* Ref for returning focus after modal closes */
  const lastFocusedRef = useRef(null);
  /* Ref to focus main content heading on view change */
  const mainHeadingRef = useRef(null);

  /* Load shared menu and choices from persistent storage on mount */
  useEffect(() => {
    async function loadData() {
      try {
        const menuResult = await window.storage.get("lunchpicker-menu-" + weekKey, true);
        if (menuResult) setMenu(JSON.parse(menuResult.value));
      } catch(e) { /* no saved menu yet */ }
      try {
        const choicesResult = await window.storage.get("lunchpicker-choices-" + weekKey, true);
        if (choicesResult) setChoices(JSON.parse(choicesResult.value));
      } catch(e) { /* no saved choices yet */ }
      setIsLoading(false);
    }
    loadData();
  }, [weekKey]);

  /* Move focus to main heading whenever the view changes */
  useEffect(() => {
    if (!isLoading) {
      mainHeadingRef.current?.focus();
    }
  }, [view, isLoading]);

  /* Restore focus to trigger element when PIN dialog closes */
  useEffect(() => {
    if (!pinTarget && lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [pinTarget]);

  const saveMenu = async (newMenu) => {
    setMenu(newMenu);
    try {
      await window.storage.set("lunchpicker-menu-" + weekKey, JSON.stringify(newMenu), true);
    } catch(e) { console.error("Failed to save menu", e); }
  };

  const saveChoices = async (newChoices) => {
    setChoices(newChoices);
    try {
      await window.storage.set("lunchpicker-choices-" + weekKey, JSON.stringify(newChoices), true);
    } catch(e) { console.error("Failed to save choices", e); }
  };

  const handleKidPress = (kid, triggerEl) => {
    lastFocusedRef.current = triggerEl;
    setPinTarget({ type: "kid", name: kid });
    setPinError(false);
  };

  const handleMomPress = (triggerEl) => {
    lastFocusedRef.current = triggerEl;
    setPinTarget({ type: "mom" });
    setPinError(false);
  };

  const handlePinSubmit = (pin) => {
    if (pinTarget.type === "kid") {
      if (pin === KID_CONFIG[pinTarget.name].pin) {
        setActiveKid(pinTarget.name);
        setView("kid");
        setPinTarget(null);
      } else {
        setPinError(true);
        setTimeout(() => setPinError(false), 1200);
      }
    } else {
      if (pin === MOM_PIN) {
        setView("mom");
        setPinTarget(null);
      } else {
        setPinError(true);
        setTimeout(() => setPinError(false), 1200);
      }
    }
  };

  const setChoice = (dayKey, value) => {
    setChoices(prev => {
      const newChoices = { ...prev, [dayKey]: { ...(prev[dayKey] || {}), [activeKid]: value } };
      saveChoices(newChoices);
      return newChoices;
    });
  };

  if (isLoading) return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Lunch Time app"
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 50%, #FCE4EC 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />
      <div aria-hidden="true" style={{ fontSize: 56, marginBottom: 16 }}>🍱</div>
      <div style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: "#FF6B6B" }}>Loading Lunch Time!</div>
      <div style={{ color: "#aaa", fontSize: 14, marginTop: 8 }}>Syncing menu...</div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 50%, #FCE4EC 100%)",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap" rel="stylesheet" />

      {/* Skip to main content link */}
      <a
        href="#main-content"
        style={{
          ...srOnly,
          ":focus": { position: "static" },
        }}
        onFocus={e => Object.assign(e.currentTarget.style, {
          position: "static", width: "auto", height: "auto",
          padding: "8px 16px", margin: 0, overflow: "visible",
          clip: "auto", whiteSpace: "normal",
          background: "white", color: "#FF6B6B",
          zIndex: 9999, textDecoration: "underline",
        })}
        onBlur={e => Object.assign(e.currentTarget.style, srOnly)}
      >
        Skip to main content
      </a>

      {pinTarget && (
        <PinPad
          emoji={pinTarget.type === "mom" ? "👩🏻" : KID_CONFIG[pinTarget.name].emoji}
          emojiLabel={pinTarget.type === "mom" ? "mom" : KID_CONFIG[pinTarget.name].emojiLabel}
          title={pinTarget.type === "mom" ? "Mom's View" : pinTarget.name}
          grad={pinTarget.type === "mom" ? "linear-gradient(135deg, #FF6B6B, #FF8E53)" : KID_CONFIG[pinTarget.name].grad}
          onSubmit={handlePinSubmit}
          onCancel={() => setPinTarget(null)}
          error={pinError}
          describedById="pin-description"
        />
      )}

      <header style={{
        background: "linear-gradient(90deg, #FF6B6B, #FF8E53)",
        padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(255,107,107,0.4)", position: "sticky", top: 0, zIndex: 100,
      }}>
        {view !== "home" ? (
          <a
            href="#"
            role="link"
            aria-label="Lunch Time – go to home"
            onClick={e => { e.preventDefault(); setView("home"); setActiveKid(null); }}
            style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textDecoration: "none" }}
          >
            <span aria-hidden="true" style={{ fontSize: 30 }}>🍱</span>
            <span style={{ fontFamily: "'Fredoka One'", fontSize: 24, color: "white", letterSpacing: 1, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
              Lunch Time!
            </span>
          </a>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span aria-hidden="true" style={{ fontSize: 30 }}>🍱</span>
            <span style={{ fontFamily: "'Fredoka One'", fontSize: 24, color: "white", letterSpacing: 1, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
              Lunch Time!
            </span>
          </div>
        )}

        <nav aria-label="App navigation" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {view !== "home" && (
            <button
              onClick={() => { setView("home"); setActiveKid(null); }}
              aria-label="Go back to Home"
              style={backBtnStyle}
            >
              <span aria-hidden="true">←</span> Home
            </button>
          )}
          <button
            onClick={e => handleMomPress(e.currentTarget)}
            aria-label="Mom's view – enter PIN"
            style={momBtnStyle}
          >
            <span aria-hidden="true" style={{ fontSize: 18 }}>👩🏻</span>
            <span style={{ fontWeight: 800, fontSize: 12 }}>MOM</span>
          </button>
        </nav>
      </header>

      <main id="main-content" style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px" }}>

        {/* HOME */}
        {view === "home" && (
          <section aria-label="Home – choose a child">
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1
                ref={mainHeadingRef}
                tabIndex={-1}
                style={{
                  fontFamily: "'Fredoka One'", fontSize: 26, color: "#555", margin: 0, fontWeight: 400,
                  outline: "none",
                }}
              >
                Who's picking lunch?
                <span aria-hidden="true"> 🎉</span>
              </h1>
              <p style={{ color: "#aaa", fontSize: 14, margin: "8px 0 0" }}>Tap your name to log in</p>
            </div>

            <ul
              role="list"
              aria-label="Kids"
              style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", listStyle: "none", margin: 0, padding: 0 }}
            >
              {KIDS.map(kid => {
                const c = KID_CONFIG[kid];
                const doneCount = week.filter(({ key }) => choices[key]?.[kid]).length;
                const allDone = doneCount === 5;
                return (
                  <li key={kid}>
                    <button
                      onClick={e => handleKidPress(kid, e.currentTarget)}
                      aria-label={`${kid} – ${allDone ? "all 5 days picked" : `${doneCount} of 5 days picked`} – enter PIN to log in`}
                      style={{
                        width: 160, padding: "28px 20px 22px", borderRadius: 24,
                        border: `3px solid ${c.light}`, background: c.bg, cursor: "pointer",
                        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
                        fontFamily: "'Nunito'", display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          width: 80, height: 80, borderRadius: "50%", background: c.grad,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 40, boxShadow: `0 6px 18px ${c.accent}44`,
                        }}
                      >{c.emoji}</div>
                      <div style={{ fontFamily: "'Fredoka One'", fontSize: 22, color: c.accent }}>{kid}</div>
                      <div
                        aria-hidden="true"
                        style={{
                          fontSize: 12, fontWeight: 700,
                          color: allDone ? c.accent : "#bbb",
                          background: allDone ? c.light : "#f5f5f5",
                          padding: "3px 10px", borderRadius: 20,
                        }}
                      >
                        {allDone ? "✅ All done!" : `${doneCount}/5 picked`}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <button
                onClick={() => { setEditMenu(JSON.parse(JSON.stringify(menu))); setEditSource("home"); setView("edit"); }}
                aria-label="Edit this week's lunch menu"
                style={{
                  padding: "13px 28px", borderRadius: 16, border: "2px dashed #FF8E53",
                  background: "white", color: "#FF8E53", fontFamily: "'Nunito'",
                  fontWeight: 800, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(255,142,83,0.15)",
                }}
              >
                <span aria-hidden="true">✏️ </span>Edit This Week Menu
              </button>
            </div>
          </section>
        )}

        {/* KID VIEW */}
        {view === "kid" && activeKid && (() => {
          const c = KID_CONFIG[activeKid];
          const allDone = week.every(({ key }) => choices[key]?.[activeKid]);
          return (
            <section aria-label={`${activeKid}'s lunch picks`}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div aria-hidden="true" style={{ fontSize: 44, marginBottom: 6 }}>{c.emoji}</div>
                <h1
                  ref={mainHeadingRef}
                  tabIndex={-1}
                  style={{
                    fontFamily: "'Fredoka One'", fontSize: 26, margin: "0 0 4px",
                    background: c.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    outline: "none",
                  }}
                >
                  {activeKid}'s Lunch Picks
                </h1>
                <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>Pack or Buy for each day?</p>
              </div>

              {/* Live region so screen readers hear choice changes */}
              <div role="status" aria-live="polite" style={srOnly} id="choice-announcement" />

              {week.map(({ name, label, key }) => {
                const dayMenu = menu[key] || {};
                const val = choices[key]?.[activeKid] || "";
                return (
                  <article
                    key={key}
                    aria-label={`${name} ${label}${val ? ` – ${val === "Pack" ? "packing lunch" : "buying lunch"}` : " – no choice yet"}`}
                    style={{
                      background: "white", borderRadius: 20, marginBottom: 14,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.07)", overflow: "hidden",
                      border: `2px solid ${val ? c.accent : "#f0f0f0"}`,
                      transition: "border-color 0.2s",
                    }}
                  >
                    <div style={{
                      background: val ? c.grad : "linear-gradient(90deg, #eee, #f5f5f5)",
                      padding: "10px 18px", display: "flex", alignItems: "center", gap: 10,
                    }}>
                      <span style={{ fontFamily: "'Fredoka One'", fontSize: 18, color: val ? "white" : "#999" }}>{name}</span>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: val ? "rgba(255,255,255,0.8)" : "#bbb",
                        background: "rgba(0,0,0,0.1)", padding: "2px 8px", borderRadius: 12,
                      }}>{label}</span>
                      {val && (
                        <span aria-hidden="true" style={{ marginLeft: "auto", color: "white", fontSize: 13, fontWeight: 800 }}>
                          {val === "Pack" ? "🍱 Packing!" : "🏦 Buying!"}
                        </span>
                      )}
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      {dayMenu.main ? (
                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                          <div aria-hidden="true" style={{ fontSize: 52, lineHeight: 1, flexShrink: 0 }}>
                            {dayMenu.image ? dayMenu.image : "🍽️"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: "#333", fontSize: 15 }}>{dayMenu.main}</div>
                            {dayMenu.sides && <div style={{ color: "#999", fontSize: 12, marginTop: 2 }}>{dayMenu.sides}</div>}
                          </div>
                        </div>
                      ) : (
                        <div style={{ color: "#ccc", fontSize: 13, textAlign: "center", padding: "6px 0 10px" }}>
                          <span aria-hidden="true">🍽️ </span>Menu not entered yet
                        </div>
                      )}
                      <div role="group" aria-label={`Choose for ${name}`} style={{ display: "flex", gap: 10 }}>
                        {["Pack", "Buy"].map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              setChoice(key, opt);
                              const el = document.getElementById("choice-announcement");
                              if (el) el.textContent = `${name}: ${opt === "Pack" ? "Packing lunch" : "Buying lunch"} selected`;
                            }}
                            aria-pressed={val === opt}
                            aria-label={`${opt === "Pack" ? "Pack lunch" : "Buy lunch"} on ${name} ${label}`}
                            style={{
                              flex: 1, padding: "12px 0", borderRadius: 14, border: "none",
                              background: val === opt ? c.grad : "#f5f5f5",
                              color: val === opt ? "white" : "#999",
                              fontFamily: "'Nunito'", fontWeight: 800, fontSize: 16, cursor: "pointer",
                              boxShadow: val === opt ? `0 4px 14px ${c.accent}55` : "none",
                              transition: "all 0.18s",
                            }}
                          >
                            <span aria-hidden="true">{opt === "Pack" ? "🍱" : "🏦"} </span>{opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}

              {allDone && (
                <div
                  role="status"
                  aria-live="polite"
                  style={{
                    textAlign: "center", padding: "20px",
                    background: c.bg, borderRadius: 20, border: `2px solid ${c.light}`,
                  }}
                >
                  <div aria-hidden="true" style={{ fontSize: 40 }}>🎉</div>
                  <div style={{ fontFamily: "'Fredoka One'", fontSize: 20, color: c.accent, marginTop: 8 }}>
                    All done, {activeKid}!
                  </div>
                  <button
                    onClick={() => { setView("home"); setActiveKid(null); }}
                    aria-label="All days picked – go back to Home"
                    style={{
                      marginTop: 14, padding: "10px 24px", borderRadius: 14, border: "none",
                      background: c.grad, color: "white", fontFamily: "'Nunito'",
                      fontWeight: 800, fontSize: 15, cursor: "pointer",
                    }}
                  >
                    <span aria-hidden="true">← </span>Back to Home
                  </button>
                </div>
              )}
            </section>
          );
        })()}

        {/* MOM VIEW */}
        {view === "mom" && (
          <section aria-label="Mom's dashboard">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div aria-hidden="true" style={{ fontSize: 48 }}>👩🏻</div>
              <h1
                ref={mainHeadingRef}
                tabIndex={-1}
                style={{ fontFamily: "'Fredoka One'", fontSize: 26, color: "#FF6B6B", margin: "4px 0 0", outline: "none" }}
              >
                Mom's Dashboard
              </h1>
              <p style={{ color: "#aaa", fontSize: 13, margin: "4px 0 0" }}>Weekly lunch overview</p>
            </div>

            {/* Summary table */}
            <div style={{ background: "white", borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }} aria-label="Weekly lunch choices by child">
                <caption style={srOnly}>Weekly lunch choices: Pack or Buy for each child and day</caption>
                <thead>
                  <tr style={{ background: "linear-gradient(90deg, #FF6B6B, #FF8E53)" }}>
                    <th scope="col" style={{ padding: "14px 20px", color: "white", fontWeight: 800, fontSize: 14, textAlign: "left" }}>Day</th>
                    {KIDS.map(k => (
                      <th key={k} scope="col" style={{ padding: "14px 8px", color: "white", fontWeight: 800, fontSize: 14, textAlign: "center" }}>
                        <span aria-hidden="true">{KID_CONFIG[k].emoji} </span>{k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {week.map(({ name, label, key }, i) => (
                    <tr
                      key={key}
                      style={{
                        background: i % 2 === 0 ? "#FAFAFA" : "white",
                        borderBottom: "1px solid #f5f5f5",
                      }}
                    >
                      <th scope="row" style={{ padding: "12px 20px", textAlign: "left" }}>
                        <div style={{ fontWeight: 800, color: "#333", fontSize: 14 }}>{name}</div>
                        <div style={{ color: "#bbb", fontSize: 12 }}>{label}</div>
                      </th>
                      {KIDS.map(kid => {
                        const val = choices[key]?.[kid];
                        const c = KID_CONFIG[kid];
                        return (
                          <td key={kid} style={{ padding: "12px 8px", textAlign: "center" }}>
                            {val ? (
                              <span style={{
                                display: "inline-block", padding: "4px 10px", borderRadius: 20,
                                background: val === "Buy" ? c.accent : c.light,
                                color: val === "Buy" ? "white" : c.accent,
                                fontWeight: 800, fontSize: 11,
                              }}>
                                <span aria-hidden="true">{val === "Pack" ? "🍱" : "🏦"} </span>{val}
                              </span>
                            ) : (
                              <span aria-label="not chosen yet" style={{ color: "#ddd", fontSize: 13 }} aria-hidden="false">–</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Per-kid summaries */}
            <ul role="list" aria-label="Summary per child" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, listStyle: "none", padding: 0, margin: "0 0 20px" }}>
              {KIDS.map(kid => {
                const c = KID_CONFIG[kid];
                const buyDays = week.filter(({ key }) => choices[key]?.[kid] === "Buy").map(d => d.name);
                const packDays = week.filter(({ key }) => choices[key]?.[kid] === "Pack").map(d => d.name);
                return (
                  <li key={kid} style={{ flex: "1 1 160px", background: c.bg, border: `2px solid ${c.light}`, borderRadius: 16, padding: 16 }}>
                    <div style={{ fontFamily: "'Fredoka One'", fontSize: 17, color: c.accent, marginBottom: 10 }}>
                      <span aria-hidden="true">{c.emoji} </span>{kid}
                    </div>
                    <dl style={{ fontSize: 12, margin: 0 }}>
                      <dt style={{ fontWeight: 800, color: "#555" }}>
                        <span aria-hidden="true">🏦 </span>Buy ({buyDays.length}):
                      </dt>
                      <dd style={{ color: "#777", marginLeft: 0, marginTop: 2, marginBottom: 6 }}>
                        {buyDays.length ? buyDays.join(", ") : <em style={{ color: "#ccc" }}>None yet</em>}
                      </dd>
                      <dt style={{ fontWeight: 800, color: "#555" }}>
                        <span aria-hidden="true">🍱 </span>Pack ({packDays.length}):
                      </dt>
                      <dd style={{ color: "#777", marginLeft: 0, marginTop: 2 }}>
                        {packDays.length ? packDays.join(", ") : <em style={{ color: "#ccc" }}>None yet</em>}
                      </dd>
                    </dl>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={() => { setEditMenu(JSON.parse(JSON.stringify(menu))); setEditSource("mom"); setView("edit"); }}
              aria-label="Edit this week's lunch menu"
              style={{
                width: "100%", padding: "14px", borderRadius: 16, border: "2px dashed #FF8E53",
                background: "white", color: "#FF8E53", fontFamily: "'Nunito'",
                fontWeight: 800, fontSize: 15, cursor: "pointer",
              }}
            >
              <span aria-hidden="true">✏️ </span>Edit This Week's Menu
            </button>
          </section>
        )}

        {/* EDIT MENU VIEW */}
        {view === "edit" && editMenu && (
          <section aria-label="Edit this week's menu">
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h1
                ref={mainHeadingRef}
                tabIndex={-1}
                style={{ fontFamily: "'Fredoka One'", fontSize: 24, color: "#FF6B6B", margin: 0, outline: "none" }}
              >
                <span aria-hidden="true">✏️ </span>Edit This Week's Menu
              </h1>
              <p style={{ color: "#aaa", fontSize: 13 }}>Enter the Meat/Meat Alt options for each day</p>
            </div>
            {week.map(({ name, label, key }) => (
              <fieldset
                key={key}
                style={{
                  background: "white", borderRadius: 20, marginBottom: 14,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.06)", overflow: "hidden",
                  border: "2px solid #f0f0f0", padding: 0,
                }}
              >
                <legend style={{
                  background: "linear-gradient(90deg, #FF6B6B, #FF8E53)",
                  padding: "10px 18px", display: "flex", gap: 10, alignItems: "center",
                  width: "100%", boxSizing: "border-box",
                  fontFamily: "'Fredoka One'", color: "white", fontSize: 17,
                }}>
                  {name} <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontFamily: "'Nunito'" }}>{label}</span>
                </legend>
                <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { field: "main", label: "Meat / Meat Alt", placeholder: "e.g. Chicken Nuggets, Pizza..." },
                    { field: "sides", label: "Sides (optional)", placeholder: "e.g. Green beans, fruit cup..." },
                  ].map(({ field, label: lbl, placeholder }) => {
                    const inputId = `menu-${key}-${field}`;
                    return (
                      <div key={field}>
                        <label
                          htmlFor={inputId}
                          style={{ fontWeight: 800, color: "#666", fontSize: 12, display: "block", marginBottom: 4 }}
                        >
                          {lbl}
                        </label>
                        <input
                          id={inputId}
                          value={editMenu[key]?.[field] || ""}
                          onChange={e => setEditMenu(prev => ({ ...prev, [key]: { ...prev[key], [field]: e.target.value } }))}
                          placeholder={placeholder}
                          aria-label={`${name} ${lbl}`}
                          style={inputStyle}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                onClick={() => setView(editSource)}
                aria-label="Cancel editing menu"
                style={{
                  flex: 1, padding: "13px", borderRadius: 14, border: "2px solid #eee",
                  background: "white", color: "#aaa", fontFamily: "'Nunito'", fontWeight: 700, fontSize: 15, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const updated = JSON.parse(JSON.stringify(editMenu));
                  const currentWeek = getWeekDates();
                  const foodEmojis = {
                    pizza: "🍕", chicken: "🍗", nugget: "🍗", burger: "🍔", hotdog: "🌭",
                    taco: "🌮", burrito: "🌯", sandwich: "🥪", sub: "🥪", wrap: "🌯",
                    pasta: "🍝", spaghetti: "🍝", mac: "🧀", cheese: "🧀", macaroni: "🧀",
                    fish: "🐟", shrimp: "🍤", corn: "🌽", soup: "🍲", chili: "🥘",
                    steak: "🥩", beef: "🥩", pork: "🥩", meatball: "🍝", rib: "🥩",
                    salad: "🥗", veggie: "🥦", vegetable: "🥦", broccoli: "🥦",
                    rice: "🍚", beans: "🫘", bread: "🍞", roll: "🥐", biscuit: "🥐",
                    pancake: "🥞", waffle: "🧇", egg: "🍳", breakfast: "🍳",
                    nacho: "🧀", quesadilla: "🧀", enchilada: "🌮", fajita: "🌮",
                    turkey: "🦃", ham: "🍖", sausage: "🌭", meatloaf: "🥩",
                    noodle: "🍜", ramen: "🍜", dumpling: "🥟", wonton: "🥟",
                  };
                  for (const { key } of currentWeek) {
                    const main = updated[key]?.main?.trim().toLowerCase();
                    if (main && !updated[key]?.image) {
                      const match = Object.keys(foodEmojis).find(k => main.includes(k));
                      updated[key].image = match ? foodEmojis[match] : "🍽️";
                    }
                  }
                  saveMenu(updated);
                  setView(editSource);
                }}
                aria-label="Save the week's menu"
                style={{
                  flex: 2, padding: "13px", borderRadius: 14, border: "none",
                  background: "linear-gradient(90deg, #FF6B6B, #FF8E53)",
                  color: "white", fontFamily: "'Nunito'", fontWeight: 800, fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(255,107,107,0.35)",
                }}
              >
                <span aria-hidden="true">💾 </span>Save Menu
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const momBtnStyle = {
  display: "flex", alignItems: "center", gap: 5,
  background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.5)",
  color: "white", padding: "7px 13px", borderRadius: 20,
  cursor: "pointer", fontFamily: "'Nunito'",
};

const backBtnStyle = {
  background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.4)",
  color: "white", padding: "7px 13px", borderRadius: 20,
  cursor: "pointer", fontFamily: "'Nunito'", fontWeight: 700, fontSize: 13,
};

const numBtnStyle = {
  padding: "16px 0", borderRadius: 14, border: "2px solid #f0f0f0",
  background: "white", fontSize: 22, fontWeight: 700,
  fontFamily: "'Nunito'", cursor: "pointer", color: "#333",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};

const inputStyle = {
  width: "100%", padding: "9px 13px", fontSize: 14,
  border: "2px solid #eee", borderRadius: 11,
  fontFamily: "'Nunito'", outline: "none",
  boxSizing: "border-box", color: "#333",
};
