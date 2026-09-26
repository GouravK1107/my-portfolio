const { useState, useEffect, useRef, useCallback, useMemo, Fragment } = React;

/* ================= data ================= */
const SECTIONS = [
  { id: "work", idx: "01", name: "Work" },
  { id: "stack", idx: "02", name: "Stack" },
  { id: "journey", idx: "03", name: "Journey" },
  { id: "awards", idx: "04", name: "Recognition" },
  { id: "contact", idx: "05", name: "Contact" },
];
const LINKS = {
  github: "https://github.com/GouravK1107",
  linkedin: "https://www.linkedin.com/in/gourav-kumar-r",
  email: "gkprof1107@gmail.com",
  phone: "+919916259010",
  resume: "https://drive.google.com/uc?export=download&id=1iE6NDoQ87KCeLgg6hmQWsCM0rOnqvnva",
};
const FEATURED = {
  title: "BlogApp",
  kicker: "A social blogging platform, not just a posting form",
  body: "Posts are the smallest part of this one. Accounts support Google and GitHub OAuth plus OTP email verification, profiles can be public, followers-only or private, and a notification system covers likes, comments, replies, follows and trending posts — with a personal dashboard tracking views and engagement.",
  tags: ["Django 5.2", "OAuth (Google · GitHub)", "OTP verification", "Notifications", "PostgreSQL-ready"],
  facts: [["Role", "Solo build"], ["Auth", "Allauth + OTP"], ["Social layer", "Follow, likes, replies"], ["Status", "Feature-complete"]],
  repo: "https://github.com/GouravK1107/Blog_app",
};
const PROJECTS = [
  {
    title: "Todo REST API", hint: "Django REST Framework", art: "api",
    body: "A task manager with a fully documented REST API underneath: custom user model, OTP email verification, OTP-based password reset, priority and due-date tracking, and a dashboard with weekly completion stats. Built as a real system, not a CRUD tutorial.",
    tags: ["Django REST Framework", "OTP auth", "Task management", "Dashboard analytics"],
    repo: "https://github.com/GouravK1107/todo-api-drf",
  },
  {
    title: "Divine Guidance", hint: "Django · RAG · LLM", art: "guidance",
    body: "Ask a life question, get a reflection grounded in real scripture. A retrieval-augmented generation pipeline pulls relevant passages from the Bhagavad Gita, Quran and Bible, then an LLM turns them into a grounded, practical answer instead of a generic AI response.",
    tags: ["Django", "RAG", "LLM", "Embeddings"],
    repo: "https://github.com/GouravK1107/divine-guidance",
  },
  {
    title: "SessionTrack", hint: "Firebase · Analytics", art: "track",
    body: "A focus timer with analytics people actually come back to: every deep-work session is stored, categorised and turned into a weekly heatmap, streaks and a leaderboard. Auth and data run on Firebase, so sessions follow the user across devices instead of dying in localStorage.",
    tags: ["Firebase Auth", "Firestore", "Analytics", "Leaderboard"],
    repo: "https://github.com/GouravK1107/sessiontrack",
    demo: "https://gouravk1107.github.io/sessiontrack/",
  },
  {
    title: "Short.ly", hint: "Django · Redirects", art: "link",
    body: "A minimal URL shortener done properly: duplicate-URL detection, instant redirection, one-click copy and a clean dark/light interface — deployed and actually reachable rather than left running on localhost.",
    tags: ["Django", "PostgreSQL-ready", "Gunicorn", "Render"],
    repo: "https://github.com/GouravK1107/short.ly",
    demo: "https://short-ly-0auu.onrender.com",
  },
  {
    title: "NoteNook", hint: "Django · Notes", art: "notes",
    body: "A notes app that went past the CRUD basics: categories, favourites, real-time search, an animated mascot and a dark/light toggle, running on Postgres in production instead of staying on SQLite.",
    tags: ["Django", "AJAX", "PostgreSQL-ready", "Render"],
    repo: "https://github.com/GouravK1107/notenook",
    demo: "https://notenook-yuaf.onrender.com/",
  },
];
/* Every public repo on github.com/GouravK1107 — powers the "All projects" overlay */
const ALL_REPOS = [
  { name: "BlogApp", cat: "Django", blurb: "Social blogging platform — OAuth, OTP verification, follows and notifications.", repo: "https://github.com/GouravK1107/Blog_app" },
  { name: "Todo REST API", cat: "Django", blurb: "Task manager with a documented DRF API, OTP auth and dashboard analytics.", repo: "https://github.com/GouravK1107/todo-api-drf" },
  { name: "Divine Guidance", cat: "AI / RAG", blurb: "RAG pipeline over the Gita, Quran and Bible for grounded LLM reflections.", repo: "https://github.com/GouravK1107/divine-guidance" },
  { name: "SessionTrack", cat: "Django", blurb: "Focus-timer analytics with streaks and a leaderboard, on Firebase.", repo: "https://github.com/GouravK1107/sessiontrack", demo: "https://gouravk1107.github.io/sessiontrack/" },
  { name: "Short.ly", cat: "Django", blurb: "Minimal, deployed URL shortener with duplicate detection.", repo: "https://github.com/GouravK1107/short.ly", demo: "https://short-ly-0auu.onrender.com" },
  { name: "NoteNook", cat: "Django", blurb: "Notes app with categories, favourites and real-time search.", repo: "https://github.com/GouravK1107/notenook", demo: "https://notenook-yuaf.onrender.com/" },
  { name: "Meditrack", cat: "AI / RAG", blurb: "Healthcare app that logs patient symptoms and monitors them with AI analysis.", repo: "https://github.com/GouravK1107/Meditrack" },
  { name: "Personal Finance RAG Assistant", cat: "AI / RAG", blurb: "RAG assistant that answers finance questions from your own PDF statements.", repo: "https://github.com/GouravK1107/personal-finance-RAG-assistant" },
  { name: "Hotel Management System", cat: "Django", blurb: "Freelance build: rooms, guests, bookings, billing and email notifications, Flask + SQLite.", repo: "https://github.com/GouravK1107/hotel-management-project" },
  { name: "Flask BookStore", cat: "Django", blurb: "College e-commerce project for buying and reading books, for readers and authors.", repo: "https://github.com/GouravK1107/Flask_BookStore" },
  { name: "Student Records CRUD", cat: "Django", blurb: "First-ever Django project — MVT architecture and CRUD, where it all clicked.", repo: "https://github.com/GouravK1107/Django_Student_CRUD_operation_project" },
  { name: "People Counting (YOLOv8)", cat: "Computer vision", blurb: "Detects and counts people in an image with YOLOv8 and OpenCV.", repo: "https://github.com/GouravK1107/people-counting-using-yolov8" },
  { name: "Air Canvas", cat: "Computer vision", blurb: "Draw in thin air — index-finger tracking via webcam with MediaPipe.", repo: "https://github.com/GouravK1107/air-canvas-project" },
  { name: "Touchless Volume Control", cat: "Computer vision", blurb: "Hand-gesture system volume control, thumb-to-index distance via MediaPipe.", repo: "https://github.com/GouravK1107/airvolume-touchless-sound-control" },
  { name: "Finger-Pinch Brightness", cat: "Computer vision", blurb: "Screen brightness controlled by a thumb-and-index pinch gesture.", repo: "https://github.com/GouravK1107/brightness-control-by-fingers" },
  { name: "Finger Counting", cat: "Computer vision", blurb: "Counts raised fingers live via webcam using MediaPipe Hand Landmarker.", repo: "https://github.com/GouravK1107/finger-counting-program" },
  { name: "Face Detection & Recognition", cat: "Computer vision", blurb: "Haar Cascade face detection with an LBPH recognizer trained per user.", repo: "https://github.com/GouravK1107/real-time-face-detection-dataset-opencv" },
  { name: "College Website", cat: "Learning", blurb: "Static, responsive college site — courses, faculty and campus info.", repo: "https://github.com/GouravK1107/College_website_project" },
  { name: "ATM Simulation", cat: "Learning", blurb: "First Python project, built solo right after learning the language.", repo: "https://github.com/GouravK1107/ATM_Simulation_program" },
  { name: "This portfolio", cat: "Learning", blurb: "Hand-written HTML, CSS and JS — no framework, no build step.", repo: "https://github.com/GouravK1107/my-portfolio" },
];
const STACK = [
  { key: "backend", label: "Backend", items: ["Python", "Django", "Django REST Framework", "Flask", "SQL", "PostgreSQL", "SQLite", "Firebase / Firestore", "REST API design", "Git", "GitHub"] },
  { key: "frontend", label: "Interface", items: ["HTML", "CSS", "JavaScript", "Responsive layout", "DOM work", "UI polish"] },
  { key: "ai", label: "AI & automation", items: ["LLM APIs", "RAG fundamentals", "n8n workflows", "Prompt design", "Claude", "ChatGPT", "Copilot", "Cursor", "Perplexity"] },
];
const LEVELS = [["Python", 82, "Confident"], ["Django", 80, "Confident"], ["SQL", 65, "Intermediate"], ["JavaScript", 60, "Intermediate"], ["DSA", 55, "Building"]];
const JOURNEY = [
  { when: "2023 — 2026", title: "BCA at Krishna Devaraya University", body: "Bachelor of Computer Applications. Coursework gave me the fundamentals; most of the actual engineering happened in side projects running in parallel." },
  { when: "2024 — 2026", title: "Built backend systems for peers and seniors", body: "Django and Python work for other people's projects: authentication systems, database models, CRUD workflows and REST-style APIs, with source managed properly in Git. Real deadlines and real feedback, which taught me more than any tutorial did." },
  { when: "Now", title: "Backend engineering, automation and applied AI", body: "Sharpening DSA, Django application architecture and relational design, while moving toward AI work — LLM-backed features, retrieval over my own data, and workflow automation with n8n. The goal is systems where the AI part is a component, not the whole pitch." },
];
const AWARDS = [
  { title: "Winner, Chakravyuha", where: "BITM University, Bellary", when: "20 July 2024", body: "First place in a competitive problem-solving event." },
  { title: "Mentor, Ignitron 2K25 (CodeRush)", where: "GM University", when: "4 Dec 2025", body: "Mentored a team through a 24-hour national hackathon on AI in healthcare. They won." },
];
const STATS = [[20, "Public repositories"], [6, "Featured builds with source you can read"], [2, "Hackathon results"]];

