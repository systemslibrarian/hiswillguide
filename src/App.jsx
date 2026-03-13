import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DAILY_VERSE, GUIDE_PILLARS, KEY_SCRIPTURES, PROMISES, SECTIONS } from './data';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem('hiswillguide-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = initial;
    return initial;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('hiswillguide-theme', theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  };
}

const VALID_SECTION_IDS = new Set(SECTIONS.map((s) => s.id));

function parseHash() {
  const hash = window.location.hash;
  if (hash === '#foundation') return 'foundation';
  if (hash === '#summary') return 'summary';
  const match = hash.match(/^#step\/(.+)$/);
  return match && VALID_SECTION_IDS.has(match[1]) ? match[1] : null;
}

function setHashRoute(id) {
  if (!id) {
    history.pushState(null, '', window.location.pathname + window.location.search);
  } else if (id === 'foundation' || id === 'summary') {
    window.location.hash = `#${id}`;
  } else {
    window.location.hash = `#step/${id}`;
  }
}

function hasAnyProgress() {
  for (const section of SECTIONS) {
    const cl = window.localStorage.getItem(`hiswillguide-checklist-${section.id}`);
    if (cl) {
      try { if (Object.values(JSON.parse(cl)).some(Boolean)) return true; } catch { /* ignore */ }
    }
    const jl = window.localStorage.getItem(`hiswillguide-journal-${section.id}`);
    if (jl && jl.trim()) return true;
  }
  const dc = window.localStorage.getItem('hiswillguide-decision-context');
  if (dc && dc.trim()) return true;
  return false;
}

function useStepProgress() {
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return useMemo(() => {
    void version;
    const progress = {};
    for (const section of SECTIONS) {
      const checklistRaw = window.localStorage.getItem(`hiswillguide-checklist-${section.id}`);
      let checkedCount = 0;
      const totalCount = section.questions.length;
      if (checklistRaw) {
        try {
          checkedCount = Object.values(JSON.parse(checklistRaw)).filter(Boolean).length;
        } catch { /* ignore */ }
      }
      const journalRaw = window.localStorage.getItem(`hiswillguide-journal-${section.id}`);
      const hasJournal = Boolean(journalRaw && journalRaw.trim());
      progress[section.id] = { checkedCount, totalCount, hasJournal };
    }
    progress._refresh = refresh;
    return progress;
  }, [version, refresh]);
}

function DecisionContext() {
  const key = 'hiswillguide-decision-context';
  const [value, setValue] = useState(() => window.localStorage.getItem(key) || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    window.localStorage.setItem(key, value);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <section className="panel decision-context-panel">
      <div className="eyebrow">What are you bringing before the Lord?</div>
      <p className="decision-context-copy">
        In a sentence, name the decision or season you are seeking guidance for. This stays private on your device.
      </p>
      <textarea
        className="journal-textarea"
        rows={3}
        maxLength={300}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g., Whether to accept a new job offer\u2026"
      />
      <div className="journal-actions">
        <button className="primary-button" onClick={save} type="button">
          {saved ? 'Saved \u2713' : 'Save'}
        </button>
      </div>
    </section>
  );
}

function DecisionReminder() {
  const [text] = useState(() => {
    const stored = window.localStorage.getItem('hiswillguide-decision-context');
    return stored ? stored.trim() : '';
  });

  if (!text) return null;

  return (
    <div className="decision-reminder">
      <em>“{text}”</em>
    </div>
  );
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
  const [checked, setChecked] = useState(() => {
    const raw = window.localStorage.getItem(`hiswillguide-checklist-${sectionId}`);
    if (raw) {
      try { return JSON.parse(raw); } catch { /* ignore */ }
    }
    return {};
  });

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
  const [value, setValue] = useState(() => window.localStorage.getItem(key) || '');
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);
  const valueRef = useRef(value);

  const doSave = useCallback((text) => {
    window.localStorage.setItem(key, text);
    setStatus('saved');
    window.setTimeout(() => setStatus('idle'), 1600);
  }, [key]);

  const handleChange = (event) => {
    const text = event.target.value;
    setValue(text);
    valueRef.current = text;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus('saving');
    timerRef.current = setTimeout(() => {
      doSave(text);
      timerRef.current = null;
    }, 1500);
  };

  const handleBlur = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSave(valueRef.current);
  };

  const handleManualSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSave(value);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.localStorage.setItem(key, valueRef.current);
    };
  }, [key]);

  const label = status === 'saving' ? 'Saving\u2026' : status === 'saved' ? 'Saved \u2713' : 'Save reflection';

  return (
    <section className="panel journal-panel">
      <div className="eyebrow">Reflection Journal</div>
      <p className="journal-copy">Capture what stood out, what needs surrender, or what next step feels most faithful.</p>
      <textarea
        className="journal-textarea"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={`What is God impressing on your heart in “${section.title.replace('?', '')}”?`}
      />
      <div className="journal-actions">
        <button className="primary-button" onClick={handleManualSave} type="button">
          {label}
        </button>
      </div>
    </section>
  );
}

