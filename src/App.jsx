import { useState } from "react";
import emailjs from "@emailjs/browser";

// ─────────────────────────────────────────────────────────────────────────────
// EMAILJS CONFIG
// Sign up free at https://www.emailjs.com then fill these in:
//   1. Create an Email Service (connect your Gmail)
//   2. Create an Email Template (see README for template variables)
//   3. Copy your Public Key from Account > API Keys
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = "service_12b0rei";
const EMAILJS_TEMPLATE_ID = "template_90fdaen";
const EMAILJS_PUBLIC_KEY  = "z1BoyoRhJlu5fsF-e";

// ─── QUIZ DATA ────────────────────────────────────────────────────────────────

const quizQuestions = [
  {
    id: 1,
    text: "When you two argue, how does it usually end?",
    options: [
      { label: "We find middle ground and move on", safe: true },
      { label: "It's tense but we work through it", safe: true },
      { label: "I apologize even when I'm not sure what I did", safe: false },
      { label: "It escalates — yelling, threats, or worse", safe: false },
    ],
    insight: "Constantly apologizing without knowing why, or conflicts that escalate beyond normal disagreement, are signs that the dynamic between you two is unhealthy — not a 'communication issue.'"
  },
  {
    id: 2,
    text: "How do you feel when you're around this person?",
    options: [
      { label: "Safe, respected, like myself", safe: true },
      { label: "Mostly okay, occasional tension", safe: true },
      { label: "Like I'm always walking on eggshells", safe: false },
      { label: "Anxious, small, or like I can't do anything right", safe: false },
    ],
    insight: "Feeling anxious around your own partner, or like you constantly have to manage their emotions, is not love — it's survival mode. That's not what a relationship is supposed to feel like."
  },
  {
    id: 3,
    text: "Do you feel like your version of events is regularly questioned or dismissed?",
    options: [
      { label: "No, we generally agree on what happened", safe: true },
      { label: "We see things differently sometimes, but it's fair", safe: true },
      { label: "Often — I end up doubting my own memory", safe: false },
      { label: "All the time. I've started to wonder if I'm the problem", safe: false },
    ],
    insight: "When someone repeatedly makes you doubt your own memory or perception, it's called gaslighting. It's a control tactic — not a sign that you're 'too sensitive' or 'forgetful.'"
  },
  {
    id: 4,
    text: "Have you been threatened with losing your kids if you leave or disagree?",
    options: [
      { label: "No, never", safe: true },
      { label: "It's been implied but not directly said", safe: false },
      { label: "Yes, directly — 'you'll never see them again'", safe: false },
      { label: "It comes up every time we fight", safe: false },
    ],
    insight: "Using your kids as a weapon is one of the most common — and most damaging — forms of emotional abuse. It's designed to trap you. The legal reality is very different from what you've been told."
  },
  {
    id: 5,
    text: "How does this person talk to you when they're upset?",
    options: [
      { label: "Firmly but respectfully", safe: true },
      { label: "Raises their voice but stays fair", safe: true },
      { label: "Name-calling, insults, or things they know will hurt", safe: false },
      { label: "It gets scary — I worry about my safety or the kids'", safe: false },
    ],
    insight: "Words used as weapons — insults, degradation, threats — are verbal abuse. The fact that it happens 'in the heat of the moment' doesn't make it acceptable or your fault."
  },
  {
    id: 6,
    text: "Do you feel like the person you used to be has slowly disappeared?",
    options: [
      { label: "No, I still feel like myself", safe: true },
      { label: "A little, but I think that's just life", safe: true },
      { label: "Yeah — I've lost hobbies, friends, confidence", safe: false },
      { label: "I don't even know who I am anymore outside of this relationship", safe: false },
    ],
    insight: "Gradually losing your identity, your friendships, and your sense of self is one of the most consistent signs of an emotionally abusive relationship. It doesn't happen overnight — and that's what makes it hard to see."
  },
  {
    id: 7,
    text: "When you imagine life without this relationship, what do you feel?",
    options: [
      { label: "Sad — there's real love here I'd be giving up", safe: true },
      { label: "Mixed — complicated feelings both ways", safe: true },
      { label: "Honestly, a wave of relief", safe: false },
      { label: "Terrified — but not because I love them, because of what they'd do", safe: false },
    ],
    insight: "Relief — not grief — at the idea of freedom is important information. Fear of what they'll do, not fear of losing love, is what traps most people in toxic relationships."
  },
  {
    id: 8,
    text: "When you're away from this person — a trip, a long day, time with friends — how do you feel?",
    options: [
      { label: "I miss them. I want to get back", safe: true },
      { label: "Fine either way", safe: true },
      { label: "Lighter. More like myself.", safe: false },
      { label: "Free — like I can breathe again", safe: false },
    ],
    insight: "Feeling genuinely lighter, freer, or more like yourself when they're not around isn't a sign you don't care. It's your nervous system telling you the truth about what this relationship is costing you."
  },
];

