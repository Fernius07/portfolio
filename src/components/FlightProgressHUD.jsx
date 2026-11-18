import { motion, useScroll, useSpring } from 'motion/react';

export default function FlightProgressHUD() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div className="flight-runway-track" aria-hidden="true">
      <motion.div className="flight-runway-fill" style={{ scaleX: smoothProgress }} />
    </div>
  );
}
