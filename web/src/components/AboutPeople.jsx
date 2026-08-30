import { motion, useReducedMotion } from "motion/react";
import PremiumGridBackground from "./PremiumGridBackground";

const peopleVideo = "/assets/videos/about-people.mp4";

const sectionStyle = {
  background: "#fff",
  padding: "26px 0 72px",
};

const wrapStyle = {
  margin: "0 auto",
  maxWidth: "900px",
  textAlign: "center",
};

const titleStyle = {
  color: "#0b0b12",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "30px",
  fontWeight: 900,
  lineHeight: 1.12,
  marginBottom: "18px",
};

const introStyle = {
  color: "#202633",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "14px",
  lineHeight: 1.8,
  margin: "0 auto 30px",
  maxWidth: "660px",
};

const imageCardStyle = {
  borderRadius: "16px",
  height: "330px",
  margin: "0 auto",
  maxWidth: "760px",
  overflow: "hidden",
  position: "relative",
};

const videoStyle = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%",
};

export default function AboutPeople() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="premium-grid-section" style={sectionStyle}>
      <PremiumGridBackground />
      <div className="container">
        <div style={wrapStyle}>
          <motion.h2
            style={titleStyle}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            Our People Make the Difference
          </motion.h2>
          <motion.p
            style={introStyle}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            At Chop Republic, we call our team caregivers because they do more
            than serve food. From the chefs in the kitchen to the servers in the
            dining room, they bring warmth, energy, and pride to every plate.
          </motion.p>

          <motion.div
            style={imageCardStyle}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            whileHover={reduceMotion ? undefined : { y: -6 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              aria-label="Chop Republic team video"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              src={peopleVideo}
              style={videoStyle}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