const truthCards = [
  {
    icon: "⚖️",
    title: "You will not lose your kids.",
    body: "This is one of the most common threats used to control a parent — especially fathers. The truth: courts decide custody based on the best interests of the child. Being in a toxic relationship does not disqualify you from being a great parent. Leaving one actually demonstrates judgment and courage. A parenting plan — drafted with a family law attorney — legally protects your time with your children. You have rights, and they are enforceable."
  },
  {
    icon: "📋",
    title: "A parenting plan is your shield.",
    body: "A parenting plan is a legal document that outlines custody, visitation, holidays, decision-making, and communication. Once it's in place, your time with your kids is not something that can be taken away on a threat. You don't need to 'win' a divorce to get fair parenting rights. Most family courts actively support both parents being involved in a child's life. Getting a lawyer is not declaring war — it's protecting your children."
  },
  {
    icon: "🚫",
    title: "Staying for the kids doesn't help the kids.",
    body: "Children raised in homes with consistent conflict, tension, fear, or emotional instability are measurably harmed by it — even when no one lays a hand on anyone. Kids learn what relationships look like from the one they grow up watching. Two healthy, stable homes are better than one unhappy, volatile one. Leaving is not abandoning your children. It can be the most protective thing you do for them."
  },
];

const healingSteps = [
  {
    phase: "Right After",
    title: "Don't numb it. Feel it.",
    body: "The impulse to fill the emptiness with alcohol, sex with someone new, or constant distraction is completely human — and almost always makes things worse. Those things don't heal the wound. They just postpone it with interest. Give yourself permission to feel the grief, the confusion, and even the anger. That's not weakness. That's how you actually move through it.",
    icon: "🌊"
  },
  {
    phase: "First Few Months",
    title: "Rebuild your identity before you rebuild your social life.",
    body: "After a toxic relationship, most people don't know who they are anymore. Before jumping into dating, go find out. What did you used to love? What did you give up? Music, sports, building things, cooking, time with your crew — go back to those things. They're breadcrumbs back to yourself.",
    icon: "🧭"
  },
  {
    phase: "Talk to Someone",
    title: "Therapy is not weakness. It's the cheat code.",
    body: "A therapist — especially one trained in relationship trauma or men's mental health — can help you understand the patterns that got you here so you don't repeat them. Not because you're broken, but because you're a person who went through something real and you deserve real support. Men are statistically less likely to seek help. The ones who do come out ahead.",
    icon: "🧠"
  },
  {
    phase: "The Long Game",
    title: "The goal isn't a new relationship. It's a new relationship with yourself.",
    body: "At some point, you'll be ready to love someone again — and when you are, it'll be from a completely different place. Not desperation, not loneliness, not trying to prove something. From knowing who you are, what you deserve, and what you'll never accept again. That version of you is a better partner, a better father, and a better man.",
    icon: "🌱"
  },
];

// ─── EMAIL SENDER ─────────────────────────────────────────────────────────────

emailjs.init(EMAILJS_PUBLIC_KEY);

