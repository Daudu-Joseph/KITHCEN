import { Eye, Target } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

const storyImage = "/assets/images/about-3.jpg";

const sectionStyle = {
  padding: "84px 0 56px",
  background: "#fff",
};

const wrapStyle = {
  maxWidth: "1080px",
  margin: "0 auto",
};

const headingStyle = {
  color: "#0b0b12",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "32px",
  fontWeight: 900,
  lineHeight: 1.05,
  marginBottom: "22px",
};

const textStyle = {
  color: "#222733",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "14px",
  lineHeight: 1.9,
  marginBottom: "24px",
};

const imageStyle = {
  aspectRatio: "1.28 / 1",
  borderRadius: "18px",
  boxShadow: "0 22px 45px rgba(13, 13, 23, 0.12)",
  height: "100%",
  maxHeight: "410px",
  objectFit: "cover",
  width: "100%",
};

const cardStyle = {
  background: "#fff2f2",
  border: "1px solid rgba(194, 0, 17, 0.04)",
  borderRadius: "18px",
  boxShadow: "0 18px 40px rgba(17, 17, 32, 0.04)",
  height: "100%",
  overflow: "hidden",
  padding: "34px",
  position: "relative",
};

const iconWrapStyle = {
  alignItems: "center",
  background: "#fff",
  borderRadius: "50%",
  display: "inline-flex",
  height: "92px",
  justifyContent: "center",
  marginBottom: "26px",
  width: "92px",
  position: "relative",
  zIndex: 1,
};

const cardTitleStyle = {
  color: "#0b0b12",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "18px",
  fontWeight: 900,
  marginBottom: "16px",
};

const cardTextStyle = {
  color: "#232936",
  fontFamily: '"Heebo", sans-serif',
  fontSize: "14px",
  lineHeight: 1.85,
  margin: 0,
  position: "relative",
  zIndex: 1,
};

function InfoCard({ icon, title, children }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      style={cardStyle}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -10,
              rotateX: 1.5,
              rotateY: -1.5,
              boxShadow: "0 28px 58px rgba(194, 0, 17, 0.14)",
            }
      }
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.75) 48%, transparent 70%)",
          inset: 0,
          position: "absolute",
          transform: "translateX(-130%)",
        }}
        whileHover={reduceMotion ? undefined : { transform: "translateX(130%)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        style={iconWrapStyle}
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>
      <h3 style={cardTitleStyle}>{title}</h3>
      <p style={cardTextStyle}>{children}</p>
    </motion.article>
  );
}

export default function AboutJourney() {
  return (
    <section style={sectionStyle}>
      <div className="container">
        <div style={wrapStyle}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6" data-aos="fade-right">
              <h2 style={headingStyle}>Our Journey</h2>
              <p style={textStyle}>
                Back in November 1983, most Nigerians saw dining out as either
                foreign fast food or roadside stalls. Mama Cass changed that by
                bringing a true taste of home to the table.
              </p>
              <p style={textStyle}>
                We began with a simple mission: to serve authentic, home-cooked
                Nigerian meals to busy city professionals and families who wanted
                real comfort food without the wait.
              </p>
              <p style={{ ...textStyle, marginBottom: 0 }}>
                Mama Cass is more than just food; it is a way to relive special
                moments. From smoky Jollof rice to soft pounded yam and our
                unique Ofada rice, every dish takes you back to family and joyful
                village celebrations.
              </p>
            </div>

            <div className="col-12 col-lg-6" data-aos="fade-left">
              <img src={storyImage} alt="A Chop Republic dish being enjoyed" style={imageStyle} />
            </div>
          </div>

          <div className="row g-4 mt-5">
            <div className="col-12 col-lg-6" data-aos="fade-up">
              <InfoCard
                icon={<Target size={46} color="#f3262c" weight="bold" />}
                title="Our Mission"
              >
                Our mission is to serve fresh dishes with a twist, creating a
                welcoming space where people connect over good food and warm
                hospitality.
              </InfoCard>
            </div>

            <div className="col-12 col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <InfoCard
                icon={<Eye size={46} color="#f3262c" weight="bold" />}
                title="Our Vision"
              >
                To be the destination for fresh and exciting food that creates a
                welcoming space and feels like home.
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
