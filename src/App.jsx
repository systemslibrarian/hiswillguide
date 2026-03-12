import { useEffect, useMemo, useState } from 'react';
import { DAILY_VERSE, GUIDE_PILLARS, KEY_SCRIPTURES, PROMISES, SECTIONS } from './data';

function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem('hiswillguide-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = stored || (prefersDark ? 'dark' : 'light');
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('hiswillguide-theme', theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  };
}

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="icon-button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
    </button>
  );
}

function ScriptureCard({ scripture }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button className={`scripture-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded((v) => !v)} type="button">
      <div className="scripture-card__row">
        <span className="scripture-card__ref">{scripture.ref}</span>
        <span className="scripture-card__icon">{expanded ? '−' : '+'}</span>
      </div>
      <p className="scripture-card__insight">{scripture.insight}</p>
      {expanded && <p className="scripture-card__text">“{scripture.text}”</p>}
    </button>
  );
}

function ReflectionChecklist({ items, sectionId }) {
  const storageKey = `hiswillguide-checklist-${sectionId}`;
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setChecked(JSON.parse(raw));
      } catch {
        setChecked({});
      }
    }
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked, storageKey]);

  return (
    <div className="question-list">
      {items.map((item, index) => {
        const active = Boolean(checked[index]);
        return (
          <button
            key={item}
            className={`question-item ${active ? 'checked' : ''}`}
            onClick={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}
            type="button"
          >
            <span className="question-item__box">{active ? '✓' : ''}</span>
            <span>{item}</span>
          </button>
        );
      })}
    </div>
  );
}

function Journal({ section }) {
  const key = `hiswillguide-journal-${section.id}`;
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(key);
    if (existing) setValue(existing);
  }, [key]);

  const save = () => {
    window.localStorage.setItem(key, value);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <section className="panel journal-panel">
      <div className="eyebrow">Reflection Journal</div>
      <p className="journal-copy">Capture what stood out, what needs surrender, or what next step feels most faithful.</p>
      <textarea
        className="journal-textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={`What is God impressing on your heart in “${section.title.replace('?', '')}”?`}
      />
      <div className="journal-actions">
        <button className="primary-button" onClick={save} type="button">
          {saved ? 'Saved' : 'Save reflection'}
        </button>
      </div>
    </section>
  );
}

function InAppBrowserBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const inApp = /(FBAN|FBAV|Instagram|Line|Twitter|TikTok|Snapchat|Messenger)/i.test(ua);
    setShow(inApp);
  }, []);

  if (!show) return null;

  return (
    <div className="inapp-banner" role="status">
      <span>For the best experience, open this page in Safari or Chrome.</span>
      <button type="button" onClick={() => setShow(false)} aria-label="Dismiss browser notice">✕</button>
    </div>
  );
}

function SiteHeader({ theme, toggleTheme, menuOpen, setMenuOpen }) {
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [setMenuOpen]);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#guide', label: 'Guide' },
    { href: '#scriptures', label: 'Scriptures' },
    { href: '#prayer', label: 'Prayer' },
  ];

  return (
    <>
      <header className="site-header">
        <a className="site-brand" href="#top" aria-label="HisWillGuide home">
          <span className="site-brand__mark">✦</span>
          <span>
            <span className="site-tag">HisWillGuide.com</span>
            <span className="site-brand__sub">Scripture · Prayer · Wisdom · Discernment</span>
          </span>
        </a>

        <nav className="site-nav desktop-nav" aria-label="Primary">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <div className="header-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            className="icon-button mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden={!menuOpen} />
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__header">
          <div>
            <div className="site-tag">Navigate</div>
            <div className="mobile-menu__title">HisWillGuide.com</div>
          </div>
          <button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <nav className="mobile-menu__nav" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
          ))}
        </nav>
      </div>
    </>
  );
}

function Home({ onOpenSection, theme, toggleTheme, menuOpen, setMenuOpen }) {
  const openFirst = () => onOpenSection(SECTIONS[0].id);

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <section className="hero hero--expanded" id="top">
        <div className="hero-banner panel">
          <img src="/banner.svg" alt="HisWillGuide banner with cross, open Bible, and Psalm 143:10 theme" />
        </div>
        <div className="hero-mark">✦</div>
        <h1>Learn to discern God&rsquo;s will</h1>
        <p className="hero-subtitle">A calm, biblical guide rooted in surrender, Scripture, prayer, wise counsel, and obedient trust.</p>
        <p className="hero-copy">
          His Will Guide is a reflective Christian resource for believers who want more than quick answers. It helps you slow
          down, seek God honestly, and walk through decisions in a faithful, Scripture-shaped way.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={openFirst} type="button">Begin the 8-step guide</button>
          <a className="ghost-button hero-link" href="#about">Explore the foundation</a>
        </div>
      </section>

      <section className="daily-verse panel">
        <div className="eyebrow">A Starting Point</div>
        <p className="daily-verse__text">“{DAILY_VERSE.text}”</p>
        <div className="daily-verse__ref">— {DAILY_VERSE.ref}</div>
      </section>

      <section id="about" className="intro-grid intro-grid--three">
        <article className="panel intro-panel">
          <div className="eyebrow">What this site is</div>
          <h2>A pastoral framework, not a formula.</h2>
          <p>
            This site is designed to help Christians think biblically about guidance. God’s will is not usually found in panic
            or pressure, but in surrender, truth, prayer, and faithful next steps.
          </p>
        </article>
        <article className="panel intro-panel">
          <div className="eyebrow">What this site is not</div>
          <h2>Not a shortcut to certainty.</h2>
          <p>
            It does not promise instant answers, hidden codes, or mystical hacks. It aims to form discernment so that your
            decisions are shaped by God’s character and Word.
          </p>
        </article>
        <article className="panel intro-panel">
          <div className="eyebrow">Why it matters</div>
          <h2>Faithfulness often begins with the next step.</h2>
          <p>
            Many believers are not asking for control. They simply want to honor God. This guide exists to help that desire be
            grounded in Scripture and expressed in obedience.
          </p>
        </article>
      </section>

      <section className="pillars-section">
        <div className="section-heading">
          <div className="eyebrow">Four Anchors</div>
          <h2>The core structure of His Will Guide.</h2>
          <p className="section-copy">
            The site is organized around four biblical anchors that keep discernment steady when life feels unclear.
          </p>
        </div>
        <div className="pillars-grid">
          {GUIDE_PILLARS.map((pillar) => (
            <article key={pillar.title} className="panel pillar-card">
              <div className="pillar-card__icon">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="guide" className="steps-section">
        <div className="section-heading">
          <div className="eyebrow">The 8-Step Guide</div>
          <h2>Walk through the questions slowly.</h2>
          <p className="section-copy">
            Each step helps you examine your heart, meditate on key passages, and move from confusion toward faithful action.
          </p>
        </div>

        <div className="step-list">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              className="step-card"
              style={{ '--accent': section.color }}
              onClick={() => onOpenSection(section.id)}
              type="button"
            >
              <div className="step-card__number">{section.number}</div>
              <div className="step-card__body">
                <h3>{section.title}</h3>
                <p>
                  {section.subtitle} · {section.scriptures.length} scriptures · {section.questions.length} reflection prompts
                </p>
              </div>
              <div className="step-card__arrow">→</div>
            </button>
          ))}
        </div>
      </section>

      <section id="scriptures" className="intro-grid">
        <article className="panel intro-panel">
          <div className="eyebrow">Core Scriptures</div>
          <h2>Verses that shape discernment.</h2>
          <ul className="key-scriptures">
            {KEY_SCRIPTURES.map((item) => (
              <li key={item.ref}>
                <strong>{item.ref}</strong>
                <span>{item.note}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="panel intro-panel promises-panel">
          <div className="eyebrow">What God promises</div>
          <h2>What you can expect as you seek Him.</h2>
          <ul className="promise-list">
            {PROMISES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section id="prayer" className="panel prayer-panel">
        <div className="eyebrow">Closing Prayer</div>
        <blockquote>
          “Teach me to do your will, for you are my God; let your good Spirit lead me on level ground.”
        </blockquote>
        <div className="daily-verse__ref">— Psalm 143:10</div>
        <p className="prayer-panel__copy">
          Let this become the posture of the whole site: not merely asking what to do, but asking God to form who we are.
        </p>
      </section>

      <footer className="footer-note">
        HisWillGuide.com — a Scripture-centered resource for believers seeking to discern God’s will with humility,
        wisdom, and obedience.
      </footer>
    </>
  );
}

function Detail({ activeId, onBack, onNavigate, theme, toggleTheme, menuOpen, setMenuOpen }) {
  const section = useMemo(() => SECTIONS.find((item) => item.id === activeId) ?? SECTIONS[0], [activeId]);
  const index = SECTIONS.findIndex((item) => item.id === section.id);
  const previous = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="detail-shell">
        <div className="detail-topbar">
          <button className="ghost-button" onClick={onBack} type="button">
            ← Home
          </button>
          <div className="dot-row" aria-hidden="true">
            {SECTIONS.map((item) => (
              <span key={item.id} className={`dot ${item.id === section.id ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <article className="detail-header" style={{ '--accent': section.color }}>
          <div className="detail-header__meta">
            <span className="detail-number">{section.number}</span>
            <span className="eyebrow">{section.subtitle}</span>
          </div>
          <h1>{section.title}</h1>
          <p className="detail-theme">{section.theme}</p>
          <p className="detail-description">{section.description}</p>
        </article>

        <section className="panel">
          <div className="eyebrow">Reflection Questions</div>
          <ReflectionChecklist items={section.questions} sectionId={section.id} />
        </section>

        <section className="panel">
          <div className="eyebrow">Scriptures to Meditate On</div>
          <div className="scripture-list">
            {section.scriptures.map((scripture) => (
              <ScriptureCard key={scripture.ref} scripture={scripture} />
            ))}
          </div>
        </section>

        <Journal section={section} />

        <div className="detail-nav">
          <button className="ghost-button" disabled={!previous} onClick={() => previous && onNavigate(previous.id)} type="button">
            ← Previous
          </button>
          <button className="primary-button" disabled={!next} onClick={() => next && onNavigate(next.id)} type="button">
            {next ? 'Next Step →' : 'Completed'}
          </button>
        </div>

        <section className="closing-block">
          <div className="divider" />
          <blockquote>
            “Teach me to do your will, for you are my God; let your good Spirit lead me on level ground.”
          </blockquote>
          <div className="daily-verse__ref">— Psalm 143:10</div>
        </section>
      </div>
    </>
  );
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMenuOpen(false);
  }, [activeSectionId]);

  useEffect(() => {
    document.title = activeSectionId
      ? `HisWillGuide.com — ${SECTIONS.find((item) => item.id === activeSectionId)?.title ?? 'Finding God’s Will'}`
      : 'HisWillGuide.com — Discern God’s Will Through Scripture, Prayer, and Wisdom';
  }, [activeSectionId]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">Skip to content</a>
      <div className="background-glow" />
      <main className="container">
        {activeSectionId ? (
          <Detail
            activeId={activeSectionId}
            onBack={() => setActiveSectionId(null)}
            onNavigate={setActiveSectionId}
            theme={theme}
            toggleTheme={toggleTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        ) : (
          <Home
            onOpenSection={setActiveSectionId}
            theme={theme}
            toggleTheme={toggleTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}
      </main>
    </div>
  );
}