/* ================= hooks ================= */
function useReducedMotion() {
  const [rm, setRm] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRm(mq.matches);
    const on = (e) => setRm(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  return rm;
}
function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => { setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches); }, []);
  return fine;
}
function useInView(options) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }), options || { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}
function Reveal({ children, as: Tag = "div", className = "" }) {
  const [ref, seen] = useInView({ threshold: 0.16 });
  return <Tag ref={ref} className={"reveal " + (seen ? "seen " : "") + className}>{children}</Tag>;
}

/* ================= split text ================= */
function Split({ text, as: Tag = "span", delay = 0, className = "" }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  const words = text.split(" ");
  let n = -1;
  return (
    <Tag ref={ref} className={"split " + (seen ? "go " : "") + className}>
      {words.map((w, wi) => (
        <span className="mask" key={wi}>
          {w.split("").map((c, ci) => {
            n += 1;
            return <span className="ch" key={ci} style={{ animationDelay: (delay + n * 0.018) + "s" }}>{c}</span>;
          })}
          {wi < words.length - 1 ? <span className="ch" style={{ animationDelay: (delay + (n += 1) * 0.018) + "s" }}>&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
}

/* ================= loader ================= */
function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const rm = useReducedMotion();
  useEffect(() => {
    if (rm) { onDone(); return; }
    document.body.classList.add("locked");
    let raf = 0, start = 0;
    const dur = 1250;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setPct(Math.round(100 * (1 - Math.pow(1 - p, 2.2))));
      if (p < 1) raf = requestAnimationFrame(step);
      else {
        setTimeout(() => setOut(true), 190);
        setTimeout(() => { document.body.classList.remove("locked"); onDone(); }, 1150);
      }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); document.body.classList.remove("locked"); };
  }, [rm]);
  if (rm) return null;
  return (
    <div className={"loader" + (out ? " out" : "")}>
      <div className="loader-num">{pct}<sup>%</sup></div>
      <div className="loader-track"><div className="loader-fill" style={{ width: pct + "%" }} /></div>
      <div className="loader-cap">gourav r · backend developer · booting interface</div>
    </div>
  );
}

/* ================= custom cursor ================= */
function Cursor() {
  const fine = useFinePointer();
  const rm = useReducedMotion();
  const dot = useRef(null), ring = useRef(null);
  const [label, setLabel] = useState("");
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!fine || rm) return;
    document.body.classList.add("hide-cursor");
    let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my, raf = 0;
    const move = (e) => { mx = e.clientX; my = e.clientY; setHidden(false); };
    const over = (e) => {
      const t = e.target.closest && e.target.closest("[data-cur]");
      setLabel(t ? t.getAttribute("data-cur") : "");
    };
    const loop = () => {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      if (dot.current) dot.current.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      if (ring.current) ring.current.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    const leave = () => setHidden(true);
    document.addEventListener("mouseleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("hide-cursor");
    };
  }, [fine, rm]);

  if (!fine || rm) return null;
  return (
    <Fragment>
      <div ref={dot} className={"cur-dot" + (hidden ? " cur-hide" : "")} />
      <div ref={ring} className={"cur-ring" + (label ? " big" : "") + (hidden ? " cur-hide" : "")}>{label}</div>
    </Fragment>
  );
}

