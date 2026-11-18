import { motion } from 'motion/react';
import { ArrowDownRight, Compass, GitBranch, Globe, PlaneTakeoff, Star } from 'lucide-react';
import Radar from './react-bits/Radar/Radar';
import SplitFlapText from './react-bits/SplitFlapText/SplitFlapText';
import DecryptedText from './react-bits/DecryptedText/DecryptedText';
import BlurText from './react-bits/BlurText/BlurText';
import CountUp from './react-bits/CountUp/CountUp';
import Magnet from './react-bits/Magnet/Magnet';
import StarBorder from './react-bits/StarBorder/StarBorder';

export default function CockpitHero({ copy, githubUser, telemetry, theme }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const gauges = [
    {
      key: 'repos',
      icon: <GitBranch size={15} color="#38bdf8" />,
      code: 'FLT-LOG',
      value: telemetry.totalRepos,
      label: copy.hero.stats.repos,
    },
    {
      key: 'live',
      icon: <Globe size={15} color="#3ef09a" />,
      code: 'AIRBORNE',
      value: telemetry.liveDeployments,
      label: copy.hero.stats.live,
    },
    {
      key: 'stars',
      icon: <Star size={15} color="#fbbf24" />,
      code: 'RATING',
      value: telemetry.totalStars,
      label: copy.hero.stats.stars,
    },
    {
      key: 'langs',
      icon: <Compass size={15} color="#a78bfa" />,
      code: 'AVIONICS',
      value: telemetry.activeLanguagesCount,
      label: copy.hero.stats.languages,
    },
  ];

  return (
    <section id="cockpit" className="cockpit-hero">
      <div className="hero-radar-layer">
        <Radar
          color={theme === 'night' ? '#3ef09a' : '#0284c7'}
          mode="sweep"
          speed={0.9}
          trail={0.42}
          ringCount={6}
          spokeCount={12}
          targets={9}
          clutter={0.28}
          tilt={22}
          centerX={0.72}
          centerY={0.48}
          gridOpacity={0.75}
          lightMode={theme === 'day'}
        />
      </div>
      <div className="hero-vignette" />

      <div className="hero-content">
        <motion.div
          className="hero-tower-pill"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="sync-dot" />
          <span>{copy.hero.badge}</span>
        </motion.div>

        <motion.div
          className="hero-splitflap-wrap"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <SplitFlapText
            words={copy.hero.callsigns}
            fontSize={42}
            padTo={19}
            flipDuration={0.09}
            stagger={0.04}
            cycleDelay={2800}
            flipsPerChar={6}
            tileColor={theme === 'night' ? '#0d1628' : '#0f172a'}
            textColor="#fbbf24"
            tileRadius={8}
            gap={5}
            glare={0.25}
          />
        </motion.div>

        <motion.div
          className="hero-metar-bar"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <DecryptedText
            text={copy.hero.metar}
            animateOn="view"
            sequential
            revealDirection="start"
            speed={28}
            scrambleColor="#fbbf24"
          />
        </motion.div>

        <h1 className="hero-headline">
          <BlurText
            text={copy.hero.headline}
            delay={70}
            animateBy="words"
            direction="top"
            trigger="load"
          />
        </h1>

        <motion.p
          className="hero-subhead"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45 }}
        >
          {copy.hero.subhead}
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.58 }}
        >
          <Magnet padding={70} magnetStrength={2.2} scale={1.03}>
            <StarBorder
              as="button"
              type="button"
              className="cockpit-cta-btn"
              color="#3ef09a"
              trailColor="#38bdf8"
              backgroundColor="linear-gradient(135deg, #0ea5e9, #10b981)"
              textColor="#03111c"
              duration={3.2}
              radius={12}
              sparkle
              onClick={() => scrollTo('boarding')}
            >
              <PlaneTakeoff size={18} />
              <span>{copy.hero.ctaBoarding}</span>
            </StarBorder>
          </Magnet>

          <Magnet padding={60} magnetStrength={2}>
            <button
              type="button"
              className="cockpit-secondary-btn"
              onClick={() => scrollTo('departures')}
            >
              <span>{copy.hero.ctaDepartures}</span>
              <ArrowDownRight size={17} />
            </button>
          </Magnet>

          {githubUser?.avatar_url && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.45rem 0.85rem 0.45rem 0.45rem',
                borderRadius: '999px',
                border: '1px solid var(--border-hud)',
                background: 'var(--bg-card)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
              }}
            >
              <img
                src={githubUser.avatar_url}
                alt={githubUser.name || 'Fernius07'}
                width={30}
                height={30}
                style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-emerald)' }}
              />
              <span>@{githubUser.login}</span>
            </div>
          )}
        </motion.div>

        <div className="hero-gauges-grid">
          {gauges.map((g, i) => (
            <motion.div
              key={g.key}
              className="gauge-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.65 + i * 0.08 }}
              whileHover={{ y: -4, borderColor: 'rgba(56, 189, 248, 0.5)' }}
            >
              <div className="gauge-top">
                <span>{g.code}</span>
                {g.icon}
              </div>
              <div className="gauge-number">
                <CountUp to={g.value} duration={1.6} trigger="load" />
              </div>
              <div className="gauge-label">{g.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
