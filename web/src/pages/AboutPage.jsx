import AboutJourney from "../components/AboutJourney";
import AboutPeople from "../components/AboutPeople";

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

      <section className="counter my-5">
        <img data-aos="fade-right" className="counter-after" src="/assets/images/vegetable_01.png" alt="" />
        <img data-aos="fade-right" className="counter-before" src="/assets/images/vegetable_02.png" alt="" />
        <div className="container pt-4 pb-5" data-aos="fade-up-right">
          <div className="row py-5">
            <div className="col-lg-3">
              <div className="counter-box d-flex flex-column align-items-center">
                <div className="counter-info pb-3">
                  <span className="number">103</span>
                  <span className="heading">/dishes</span>
                </div>
                <div className="counter-avatar pt-4">
                  <img src="/assets/images/counter-1.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="counter-box d-flex flex-column align-items-center">
                <div className="counter-info pb-3">
                  <span className="number">2389</span>
                  <span className="heading">/customers</span>
                </div>
                <div className="counter-avatar pt-4">
                  <img src="/assets/images/counter-2.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="counter-box d-flex flex-column align-items-center">
                <div className="counter-info pb-3">
                  <span className="number">20</span>
                  <span className="heading">/awards</span>
                </div>
                <div className="counter-avatar pt-4">
                  <img src="/assets/images/counter-3.png" alt="" />
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="counter-box d-flex flex-column align-items-center">
                <div className="counter-info pb-3">
                  <span className="number">2589</span>
                  <span className="heading">/working hours</span>
                </div>
                <div className="counter-avatar pt-4">
                  <img src="/assets/images/counter-4.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <AboutPeople />

      <section className="reservation-form my-5 py-5">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h2 data-aos="fade-right" className="text-center display-6 fw-bold">Make Reservation</h2>
                    <div data-aos="fade-right" className="reservation-line d-flex justify-content-center align-items-center">
                        <span></span>
                    </div>
                    <form action="" className="position-relative">
                        <p className="text-center" data-aos="fade-up-right">We are happy to help with your reservation. You can call us directly through the customer service hotline: +44 7990 532631</p>
                        <div className="row mt-5">
                            <div className="col-md-6" data-aos="fade-right">
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                      <i className="fa fa-user py-2 px-3"></i>
                                    </div>
                                    <input className="form-control bg-transparent border-0 px-3" type="text" placeholder="Username" />
                                </div>
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                      <i className="fa fa-phone py-2 px-3"></i>
                                    </div>
                                    <input className="form-control bg-transparent border-0 px-3" type="text" placeholder="Phone" />
                                </div>
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                      <i className="fa fa-calendar py-2 px-3"></i>
                                    </div>
                                    <input className="form-control bg-transparent border-0 px-3" type="date" placeholder="Date" />
                                </div>
                            </div>
                            <div className="col-md-6" data-aos="fade-left">
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                      <i className="fa fa-envelope py-2 px-3"></i>
                                    </div>
                                    <input className="form-control bg-transparent border-0 px-3" type="email" placeholder="Email" />
                                </div>
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                        <i className="fa fa-person py-2 px-3"></i>
                                    </div>
                                    <select className="form-select bg-transparent border-0 ps-3" name="" id="">
                                        <option value="">1 Person</option>
                                        <option value="">2 Person</option>
                                        <option value="">3 Person</option>
                                        <option value="">4 Person</option>
                                        <option value="">5 Person</option>
                                        <option value="">6 Person</option>
                                        <option value="">7 Person</option>
                                        <option value="">8 Person</option>
                                        <option value="">9 Person</option>
                                        <option value="">10 Person</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <div className="icon-wrapper d-flex align-items-center position-relative">
                                        <i className="fa fa-clock py-2 px-3"></i>
                                    </div>
                                    <select type="text" placeholder="Time" className="ps-3 form-select bg-transparent border-0">
                                        <option>7:00 AM</option>
                                        <option>8:00 AM</option>
                                        <option>9:00 AM</option>
                                        <option>10:00 AM</option>
                                        <option>11:00 AM</option>
                                        <option>12:00 AM</option>
                                        <option>1:00 PM</option>
                                        <option>2:00 PM</option>
                                        <option>3:00 PM</option>
                                        <option>4:00 PM</option>
                                        <option>5:00 PM</option>
                                        <option>6:00 PM</option>
                                        <option>7:00 PM</option>
                                        <option>8:00 PM</option>
                                        <option>9:00 PM</option>
                                        <option>10:00 PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="text-center" data-aos="fade-up-left">
                            <div className="book-a-table contact-button">
                                <div className="anim-layer"></div>
                                <a href="#">Book Table</a>
                            </div>
                        </div>
                    </form>
                </div>
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
