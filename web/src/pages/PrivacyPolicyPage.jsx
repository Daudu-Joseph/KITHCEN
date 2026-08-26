const privacySections = [
  {
    title: "Information We Collect",
    content: [
      "We may collect personal information such as your name, email address, phone number, address, and order details when you place an order, make a reservation, or contact us.",
      "We may also collect non-personal information such as browser type, device details, and usage data to help improve our website and services.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use your information to process orders, manage deliveries, improve our services, personalize your experience, respond to inquiries, and send updates or offers while keeping your data secure.",
    ],
    bullets: [
      "Process orders and reservations",
      "Improve our website and services",
      "Communicate updates and offers",
      "Respond to inquiries and support requests",
    ],
  },
  {
    title: "Sharing of Information",
    content: [
      "We value your privacy and do not sell your personal information. We only share information when needed to provide our services, comply with legal obligations, or protect our customers and business.",
    ],
  },
  {
    title: "Cookies & Tracking",
    content: [
      "We use cookies to enhance your browsing experience and analyze website traffic. You can manage cookie preferences through your browser settings.",
    ],
  },
  {
    title: "Your Rights",
    content: ["You have the right to:"],
    bullets: [
      "Access your personal data",
      "Request corrections",
      "Request deletion of your data",
    ],
  },
  {
    title: "Contact Us",
    content: [
      "If you have any questions about this Privacy Policy, please contact us through our website or email choprepublic@subtleinnovsvcs.org.",
    ],
  },
  {
    title: "Updates to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page and take effect immediately after posting.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <section className="page-banner d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="banner-content">
              <h2 className="text-white display-3 text-center">Privacy Policy</h2>
              <div className="divider">
                <div className="dot mb-2"></div>
              </div>
              <p className="text-white mb-0 text-center">
                We value your privacy and are committed to protecting your personal information
                with safe handling and complete confidentiality.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="legal-content py-5">
        <div className="container">
          <div className="legal-shell">
            <p className="legal-updated">Last Updated: August 2026</p>
            {privacySections.map((section) => (
              <article className="legal-section" key={section.title}>
                <h3>{section.title}</h3>
                {section.content.map((paragraph) => (
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