/* ================= magnetic ================= */
function Magnetic({ children, strength = 10 }) {
  const ref = useRef(null);
  const fine = useFinePointer();
  const rm = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || rm) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = "translate(" + dx * strength + "px," + dy * strength * 0.6 + "px)";
    };
    const out = () => { el.style.transform = "translate(0,0)"; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", out);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", out); };
  }, [fine, rm, strength]);
  return React.cloneElement(children, { ref, style: { ...(children.props.style || {}), transition: "transform .35s var(--ease-out)" } });
}

/* ================= reactive dot field ================= */
function DotField() {
  const wrap = useRef(null), cvs = useRef(null);
  const rm = useReducedMotion();
  useEffect(() => {
    if (rm) return;
    const el = wrap.current, c = cvs.current;
    if (!el || !c) return;
    const ctx = c.getContext("2d");
    let w = 0, h = 0, dpr = 1, raf = 0, live = true;
    let mx = -999, my = -999;
    const gap = 30;
    const css = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
    let jade = css("--jade", "#3FD9A4"), muted = css("--muted", "#8CA7B1");
    const resize = () => {
      const r = el.getBoundingClientRect();
      w = r.width; h = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, w * dpr); c.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
    };
    const frame = () => {
      if (!live) return;
      ctx.clearRect(0, 0, w, h);
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          const d = Math.hypot(x - mx, y - my);
          const k = Math.max(0, 1 - d / 150);
          const push = k * 9;
          const ang = Math.atan2(y - my, x - mx);
          const px = x + Math.cos(ang) * push, py = y + Math.sin(ang) * push;
          ctx.globalAlpha = 0.14 + k * 0.7;
          ctx.fillStyle = k > 0.12 ? jade : muted;
          ctx.beginPath();
          ctx.arc(px, py, 1 + k * 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    resize(); raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize); ro.observe(el);
    window.addEventListener("pointermove", move);
    const mo = new MutationObserver(() => { jade = css("--jade", "#3FD9A4"); muted = css("--muted", "#8CA7B1"); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { live = false; cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); window.removeEventListener("pointermove", move); };
  }, [rm]);
  if (rm) return null;
  return <div className="field" ref={wrap}><canvas ref={cvs} /></div>;
}

/* ================= system graph ================= */
const NODES = [
  { id: "client", x: 0.13, y: 0.5, label: "Browser" },
  { id: "api", x: 0.33, y: 0.5, label: "REST API" },
  { id: "auth", x: 0.55, y: 0.16, label: "Auth" },
  { id: "core", x: 0.55, y: 0.5, label: "Django" },
  { id: "jobs", x: 0.55, y: 0.85, label: "n8n jobs" },
  { id: "pg", x: 0.81, y: 0.30, label: "PostgreSQL", store: true },
  { id: "fs", x: 0.81, y: 0.70, label: "Firestore", store: true },
];
const EDGES = [["client","api"],["api","auth"],["api","core"],["api","jobs"],["core","pg"],["core","fs"],["auth","pg"],["jobs","fs"]];
const ROUTES = [
  { path: [["client","api"],["api","core"],["core","pg"]], name: "GET /api/sessions" },
  { path: [["client","api"],["api","auth"],["auth","pg"]], name: "POST /auth/token" },
  { path: [["client","api"],["api","core"],["core","fs"]], name: "GET /api/streak" },
  { path: [["client","api"],["api","jobs"],["jobs","fs"]], name: "POST /hooks/weekly" },
];

function SystemGraph() {
  const wrapRef = useRef(null), cvsRef = useRef(null);
  const [hot, setHot] = useState(null);
  const [trace, setTrace] = useState([]);
  const rm = useReducedMotion();
  useEffect(() => {
    const cvs = cvsRef.current, wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const ctx = cvs.getContext("2d");
    let raf = 0, w = 0, h = 0, dpr = 1, live = true, packets = [], spawnAt = 0;
    const css = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;
    let C = { line: css("--line", "#ccc"), jade: css("--jade", "#3FD9A4"), amber: css("--amber", "#F7A94B") };
    const pos = (id) => { const n = NODES.find((n) => n.id === id); return { x: n.x * w, y: n.y * h }; };
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height; dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.max(1, Math.floor(w * dpr)); cvs.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (ts) => {
      if (!live) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1; ctx.strokeStyle = C.line;
      EDGES.forEach(([a, b]) => { const p1 = pos(a), p2 = pos(b); ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); });
      if (!rm) {
        if (ts - spawnAt > 850 && packets.length < 5) {
          packets.push({ route: Math.floor(Math.random() * ROUTES.length), seg: 0, t: 0, speed: 0.55 + Math.random() * 0.45, ms: 24 + Math.floor(Math.random() * 90) });
          spawnAt = ts;
        }
        packets = packets.filter((p) => {
          const route = ROUTES[p.route], seg = route.path[p.seg];
          if (!seg) return false;
          const a = pos(seg[0]), b = pos(seg[1]);
          p.t += 0.011 * p.speed;
          if (p.t >= 1) {
            p.t = 0; p.seg += 1;
            if (p.seg >= route.path.length) {
              setTrace((prev) => [{ id: Math.random(), name: route.name, ms: p.ms, code: 200 }, ...prev].slice(0, 4));
              return false;
            }
          }
          const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
          const color = p.seg === route.path.length - 1 ? C.amber : C.jade;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 16);
          g.addColorStop(0, color); g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.globalAlpha = 0.28; ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1; ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
          return true;
        });
      }
      raf = requestAnimationFrame(frame);
    };
    resize(); raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(resize); ro.observe(wrap);
    const mo = new MutationObserver(() => { C = { line: css("--line", "#ccc"), jade: css("--jade", "#3FD9A4"), amber: css("--amber", "#F7A94B") }; });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    if (rm) setTrace([{ id: 1, name: "GET /api/sessions", ms: 41, code: 200 }, { id: 2, name: "POST /auth/token", ms: 88, code: 200 }, { id: 3, name: "GET /api/streak", ms: 33, code: 200 }]);
    return () => { live = false; cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, [rm]);
  return (
    <div className="system">
      <div className="system-head"><span className="dots"><i /><i /><i /></span><span>request graph — sessiontrack</span></div>
      <div className="graph" ref={wrapRef}>
        <canvas ref={cvsRef} />
        {NODES.map((n) => (
          <div key={n.id} className={"node" + (n.store ? " store" : "") + (hot === n.id ? " hot" : "")}
            style={{ left: n.x * 100 + "%", top: n.y * 100 + "%" }}
            onMouseEnter={() => setHot(n.id)} onMouseLeave={() => setHot(null)}>
            <em />{n.label}
          </div>
        ))}
      </div>
      <div className="trace">
        {trace.map((t) => (
          <div className="trace-row" key={t.id}>
            <span className="ok">{t.code}</span><span className="path">{t.name}</span><span className="ms">{t.ms}ms</span>
          </div>
        ))}
        {trace.length === 0 && <div style={{ opacity: .6 }}>waiting for requests…</div>}
      </div>
    </div>
  );
}

/* ================= project preview art (original SVG) ================= */
function PeekArt({ kind }) {
  const bg = "var(--surface)", line = "var(--line)", jade = "var(--jade)", amber = "var(--amber)";
  if (kind === "api") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        <rect x="16" y="16" width="88" height="10" rx="5" fill={jade} opacity=".8" />
        {[0,1,2,3].map((i) => (
          <g key={i}>
            <rect x="16" y={40 + i * 24} width="228" height="16" rx="6" fill={line} />
            <rect x="22" y={45 + i * 24} width={i % 2 ? 44 : 30} height="6" rx="3" fill={i % 2 ? amber : jade} />
            <rect x="80" y={45 + i * 24} width={110 - i * 18} height="6" rx="3" fill="var(--muted)" opacity=".5" />
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "blog") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        <rect x="16" y="16" width="150" height="14" rx="4" fill="var(--ink-2)" opacity=".7" />
        <rect x="16" y="38" width="120" height="6" rx="3" fill={amber} />
        {[0,1,2,3,4].map((i) => <rect key={i} x="16" y={58 + i * 12} width={i === 4 ? 120 : 176} height="5" rx="2.5" fill="var(--muted)" opacity=".45" />)}
        <rect x="200" y="16" width="44" height="44" rx="10" fill={jade} opacity=".75" />
        <rect x="200" y="70" width="44" height="6" rx="3" fill={line} />
      </svg>
    );
  }
  if (kind === "track") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        <rect x="16" y="16" width="120" height="10" rx="5" fill="var(--ink-2)" opacity=".7" />
        {[0,1,2,3,4,5,6].map((i) => (
          <rect key={i} x={16 + i * 17} y={72 - ((i * 37) % 55)} width="11" height={((i * 37) % 55) + 18} rx="3"
            fill={i % 3 === 0 ? jade : i % 3 === 1 ? amber : "var(--muted)"} opacity=".8" />
        ))}
        <rect x="16" y="112" width="228" height="1" fill={line} />
        <rect x="16" y="124" width="70" height="6" rx="3" fill={jade} opacity=".8" />
        <rect x="96" y="124" width="52" height="6" rx="3" fill={line} />
      </svg>
    );
  }
  if (kind === "link") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        <rect x="16" y="16" width="228" height="16" rx="8" fill={line} />
        <rect x="22" y="21" width="120" height="6" rx="3" fill="var(--muted)" opacity=".55" />
        <path d="M60 78 h30 a16 16 0 0 0 0-32 h-14" stroke={jade} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M198 88 h-30 a16 16 0 0 1 0-32 h14" stroke={amber} strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="122" y="59" width="16" height="7" rx="3.5" fill="var(--ink-2)" opacity=".7" />
        <rect x="16" y="118" width="150" height="6" rx="3" fill={line} />
      </svg>
    );
  }
  if (kind === "notes") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        {[0,1].map((c) => (
          <g key={c} transform={"translate(" + (16 + c * 130) + ",14)"}>
            <rect width="112" height="122" rx="10" fill={line} opacity=".55" />
            <rect x="10" y="14" width="60" height="8" rx="4" fill={c ? amber : jade} opacity=".85" />
            {[0,1,2].map((i) => <rect key={i} x="10" y={34 + i * 14} width={92 - i * 18} height="6" rx="3" fill="var(--muted)" opacity=".5" />)}
          </g>
        ))}
      </svg>
    );
  }
  if (kind === "guidance") {
    return (
      <svg viewBox="0 0 260 150">
        <rect width="260" height="150" fill={bg} />
        <circle cx="130" cy="70" r="10" fill={amber} />
        <circle cx="130" cy="70" r="26" fill="none" stroke={jade} strokeWidth="2" opacity=".55" />
        <circle cx="130" cy="70" r="42" fill="none" stroke={line} strokeWidth="2" />
        {[0,1,2].map((i) => (
          <rect key={i} x={46 + i * 60} y="118" width="46" height="7" rx="3.5" fill={i === 1 ? jade : "var(--muted)"} opacity=".6" />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 260 150">
      <rect width="260" height="150" fill={bg} />
      <rect x="16" y="16" width="228" height="22" rx="6" fill={line} />
      <rect x="24" y="24" width="60" height="6" rx="3" fill={jade} />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x="16" y={46 + i * 22} width="228" height="1" fill={line} />
          <circle cx="28" cy={57 + i * 22} r="5" fill={i === 1 ? amber : "var(--muted)"} opacity=".7" />
          <rect x="42" y={54 + i * 22} width={90 - i * 10} height="6" rx="3" fill="var(--muted)" opacity=".5" />
          <rect x="190" y={54 + i * 22} width="40" height="6" rx="3" fill={line} />
        </g>
      ))}
    </svg>
  );
}

