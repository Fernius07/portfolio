import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ChevronUp, ExternalLink, PlaneTakeoff, Search, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SplitFlapText from './react-bits/SplitFlapText/SplitFlapText';
import BlurText from './react-bits/BlurText/BlurText';
import TiltedCard, { TiltedCardLayer } from './react-bits/TiltedCard/TiltedCard';

const TOP_FEATURED = ['PilotBriefingApp', 'Metro-Bilbao', 'trayko'];

export default function DeparturesBoard({ copy, projects }) {
  const [filter, setFilter] = useState('featured');
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const featuredCards = useMemo(() => {
    const map = new Map(projects.map((p) => [p.name, p]));
    const picks = TOP_FEATURED.map((name) => map.get(name)).filter(Boolean);
    return picks.length === 3 ? picks : projects.slice(0, 3);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === 'featured' && !p.isFeatured) return false;
      if (filter === 'live' && !p.hasHomepage) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        (p.language || '').toLowerCase().includes(q) ||
        (p.summary || '').toLowerCase().includes(q)
      );
    });
  }, [projects, filter, query]);

  const visibleRows = showAll ? filtered : filtered.slice(0, 8);

  return (
    <section id="departures" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <PlaneTakeoff size={14} />
            <span>{copy.projects.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.projects.title} animateBy="words" delay={55} />
          </h2>
          <p className="section-subtitle">{copy.projects.subtitle}</p>
        </div>

        {/* Top 3 Featured 3D Cards */}
        <div className="featured-three-grid">
          {featuredCards.map((project) => (
            <TiltedCard
              key={project.name}
              containerHeight="250px"
              imageHeight="250px"
              imageWidth="100%"
              showTooltip={false}
              rotateAmplitude={10}
              scaleOnHover={1.03}
              glare={0.3}
              glareColor="#38bdf8"
              flipOnClick
              backContent={
                <div className="mission-card-back">
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#fbbf24' }}>
                      {project.code} · {project.language || 'Web'}
                    </div>
                    <h4 style={{ margin: '0.4rem 0', fontSize: '1.15rem' }}>{project.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                      {project.summary}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.55rem' }} onClick={(e) => e.stopPropagation()}>
                    {project.homepage && (
                      <a
                        href={project.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fids-link-btn live"
                      >
                        <ExternalLink size={13} />
                        <span>{copy.projects.demo}</span>
                      </a>
                    )}
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fids-link-btn repo"
                    >
                      <FaGithub size={13} />
                      <span>{copy.projects.code}</span>
                    </a>
                  </div>
                </div>
              }
            >
              <TiltedCardLayer depth={14}>
                <div className="mission-card-face">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="flap-badge">{project.code}</span>
                    <span className="status-led status-led--boarding">
                      {project.hasHomepage ? copy.projects.statusLive : copy.projects.statusRepo}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ margin: '0.5rem 0 0.35rem 0', fontSize: '1.25rem', color: '#f8fafc' }}>
                      {project.name}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: '#94a3b8',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {project.summary}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: '#38bdf8',
                      borderTop: '1px dashed rgba(148,163,184,0.2)',
                      paddingTop: '0.7rem',
                    }}
                  >
                    <span>{project.language || 'Web'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                      <Star size={12} /> {project.stargazers_count}
                    </span>
                  </div>
                </div>
              </TiltedCardLayer>
            </TiltedCard>
          ))}
        </div>

        {/* Airport Departures Board (FIDS) */}
        <motion.div
          className="fids-panel"
          style={{ marginTop: '2.5rem' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
        >
          <div className="fids-topbar">
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <SplitFlapText
                words={['GITHUB PROJECTS', 'SALIDAS / REPOS']}
                fontSize={22}
                padTo={16}
                flipDuration={0.08}
                stagger={0.03}
                cycleDelay={3400}
                tileColor="#0f172a"
                textColor="#fbbf24"
                tileRadius={5}
                gap={4}
              />
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#94a3b8' }}>
              {filtered.length} / {projects.length} repos
            </div>
          </div>

          <div className="fids-controls">
            <div className="fids-filter-group">
              {[
                { key: 'featured', label: copy.projects.filters.featured },
                { key: 'live', label: copy.projects.filters.live },
                { key: 'all', label: copy.projects.filters.all },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  className={`fids-filter-btn ${filter === btn.key ? 'active' : ''}`}
                  onClick={() => {
                    setFilter(btn.key);
                    setShowAll(false);
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="fids-search-box">
              <Search size={14} color="#38bdf8" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={copy.projects.searchPlaceholder}
                aria-label={copy.projects.searchPlaceholder}
              />
            </div>
          </div>

          <div className="fids-table-wrap">
            <table className="fids-table">
              <thead>
                <tr>
                  <th>{copy.projects.columns.code}</th>
                  <th>{copy.projects.columns.project}</th>
                  <th>{copy.projects.columns.language}</th>
                  <th>{copy.projects.columns.description}</th>
                  <th>{copy.projects.columns.status}</th>
                  <th>{copy.projects.columns.links}</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((project) => (
                  <tr key={project.name} className="fids-row">
                    <td>
                      <span className="flap-badge">{project.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                        {project.name}
                      </div>
                    </td>
                    <td>
                      <span className="lang-pill">{project.language || 'Docs'}</span>
                    </td>
                    <td style={{ maxWidth: '380px', color: '#cbd5e1', fontFamily: 'var(--font-sans)', fontSize: '0.86rem' }}>
                      {project.summary}
                    </td>
                    <td>
                      <span className={`status-led ${project.hasHomepage ? 'status-led--boarding' : 'status-led--landed'}`}>
                        {project.hasHomepage ? copy.projects.statusLive : copy.projects.statusRepo}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        {project.homepage && (
                          <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fids-link-btn live"
                          >
                            <ExternalLink size={12} />
                            <span>{copy.projects.demo}</span>
                          </a>
                        )}
                        <a
                          href={project.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fids-link-btn repo"
                        >
                          <FaGithub size={12} />
                          <span>{copy.projects.code}</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length > 8 && (
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(148,163,184,0.12)' }}>
              <button
                type="button"
                className="fids-filter-btn"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>
                  {showAll ? copy.projects.showLess : `${copy.projects.showAll} (${filtered.length})`}
                </span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
