import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, PlaneTakeoff, Search, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import SplitFlapText from './react-bits/SplitFlapText/SplitFlapText';
import BlurText from './react-bits/BlurText/BlurText';
import TiltedCard, { TiltedCardLayer } from './react-bits/TiltedCard/TiltedCard';

const FEATURED_REPOS = [
  'PilotBriefingApp',
  'AeroLink',
  'TreAir',
  'Metro-Bilbao',
  'trayko',
  'TicketTool',
];

export default function DeparturesBoard({ copy, flights }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const filteredFlights = useMemo(() => {
    const q = query.trim().toLowerCase();
    return flights.filter((f) => {
      if (filter === 'live' && f.status !== 'BOARDING') return false;
      if (filter === 'aviation' && f.sector !== 'aviation' && f.sector !== 'transit') return false;
      if (filter === 'software' && f.sector !== 'ai' && f.sector !== 'fullstack') return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.flightCode.toLowerCase().includes(q) ||
        (f.language || '').toLowerCase().includes(q) ||
        (f.remarks || '').toLowerCase().includes(q)
      );
    });
  }, [flights, filter, query]);

  const featuredFlights = useMemo(() => {
    const map = new Map(flights.map((f) => [f.name, f]));
    const picks = FEATURED_REPOS.map((name) => map.get(name)).filter(Boolean);
    return picks.length >= 6 ? picks : flights.slice(0, 6);
  }, [flights]);

  return (
    <section id="departures" className="cockpit-section">
      <div className="cockpit-container">
        <div className="section-header">
          <div className="section-eyebrow">
            <PlaneTakeoff size={14} />
            <span>{copy.departures.eyebrow}</span>
          </div>
          <h2 className="section-title">
            <BlurText text={copy.departures.title} animateBy="words" delay={65} />
          </h2>
          <p className="section-subtitle">{copy.departures.subtitle}</p>
        </div>

        <motion.div
          className="fids-panel"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
        >
          <div className="fids-topbar">
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
              <SplitFlapText
                words={['DEPARTURES LEBB', `FLIGHTS ${flights.length}`, 'GITHUB SYNC LIVE']}
                fontSize={24}
                padTo={16}
                flipDuration={0.08}
                stagger={0.03}
                cycleDelay={3200}
                tileColor="#0f172a"
                textColor="#fbbf24"
                tileRadius={5}
                gap={4}
              />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: '#3ef09a',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span className="sync-dot" />
              <span>FIDS // {filteredFlights.length} / {flights.length}</span>
            </div>
          </div>

          <div className="fids-controls">
            <div className="fids-filter-group">
              {[
                { key: 'all', label: copy.departures.filters.all },
                { key: 'live', label: copy.departures.filters.live },
                { key: 'aviation', label: copy.departures.filters.aviation },
                { key: 'software', label: copy.departures.filters.software },
              ].map((btn) => (
                <button
                  key={btn.key}
                  type="button"
                  className={`fids-filter-btn ${filter === btn.key ? 'active' : ''}`}
                  onClick={() => setFilter(btn.key)}
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
                placeholder={copy.departures.searchPlaceholder}
                aria-label={copy.departures.searchPlaceholder}
              />
            </div>
          </div>

          <div className="fids-table-wrap">
            <table className="fids-table">
              <thead>
                <tr>
                  <th>{copy.departures.columns.flight}</th>
                  <th>{copy.departures.columns.destination}</th>
                  <th>{copy.departures.columns.gate}</th>
                  <th>{copy.departures.columns.status}</th>
                  <th>{copy.departures.columns.remarks}</th>
                  <th>{copy.departures.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight, idx) => (
                  <motion.tr
                    key={flight.name}
                    className="fids-row"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.025, 0.35) }}
                  >
                    <td>
                      <span className="flap-badge">{flight.flightCode}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                        {flight.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                        {flight.destCode}
                        {flight.stargazers_count > 0 ? ` · ★ ${flight.stargazers_count}` : ''}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: 'rgba(56, 189, 248, 0.12)',
                          border: '1px solid rgba(56, 189, 248, 0.28)',
                          color: '#38bdf8',
                          fontSize: '0.74rem',
                        }}
                      >
                        {flight.language || 'DOCS'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-led ${
                          flight.status === 'BOARDING'
                            ? 'status-led--boarding'
                            : flight.status === 'IN FLIGHT'
                              ? 'status-led--flight'
                              : 'status-led--landed'
                        }`}
                      >
                        {flight.status}
                      </span>
                    </td>
                    <td style={{ maxWidth: '340px', color: '#cbd5e1', fontFamily: 'var(--font-sans)', fontSize: '0.84rem' }}>
                      {flight.remarks}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                        {flight.homepage && (
                          <a
                            href={flight.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fids-link-btn live"
                          >
                            <ExternalLink size={12} />
                            <span>LIVE</span>
                          </a>
                        )}
                        <a
                          href={flight.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fids-link-btn repo"
                        >
                          <FaGithub size={12} />
                          <span>REPO</span>
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div style={{ marginTop: '4rem' }}>
          <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.55rem' }}>{copy.departures.featuredTitle}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
            {copy.departures.featuredHint}
          </p>

          <div className="featured-missions-grid">
            {featuredFlights.map((flight) => (
              <TiltedCard
                key={flight.name}
                containerHeight="285px"
                imageHeight="285px"
                imageWidth="100%"
                captionText={`${flight.flightCode} · ${flight.name}`}
                showTooltip={false}
                rotateAmplitude={11}
                scaleOnHover={1.03}
                glare={0.35}
                glareColor="#38bdf8"
                flipOnClick
                backContent={
                  <div className="mission-card-back">
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#fbbf24' }}>
                        FLIGHT TELEMETRY // {flight.flightCode}
                      </div>
                      <h4 style={{ margin: '0.45rem 0', fontSize: '1.2rem' }}>{flight.name}</h4>
                      <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                        {flight.remarks}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {flight.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              background: 'rgba(251, 191, 36, 0.14)',
                              color: '#fbbf24',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }} onClick={(e) => e.stopPropagation()}>
                        {flight.homepage && (
                          <a
                            href={flight.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fids-link-btn live"
                          >
                            <ExternalLink size={13} />
                            <span>{copy.departures.liveDemo}</span>
                          </a>
                        )}
                        <a
                          href={flight.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="fids-link-btn repo"
                        >
                          <FaGithub size={13} />
                          <span>{copy.departures.viewRepo}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                }
              >
                <TiltedCardLayer depth={14}>
                  <div className="mission-card-face">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="flap-badge">{flight.flightCode}</span>
                      <span className="status-led status-led--boarding">{flight.status}</span>
                    </div>

                    <div>
                      <h4 style={{ margin: '0.6rem 0 0.45rem 0', fontSize: '1.3rem', color: '#f8fafc' }}>
                        {flight.name}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          color: '#94a3b8',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {flight.remarks}
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
                        borderTop: '1px dashed rgba(148,163,184,0.22)',
                        paddingTop: '0.75rem',
                      }}
                    >
                      <span>{flight.language || 'Web'}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                        <Star size={12} /> {flight.stargazers_count} · {flight.destCode}
                      </span>
                    </div>
                  </div>
                </TiltedCardLayer>
              </TiltedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
