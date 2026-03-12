import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
      <span aria-hidden="true">{theme === 'dark' ? 'â˜€ï¸' : 'ðŸŒ™'}</span>
    </button>
  );
}

function ScriptureCard({ scripture }) {
  const [expanded, setExpanded] = useState(false);
  const cardId = `scripture-${scripture.ref.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`scripture-card ${expanded ? 'expanded' : ''}`}>
      <button
        className="scripture-card__toggle"
        onClick={() => setExpanded((v) => !v)}
        type="button"
        aria-expanded={expanded}
        aria-controls={`${cardId}-text`}
      >
        <div className="scripture-card__row">
          <span className="scripture-card__ref">{scripture.ref}</span>
          <span className="scripture-card__icon" aria-hidden="true">{expanded ? '\u2212' : '+'}</span>
        </div>
        <p className="scripture-card__insight">{scripture.insight}</p>
      </button>
      {expanded && (
        <div id={`${cardId}-text`} role="region" aria-label={`${scripture.ref} full text`}>
          <p className="scripture-card__text">{'\u201C'}{scripture.text}{'\u201D'}</p>
        </div>
      )}
    </div>
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
    <div className="question-list" role="group" aria-label="Reflection checklist">
      {items.map((item, index) => {
        const active = Boolean(checked[index]);
        return (
          <button
            key={item}
            className={`question-item ${active ? 'checked' : ''}`}
            onClick={() => setChecked((current) => ({ ...current, [index]: !current[index] }))}
            type="button"
            role="checkbox"
            aria-checked={active}
          >
            <span className="question-item__box" aria-hidden="true">{active ? '\u2713' : ''}</span>
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
  const textareaId = `journal-${section.id}`;

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
    <section className="panel journal-panel" aria-labelledby={`${textareaId}-heading`}>
      <h2 className="eyebrow" id={`${textareaId}-heading`}>Reflection Journal</h2>
      <p className="journal-copy" id={`${textareaId}-desc`}>Capture what stood out, what needs surrender, or what next step feels most faithful.</p>
      <label htmlFor={textareaId} className="sr-only">
        Your reflection on {section.title}
      </label>
      <textarea
        id={textareaId}
        className="journal-textarea"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={`What is God impressing on your heart in "${section.title.replace('?', '')}"?`}
        aria-describedby={`${textareaId}-desc`}
      />
      <div className="journal-actions">
        <button className="primary-button" onClick={save} type="button">
          {saved ? 'Saved \u2713' : 'Save reflection'}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {saved ? 'Reflection saved successfully.' : ''}
        </span>
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
      <button type="button" onClick={() => setShow(false)} aria-label="Dismiss browser notice">âœ•</button>
    </div>
  );
}

function SiteHeader({ theme, toggleTheme, menuOpen, setMenuOpen }) {
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [setMenuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, setMenuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const menu = menuRef.current;
    const focusable = menu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onTab);
    return () => document.removeEventListener('keydown', onTab);
  }, [menuOpen]);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#guide', label: 'Guide' },
    { href: '#scriptures', label: 'Scriptures' },
    { href: '#prayer', label: 'Prayer' },
  ];

  return (
    <>
      <header className="site-header" role="banner">
        <a className="site-brand" href="#top" aria-label="HisWillGuide home">
          <span className="site-brand__mark" aria-hidden="true">{'\u2726'}</span>
          <span>
            <span className="site-tag">HisWillGuide.com</span>
            <span className="site-brand__sub">Scripture Â· Prayer Â· Wisdom Â· Discernment</span>
          </span>
        </a>

        <nav className="site-nav desktop-nav" aria-label="Primary">
          {navLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <div className="header-actions">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{menuOpen ? '\u2715' : '\u2630'}</span>
          </button>
        </div>
      </header>

      <div
        className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Site navigation menu"
      >
        <div className="mobile-menu__header">
          <div>
            <div className="site-tag">Navigate</div>
            <div className="mobile-menu__title">HisWillGuide.com</div>
          </div>
          <button type="button" className="icon-button" onClick={() => { setMenuOpen(false); menuButtonRef.current?.focus(); }} aria-label="Close menu">
            <span aria-hidden="true">{'\u2715'}</span>
          </button>
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

      <section className="hero hero--expanded" id="top" aria-labelledby="hero-heading">
        <div className="hero-banner panel">
          <img src="/banner.svg" alt="HisWillGuide banner with cross, open Bible, and Psalm 143:10 theme" />
        </div>
        <div className="hero-mark" aria-hidden="true">{'\u2726'}</div>
        <h1 id="hero-heading">
          {"Learn to discern God\u2019s will"}
          <span>with a calm, biblical guide rooted in surrender, Scripture, prayer, wise counsel, and obedient trust.</span>
        </h1>
        <p className="hero-copy">
          His Will Guide is a reflective Christian resource for believers who want more than quick answers. It helps you slow
          down, seek God honestly, and walk through decisions in a faithful, Scripture-shaped way.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={openFirst} type="button">Begin the 8-step guide</button>
          <a className="ghost-button hero-link" href="#about">Explore the foundation</a>
        </div>
      </section>

      <section className="daily-verse panel" aria-label="Verse of encouragement">
        <div className="eyebrow">A Starting Point</div>
        <p className="daily-verse__text">{'\u201C'}{DAILY_VERSE.text}{'\u201D'}</p>
        <div className="daily-verse__ref">{'\u2014'} {DAILY_VERSE.ref}</div>
      </section>

      <section id="about" className="intro-grid intro-grid--three" aria-label="About this site">
        <article className="panel intro-panel">
          <div className="eyebrow">What this site is</div>
          <h2>A pastoral framework, not a formula.</h2>
          <p>
            {"This site is designed to help Christians think biblically about guidance. God\u2019s will is not usually found in panic or pressure, but in surrender, truth, prayer, and faithful next steps."}
          </p>
        </article>
        <article className="panel intro-panel">
          <div className="eyebrow">What this site is not</div>
          <h2>Not a shortcut to certainty.</h2>
          <p>
            {"It does not promise instant answers, hidden codes, or mystical hacks. It aims to form discernment so that your decisions are shaped by God\u2019s character and Word."}
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

      <section className="pillars-section" aria-labelledby="pillars-heading">
        <div className="section-heading">
          <div className="eyebrow">Four Anchors</div>
          <h2 id="pillars-heading">The core structure of His Will Guide.</h2>
          <p className="section-copy">
            The site is organized around four biblical anchors that keep discernment steady when life feels unclear.
          </p>
        </div>
        <div className="pillars-grid">
          {GUIDE_PILLARS.map((pillar) => (
            <article key={pillar.title} className="panel pillar-card">
              <div className="pillar-card__icon" aria-hidden="true">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="guide" className="steps-section" aria-labelledby="guide-heading">
        <div className="section-heading">
          <div className="eyebrow">The 8-Step Guide</div>
          <h2 id="guide-heading">Walk through the questions slowly.</h2>
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
              aria-label={`Step ${section.number}: ${section.title}`}
            >
              <div className="step-card__number" aria-hidden="true">{section.number}</div>
              <div className="step-card__body">
                <h3>{section.title}</h3>
                <p>
                  {section.subtitle} {'\u00B7'} {section.scriptures.length} scriptures {'\u00B7'} {section.questions.length} reflection prompts
                </p>
              </div>
              <div className="step-card__arrow" aria-hidden="true">{'\u2192'}</div>
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

      <section id="prayer" className="panel prayer-panel" aria-label="Closing prayer">
        <div className="eyebrow">Closing Prayer</div>
        <blockquote>
          {'\u201C'}Teach me to do your will, for you are my God; let your good Spirit lead me on level ground.{'\u201D'}
        </blockquote>
        <div className="daily-verse__ref">{'\u2014'} Psalm 143:10</div>
        <p className="prayer-panel__copy">
          Let this become the posture of the whole site: not merely asking what to do, but asking God to form who we are.
        </p>
      </section>

      <footer className="footer-note" role="contentinfo">
        {"HisWillGuide.com \u2014 a Scripture-centered resource for believers seeking to discern God\u2019s will with humility, wisdom, and obedience."}
      </footer>
    </>
  );
}

function Detail({ activeId, onBack, onNavigate, theme, toggleTheme, menuOpen, setMenuOpen }) {
  const section = useMemo(() => SECTIONS.find((item) => item.id === activeId) ?? SECTIONS[0], [activeId]);
  const index = SECTIONS.findIndex((item) => item.id === section.id);
  const previous = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];
  const headingRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const timer = setTimeout(() => headingRef.current?.focus(), 120);
    return () => clearTimeout(timer);
  }, [activeId]);

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="detail-shell">
        <div className="detail-topbar">
          <button className="ghost-button" onClick={onBack} type="button">
            <span aria-hidden="true">{'\u2190'}</span> Home
          </button>
          <nav className="dot-row" aria-label="Step progress">
            {SECTIONS.map((item, i) => (
              <button
                key={item.id}
                className={`dot ${item.id === section.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                type="button"
                aria-label={`Go to step ${i + 1}: ${item.title}`}
                aria-current={item.id === section.id ? 'step' : undefined}
              />
            ))}
          </nav>
        </div>

        <article className="detail-header" style={{ '--accent': section.color }} aria-labelledby="detail-title">
          <div className="detail-header__meta">
            <span className="detail-number" aria-hidden="true">{section.number}</span>
            <span className="eyebrow">Step {section.number} {'\u00B7'} {section.subtitle}</span>
          </div>
          <h1 id="detail-title" ref={headingRef} tabIndex={-1}>{section.title}</h1>
          <p className="detail-theme">{section.theme}</p>
          <p className="detail-description">{section.description}</p>
        </article>

        <section className="panel" aria-labelledby={`reflection-heading-${section.id}`}>
          <h2 className="eyebrow" id={`reflection-heading-${section.id}`}>Reflection Questions</h2>
          <ReflectionChecklist items={section.questions} sectionId={section.id} />
        </section>

        <section className="panel" aria-labelledby={`scripture-heading-${section.id}`}>
          <h2 className="eyebrow" id={`scripture-heading-${section.id}`}>Scriptures to Meditate On</h2>
          <div className="scripture-list">
            {section.scriptures.map((scripture) => (
              <ScriptureCard key={scripture.ref} scripture={scripture} />
            ))}
          </div>
        </section>

        <Journal section={section} />

        <nav className="detail-nav" aria-label="Step navigation">
          <button className="ghost-button" disabled={!previous} onClick={() => previous && onNavigate(previous.id)} type="button">
            <span aria-hidden="true">{'\u2190'}</span> Previous
          </button>
          <button className="primary-button" disabled={!next} onClick={() => next && onNavigate(next.id)} type="button">
            {next ? 'Next Step \u2192' : 'Completed \u2713'}
          </button>
        </nav>

        <section className="closing-block" aria-label="Closing verse">
          <div className="divider" aria-hidden="true" />
          <blockquote>
            {'\u201C'}Teach me to do your will, for you are my God; let your good Spirit lead me on level ground.{'\u201D'}
          </blockquote>
          <div className="daily-verse__ref">{'\u2014'} Psalm 143:10</div>
        </section>
      </div>
    </>
  );
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigateToSection = useCallback((id) => {
    setActiveSectionId(id);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeSectionId]);

  useEffect(() => {
    document.title = activeSectionId
      ? "HisWillGuide.com \u2014 " + (SECTIONS.find((item) => item.id === activeSectionId)?.title || "Finding God's Will")
      : "HisWillGuide.com \u2014 Discern God's Will Through Scripture, Prayer, and Wisdom";
  }, [activeSectionId]);

  useEffect(() => {
    if (!activeSectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSectionId]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">Skip to content</a>
      <div className="background-glow" aria-hidden="true" />
      <main className="container" id="main-content">
        {activeSectionId ? (
          <Detail
            activeId={activeSectionId}
            onBack={() => setActiveSectionId(null)}
            onNavigate={navigateToSection}
            theme={theme}
            toggleTheme={toggleTheme}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        ) : (
          <Home
            onOpenSection={navigateToSection}
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