function AutoSaveTextarea({ storageKey, placeholder }) {
  const [value, setValue] = useState(() => window.localStorage.getItem(storageKey) || '');
  const [status, setStatus] = useState('idle');
  const timerRef = useRef(null);
  const valueRef = useRef(value);

  const doSave = useCallback((text) => {
    window.localStorage.setItem(storageKey, text);
    setStatus('saved');
    window.setTimeout(() => setStatus('idle'), 1600);
  }, [storageKey]);

  const handleChange = (event) => {
    const text = event.target.value;
    setValue(text);
    valueRef.current = text;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus('saving');
    timerRef.current = setTimeout(() => {
      doSave(text);
      timerRef.current = null;
    }, 1500);
  };

  const handleBlur = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSave(valueRef.current);
  };

  const handleManualSave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSave(valueRef.current);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      window.localStorage.setItem(storageKey, valueRef.current);
    };
  }, [storageKey]);

  const label = status === 'saving' ? 'Saving\u2026' : status === 'saved' ? 'Saved \u2713' : 'Save';

  return (
    <>
      <textarea
        className="journal-textarea"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      <div className="journal-actions">
        <button className="primary-button" onClick={handleManualSave} type="button">
          {label}
        </button>
      </div>
    </>
  );
}

function ResetModal({ open, onClose, onReset }) {
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    if (el) el.focus();
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = async () => {
    const decision = window.localStorage.getItem('hiswillguide-decision-context') || 'Not specified';
    let text = 'HisWillGuide.com \u2014 My Reflections\nDecision: ' + decision + '\n';
    for (const section of SECTIONS) {
      const journal = window.localStorage.getItem('hiswillguide-journal-' + section.id) || 'No entry';
      text += '\nStep ' + section.number + ': ' + section.title + '\n' + journal + '\n';
    }
    const peace = window.localStorage.getItem('hiswillguide-peace-reflection') || 'No entry';
    text += '\nFinal Reflection:\n' + peace + '\n';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard may not be available */ }
  };

  const handleReset = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith('hiswillguide-') && k !== 'hiswillguide-theme') {
        keys.push(k);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
    onReset();
    onClose();
  };

  return (
    <>
      <div className="reset-modal-overlay" onClick={onClose} />
      <div
        className="reset-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Begin a new decision"
        ref={dialogRef}
        tabIndex={-1}
      >
        <h2>Begin a New Decision?</h2>
        <p>
          This will clear all your saved reflections, journal entries, and checklist progress. This cannot be undone.
        </p>
        <div className="reset-modal__actions">
          <button className="ghost-button" onClick={handleCopy} type="button">
            {copied ? 'Copied \u2713' : 'Copy my reflections first'}
          </button>
          <button className="primary-button" onClick={handleReset} type="button">
            Clear and start fresh
          </button>
          <button className="ghost-button" onClick={onClose} type="button">
            Cancel
          </button>
        </div>
      </div>
    </>
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

function SiteHeader({ theme, toggleTheme, menuOpen, setMenuOpen, onOpenFoundation }) {
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [setMenuOpen]);

  const handleFoundation = (e) => {
    e.preventDefault();
    if (onOpenFoundation) onOpenFoundation();
    setMenuOpen(false);
  };

  const navLinks = [
    { href: '#guide', label: 'Guide' },
    { href: '#foundation', label: 'Foundation', onClick: handleFoundation },
    { href: '#prayer', label: 'Closing Prayer' },
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
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={link.onClick}>{link.label}</a>
          ))}
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
            <a key={link.href} href={link.href} onClick={link.onClick || (() => setMenuOpen(false))}>{link.label}</a>
          ))}
        </nav>
      </div>
    </>
  );
}

