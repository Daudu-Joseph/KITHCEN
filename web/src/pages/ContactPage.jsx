export default function ContactPage() {
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
                  <form action="" data-aos="fade-right">
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-user py-2 px-3"></i>
                      </div>
                      <input className="form-control bg-transparent border-0 px-3" type="text" placeholder="Username" />
                    </div>
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-envelope py-2 px-3"></i>
                      </div>
                      <input className="form-control bg-transparent border-0 px-3" type="email" placeholder="Email" />
                    </div>
                    <div className="input-group">
                      <div className="icon-wrapper d-flex align-items-center position-relative">
                        <i className="fa fa-phone py-2 px-3"></i>
                      </div>
                      <input className="form-control bg-transparent border-0 px-3" type="text" placeholder="Phone" />
                    </div>
                    <div className="input-group">
                      <textarea className="form-control bg-transparent border-0 px-3" name="" id="" placeholder="Message"></textarea>
                    </div>

                    <div className="book-a-table contact-button">
                      <div className="anim-layer"></div>
                      <a href="#">Send</a>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contact-info">
                  <h2 className="mb-5 mt-5 mt-lg-0 position-relative display-6 fw-bold" data-aos="fade-right">Contact Info</h2>
                    <div className="d-flex flex-column px-0 justify-content-between" data-aos="fade-left">
                        <div className="contact-info-box d-flex align-items-center pe-2 py-3">
                          <div className="contact-icon-box">
                            <i className="fa-solid fa-location-dot border-bottom pb-2"></i>
                          </div>
                          <div className="ps-3">
                            <p className="mb-0">
                              <b>Restaurent 1</b> <br />
                              157 White Oak Drive Kansas City
                            </p>
                          </div>
                        </div>
                        <div className="contact-info-box d-flex align-items-center pe-2 py-3">
                          <div className="contact-icon-box">
                            <i className="fa-solid fa-location-dot border-bottom pb-2"></i>
                          </div>
                          <div className="ps-3">
                            <p className="mb-0">
                              <b>Restaurent 2</b> <br />
                              158 White Oak Drive Kansas City
                            </p>
                          </div>
                        </div>
                        <div className="contact-info-box d-flex align-items-center pe-2 py-3">
                          <div className="contact-icon-box">
                            <i className="fa-solid fa-phone border-bottom pb-2"></i>
                          </div>
                          <div className="ps-3">
                            <p className="mb-0">
                              <b>Phone Number</b> <br />
                              (012) 978 645 312
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
                              hello@fooday.com <br />
                              contact@fooday.com
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
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7236.375239953878!2d67.08098637770993!3d24.92567760000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f60a0781265%3A0x2befaba123014ab1!2sSMIT%20Gulshan%20Campus!5e0!3m2!1sen!2s!4v1724775738916!5m2!1sen!2s" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
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