async function sendResultsEmail(answers) {
  const flagged = answers.filter(a => !a.safe);
  const score = flagged.length;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Denver",
    dateStyle: "full",
    timeStyle: "short"
  });

  const answerLines = quizQuestions.map((q, i) => {
    const ans = answers[i];
    const flag = ans?.safe ? "Healthy" : "FLAGGED";
    return `Q${i + 1}: ${q.text} | Answer: "${ans?.label || "N/A"}" (${flag})`;
  }).join("\n");

  const flaggedInsights = answers
    .filter(a => !a.safe)
    .map(a => `- ${a.insight}`)
    .join("\n");

  const summaryText = score === 0
    ? "His answers did not flag any concerning patterns."
    : `He flagged ${score} out of 8 questions. Patterns that showed up:\n${flaggedInsights}`;

  const templateParams = {
    to_email: "Anthony@bellhome.co",
    timestamp: timestamp,
    score: `${score} out of 8`,
    summary: summaryText,
    full_answers: answerLines,
  };

  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    console.log("Email sent:", response.status, response.text);
  } catch (err) {
    console.error("EmailJS error:", err);
  }
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("cover");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [expandedTruth, setExpandedTruth] = useState(null);

  const score = answers.filter(a => !a.safe).length;

  const handleSelect = (opt, idx) => {
    if (transitioning) return;
    setSelected(idx);
    setTransitioning(true);
    setTimeout(() => {
      const q = quizQuestions[current];
      const newAnswers = [...answers, { ...opt, insight: q.insight }];
      setAnswers(newAnswers);
      if (current < quizQuestions.length - 1) {
        setCurrent(current + 1);
        setSelected(null);
        setTransitioning(false);
      } else {
        sendResultsEmail(newAnswers).catch(console.error);
        setPhase("pivot");
        setTransitioning(false);
      }
    }, 450);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0f14", color: "#ede8e0", fontFamily: "'Georgia', serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .orb { position: fixed; border-radius: 50%; filter: blur(140px); pointer-events: none; z-index: 0; }
        .page { position: relative; z-index: 1; max-width: 680px; margin: 0 auto; padding: 52px 24px 100px; animation: rise 0.6s ease; }
        .page-center { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .eyebrow { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: rgba(237,232,224,0.3); margin-bottom: 20px; }
        .display { font-family: 'Lora', serif; font-size: clamp(34px, 7vw, 62px); line-height: 1.15; font-weight: 600; color: #ede8e0; margin-bottom: 18px; }
        .display em { font-style: italic; color: #c9a96a; }
        .body-text { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 300; line-height: 1.75; color: rgba(237,232,224,0.55); }
        .gold-btn { background: #c9a96a; color: #0c0f14; border: none; padding: 14px 36px; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .gold-btn:hover { background: #d9bb7e; transform: translateY(-1px); }
        .ghost-btn { background: transparent; border: 1.5px solid rgba(201,169,106,0.45); color: #c9a96a; padding: 13px 32px; border-radius: 2px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
        .ghost-btn:hover { background: rgba(201,169,106,0.1); border-color: #c9a96a; }
        .progress-bar { height: 2px; background: rgba(237,232,224,0.07); border-radius: 1px; margin-bottom: 56px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #c9a96a, #e8ca8a); border-radius: 1px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
        .q-num { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: #c9a96a; margin-bottom: 18px; }
        .q-text { font-family: 'Lora', serif; font-size: clamp(18px, 3.5vw, 26px); line-height: 1.45; color: #ede8e0; margin-bottom: 36px; font-weight: 600; }
        .opt-list { display: flex; flex-direction: column; gap: 10px; }
        .opt-btn { background: rgba(237,232,224,0.04); border: 1px solid rgba(237,232,224,0.09); border-radius: 3px; padding: 17px 20px; text-align: left; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 300; color: rgba(237,232,224,0.75); line-height: 1.5; transition: all 0.2s; }
        .opt-btn:hover:not(.sel) { background: rgba(201,169,106,0.09); border-color: rgba(201,169,106,0.35); color: #ede8e0; }
        .opt-btn.sel { background: rgba(201,169,106,0.14); border-color: #c9a96a; color: #ede8e0; }
        .section-label { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: rgba(237,232,224,0.2); margin-bottom: 18px; margin-top: 52px; }
        .section-title { font-family: 'Lora', serif; font-size: clamp(24px, 4.5vw, 36px); line-height: 1.25; color: #ede8e0; margin-bottom: 12px; font-weight: 600; }
        .section-sub { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.7; color: rgba(237,232,224,0.5); font-weight: 300; margin-bottom: 32px; }
        .insight-card { background: rgba(255,80,70,0.06); border: 1px solid rgba(255,80,70,0.13); border-radius: 3px; padding: 18px 22px; margin-bottom: 11px; }
        .insight-text { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.75; color: rgba(237,232,224,0.7); font-weight: 300; }
        .truth-card { background: rgba(237,232,224,0.03); border: 1px solid rgba(237,232,224,0.08); border-radius: 4px; margin-bottom: 12px; overflow: hidden; }
        .truth-card:hover { border-color: rgba(201,169,106,0.25); }
        .truth-header { display: flex; align-items: center; gap: 14px; padding: 20px 22px; cursor: pointer; }
        .truth-icon { font-size: 22px; flex-shrink: 0; }
        .truth-title { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; color: #ede8e0; flex: 1; }
        .truth-toggle { font-size: 18px; color: rgba(201,169,106,0.6); flex-shrink: 0; font-family: 'Inter', sans-serif; }
        .truth-body { padding: 16px 22px 20px 58px; font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.8; color: rgba(237,232,224,0.6); font-weight: 300; border-top: 1px solid rgba(237,232,224,0.06); }
        .heal-card { display: flex; gap: 22px; padding: 28px 0; border-bottom: 1px solid rgba(237,232,224,0.06); align-items: flex-start; }
        .heal-card:last-child { border-bottom: none; }
        .heal-icon { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
        .heal-phase { font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(201,169,106,0.6); margin-bottom: 6px; }
        .heal-title { font-family: 'Lora', serif; font-size: 19px; font-weight: 600; color: #ede8e0; margin-bottom: 9px; }
        .heal-body { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.8; color: rgba(237,232,224,0.55); font-weight: 300; }
        .dad-box { background: rgba(201,169,106,0.07); border: 1px solid rgba(201,169,106,0.18); border-left: 3px solid #c9a96a; border-radius: 0 4px 4px 0; padding: 28px 30px; margin-bottom: 44px; }
        .dad-box p { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 1.8; font-weight: 300; color: rgba(237,232,224,0.78); margin-bottom: 14px; }
        .dad-box p:last-of-type { margin-bottom: 0; }
        .dad-sig { font-family: 'Lora', serif; font-size: 19px; font-style: italic; color: #c9a96a; margin-top: 18px; }
        .resources { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; margin-top: 10px; }
        .resource-tile { background: rgba(100,200,140,0.06); border: 1px solid rgba(100,200,140,0.13); border-radius: 3px; padding: 16px 18px; }
        .r-name { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: rgba(237,232,224,0.55); margin-bottom: 4px; }
        .r-contact { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #6dcba0; margin-bottom: 3px; }
        .r-note { font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(237,232,224,0.28); }
        .closing-section { text-align: center; margin-top: 60px; padding-top: 48px; border-top: 1px solid rgba(237,232,224,0.06); }
        .cover-note { font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(237,232,224,0.18); letter-spacing: 0.5px; margin-top: 18px; }
      `}</style>

      <div className="orb" style={{ width: 500, height: 500, top: -180, right: -160, background: "rgba(201,169,106,0.07)" }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: 80, left: -120, background: "rgba(80,120,200,0.05)" }} />

      {/* COVER */}
      {phase === "cover" && (
        <div className="page page-center">
          <div className="eyebrow">A personal check-in · 8 questions · 3 minutes</div>
          <h1 className="display">Are you actually<br /><em>happy?</em></h1>
          <p className="body-text" style={{ maxWidth: 460, textAlign: "center", marginBottom: 36 }}>
            Not "fine." Not "it's complicated." Actually happy — in your relationship, in yourself, in your life. Answer honestly. No one's watching.
          </p>
          <button className="gold-btn" onClick={() => setPhase("quiz")}>Let's find out →</button>
          <div className="cover-note">private · no login · made with care</div>
        </div>
      )}

      {/* QUIZ */}
      {phase === "quiz" && (
        <div className="page" style={{ minHeight: "100vh", paddingTop: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 15, color: "rgba(237,232,224,0.2)", fontStyle: "italic" }}>check-in</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "rgba(237,232,224,0.2)", letterSpacing: 1 }}>{current + 1} / {quizQuestions.length}</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(current / quizQuestions.length) * 100}%` }} />
          </div>
          <div className="q-num">Question {current + 1}</div>
          <div className="q-text">{quizQuestions[current].text}</div>
          <div className="opt-list">
            {quizQuestions[current].options.map((opt, i) => (
              <button key={i} className={`opt-btn ${selected === i ? "sel" : ""}`} onClick={() => handleSelect(opt, i)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PIVOT */}
      {phase === "pivot" && (
        <div className="page page-center">
          <div style={{ fontSize: 44, marginBottom: 24 }}>💛</div>
          <h2 className="display" style={{ fontSize: "clamp(28px,5vw,44px)", textAlign: "center" }}>This wasn't just a quiz.</h2>
          <p className="body-text" style={{ textAlign: "center", maxWidth: 480, marginBottom: 36 }}>
            Someone who loves you made this — not to tell you what to think, but to make sure you had real information. There's a message from them waiting for you.
          </p>
          <button className="gold-btn" onClick={() => setPhase("reveal")}>Read it →</button>
        </div>
      )}

      {/* REVEAL */}
      {phase === "reveal" && (
        <div className="page">
          <div className="eyebrow">A message from your Dad</div>
          <div className="dad-box">
            <p>Hey. I made this for you. Not to lecture you, not to tell you what to do with your life — but because I love you and I've been watching, and something feels wrong. I didn't know how to bring it up without it turning into a fight, so I did this instead.</p>
            <p>Those eight questions weren't random. They were designed by people who study what unhealthy relationships actually look like — and what they do to the people inside them. I wanted you to see your own answers reflected back to you, without me being the one saying it.</p>
            <p>What you'll read next is real information. About what you're going through. About your kids and your rights as their father. About what actually helps after a hard chapter — and what only makes it worse. I'm not trying to push you anywhere. I just want you to have the truth.</p>
            <p>I'm here. No judgment. Take your time.</p>
            <div className="dad-sig">— Dad</div>
          </div>

          {score === 0 ? (
            <div style={{ background: "rgba(100,200,140,0.06)", border: "1px solid rgba(100,200,140,0.15)", borderRadius: 4, padding: "24px 28px", marginBottom: 32 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 19, color: "#6dcba0", marginBottom: 8 }}>Your answers look mostly healthy.</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.75, color: "rgba(237,232,224,0.55)", fontWeight: 300 }}>
                That's genuinely good. But if you're here, something brought you — trust that. Keep the conversation open with your dad.
              </p>
            </div>
          ) : (
            <>
              <div className="section-title" style={{ marginBottom: 10 }}>
                {score <= 2 ? "There are some things worth paying attention to."
                  : score <= 5 ? "What you're experiencing has a name."
                  : "What's happening to you is not okay — and it's not your fault."}
              </div>
              <p className="section-sub">
                {score <= 2
                  ? `You flagged ${score} patterns that show up in unhealthy relationships. It doesn't mean everything is broken — but these things matter.`
                  : `You answered in ways that match ${score} recognized patterns of a toxic relationship. That word can feel heavy. But naming what's happening is how you start to understand it.`}
              </p>
              <div className="section-label">What your answers actually mean</div>
              {answers.filter(a => !a.safe).map((a, i) => (
                <div key={i} className="insight-card">
                  <p className="insight-text">{a.insight}</p>
                </div>
              ))}
            </>
          )}

          <div style={{ background: "rgba(201,169,106,0.07)", border: "1px solid rgba(201,169,106,0.15)", borderRadius: 3, padding: "22px 26px", marginTop: 32, marginBottom: 40 }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "#c9a96a", marginBottom: 8 }}>You are not crazy. You are not the problem.</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(237,232,224,0.55)", fontWeight: 300 }}>
              Toxic relationships work by making you feel like you are. The confusion, the self-doubt, the constant apologizing — those aren't personality flaws. They're symptoms of what you've been living inside.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="gold-btn" onClick={() => setPhase("rights")}>Your rights as a father →</button>
            <button className="ghost-btn" onClick={() => setPhase("healing")}>Skip to healing</button>
          </div>
        </div>
      )}

      {/* RIGHTS */}
      {phase === "rights" && (
        <div className="page">
          <div className="eyebrow">The truth about your kids</div>
          <h2 className="section-title" style={{ marginTop: 0 }}>You will not lose your children.</h2>
          <p className="section-sub">This is probably the biggest fear being used against you. Here's what's actually true — legally, statistically, and practically.</p>
          {truthCards.map((c, i) => (
            <div key={i} className="truth-card">
              <div className="truth-header" onClick={() => setExpandedTruth(expandedTruth === i ? null : i)}>
                <div className="truth-icon">{c.icon}</div>
                <div className="truth-title">{c.title}</div>
                <div className="truth-toggle">{expandedTruth === i ? "−" : "+"}</div>
              </div>
              {expandedTruth === i && <div className="truth-body">{c.body}</div>}
            </div>
          ))}
          <div style={{ background: "rgba(237,232,224,0.03)", border: "1px solid rgba(237,232,224,0.07)", borderRadius: 3, padding: "22px 26px", marginTop: 28 }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, color: "#ede8e0", marginBottom: 8 }}>🗂️ What to do right now</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(237,232,224,0.55)", fontWeight: 300, marginBottom: 10 }}>
              Even if you're not ready to leave, consult a family law attorney for a free or low-cost initial consultation. Know your rights before you need them.
            </p>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#c9a96a" }}>Colorado Legal Services: 303-837-1321 · coloradolegalservices.org</div>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 40 }}>
            <button className="gold-btn" onClick={() => setPhase("healing")}>Next: Finding yourself again →</button>
            <button className="ghost-btn" onClick={() => setPhase("reveal")}>← Back</button>
          </div>
        </div>
      )}

      {/* HEALING */}
      {phase === "healing" && (
        <div className="page">
          <div className="eyebrow">The real work</div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Finding yourself again.</h2>
          <p className="section-sub">If this relationship ends — or when it does — there will be a temptation to fill the emptiness fast. Here's the honest truth about why that doesn't work, and what actually does.</p>
          {healingSteps.map((s, i) => (
            <div key={i} className="heal-card">
              <div className="heal-icon">{s.icon}</div>
              <div>
                <div className="heal-phase">{s.phase}</div>
                <div className="heal-title">{s.title}</div>
                <div className="heal-body">{s.body}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "rgba(201,169,106,0.07)", border: "1px solid rgba(201,169,106,0.18)", borderRadius: 3, padding: "24px 28px", marginTop: 40 }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "#c9a96a", marginBottom: 10 }}>A note about your kids and your example</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.8, color: "rgba(237,232,224,0.6)", fontWeight: 300 }}>
              Your kids are watching you learn what love looks like. The version of yourself you build after this — grounded, honest, present — is the version they'll carry with them. Choosing yourself is not selfish. It's one of the most important things you can do for them.
            </p>
          </div>
          <button className="gold-btn" style={{ marginTop: 36 }} onClick={() => setPhase("support")}>Resources & next steps →</button>
        </div>
      )}

      {/* SUPPORT */}
      {phase === "support" && (
        <div className="page">
          <div className="eyebrow">You're not alone in this</div>
          <h2 className="section-title" style={{ marginTop: 0 }}>Resources & next steps.</h2>
          <p className="section-sub">Whether you're ready to act or just starting to think — here are real places to turn.</p>
          <div className="section-label">If you're in a dangerous situation</div>
          <div className="resources">
            {[{ name: "National DV Hotline", contact: "1-800-799-7233", note: "Call or text · 24/7" }, { name: "Crisis Text Line", contact: "Text HOME to 741741", note: "Free · Confidential · 24/7" }, { name: "911", contact: "Call 911", note: "Immediate danger" }]
              .map((r, i) => <div key={i} className="resource-tile"><div className="r-name">{r.name}</div><div className="r-contact">{r.contact}</div><div className="r-note">{r.note}</div></div>)}
          </div>
          <div className="section-label">Legal help for fathers in Colorado</div>
          <div className="resources">
            {[{ name: "Colorado Legal Services", contact: "303-837-1321", note: "Free civil legal aid" }, { name: "Colorado Bar Referral", contact: "303-860-1115", note: "Find a family law attorney" }, { name: "Colorado Courts Self-Help", contact: "coloradojudicial.gov", note: "Forms, guides, parenting plans" }]
              .map((r, i) => <div key={i} className="resource-tile"><div className="r-name">{r.name}</div><div className="r-contact">{r.contact}</div><div className="r-note">{r.note}</div></div>)}
          </div>
          <div className="section-label">Mental health & recovery</div>
          <div className="resources">
            {[{ name: "Psychology Today", contact: "psychologytoday.com", note: "Filter by specialty & insurance" }, { name: "BetterHelp", contact: "betterhelp.com", note: "Online therapy, affordable" }, { name: "SAMHSA Helpline", contact: "1-800-662-4357", note: "Substance use support · Free" }]
              .map((r, i) => <div key={i} className="resource-tile"><div className="r-name">{r.name}</div><div className="r-contact">{r.contact}</div><div className="r-note">{r.note}</div></div>)}
          </div>
          <div className="closing-section">
            <div style={{ fontSize: 36, marginBottom: 18 }}>💛</div>
            <div style={{ fontFamily: "'Lora', serif", fontSize: "clamp(22px,4vw,32px)", color: "#c9a96a", fontStyle: "italic", marginBottom: 14 }}>"You deserve a life that feels like freedom."</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(237,232,224,0.35)", fontWeight: 300, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 20px" }}>
              This app was made for you — and for anyone who needs it. You are not alone, you are not broken, and you are not stuck. The first step is just knowing the truth. You took it.
            </p>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontStyle: "italic", color: "rgba(201,169,106,0.5)" }}>Made with love, by your Dad.</div>
          </div>
        </div>
      )}
    </div>
  );
}