function Home({ onOpenSection, onOpenFoundation, onShowReset, theme, toggleTheme, menuOpen, setMenuOpen, progress }) {
  const openFirst = () => onOpenSection(SECTIONS[0].id);
  const engagedCount = SECTIONS.filter((s) => {
    const sp = progress[s.id];
    return sp.checkedCount > 0 || sp.hasJournal;
  }).length;
  const showReset = hasAnyProgress();

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenFoundation={onOpenFoundation} />

      <section className="hero hero--expanded" id="top">
        <div className="hero-mark">✦</div>
        <h1>Learn to discern God&rsquo;s&nbsp;will</h1>
        <p className="hero-subtitle">A calm, biblical guide rooted in surrender, Scripture, prayer, wise counsel, and obedient trust.</p>
        <p className="hero-verse">&ldquo;{DAILY_VERSE.text}&rdquo; &mdash; {DAILY_VERSE.ref}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={openFirst} type="button">Begin the 10-step guide</button>
          <button className="ghost-button hero-link" onClick={onOpenFoundation} type="button">Explore the foundation</button>
        </div>
        {showReset && (
          <button className="new-decision-link" onClick={onShowReset} type="button">
            or start a new decision &rarr;
          </button>
        )}
      </section>


      <DecisionContext />

      <section id="guide" className="steps-section">
        <div className="section-heading">
          <div className="eyebrow">A 10-Step Discernment Path</div>
          <h2>Walk through the questions slowly.</h2>
          <p className="section-copy">
            Discerning God&rsquo;s will is rarely a single moment of clarity. Scripture shows it as a path walked step by step &mdash; with humility, prayer, community, and obedience.
          </p>
          {engagedCount > 0 && (
            <p className="steps-summary">You have engaged with {engagedCount} of {SECTIONS.length} steps.</p>
          )}
        </div>

        <div className="step-list">
          {SECTIONS.map((section) => {
            const sp = progress[section.id];
            const engaged = sp.checkedCount > 0 || sp.hasJournal;
            const completed = sp.checkedCount === sp.totalCount && sp.hasJournal;
            return (
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
                  {engaged && (
                    <div className="step-progress-hint">
                      {completed
                        ? '\u2713 Completed'
                        : [
                            sp.checkedCount > 0 && `${sp.checkedCount} of ${sp.totalCount} reflections`,
                            sp.hasJournal && 'notes saved',
                          ]
                            .filter(Boolean)
                            .join(' \u00b7 ')}
                    </div>
                  )}
                </div>
                <div className="step-card__arrow">→</div>
              </button>
            );
          })}
        </div>
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

function Foundation({ onBack, theme, toggleTheme, menuOpen, setMenuOpen, onOpenFoundation }) {
  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenFoundation={onOpenFoundation} />
      <div className="detail-shell">
        <div className="detail-topbar">
          <button className="ghost-button" onClick={onBack} type="button">
            ← Home
          </button>
        </div>

        <div className="foundation-section">
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
        </div>

        <div className="foundation-section">
          <div className="section-heading">
            <div className="eyebrow">Core Scriptures</div>
            <h2>Verses that shape discernment.</h2>
          </div>
          <div className="scripture-list">
            {KEY_SCRIPTURES.map((scripture) => (
              <ScriptureCard key={scripture.ref} scripture={scripture} />
            ))}
          </div>
        </div>

        <div className="foundation-section">
          <div className="section-heading">
            <div className="eyebrow">What God Promises</div>
            <h2>What you can expect as you seek Him.</h2>
          </div>
          <ul className="promise-list panel" style={{ padding: 22 }}>
            {PROMISES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.copy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Detail({ activeId, onBack, onNavigate, onViewSummary, theme, toggleTheme, menuOpen, setMenuOpen, onOpenFoundation }) {
  const section = useMemo(() => SECTIONS.find((item) => item.id === activeId) ?? SECTIONS[0], [activeId]);
  const index = SECTIONS.findIndex((item) => item.id === section.id);
  const previous = SECTIONS[index - 1];
  const next = SECTIONS[index + 1];

  useEffect(() => {
    const handleKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (document.querySelector('.reset-modal')) return;
      if (e.key === 'ArrowLeft' && previous) {
        e.preventDefault();
        onNavigate(previous.id);
      } else if (e.key === 'ArrowRight' && next) {
        e.preventDefault();
        onNavigate(next.id);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [previous, next, onNavigate, onBack]);

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenFoundation={onOpenFoundation} />
      <div className="detail-shell">
        <div className="detail-topbar">
          <button className="ghost-button" onClick={onBack} type="button">
            ← Home
          </button>
          <div className="dot-row" role="tablist" aria-label="Steps">
            {SECTIONS.map((item, i) => (
              <button
                key={item.id}
                className={`dot ${item.id === section.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
                type="button"
                aria-label={`Step ${i + 1}: ${item.title}`}
                aria-current={item.id === section.id ? 'step' : undefined}
              />
            ))}
          </div>
        </div>

        <DecisionReminder />

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
          {next ? (
            <button className="primary-button" onClick={() => onNavigate(next.id)} type="button">
              Next Step →
            </button>
          ) : (
            <button className="primary-button" onClick={onViewSummary} type="button">
              View Summary →
            </button>
          )}
        </div>


      </div>
    </>
  );
}

const PEACE_PROMPTS = [
  'I sense a settled peace, not just relief or avoidance, about this direction.',
  'This direction aligns with Scripture and godly counsel I have received.',
  'I am willing to obey even if the outcome is costly or unclear.',
];

const PEACE_SCRIPTURE = {
  ref: 'Colossians 3:15',
  text: 'And let the peace of Christ rule in your hearts, to which indeed you were called in one body. And be thankful.',
  insight: 'Peace is not passive comfort — it is an active ruling principle.',
};

function PeaceReflection() {
  return (
    <div className="peace-reflection">
      <div className="eyebrow">Final Reflection</div>
      <h3>Peace &amp; Conviction</h3>
      <p className="section-copy">Before concluding, pause and consider whether you sense the peace of Christ about the direction you are leaning.</p>
      <ReflectionChecklist items={PEACE_PROMPTS} sectionId="peace" />
      <AutoSaveTextarea storageKey="hiswillguide-peace-reflection" placeholder="What is God impressing on your heart as you consider your decision?" />
      <div style={{ marginTop: 16 }}>
        <ScriptureCard scripture={PEACE_SCRIPTURE} />
      </div>
    </div>
  );
}

function CompletionSummary({ onBack, onNavigate, onShowReset, theme, toggleTheme, menuOpen, setMenuOpen, progress, onOpenFoundation }) {
  const [copied, setCopied] = useState(false);

  const decision = useMemo(() => {
    const d = window.localStorage.getItem('hiswillguide-decision-context');
    return d && d.trim() ? d.trim() : null;
  }, []);

  const stepSummaries = useMemo(() => {
    return SECTIONS.map((section) => {
      const sp = progress[section.id];
      const journal = window.localStorage.getItem('hiswillguide-journal-' + section.id);
      return {
        section,
        checkedCount: sp.checkedCount,
        totalCount: sp.totalCount,
        hasJournal: sp.hasJournal,
        journalText: journal && journal.trim() ? journal.trim() : null,
        skipped: sp.checkedCount === 0 && !sp.hasJournal,
      };
    });
  }, [progress]);

  const skippedSteps = stepSummaries.filter((s) => s.skipped);

  const buildReflectionText = useCallback(() => {
    const dec = decision || 'Not specified';
    let text = 'HisWillGuide.com \u2014 My Reflections\n';
    text += 'Decision: ' + dec + '\n';
    text += '\u2500'.repeat(40) + '\n';
    for (const { section, checkedCount, totalCount, journalText, skipped } of stepSummaries) {
      if (skipped) continue;
      text += '\nStep ' + section.number + ': ' + section.title + '\n';
      text += 'Reflections: ' + checkedCount + ' of ' + totalCount + '\n';
      text += 'Journal: ' + (journalText || 'No entry') + '\n';
    }
    const peace = window.localStorage.getItem('hiswillguide-peace-reflection');
    if (peace && peace.trim()) {
      text += '\n' + '\u2500'.repeat(40) + '\n';
      text += 'Final Reflection:\n' + peace.trim() + '\n';
    }
    return text;
  }, [decision, stepSummaries]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildReflectionText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may not be available */ }
  }, [buildReflectionText]);

  const handleSavePDF = useCallback(() => {
    const text = buildReflectionText();
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write('<!DOCTYPE html><html><head><title>My Reflections \u2014 HisWillGuide</title>' +
      '<style>body{font-family:Georgia,serif;max-width:640px;margin:40px auto;padding:20px;line-height:1.7;color:#1e1a15;}' +
      'h1{font-size:1.4rem;border-bottom:1px solid #ccc;padding-bottom:8px;}pre{white-space:pre-wrap;font-family:inherit;}</style></head>' +
      '<body><h1>My Reflections \u2014 HisWillGuide.com</h1><pre>' +
      text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
      '</pre><script>window.print()<\/script></body></html>');
    w.document.close();
  }, [buildReflectionText]);

  return (
    <>
      <InAppBrowserBanner />
      <SiteHeader theme={theme} toggleTheme={toggleTheme} menuOpen={menuOpen} setMenuOpen={setMenuOpen} onOpenFoundation={onOpenFoundation} />
      <div className="detail-shell summary-shell">
        <div className="detail-topbar">
          <button className="ghost-button" onClick={onBack} type="button">
            ← Home
          </button>
        </div>

        <div className="summary-header">
          <div className="eyebrow">Your Journey</div>
          <h1>Summary &amp; Reflection</h1>
          {decision && <p className="summary-decision">“{decision}”</p>}
        </div>

        {stepSummaries.filter((s) => !s.skipped).map(({ section, checkedCount, totalCount, journalText }) => (
          <div key={section.id} className="panel summary-step-card">
            <div className="summary-step-card__header">
              <span className="detail-number">{section.number}</span>
              <div>
                <h3>{section.title}</h3>
                <span className="step-progress-hint">{checkedCount} of {totalCount} reflections{journalText ? ' · journal saved' : ''}</span>
              </div>
            </div>
            {journalText && <blockquote className="summary-journal-quote">{journalText}</blockquote>}
            <button className="ghost-button" onClick={() => onNavigate(section.id)} type="button" style={{ marginTop: 8, fontSize: '0.9rem' }}>
              Revisit step →
            </button>
          </div>
        ))}

        {skippedSteps.length > 0 && (
          <p className="section-copy" style={{ textAlign: 'center', marginTop: 16 }}>
            {skippedSteps.length} step{skippedSteps.length > 1 ? 's' : ''} not yet engaged:
            {' '}{skippedSteps.map((s) => s.section.title.replace('?', '')).join(', ')}.
          </p>
        )}

        <PeaceReflection />

        <section className="closing-block summary-benediction">
          <div className="divider" />
          <blockquote>
            “Now may the God of peace… equip you with everything good that you may do his will,
            working in us that which is pleasing in his sight, through Jesus Christ,
            to whom be glory forever and ever. Amen.”
          </blockquote>
          <div className="daily-verse__ref">— Hebrews 13:20–21</div>
        </section>

        <div className="summary-export-actions">
          <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 12 }}>Save Your Reflections</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ghost-button" onClick={handleCopy} type="button">
              {copied ? 'Copied \u2713' : 'Copy to Clipboard'}
            </button>
            <button className="ghost-button" onClick={handleSavePDF} type="button">
              Save as PDF
            </button>
          </div>
        </div>

        <div className="summary-actions">
          <button className="ghost-button" onClick={onBack} type="button">← Back to Home</button>
          <button className="primary-button" onClick={onShowReset} type="button">Begin a New Decision</button>
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(() => parseHash());
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [homeKey, setHomeKey] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const progress = useStepProgress();

  useEffect(() => {
    const onPopState = () => setActiveSectionId(parseHash());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId]);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeSectionId]);

  useEffect(() => {
    const sectionMatch = SECTIONS.find((item) => item.id === activeSectionId);
    if (activeSectionId === 'foundation') {
      document.title = 'HisWillGuide.com \u2014 Foundation';
    } else if (activeSectionId === 'summary') {
      document.title = 'HisWillGuide.com \u2014 Summary';
    } else if (sectionMatch) {
      document.title = 'HisWillGuide.com \u2014 ' + sectionMatch.title;
    } else {
      document.title = 'HisWillGuide.com \u2014 Discern God\u2019s Will Through Scripture, Prayer, and Wisdom';
    }
  }, [activeSectionId]);

  const navigateTo = (id) => {
    setHashRoute(id);
    setActiveSectionId(id);
    progress._refresh();
  };

  const navigateHome = () => {
    setHashRoute(null);
    setActiveSectionId(null);
    progress._refresh();
  };

  const handleReset = () => {
    progress._refresh();
    setHomeKey((k) => k + 1);
    navigateHome();
  };

  const sharedProps = { theme, toggleTheme, menuOpen, setMenuOpen, onOpenFoundation: () => navigateTo('foundation') };

  const renderView = () => {
    if (activeSectionId === 'foundation') {
      return <Foundation onBack={navigateHome} {...sharedProps} />;
    }
    if (activeSectionId === 'summary') {
      return (
        <CompletionSummary
          onBack={navigateHome}
          onNavigate={navigateTo}
          onShowReset={() => setResetOpen(true)}
          progress={progress}
          {...sharedProps}
        />
      );
    }
    if (activeSectionId && VALID_SECTION_IDS.has(activeSectionId)) {
      return (
        <Detail
          key={activeSectionId}
          activeId={activeSectionId}
          onBack={navigateHome}
          onNavigate={navigateTo}
          onViewSummary={() => navigateTo('summary')}
          {...sharedProps}
        />
      );
    }
    return (
      <Home
        key={homeKey}
        onOpenSection={navigateTo}
        onOpenFoundation={() => navigateTo('foundation')}
        onShowReset={() => setResetOpen(true)}
        progress={progress}
        {...sharedProps}
      />
    );
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">Skip to content</a>
      <div className="background-glow" />
      <main className="container">
        {renderView()}
      </main>
      <ResetModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onReset={handleReset}
      />
    </div>
  );
}
