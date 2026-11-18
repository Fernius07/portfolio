import { motion } from 'motion/react';
import { BookOpen, Briefcase, Code2, ExternalLink, Languages } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import BlurText from './react-bits/BlurText/BlurText';
import SpotlightCard from './react-bits/SpotlightCard/SpotlightCard';
import CountUp from './react-bits/CountUp/CountUp';
import { LINKEDIN_URL } from '../data/fallbackData';

export default function FlightLogLinkedin({ copy, language, linkedin, stats, theme }) {
  const stackEntries = Object.entries(linkedin.techStack || {});

  return (
    <section id="about" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <FaLinkedin size={13} />
            <span>{copy.about.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.about.title} animateBy="words" delay={55} />
          </h2>
          <p className="section-subtitle">{copy.about.subtitle}</p>
        </div>

        <div className="about-two-col">
          {/* Left: LinkedIn Profile, Education, Experience & Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <SpotlightCard
              spotlightColor="#38bdf8"
              intensity={0.18}
              theme={theme === 'day' ? 'light' : 'dark'}
              className="clean-spotlight-card"
            >
              <div className="clean-card-inner">
                <div>
                  <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.35rem' }}>{linkedin.fullName}</h3>
                  <div style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.6rem' }}>
                    {linkedin.headline[language]}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: 1.6 }}>
                    {linkedin.summary[language]}
                  </p>
                </div>

                <div className="clean-block">
                  <div className="clean-block-title">
                    <BookOpen size={15} color="var(--accent-cyan)" />
                    <span>{copy.about.eduTitle}</span>
                  </div>
                  {(linkedin.education || []).map((edu) => (
                    <div key={edu.id} className="clean-item">
                      <div className="clean-item-top">
                        <strong>{edu.institution}</strong>
                        <span>{edu.period}</span>
                      </div>
                      <div style={{ fontSize: '0.92rem', marginTop: '0.2rem' }}>{edu.degree[language]}</div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        {edu.focus[language]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="clean-block">
                  <div className="clean-block-title">
                    <Briefcase size={15} color="var(--accent-emerald)" />
                    <span>{copy.about.expTitle}</span>
                  </div>
                  {(linkedin.experience || []).map((exp) => (
                    <div key={exp.id} className="clean-item">
                      <div className="clean-item-top">
                        <strong>{exp.role[language]}</strong>
                        <span>{exp.period}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--accent-cyan)', marginTop: '0.15rem' }}>
                        {exp.organization}
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {exp.description[language]}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="clean-block">
                  <div className="clean-block-title">
                    <Languages size={15} color="var(--accent-amber)" />
                    <span>{copy.about.langTitle}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {(linkedin.spokenLanguages || []).map((item, idx) => (
                      <span key={idx} className="clean-chip">
                        <strong>{item.name[language]}</strong> · {item.level[language]}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <a
                    href={linkedin.profileUrl || LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fids-link-btn repo"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.84rem' }}
                  >
                    <FaLinkedin size={15} />
                    <span>{copy.about.linkedinBtn}</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right: GitHub Languages & Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            <SpotlightCard
              spotlightColor="#3ef09a"
              intensity={0.18}
              theme={theme === 'day' ? 'light' : 'dark'}
              className="clean-spotlight-card"
            >
              <div className="clean-card-inner">
                <div>
                  <div className="clean-block-title" style={{ marginBottom: '1rem' }}>
                    <Code2 size={16} color="var(--accent-emerald)" />
                    <span>{copy.about.githubLangsTitle}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {stats.languages.slice(0, 5).map((lang, idx) => (
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
                            {lang.count} repos · <CountUp to={lang.percent} suffix="%" duration={1} />
                          </span>
                        </div>
                        <div className="lang-bar-track">
                          <motion.div
                            className="lang-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${lang.percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.75, delay: idx * 0.05 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="clean-block">
                  <div className="clean-block-title" style={{ marginBottom: '0.85rem' }}>
                    <span>{copy.about.stackTitle}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {stackEntries.map(([groupKey, items]) => (
                      <div key={groupKey}>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '0.4rem',
                          }}
                        >
                          {copy.about.stackLabels[groupKey] || groupKey}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                          {items.map((tech) => (
                            <span key={tech} className="clean-chip">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