function Peek({ kind, on, x, y }) {
  return (
    <div className="peek" style={{ transform: "translate3d(" + x + "px," + y + "px,0) scale(" + (on ? 1 : 0.9) + ")", opacity: on ? 1 : 0 }}>
      {kind ? <PeekArt kind={kind} /> : null}
    </div>
  );
}

function AllProjectsOverlay({ open, onClose }) {
  const [cat, setCat] = useState("All");
  const [flipped, setFlipped] = useState(null);

  useEffect(() => {
    if (open) { document.body.classList.add("locked"); setFlipped(null); }
    else document.body.classList.remove("locked");
    return () => document.body.classList.remove("locked");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const key = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, onClose]);

  if (!open) return null;
  const cats = ["All", ...Array.from(new Set(ALL_REPOS.map((r) => r.cat)))];
  const list = cat === "All" ? ALL_REPOS : ALL_REPOS.filter((r) => r.cat === cat);

  return ReactDOM.createPortal(
    <div className="all-back" onClick={onClose}>
      <div className="all-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="All projects">
        <div className="all-head">
          <div>
            <h3>All projects</h3>
            <p>{ALL_REPOS.length} public repositories on GitHub — hover a card for a preview, tap it on mobile.</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close" data-cur="close">✕</button>
        </div>
        <div className="all-tabs">
          {cats.map((c) => (
            <button key={c} className={"tab" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>
              {c}{c !== "All" ? " · " + ALL_REPOS.filter((r) => r.cat === c).length : ""}
            </button>
          ))}
        </div>
        <div className="all-grid" key={cat}>
          {list.map((r, i) => (
            <a
              key={r.repo}
              className={"repo-card" + (flipped === r.repo ? " open" : "")}
              href={r.repo}
              target="_blank"
              rel="noopener"
              data-cur="code"
              style={{ animationDelay: (i * 0.03) + "s" }}
              onTouchStart={(e) => { if (flipped !== r.repo) { e.preventDefault(); setFlipped(r.repo); } }}
            >
              <span className="repo-cat">{r.cat}</span>
              <h4>{r.name}</h4>
              <div className="repo-preview">
                <p>{r.blurb}</p>
                <span className="repo-links">
                  {r.demo ? <span className="repo-link live">Live</span> : null}
                  <span className="repo-link">Code ↗</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ================= chrome ================= */
function useTheme() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem("gr-theme"); } catch (e) {}
    const next = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(next); document.documentElement.setAttribute("data-theme", next);
  }, []);
  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("gr-theme", next); } catch (e) {}
      return next;
    });
  }, []);
  return [theme, toggle];
}

