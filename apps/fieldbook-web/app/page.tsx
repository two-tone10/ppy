"use client";

import { useState } from "react";

const moments = [
  { label: "I tried it", text: "I got to run the sound for the showcase 🎚️", meta: "Today · Hook Arts Media", tone: "coral" },
  { label: "Felt seen", text: "Maya noticed I kept the group calm when we got stuck.", meta: "Yesterday · Closing circle", tone: "purple" },
  { label: "Unlocked", text: "The open laptop room made my idea feel possible 💡", meta: "Mon · Open studio", tone: "green" },
];

export default function Home() {
  const [tab, setTab] = useState("home");
  const [saved, setSaved] = useState(false);
  const [choice, setChoice] = useState("");

  return (
    <main className="stage">
      <div className="phone">
        <header className="topbar">
          <div className="brandmark"><span>✦</span> fieldbook</div>
          <button className="avatar" aria-label="Profile">J</button>
        </header>

        {tab === "home" && <section className="screen home-screen">
          <div className="eyebrow">TUESDAY · WEEK 4 OF 8</div>
          <h1>What was<br /><em>your moment?</em></h1>
          <p className="lede">The tiny wins, big ideas, weird surprises, and stuff you want to remember.</p>
          <button className="hero-action" onClick={() => setTab("capture")}><span className="plus">✦</span><span><b>Drop a moment</b><small>30 seconds · just for you</small></span><span className="arrow">↗</span></button>
          <div className="section-head"><span>Your moments</span><button onClick={() => setTab("notes")}>See all →</button></div>
          <div className="moment-stack">{moments.map((m) => <article className="moment" key={m.text}><div className={`dot ${m.tone}`} /><div><div className="moment-label">{m.label}</div><p>{m.text}</p><small>{m.meta}</small></div><span className="lock">⌁</span></article>)}</div>
          <div className="quiet-card"><div className="quiet-icon">✺</div><div><b>Your week, in a nutshell</b><p>You found 3 things that helped you shine.</p></div><button onClick={() => setTab("portrait")}>See it ↗</button></div>
        </section>}

        {tab === "capture" && <section className="screen capture-screen">
          <button className="back" onClick={() => setTab("home")}>← Back</button>
          <div className="eyebrow">QUICK DROP · 30 SEC</div><h2>Tell the story<br /><em>your way.</em></h2>
          <p className="prompt">What happened today that made you feel proud, curious, included, or stuck?</p>
          <div className="voice-card"><span className="mic">●</span><div><b>Hold to tell it 🎙️</b><small>or type it below</small></div><span className="wave">▂▅▃▇▂▆</span></div>
          <textarea placeholder="Okay, so today…" value={choice} onChange={(e) => setChoice(e.target.value)} />
          <div className="chips"><button className={choice === "practice" ? "selected" : ""} onClick={() => setChoice("practice")}>I got to try something</button><button className={choice === "seen" ? "selected" : ""} onClick={() => setChoice("seen")}>Someone hyped me up</button><button className={choice === "help" ? "selected" : ""} onClick={() => setChoice("help")}>I found a way in</button><button className={choice === "hard" ? "selected" : ""} onClick={() => setChoice("hard")}>Something was off</button></div>
          <div className="privacy"><span>◌</span><div><b>Yours first 🔒</b><small>You decide if anyone else sees this.</small></div><button>Change</button></div>
          <button className="save" onClick={() => { setSaved(true); setTab("home"); }}>{saved ? "In your moments ✓" : "Keep this moment"}</button>
        </section>}

        {tab === "notes" && <section className="screen"><button className="back" onClick={() => setTab("home")}>← Home</button><div className="eyebrow">YOUR MOMENTS</div><h2>Your week,<br /><em>in real life.</em></h2><p className="lede">No grades. No right answers. Just stuff you noticed.</p><div className="filter-row"><button className="filter active">All</button><button className="filter">I tried</button><button className="filter">Felt seen</button></div><div className="moment-stack">{moments.concat([{label:"The vibe",text:"The adults here ask what we think before deciding.",meta:"Last week · Youth council",tone:"amber"}]).map((m) => <article className="moment" key={m.text}><div className={`dot ${m.tone}`} /><div><div className="moment-label">{m.label}</div><p>{m.text}</p><small>{m.meta}</small></div><span className="lock">⌁</span></article>)}</div></section>}

        {tab === "constellation" && <section className="screen constellation"><button className="back" onClick={() => setTab("home")}>← Home</button><div className="eyebrow">THE GROUP VIBE · ANONYMOUS</div><h2>Look what<br /><em>we found.</em></h2><p className="lede">Little moments from everyone, lighting up the same sky.</p><div className="map"><div className="orbit o1" /><div className="orbit o2" /><span className="star s1">✦</span><span className="star s2">✦</span><span className="star s3">✦</span><span className="star s4">✦</span><span className="star s5">✦</span><div className="map-center">OUR<br />SKY</div></div><div className="legend"><span><i className="coral-dot" /> I tried · 18</span><span><i className="purple-dot" /> Felt seen · 24</span><span><i className="green-dot" /> Got help · 13</span></div><div className="insight"><b>Something is glowing</b><p>A lot of people mentioned closing circle as a place where they feel seen. What should we try next?</p><button>Share an idea →</button></div></section>}

        {tab === "portrait" && <section className="screen portrait"><button className="back" onClick={() => setTab("home")}>← Home</button><div className="eyebrow">YOUR PORTRAIT · JUST YOURS</div><h2>Your personal<br /><em>power-up.</em></h2><div className="portrait-card"><div className="portrait-orb">✦</div><div className="portrait-title">J’s way of showing up</div><p>“I do my best work when I can try something real, with people who trust me to figure it out.”</p><div className="bar-label"><span>Chances to try real things</span><b>often</b></div><div className="bar"><i style={{width:"82%"}} /></div><div className="bar-label"><span>People who see your good stuff</span><b>growing</b></div><div className="bar"><i style={{width:"61%"}} /></div><div className="bar-label"><span>Tools + spaces that help</span><b>sometimes</b></div><div className="bar"><i style={{width:"43%"}} /></div></div><button className="outline">Save my power-up card ↘</button><button className="text-link">Keep adding moments →</button></section>}

        <nav className="nav"><button className={tab === "home" ? "current" : ""} onClick={() => setTab("home")}><span>⌂</span>Today</button><button className={tab === "capture" ? "current" : ""} onClick={() => setTab("capture")}><span>✦</span>Drop one</button><button className={tab === "constellation" ? "current" : ""} onClick={() => setTab("constellation")}><span>✧</span>Our sky</button><button className={tab === "portrait" ? "current" : ""} onClick={() => setTab("portrait")}><span>◒</span>My power-up</button></nav>
      </div>
    </main>
  );
}
