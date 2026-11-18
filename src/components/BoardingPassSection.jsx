import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, ExternalLink, Mail, Plane, Printer, RotateCcw, Scissors, Ticket } from 'lucide-react';
import TearTicket from './react-bits/TearTicket/TearTicket';
import BlurText from './react-bits/BlurText/BlurText';
import StarBorder from './react-bits/StarBorder/StarBorder';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function BoardingPassSection({ copy, language, linkedin, telemetry }) {
  const [mode, setMode] = useState('pilot'); // 'pilot' | 'recruiter'
  const [isTorn, setIsTorn] = useState(false);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    passenger: '',
    company: '',
    email: '',
    missionIdx: 0,
    seatClassIdx: 0,
    message: '',
  });

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedMission = copy.boarding.missions[form.missionIdx] || copy.boarding.missions[0];
  const selectedSeatClass = copy.boarding.classes[form.seatClassIdx] || copy.boarding.classes[0];

  const displayPassenger =
    mode === 'pilot'
      ? linkedin.fullName.toUpperCase()
      : (form.passenger || (language === 'es' ? 'INVITADO / RECLUTADOR' : 'GUEST / RECRUITER')).toUpperCase();

  const displayOrg =
    mode === 'pilot'
      ? 'DEUSTO ENG · FERNIUS07'
      : (form.company || (language === 'es' ? 'TU EMPRESA / EQUIPO' : 'YOUR ORGANIZATION')).toUpperCase();

  const displayMission =
    mode === 'pilot'
      ? 'FULL-STACK · AI · AVIATION'
      : selectedMission.toUpperCase();

  const displaySeat = mode === 'pilot' ? '01A · CPT' : `${selectedSeatClass.slice(0, 5)} · 07F`;
  const gateCode = mode === 'pilot' ? 'G-07' : 'G-12';
  const flightCode = mode === 'pilot' ? 'IFG 007' : 'REC 2026';

  const summaryText =
    language === 'es'
      ? `TARJETA DE EMBARQUE ${flightCode}\nPasajero: ${displayPassenger}\nOrganización: ${displayOrg}\nRuta: BIO (Bilbao) -> WLD (Global)\nMisión: ${displayMission}\nRepositorios GitHub: ${telemetry.totalRepos} (${telemetry.liveDeployments} en vivo)\nLinkedIn: ${LINKEDIN_URL}\nMensaje: ${form.message || 'Solicitando conexión profesional'}`
      : `BOARDING PASS ${flightCode}\nPassenger: ${displayPassenger}\nOrganization: ${displayOrg}\nRoute: BIO (Bilbao) -> WLD (Global)\nMission: ${displayMission}\nGitHub Repos: ${telemetry.totalRepos} (${telemetry.liveDeployments} live)\nLinkedIn: ${LINKEDIN_URL}\nMessage: ${form.message || 'Requesting professional connection'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const mailHref = `mailto:?subject=${encodeURIComponent(
    `[Flight ${flightCode}] ${displayPassenger} — ${displayOrg}`
  )}&body=${encodeURIComponent(summaryText)}`;

  return (
    <section id="boarding" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <Ticket size={14} />
            <span>{copy.boarding.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.boarding.title} animateBy="words" delay={65} />
          </h2>
          <p className="section-subtitle">{copy.boarding.subtitle}</p>
        </div>

        <div className="boarding-grid">
          <motion.div
            className="checkin-kiosk"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <div className="kiosk-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'pilot'}
                className={`kiosk-tab ${mode === 'pilot' ? 'active' : ''}`}
                onClick={() => {
                  setMode('pilot');
                  setIsTorn(false);
                }}
              >
                {copy.boarding.modePilot}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'recruiter'}
                className={`kiosk-tab ${mode === 'recruiter' ? 'active' : ''}`}
                onClick={() => {
                  setMode('recruiter');
                  setIsTorn(false);
                }}
              >
                {copy.boarding.modeRecruiter}
              </button>
            </div>

            {mode === 'pilot' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid var(--border-hud)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                  }}
                >
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.4rem' }}>
                    {linkedin.callsign} · {linkedin.homeAirport.icao}
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {linkedin.headline[language]}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {linkedin.availability[language]}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-hud)',
                      background: 'rgba(15, 23, 42, 0.35)',
                    }}
                  >
                    <div className="bp-meta-label">GITHUB OPS</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>
                      {telemetry.totalRepos} Repos · {telemetry.liveDeployments} Live
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-hud)',
                      background: 'rgba(15, 23, 42, 0.35)',
                    }}
                  >
                    <div className="bp-meta-label">HOME BASE</div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-amber)' }}>
                      BIO · Bilbao (ES)
                    </div>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.93rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {linkedin.summary[language]}
                </p>
              </div>
            ) : (
              <div className="kiosk-form-grid">
                <div className="kiosk-field">
                  <label htmlFor="bp-name">{copy.boarding.passengerLabel}</label>
                  <input
                    id="bp-name"
                    type="text"
                    className="kiosk-input"
                    placeholder="Elena Vance"
                    value={form.passenger}
                    onChange={(e) => handleField('passenger', e.target.value)}
                  />
                </div>

                <div className="kiosk-field">
                  <label htmlFor="bp-company">{copy.boarding.companyLabel}</label>
                  <input
                    id="bp-company"
                    type="text"
                    className="kiosk-input"
                    placeholder="Airbus / Vercel / Studio"
                    value={form.company}
                    onChange={(e) => handleField('company', e.target.value)}
                  />
                </div>

                <div className="kiosk-field">
                  <label htmlFor="bp-mission">{copy.boarding.missionLabel}</label>
                  <select
                    id="bp-mission"
                    className="kiosk-select"
                    value={form.missionIdx}
                    onChange={(e) => handleField('missionIdx', Number(e.target.value))}
                  >
                    {copy.boarding.missions.map((m, idx) => (
                      <option key={idx} value={idx}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kiosk-field">
                  <label htmlFor="bp-seat">{copy.boarding.seatLabel}</label>
                  <select
                    id="bp-seat"
                    className="kiosk-select"
                    value={form.seatClassIdx}
                    onChange={(e) => handleField('seatClassIdx', Number(e.target.value))}
                  >
                    {copy.boarding.classes.map((c, idx) => (
                      <option key={idx} value={idx}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kiosk-field full">
                  <label htmlFor="bp-msg">{copy.boarding.messageLabel}</label>
                  <textarea
                    id="bp-msg"
                    rows={2}
                    className="kiosk-textarea"
                    placeholder={
                      language === 'es'
                        ? 'Describe el proyecto, puesto o idea y luego arranca el talón...'
                        : 'Describe the role, project or idea, then tear the boarding stub...'
                    }
                    value={form.message}
                    onChange={(e) => handleField('message', e.target.value)}
                  />
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            className="boarding-stage"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="boarding-ticket-shell">
              <TearTicket
                width={620}
                height={272}
                stubSize={178}
                torn={isTorn}
                onTear={() => setIsTorn(true)}
                background="#0c1526"
                stubBackground="#121d33"
                color="#f8fafc"
                borderColor="rgba(56, 189, 248, 0.36)"
                rotate={1.5}
                tiltMax={7}
                ariaLabel={copy.boarding.tearPrompt}
                stub={
                  <div className="bp-stub">
                    <div>
                      <div className="bp-meta-label" style={{ color: '#fbbf24' }}>
                        BOARDING STUB
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: '#f8fafc' }}>
                        {flightCode}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>
                        <div className="bp-meta-label">SEAT</div>
                        <div className="bp-meta-val" style={{ color: '#3ef09a' }}>
                          {displaySeat}
                        </div>
                      </div>
                      <div>
                        <div className="bp-meta-label">GATE</div>
                        <div className="bp-meta-val">{gateCode}</div>
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
                      <span>FERNIUS AIRWAYS // {flightCode}</span>
                    </div>
                    <span className="bp-class-badge">{displaySeat}</span>
                  </div>

                  <div className="bp-route">
                    <div>
                      <div className="bp-airport-code">BIO</div>
                      <div className="bp-airport-city">BILBAO · LEBB</div>
                    </div>

                    <div className="bp-plane-divider">
                      <span className="bp-plane-line" />
                      <Plane size={18} />
                      <span className="bp-plane-line" />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="bp-airport-code">WLD</div>
                      <div className="bp-airport-city">REMOTE / GLOBAL</div>
                    </div>
                  </div>

                  <div className="bp-meta-row">
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">PASSENGER</span>
                      <span className="bp-meta-val">{displayPassenger}</span>
                    </div>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">CARRIER</span>
                      <span className="bp-meta-val">{displayOrg}</span>
                    </div>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">MISSION</span>
                      <span className="bp-meta-val" style={{ color: '#38bdf8' }}>
                        {displayMission}
                      </span>
                    </div>
                    <div className="bp-meta-item">
                      <span className="bp-meta-label">STATUS</span>
                      <span className="bp-meta-val" style={{ color: '#3ef09a' }}>
                        {isTorn ? 'BOARDED ✓' : 'READY'}
                      </span>
                    </div>
                  </div>

                  <div className="bp-footer-note">
                    <span>SEQ 007 · DEUSTO ENG</span>
                    <span>
                      GITHUB: {telemetry.totalRepos} FLTS · LINKEDIN SYNCED
                    </span>
                  </div>
                </div>
              </TearTicket>
            </div>

            {!isTorn ? (
              <div className="tear-hint-pill">
                <Scissors size={14} />
                <span>{copy.boarding.tearPrompt}</span>
              </div>
            ) : (
              <motion.div
                className="boarded-actions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald)',
                    }}
                  >
                    {copy.boarding.boardedBanner}
                  </span>

                  <button
                    type="button"
                    className="hud-icon-btn"
                    onClick={() => setIsTorn(false)}
                  >
                    <RotateCcw size={13} />
                    <span>{copy.boarding.resetTicket}</span>
                  </button>
                </div>

                <div className="boarded-btn-row">
                  <StarBorder
                    as="a"
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fids-link-btn live"
                    color="#3ef09a"
                    backgroundColor="rgba(16, 185, 129, 0.18)"
                    textColor="var(--accent-emerald)"
                    radius={8}
                    style={{ padding: '0.55rem 0.9rem', fontSize: '0.78rem' }}
                  >
                    <ExternalLink size={14} />
                    <span>{copy.boarding.openLinkedin}</span>
                  </StarBorder>

                  <a href={mailHref} className="fids-link-btn repo" style={{ padding: '0.55rem 0.9rem' }}>
                    <Mail size={14} />
                    <span>{copy.boarding.sendMail}</span>
                  </a>

                  <button
                    type="button"
                    className="hud-icon-btn"
                    onClick={handleCopy}
                    style={{ height: 'auto', padding: '0.5rem 0.85rem' }}
                  >
                    {copied ? <Check size={14} color="#3ef09a" /> : <Copy size={14} />}
                    <span>{copied ? copy.boarding.copied : copy.boarding.copyPass}</span>
                  </button>

                  <button
                    type="button"
                    className="hud-icon-btn"
                    onClick={() => window.print()}
                    style={{ height: 'auto', padding: '0.5rem 0.85rem' }}
                  >
                    <Printer size={14} />
                    <span>{copy.boarding.printPass}</span>
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