function Nav({ active, theme, onTheme, onCmd }) {
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 8);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={"nav" + (stuck ? " stuck" : "")}>
      <div className="wrap nav-in">
        <a className="brand" href="#top" data-cur="top"><span className="brand-mark">gr</span>Gourav R</a>
        <nav className="nav-links">
          {SECTIONS.map((s) => <a key={s.id} href={"#" + s.id} className={"nav-link" + (active === s.id ? " active" : "")}>{s.name}</a>)}
        </nav>
        <div className="nav-tools">
          <button className="kbd" onClick={onCmd} aria-label="Open quick jump"><span>⌘</span><span>K</span></button>
          <button className="icon-btn menu-btn" onClick={onCmd} aria-label="Open menu">≡</button>
          <button className="icon-btn" onClick={onTheme} aria-label="Switch theme">{theme === "dark" ? "☾" : "☀"}</button>
        </div>
      </div>
    </header>
  );
}

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState(""), [sel, setSel] = useState(0);
  const inputRef = useRef(null);
  const items = useMemo(() => ([
    ...SECTIONS.map((s) => ({ ic: s.idx, label: "Go to " + s.name, kind: "section", target: "#" + s.id })),
    { ic: "↗", label: "GitHub profile", kind: "link", target: LINKS.github },
    { ic: "↗", label: "LinkedIn profile", kind: "link", target: LINKS.linkedin },
    { ic: "↓", label: "Download resume", kind: "link", target: LINKS.resume },
    { ic: "@", label: "Email " + LINKS.email, kind: "link", target: "mailto:" + LINKS.email },
    { ic: "#", label: "Call " + LINKS.phone, kind: "link", target: "tel:" + LINKS.phone },
  ]), []);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => { if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 40); } }, [open]);
  const run = useCallback((item) => {
    if (!item) return;
    onClose();
    if (item.kind === "section") { const el = document.querySelector(item.target); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else window.open(item.target, item.target.indexOf("http") === 0 ? "_blank" : "_self");
  }, [onClose]);
  useEffect(() => {
    if (!open) return;
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); run(filtered[sel]); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [open, filtered, sel, run, onClose]);
  if (!open) return null;
  return (
    <div className="cmd-back" onClick={onClose}>
      <div className="cmd" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Quick jump">
        <input ref={inputRef} value={q} placeholder="Jump to a section or open a link" onChange={(e) => { setQ(e.target.value); setSel(0); }} />
        <div className="cmd-list">
          {filtered.map((i, n) => (
            <div key={i.label} className={"cmd-item" + (n === sel ? " sel" : "")} onMouseEnter={() => setSel(n)} onClick={() => run(i)}>
              <span className="ic">{i.ic}</span><span>{i.label}</span>{n === sel && <span className="k">enter</span>}
            </div>
          ))}
          {filtered.length === 0 && <div className="cmd-empty">Nothing matches that. Try “work”, “resume” or “email”.</div>}
        </div>
      </div>
    </div>
  );
}

