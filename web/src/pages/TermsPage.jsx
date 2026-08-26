const termsSections = [
  {
    title: "1. General Terms",
    content: [
      "By using Chop Republic services, website, reservations, checkout, or catering support, you agree to follow these terms and any policies shown on our website.",
    ],
  },
  {
    title: "2. Orders & Services",
    bullets: [
      "All orders are subject to availability",
      "We reserve the right to modify or cancel orders",
      "Menu items and prices may change without notice",
    ],
  },
  {
    title: "3. Reservations",
    bullets: [
      "Reservations are subject to availability",
      "Please arrive on time to avoid cancellation",
      "Late arrivals may result in rescheduling",
    ],
  },
  {
    title: "4. Payments",
    bullets: [
      "Payment is required at the time of order or service",
      "We accept major payment methods",
      "Prices may include applicable taxes",
    ],
  },
  {
    title: "5. Cancellations & Refunds",
    bullets: [
      "Orders can be canceled within a limited time",
      "Refunds are processed based on our policy",
      "Late cancellations may not be eligible for refunds",
    ],
  },
  {
    title: "6. User Responsibilities",
    bullets: [
      "Provide accurate information",
      "Do not misuse our services",
      "Respect staff and policies",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      "All content on this website, including text, images, and branding, is the property of Chop Republic and may not be used without permission.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      "We are not responsible for any indirect or incidental damages arising from the use of our services under any circumstances whatsoever.",
    ],
  },
  {
    title: "9. Changes to Terms",
    content: [
      "We may update these terms from time to time. Continued use of our website or services means you accept the updated terms.",
    ],
  },
  {
    title: "10. Contact",
    content: [
      "For any questions regarding these terms, please contact us through our website or email choprepublic@subtleinnovsvcs.org for quick assistance, clear answers, and helpful customer support.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="legal-page">
      <section className="page-banner d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="banner-content">
              <h2 className="text-white display-3 text-center">Terms & Conditions</h2>
              <div className="divider">
                <div className="dot mb-2"></div>
              </div>
              <p className="text-white mb-0 text-center">
                Please read these terms carefully before using our services to understand rules,
                conditions, and guidelines clearly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="legal-content py-5">
        <div className="container">
          <div className="legal-shell">
            <p className="legal-updated">Last Updated: January 2026</p>
            {termsSections.map((section) => (
              <article className="legal-section" key={section.title}>
                <h3>{section.title}</h3>
                {section.content?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
