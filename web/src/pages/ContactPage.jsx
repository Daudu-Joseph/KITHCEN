import { useState } from "react";

const initialContactForm = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:4242";

export default function ContactPage() {
  const [form, setForm] = useState(initialContactForm);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitContactMessage = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to send contact message.");
      }

      setStatus("success");
      setFeedback("Thanks. Your message has been sent to Chop Republic.");
      setForm(initialContactForm);
    } catch {
      setStatus("error");
      setFeedback("We could not send your message right now. Please try again or call us directly.");
    }
  };

  return (
    <main className="contact-page">
        <section className="page-banner d-flex align-items-center">
          <div className="container"> 
            <div className="row">
              <div className="banner-content">
                <h2 className="text-white display-3 text-center" data-aos="fade-right" data-aos-delay="0">Contact Us</h2>
                <div className="divider" data-aos="fade-up-right" data-aos-delay="0">
                    <div className="dot mb-2"></div>
                </div>
                <p className="text-white mb-0 text-center" data-aos="fade-left" data-aos-delay="0">Let us know if you have any concern about our menu, service or other information you want to have</p>
            </div>
            </div>
          </div>
        </section>

        <section className="contact-us my-5 py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="form">
                  <h2 className="mb-5 position-relative display-6 fw-bold" data-aos="fade-right">Get In Touch</h2>
                  <form data-aos="fade-right" onSubmit={submitContactMessage}>
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-user py-2 px-3"></i>
                      </div>
                      <input
                        className="form-control bg-transparent border-0 px-3"
                        name="name"
                        onChange={updateField}
                        placeholder="Name"
                        required
                        type="text"
                        value={form.name}
                      />
                    </div>
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-envelope py-2 px-3"></i>
                      </div>
                      <input
                        className="form-control bg-transparent border-0 px-3"
                        name="email"
                        onChange={updateField}
                        placeholder="Email"
                        required
                        type="email"
                        value={form.email}
                      />
                    </div>
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-phone py-2 px-3"></i>
                      </div>
                      <input
                        className="form-control bg-transparent border-0 px-3"
                        name="phone"
                        onChange={updateField}
                        placeholder="Phone"
                        type="tel"
                        value={form.phone}
                      />
                    </div>
                    <div className="input-group">
                      <textarea
                        className="form-control bg-transparent border-0 px-3"
                        name="message"
                        onChange={updateField}
                        placeholder="Message"
                        required
                        value={form.message}
                      ></textarea>
                    </div>

                    <div className="book-a-table contact-button">
                      <div className="anim-layer"></div>
                      <button disabled={status === "loading"} type="submit">
                        {status === "loading" ? "Sending..." : "Send"}
                      </button>
                    </div>
                    {feedback ? (
                      <p
                        className={`contact-form-feedback ${
                          status === "error" ? "is-error" : "is-success"
                        }`}
                      >
                        {feedback}
                      </p>
                    ) : null}
                  </form>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contact-info">
                  <h2 className="mb-5 mt-5 mt-lg-0 position-relative display-6 fw-bold" data-aos="fade-right">Contact Info</h2>
                    <div className="d-flex flex-column px-0 justify-content-between" data-aos="fade-left">
                        <div className="contact-info-box d-flex align-items-center pe-2 py-3">
                          <div className="contact-icon-box">
                            <i className="fa-solid fa-phone border-bottom pb-2"></i>
                          </div>
                          <div className="ps-3">
                            <p className="mb-0">
                              <b>Phone Number</b> <br />
                              +44 7990 532631
                            </p>
                          </div>
                        </div>
                        <div className="contact-info-box d-flex align-items-center pe-2 py-3">
                          <div className="contact-icon-box">
                            <i className="fa-solid fa-envelope border-bottom pb-2"></i>
                          </div>
                          <div className="ps-3">
                            <p className="mb-0">
                              <b>Mail</b> <br />
                              <a href="mailto:choprepublic@subtleinnovsvcs.org">
                                choprepublic@subtleinnovsvcs.org
                              </a>
                            </p>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="map pb-0 pb-lg-5 ">
          <div className="container pb-5" data-aos="fade-right">
            <div className="row">
              <iframe
                title="Chop Republic trading address map"
                src="https://www.google.com/maps?q=66%20Paul%20Street%2C%20London%20EC2A%204NA&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>

        <section className="subscribe-us pb-5 mb-5">
          <img className="d-none d-lg-block" src="/assets/images/subscribe-us.png" alt="" data-aos="fade-down-right" />
          <div className="container">
            <div className="row">
              <div className="col-lg-2">
              </div>
              <div className="col-lg-8 d-flex flex-column flex-md-row align-items-lg-center">
                <div className="content" data-aos="fade-right">
                  <h5 className="display-6 text-black">Subcribe Us Now</h5>
                  <p>
                    Get more news and delicious dishes everyday from us
                  </p>
                </div>
                <div className="subscribe-form d-flex ps-0 ms-0 ps-lg-5 ms-lg-5" data-aos="fade-left">
                  <div className="input-form w-100">
                    <input className="border-0 px-3 w-100" type="email" placeholder="Email" />
                  </div>
                  <div className="input-button">
                    <a className="text-decoration-none" href="#">
                      <i className="fa fa-paper-plane"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
    </main>
  );
}