/* ================= sections ================= */
function Section({ id, idx, name, children, field }) {
  return (
    <section id={id} className="sect">
      {field ? <DotField /> : null}
      <div className="wrap sect-grid">
        <div className="rail"><div className="rail-inner"><span className="rail-idx">{idx}</span><span className="rail-name">{name}</span><span className="rail-bar" /></div></div>
        <div>{children}</div>
      </div>
    </section>
  );
}

function Hero({ ready }) {
  return (
    <div className="wrap hero" id="top">
      <div className="hero-grid">
        <div className={"stage" + (ready ? " go" : "")}>
          <span className="status"><i />open to backend and applied-AI roles</span>
          <h1>
            {ready ? <Fragment><Split text="Backend that holds" delay={0.25} /><Split className="two" text="up under real users." delay={0.5} /></Fragment> : <span style={{ opacity: 0 }}>Backend that holds up under real users.</span>}
          </h1>
          <p className="hero-sub">I'm Gourav — I design Django APIs, data models and the plumbing behind web apps, then care about the interface on top of them too. Currently pushing that work toward applied AI: LLM-backed features and retrieval over real data.</p>
          <div className="cta-row">
            <Magnetic><a className="btn btn-primary" href="#work" data-cur="work">See the work</a></Magnetic>
            <Magnetic><a className="btn" href={LINKS.resume} target="_blank" rel="noopener" data-cur="open">Download resume</a></Magnetic>
            <Magnetic><a className="btn" href={LINKS.github} target="_blank" rel="noopener" data-cur="open">GitHub</a></Magnetic>
          </div>
          <div className="hero-meta">
            <span><b>Hospet</b>, Karnataka</span>
            <span><b>BCA</b> · Krishna Devaraya University</span>
            <span><b>4</b> languages spoken</span>
          </div>
        </div>
        <div><SystemGraph /></div>
      </div>
    </div>
  );
}

