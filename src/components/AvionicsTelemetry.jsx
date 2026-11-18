import { motion } from 'motion/react';
import { Activity, Cpu, Radio } from 'lucide-react';
import SpotlightCard from './react-bits/SpotlightCard/SpotlightCard';
import BlurText from './react-bits/BlurText/BlurText';
import CountUp from './react-bits/CountUp/CountUp';
import { AVIONICS_STACK } from '../data/fallbackData';

export default function AvionicsTelemetry({ copy, language, telemetry, events, theme }) {
  return (
    <section id="avionics" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <Cpu size={14} />
            <span>{copy.avionics.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.avionics.title} animateBy="words" delay={65} />
          </h2>
          <p className="section-subtitle">{copy.avionics.subtitle}</p>
        </div>

        <div className="avionics-cards-grid">
          {AVIONICS_STACK.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <SpotlightCard
                spotlightColor={group.color}
                intensity={0.22}
                spotlightSize={250}
                theme={theme === 'day' ? 'light' : 'dark'}
                style={{
                  borderRadius: '16px',
                  padding: '1.35rem',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: group.color,
                      letterSpacing: '0.12em',
                    }}
                  >
                    {group.code}
                  </span>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: group.color,
                      boxShadow: `0 0 10px ${group.color}`,
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.08rem' }}>{group.title[language]}</h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    {group.subtitle[language]}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
                  {group.items.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        padding: '0.26rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-hud)',
                        background: 'rgba(56, 189, 248, 0.06)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <div className="telemetry-split-grid">
          <motion.div
            className="telemetry-panel"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
              <Activity size={17} color="#38bdf8" />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.avionics.langTitle}</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
              {telemetry.languages.slice(0, 7).map((lang, idx) => (
                <div key={lang.name}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{lang.name}</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>
                      {lang.count} {language === 'es' ? 'repos' : 'repos'} · <CountUp to={lang.percent} suffix="%" duration={1.1} />
                    </span>
                  </div>
                  <div className="lang-bar-track">
                    <motion.div
                      className="lang-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${lang.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85, delay: idx * 0.06 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="telemetry-panel"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1.25rem' }}>
              <Radio size={17} color="#3ef09a" />
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{copy.avionics.atcTitle}</h3>
            </div>

            {events.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.84rem' }}>
                {copy.avionics.noEvents}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {events.slice(0, 6).map((evt) => (
                  <div
                    key={evt.id}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-hud)',
                      background: 'rgba(15, 23, 42, 0.28)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-emerald)', marginBottom: '0.2rem' }}>
                      <span>{(evt.type || 'Event').replace('Event', '').toUpperCase()}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {evt.created_at ? evt.created_at.slice(0, 10) : 'LIVE'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {evt.repo?.name || 'Fernius07'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
