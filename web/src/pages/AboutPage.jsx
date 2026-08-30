import AboutJourney from "../components/AboutJourney";
import AboutPeople from "../components/AboutPeople";
import PremiumGridBackground from "../components/PremiumGridBackground";
import { BookingForm } from "@/components/ui/booking-form";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="page-banner d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div className="banner-content">
              <h2 className="text-white display-6 fw-bold text-center" data-aos="fade-right" data-aos-delay="0">About Us</h2>
              <div className="divider" data-aos="fade-up-right" data-aos-delay="0">
                <div className="dot mb-2"></div>
              </div>
              <p className="text-white mb-0 text-center" data-aos="fade-left" data-aos-delay="0">
                We bring to you the unforgetable moment with our delicious
                dishes
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutJourney />
      
      <AboutPeople />

      <section className="premium-grid-section my-5 py-5">
        <PremiumGridBackground />
        <div className="container">
          <div className="mx-auto mb-4 max-w-3xl text-center">
            <h2 data-aos="fade-right" className="display-6 fw-bold">
              Book Chop Republic
            </h2>
            <div
              data-aos="fade-right"
              className="reservation-line d-flex justify-content-center align-items-center"
            >
              <span></span>
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#3a4658]">
              Planning a private event, party tray order or corporate catering?
              Send us the details and we will help you shape the right food plan.
            </p>
          </div>
          <BookingForm />
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