function Work() {
  const [open, setOpen] = useState(0);
  const [peek, setPeek] = useState({ on: false, kind: null, x: 0, y: 0 });
  const fine = useFinePointer();
  const rm = useReducedMotion();
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const featureRef = useRef(null);

  const tiltMove = (e) => {
    if (!fine || rm) return;
    const el = featureRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = "perspective(900px) rotateY(" + (px * 5) + "deg) rotateX(" + (-py * 5) + "deg) translateZ(0)";
  };
  const tiltLeave = () => { const el = featureRef.current; if (el) el.style.transform = "perspective(900px) rotateY(0) rotateX(0)"; };

  useEffect(() => {
    if (!fine || rm) return;
    let cur = { x: 0, y: 0 }, live = true;
    const loop = () => {
      if (!live) return;
      cur.x += (target.current.x - cur.x) * 0.12;
      cur.y += (target.current.y - cur.y) * 0.12;
      setPeek((p) => (p.on ? { ...p, x: cur.x, y: cur.y } : p));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { live = false; cancelAnimationFrame(raf.current); };
  }, [fine, rm]);

  const enter = (kind) => (e) => {
    if (!fine || rm) return;
    target.current = { x: e.clientX + 26, y: e.clientY - 80 };
    setPeek({ on: true, kind, x: e.clientX + 26, y: e.clientY - 80 });
  };
  const move = (e) => { target.current = { x: e.clientX + 26, y: e.clientY - 80 }; };
  const leave = () => setPeek((p) => ({ ...p, on: false }));

  const [allOpen, setAllOpen] = useState(false);

  return (
    <Section id="work" idx="01" name="Work">
      <Split as="h2" text="Six builds, each one fixing what the last one taught me." />
      <Reveal><p className="lead">Every project below has readable source. Start with BlogApp — it's the one with the most moving parts: auth, social features and a dashboard.</p></Reveal>

      <Reveal>
        <div className="feature" ref={featureRef} onMouseMove={tiltMove} onMouseLeave={tiltLeave} style={{ transition: "transform .35s var(--ease)", willChange: "transform" }}>
          <div>
            <h3>{FEATURED.title}</h3>
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 15.5, fontWeight: 600 }}>{FEATURED.kicker}</p>
            <p style={{ color: "var(--ink-2)", fontSize: 15 }}>{FEATURED.body}</p>
            <div className="tag-row">{FEATURED.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
            <div className="links">
              {FEATURED.demo ? <a className="link-pill" href={FEATURED.demo} target="_blank" rel="noopener" data-cur="open">Open live app</a> : null}
              <a className="link-pill" href={FEATURED.repo} target="_blank" rel="noopener" data-cur="code">Read the code</a>
            </div>
          </div>
          <div className="feature-side">{FEATURED.facts.map(([k, v]) => <div className="kv" key={k}><span>{k}</span><span>{v}</span></div>)}</div>
        </div>
      </Reveal>

      <div className="rows">
        {PROJECTS.map((p, i) => (
          <div className={"row" + (open === i ? " open" : "")} key={p.title}>
            <button className="row-head" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
              onMouseEnter={enter(p.art)} onMouseMove={move} onMouseLeave={leave} data-cur={open === i ? "close" : "expand"}>
              <span className="row-num">{"0" + (i + 2)}</span>
              <span className="row-title">{p.title}</span>
              <span className="row-hint"><span>{p.hint}</span><span className="row-plus">+</span></span>
            </button>
            <div className="row-body"><div><div className="row-inner">
              <p style={{ marginTop: 0 }}>{p.body}</p>
              <div className="tag-row">{p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
              <div className="links">
                {p.demo ? <a className="link-pill" href={p.demo} target="_blank" rel="noopener" data-cur="open">Open live app</a> : null}
                <a className="link-pill" href={p.repo} target="_blank" rel="noopener" data-cur="code">Read the code</a>
              </div>
            </div></div></div>
          </div>
        ))}
      </div>

      <div className="links" style={{ marginTop: 26 }}>
        <Magnetic><button className="link-pill" onClick={() => setAllOpen(true)} data-cur="open">All {ALL_REPOS.length} repositories ↗</button></Magnetic>
      </div>

      {fine && !rm ? <Peek kind={peek.kind} on={peek.on} x={peek.x} y={peek.y} /> : null}
      <AllProjectsOverlay open={allOpen} onClose={() => setAllOpen(false)} />
    </Section>
  );
}

function Stack() {
  const [tab, setTab] = useState("backend");
  const [ref, seen] = useInView({ threshold: 0.3 });
  const group = STACK.find((g) => g.key === tab);
  return (
    <Section id="stack" idx="02" name="Stack" field>
      <Split as="h2" text="What I reach for, and how far I've actually got." />
      <div className="tabs">
        {STACK.map((g) => <button key={g.key} className={"tab" + (tab === g.key ? " on" : "")} onClick={() => setTab(g.key)}>{g.label}</button>)}
      </div>
      <div className="chips" key={tab}>
        {group.items.map((it, i) => <span className="chip" key={it} style={{ animationDelay: (i * 0.035) + "s" }}>{it}</span>)}
      </div>
      <div className="bars" ref={ref}>
        {LEVELS.map(([name, pct, label]) => (
          <div className="bar-row" key={name}>
            <span>{name}</span>
            <span className="bar-track"><span className="bar-fill" style={{ width: seen ? pct + "%" : 0 }} /></span>
            <span className="lvl">{label}</span>
          </div>
        ))}
      </div>
      <p className="lead" style={{ fontSize: 15 }}>I use AI tools daily for generation and debugging, but the logic, the data flow and the decisions are mine — that is the part I am actually being hired for.</p>
    </Section>
  );
}

function Journey() {
  const rm = useReducedMotion();
  const cardRefs = useRef([]);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width:700px)");
    const on = (e) => setNarrow(e.matches);
    on(mq);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);

  const base = narrow ? 76 : 96;
  const gap = narrow ? 12 : 18;

  useEffect(() => {
    if (rm) return;
    const cards = cardRefs.current.filter(Boolean);
    if (!cards.length) return;
    const settleSpan = narrow ? 130 : 190;
    let raf = 0, ticking = false;
    let naturalTops = [];

    // Layout-only position, unaffected by any transform this effect applies —
    // avoids the drift that happens if getBoundingClientRect is read while a
    // transform/scale is live.
    const getAbsoluteTop = (el) => {
      let top = 0, node = el;
      while (node) { top += node.offsetTop || 0; node = node.offsetParent; }
      return top;
    };

    const measure = () => { naturalTops = cards.map(getAbsoluteTop); };

    const apply = () => {
      ticking = false;
      const scrollY = window.scrollY;

      // how far each card still has to travel before it locks into its own sticky slot
      const inProgress = cards.map((c, i) => {
        const ownStickyTop = base + i * gap;
        const dist = (naturalTops[i] - ownStickyTop) - scrollY;
        return Math.min(1, Math.max(0, 1 - dist / settleSpan));
      });

      // how close the following card is to covering this one
      const outProgress = cards.map((c, i) => {
        if (i === cards.length - 1) return 0;
        const nextStickyTop = base + (i + 1) * gap;
        const dist = (naturalTops[i + 1] - nextStickyTop) - scrollY;
        return Math.min(1, Math.max(0, 1 - dist / settleSpan));
      });

      cards.forEach((c, i) => {
        const rise = (1 - inProgress[i]) * 26;
        const tuck = outProgress[i] * -10;
        const y = rise + tuck;
        const scale = 1 - (1 - inProgress[i]) * 0.035 - outProgress[i] * 0.045;
        const bright = 1 - outProgress[i] * 0.18;
        c.style.transform = (y !== 0 || scale !== 1) ? "translateY(" + y.toFixed(2) + "px) scale(" + scale.toFixed(3) + ")" : "none";
        c.style.filter = bright !== 1 ? "brightness(" + bright.toFixed(3) + ")" : "none";
      });
    };

    const onScroll = () => { if (!ticking) { ticking = true; raf = requestAnimationFrame(apply); } };
    const remeasure = () => { measure(); onScroll(); };

    measure();
    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("load", remeasure);
    // web fonts finishing (or swapping) after first paint is the usual cause
    // of a stale measurement — catch that and re-measure once it settles.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure).catch(() => {});
    // catch any other later reflow (images loading, content shifting, etc.)
    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(remeasure);
      ro.observe(document.body);
    }
    const settleTimer = setTimeout(remeasure, 500);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("load", remeasure);
      if (ro) ro.disconnect();
      clearTimeout(settleTimer);
      cancelAnimationFrame(raf);
      cards.forEach((c) => { if (c) { c.style.transform = ""; c.style.filter = ""; } });
    };
  }, [rm, narrow, base, gap]);

  return (
    <Section id="journey" idx="03" name="Journey">
      <Split as="h2" text="How the last three years actually went." />
      <div className="jstack">
        {JOURNEY.map((j, i) => (
          <article
            className="jcard"
            key={j.title}
            ref={(el) => (cardRefs.current[i] = el)}
            style={{ top: (base + i * gap) + "px", zIndex: i + 1 }}
          >
            <div className="jcard-top">
              <span className="jcard-num">{"0" + (i + 1)}</span>
              <span className="jcard-when">{j.when}</span>
            </div>
            <h3>{j.title}</h3>
            <p>{j.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Counter({ to }) {
  const [ref, seen] = useInView({ threshold: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0, start = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 950, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <b ref={ref}>{n}</b>;
}

function Awards() {
  return (
    <Section id="awards" idx="04" name="Recognition">
      <Split as="h2" text="Two rooms where the work was tested against other people's." />
      <Reveal>
        <div className="awards">
          {AWARDS.map((a) => (
            <Magnetic key={a.title} strength={6}>
              <div className="award">
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                <span className="where">{a.where} · {a.when}</span>
              </div>
            </Magnetic>
          ))}
        </div>
      </Reveal>
      <div className="stats">
        {STATS.map(([n, label]) => <div className="stat" key={label}><Counter to={n} /><span>{label}</span></div>)}
      </div>
    </Section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) { window.location.href = "mailto:" + LINKS.email; }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    const subject = encodeURIComponent("Portfolio message from " + form.name);
    const body = encodeURIComponent(form.message + "\n\n— " + form.name + " (" + form.email + ")");
    window.location.href = "mailto:" + LINKS.email + "?subject=" + subject + "&body=" + body;
    setSent(true);
    setTimeout(() => setSent(false), 2600);
  };

  const SOCIAL = [
    { label: "GitHub", tip: "github.com/GouravK1107", href: LINKS.github, ic: "⌥" },
    { label: "LinkedIn", tip: "linkedin.com/in/gourav-kumar-r", href: LINKS.linkedin, ic: "in" },
    { label: "Email", tip: LINKS.email, href: "mailto:" + LINKS.email, ic: "@" },
    { label: "Call", tip: "+91 99162 59010", href: "tel:" + LINKS.phone, ic: "☎" },
  ];

  return (
    <Section id="contact" idx="05" name="Contact">
      <Split as="h2" text="Got a backend that needs building or fixing?" />
      <div className="contact" style={{ marginTop: 14 }}>
        <div>
          <Reveal><span className="avail"><i />usually replies within a day</span></Reveal>
          <Reveal><p className="lead">I'm open to backend and applied-AI roles, freelance API work, and collaborations. Send a message directly, or reach me on any of these.</p></Reveal>

          <div className="social-row">
            {SOCIAL.map((s) => (
              <a key={s.label} className="social-btn" href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener" data-cur={s.label}>
                {s.ic}
                <span className="tip">{s.tip}</span>
              </a>
            ))}
          </div>

          <div className="mailto">
            <span className="mail-val">{LINKS.email}</span>
            <button className="btn" onClick={copy} data-cur="copy">{copied ? "Copied" : "Copy email"}</button>
          </div>
        </div>

        <form className="compose" onSubmit={submit}>
          <div className="compose-head">
            <h4>Send a message</h4>
            <span>opens your email app</span>
          </div>
          <div className="crow">
            <input className="cin" placeholder="Your name" value={form.name} onChange={set("name")} required />
            <input className="cin" type="email" placeholder="Your email" value={form.email} onChange={set("email")} required />
          </div>
          <textarea className="cin" placeholder="What are you building, or what's the role?" value={form.message} onChange={set("message")} required />
          <div className="compose-foot">
            <span className="compose-note">No backend here — this hands off to your mail client with everything filled in.</span>
            <button className={"send-btn" + (sent ? " sent" : "")} type="submit" data-cur="send">
              {sent ? <Fragment><span className="send-check">✓</span> Opening mail…</Fragment> : "Send message"}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <span>© {new Date().getFullYear()} Gourav R — built with React, hand-written CSS and no template.</span>
        <div className="foot-links">
          <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
          <a href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a href={"mailto:" + LINKS.email}>Email</a>
          <a href="#top">Top</a>
        </div>
      </div>
    </footer>
  );
}

/* ================= app ================= */
function App() {
  const [theme, toggleTheme] = useTheme();
  const [active, setActive] = useState("work");
  const [cmd, setCmd] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => { const b = document.getElementById("boot"); if (b) b.remove(); }, []);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: "-45% 0px -50% 0px" });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const key = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmd((c) => !c); }
      if (e.key === "/" && document.activeElement === document.body) { e.preventDefault(); setCmd(true); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  return (
    <Fragment>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <Nav active={active} theme={theme} onTheme={toggleTheme} onCmd={() => setCmd(true)} />
      <main>
        <Hero ready={ready} />
        <div className="wrap"><div className="rule" /></div>
        <Work />
        <div className="wrap"><div className="rule" /></div>
        <Stack />
        <div className="wrap"><div className="rule" /></div>
        <Journey />
        <div className="wrap"><div className="rule" /></div>
        <Awards />
        <div className="wrap"><div className="rule" /></div>
        <Contact />
      </main>
      <Footer />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} />
    </Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);