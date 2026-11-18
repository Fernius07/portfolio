import { motion } from 'motion/react';
import { Award, BookOpen, ExternalLink, Languages, RefreshCw } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import BlurText from './react-bits/BlurText/BlurText';
import SpotlightCard from './react-bits/SpotlightCard/SpotlightCard';
import StarBorder from './react-bits/StarBorder/StarBorder';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function FlightLogLinkedin({ copy, language, linkedin, theme }) {
  return (
    <section id="flightlog" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <FaLinkedin size={14} />
            <span>{copy.flightlog.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.flightlog.title} animateBy="words" delay={65} />
          </h2>
          <p className="section-subtitle">{copy.flightlog.subtitle}</p>
        </div>

        <div className="logbook-grid">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <SpotlightCard
              spotlightColor="#0ea5e9"
              intensity={0.22}
              theme={theme === 'day' ? 'light' : 'dark'}
              style={{ borderRadius: '18px', padding: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700 }}>
                  LINKEDIN CREW LICENCE // {linkedin.syncMode?.toUpperCase()}
                </span>
                <span className="status-led status-led--boarding">ACTIVE</span>
              </div>

              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem' }}>{linkedin.fullName}</h3>
              <p style={{ margin: '0 0 0.9rem 0', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                {linkedin.headline[language]}
              </p>

              <StarBorder
                as="a"
                href={linkedin.profileUrl || LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="fids-link-btn repo"
                color="#38bdf8"
                backgroundColor="rgba(56, 189, 248, 0.14)"
                textColor="var(--accent-cyan)"
                radius={10}
                style={{ padding: '0.6rem 1rem', fontSize: '0.82rem', display: 'inline-flex' }}
              >
                <FaLinkedin size={15} />
                <span>{copy.flightlog.openProfile}</span>
                <ExternalLink size={13} />
              </StarBorder>
            </SpotlightCard>

            <div className="telemetry-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Award size={16} color="#fbbf24" />
                <h4 style={{ margin: 0 }}>{copy.flightlog.certTitle}</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {(linkedin.certifications || []).map((cert, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-hud)',
                      background: 'rgba(15, 23, 42, 0.25)',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cert.title[language]}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                      {cert.issuer} · {cert.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="telemetry-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Languages size={16} color="#3ef09a" />
                <h4 style={{ margin: 0 }}>{copy.flightlog.langTitle}</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(linkedin.spokenLanguages || []).map((langItem, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      padding: '0.45rem 0',
                      borderBottom: '1px dashed rgba(148,163,184,0.2)',
                    }}
                  >
                    <span>{langItem.name[language]}</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>{langItem.level[language]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
                <BookOpen size={17} color="#38bdf8" />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{copy.flightlog.eduTitle}</h3>
              </div>

              {(linkedin.education || []).map((edu) => (
                <motion.div
                  key={edu.id}
                  className="telemetry-panel"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="flap-badge">{edu.airportCode}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
                      {edu.period} · {edu.status}
                    </span>
                  </div>
                  <h4 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.15rem' }}>{edu.degree[language]}</h4>
                  <div style={{ fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
                    {edu.institution}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {edu.focus[language]}
                  </p>
                </motion.div>
              ))}
            </div>

            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>{copy.flightlog.expTitle}</h3>
              <div className="flight-timeline">
                {(linkedin.experience || []).map((exp, idx) => (
                  <motion.div
                    key={exp.id}
                    className="waypoint-item"
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                  >
                    <span className="waypoint-node" />
                    <div className="telemetry-panel">
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                          {exp.flightTag}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {exp.period}
                        </span>
                      </div>
                      <h4 style={{ margin: '0.45rem 0 0.2rem 0', fontSize: '1.08rem' }}>{exp.role[language]}</h4>
                      <div style={{ fontSize: '0.84rem', color: 'var(--accent-cyan)', marginBottom: '0.55rem' }}>
                        {exp.organization}
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
                        {(exp.highlights[language] || []).map((line, hIdx) => (
                          <li key={hIdx}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="telemetry-panel"
              style={{
                borderColor: 'rgba(62, 240, 154, 0.35)',
                background: 'rgba(16, 185, 129, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem', color: 'var(--accent-emerald)' }}>
                <RefreshCw size={15} />
                <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                  {copy.flightlog.syncBoxTitle}
                </strong>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {copy.flightlog.syncBoxItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
