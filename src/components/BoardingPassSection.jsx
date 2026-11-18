import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Mail, Plane, Printer, RotateCcw, Scissors, Ticket } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import TearTicket from './react-bits/TearTicket/TearTicket';
import BlurText from './react-bits/BlurText/BlurText';
import StarBorder from './react-bits/StarBorder/StarBorder';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function BoardingPassSection({ copy, language, linkedin, stats }) {
  const [mode, setMode] = useState('cv'); // 'cv' | 'message'
  const [isTorn, setIsTorn] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: '',
    subject: '',
    message: '',
  });

  const displayName =
    mode === 'cv'
      ? linkedin.fullName.toUpperCase()
      : (form.name || (language === 'es' ? 'TU NOMBRE' : 'YOUR NAME')).toUpperCase();

  const displayOrg =
    mode === 'cv'
      ? 'UNIV. DE DEUSTO'
      : (form.subject || (language === 'es' ? 'TU EMPRESA / ASUNTO' : 'COMPANY / SUBJECT')).toUpperCase();

  const displayRole =
    mode === 'cv'
      ? '@FERNIUS07'
      : (form.message ? form.message.slice(0, 22) : language === 'es' ? 'CONTACTO DIRECTO' : 'DIRECT MESSAGE').toUpperCase();

  const ticketNumber = mode === 'cv' ? 'IFG-007' : 'MSG-2026';

  const summaryText =
    mode === 'cv'
      ? `${linkedin.fullName} — ${linkedin.headline[language]}\nGitHub: https://github.com/Fernius07 (${stats.totalRepos} repos)\nLinkedIn: ${LINKEDIN_URL}`
      : `${form.name || 'Visitante'} (${form.subject || 'Contacto'})\n\n${form.message || ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const mailHref = `mailto:?subject=${encodeURIComponent(
    form.subject ? `[Portfolio] ${form.subject}` : '[Portfolio] Contacto con Iñigo Fernández'
  )}&body=${encodeURIComponent(summaryText)}`;

  return (
    <section id="boarding" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <Ticket size={14} />
            <span>{copy.contact.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.contact.title} animateBy="words" delay={55} />
          </h2>
          <p className="section-subtitle">{copy.contact.subtitle}</p>
        </div>

        <div className="boarding-grid">
          <motion.div
            className="checkin-kiosk"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="kiosk-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'cv'}
                className={`kiosk-tab ${mode === 'cv' ? 'active' : ''}`}
                onClick={() => {
                  setMode('cv');
                  setIsTorn(false);
                }}
              >
                {copy.contact.modeCv}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'message'}
                className={`kiosk-tab ${mode === 'message' ? 'active' : ''}`}
                onClick={() => {
                  setMode('message');
                  setIsTorn(false);
                }}
              >
                {copy.contact.modeMessage}
              </button>
            </div>

            {mode === 'cv' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{linkedin.fullName}</div>
                <div style={{ color: 'var(--accent-cyan)', fontSize: '0.92rem' }}>
                  {linkedin.headline[language]}
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {linkedin.summary[language]}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', marginTop: '0.25rem' }}>
                  <span className="clean-chip">GitHub: {stats.totalRepos} repos</span>
                  <span className="clean-chip">Bilbao, España</span>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div className="kiosk-field">
                  <label htmlFor="bp-name">{copy.contact.nameLabel}</label>
                  <input
                    id="bp-name"
                    type="text"
                    className="kiosk-input"
                    placeholder="Alex"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>

                <div className="kiosk-field">
                  <label htmlFor="bp-subject">{copy.contact.subjectLabel}</label>
                  <input
                    id="bp-subject"
                    type="text"
                    className="kiosk-input"
                    placeholder={language === 'es' ? 'Colaboración / Oferta' : 'Collaboration / Role'}
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                  />
                </div>

                <div className="kiosk-field">
                  <label htmlFor="bp-msg">{copy.contact.messageLabel}</label>
                  <textarea
                    id="bp-msg"
                    rows={3}
                    className="kiosk-textarea"
                    placeholder={
                      language === 'es'
                        ? 'Escribe tu mensaje y arranca el talón...'
                        : 'Write your message and tear the stub...'
                    }
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="boarding-stage"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <div className="boarding-ticket-shell">
              <TearTicket
                width={600}
                height={264}
                stubSize={170}
                torn={isTorn}
                onTear={() => setIsTorn(true)}
                background="#0c1526"
                stubBackground="#121d33"
                color="#f8fafc"
                borderColor="rgba(56, 189, 248, 0.35)"
                rotate={1.2}
                tiltMax={6}
                ariaLabel={copy.contact.tearHint}
                stub={
                  <div className="bp-stub">
                    <div>
                      <div className="bp-meta-label" style={{ color: '#fbbf24' }}>
                        PASS
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', color: '#f8fafc' }}>
                        {ticketNumber}
                      </div>
                    </div>

                    <div>
                      <div className="bp-meta-label">GATE</div>
                      <div className="bp-meta-val" style={{ color: '#3ef09a' }}>
                        BIO-07
                      </div>
                    </div>

                    <div>
                      <div className="bp-barcode" />
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.58rem',
                          color: '#fbbf24',
                          marginTop: '6px',
                          textAlign: 'center',
                          letterSpacing: '0.08em',
                        }}
                      >
                        TEAR HERE ➔
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="bp-main">
                  <div className="bp-header">
                    <div className="bp-airline">
                      <Plane size={15} />
                      <span>IÑIGO FERNÁNDEZ // {ticketNumber}</span>
                    </div>
                    <span className="bp-class-badge">@FERNIUS07</span>
                  </div>

                  <div className="bp-route">
                    <div>
                      <div className="bp-airport-code">BIO</div>
                      <div className="bp-airport-city">BILBAO, ES</div>
                    </div>

                    <div className="bp-plane-divider">
                      <span className="bp-plane-line" />
                      <Plane size={18} />
                      <span className="bp-plane-line" />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="bp-airport-code">GLOBAL</div>
                      <div className="bp-airport-city">REMOTE / ON-SITE</div>
                    </div>
                  </div>

                  <div className="bp-meta-row" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">PASSENGER</span>
                      <span className="bp-meta-val">{displayName}</span>
                    </div>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">ORGANIZATION</span>
                      <span className="bp-meta-val">{displayOrg}</span>
                    </div>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">DETAIL</span>
                      <span className="bp-meta-val" style={{ color: '#38bdf8' }}>
                        {displayRole}
                      </span>
                    </div>
                  </div>

                  <div className="bp-footer-note">
                    <span>UNIVERSIDAD DE DEUSTO</span>
                    <span>{isTorn ? 'CONFIRMED ✓' : `${stats.totalRepos} REPOS · LINKEDIN`}</span>
                  </div>
                </div>
              </TearTicket>
            </div>

            {!isTorn ? (
              <div className="tear-hint-pill">
                <Scissors size={14} />
                <span>{copy.contact.tearHint}</span>
              </div>
            ) : (
              <motion.div
                className="boarded-actions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    {copy.contact.confirmed}
                  </span>
                  <button type="button" className="hud-icon-btn" onClick={() => setIsTorn(false)}>
                    <RotateCcw size={13} />
                    <span>{copy.contact.reset}</span>
                  </button>
                </div>

                <div className="boarded-btn-row">
                  <StarBorder
                    as="a"
                    href={mailHref}
                    className="fids-link-btn live"
                    color="#3ef09a"
                    backgroundColor="rgba(16, 185, 129, 0.16)"
                    textColor="var(--accent-emerald)"
                    radius={8}
                    style={{ padding: '0.55rem 0.9rem', fontSize: '0.78rem' }}
                  >
                    <Mail size={14} />
                    <span>{copy.contact.sendMail}</span>
                  </StarBorder>

                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fids-link-btn repo"
                    style={{ padding: '0.55rem 0.9rem' }}
                  >
                    <FaLinkedin size={14} />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://github.com/Fernius07"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fids-link-btn repo"
                    style={{ padding: '0.55rem 0.9rem' }}
                  >
                    <FaGithub size={14} />
                    <span>GitHub</span>
                  </a>

                  <button
                    type="button"
                    className="hud-icon-btn"
                    onClick={handleCopy}
                    style={{ height: 'auto', padding: '0.5rem 0.85rem' }}
                  >
                    {copied ? <Check size={14} color="#3ef09a" /> : <Copy size={14} />}
                    <span>{copied ? copy.contact.copied : copy.contact.copy}</span>
                  </button>

                  <button
                    type="button"
                    className="hud-icon-btn"
                    onClick={() => window.print()}
                    style={{ height: 'auto', padding: '0.5rem 0.85rem' }}
                  >
                    <Printer size={14} />
                    <span>{copy.contact.printCv}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
