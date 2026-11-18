import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

export default function FlightProgressHUD({ copy }) {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  const altitudeTransform = useTransform(smoothProgress, [0, 1], [0, 38000]);
  const speedTransform = useTransform(smoothProgress, [0, 0.25, 0.85, 1], [145, 460, 490, 160]);

  const [altitude, setAltitude] = useState(0);
  const [airspeed, setAirspeed] = useState(145);

  useEffect(() => {
    const unsubAlt = altitudeTransform.on('change', (v) => setAltitude(Math.round(v)));
    const unsubSpd = speedTransform.on('change', (v) => setAirspeed(Math.round(v)));
    return () => {
      unsubAlt();
      unsubSpd();
    };
  }, [altitudeTransform, speedTransform]);

  return (
    <>
      <div className="flight-runway-track" aria-hidden="true">
        <motion.div className="flight-runway-fill" style={{ scaleX: smoothProgress }} />
      </div>

      <aside className="altimeter-hud" aria-label="Flight telemetry HUD">
        <span className="altimeter-label">{copy.hud.altitude}</span>
        <span className="altimeter-value">{altitude.toLocaleString()} FT</span>

        <div className="altimeter-scale">
          <motion.div className="altimeter-bar" style={{ scaleY: smoothProgress }} />
        </div>

        <span className="altimeter-label">{copy.hud.speed}</span>
        <span className="altimeter-value" style={{ color: 'var(--accent-cyan)', fontSize: '0.84rem' }}>
          {airspeed} KTS
        </span>
      </aside>
    </>
  );
}
