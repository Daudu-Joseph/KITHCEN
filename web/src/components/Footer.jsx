import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="footer-content col-xl-8  px-4">
            <div className="row">
              <div className="col-lg-6 px-0">
                <div className="logo" data-aos="fade-down-right">
                  <Logo variant="light" />
                </div>
              </div>
              <div
                data-aos="fade-down"
                className="col-lg-6 pt-4 pt-lg-0 d-flex align-items-center justify-content-start justify-content-lg-end"
              >
                <div className="social-icons d-flex">
                  <ul className="d-flex mb-0 ps-0">
                    <li className="mx-2">
                      <a className="text-decoration-none text-white" href="#">
                        <i className="fab fa-facebook"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a className="text-decoration-none text-white" href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a className="text-decoration-none text-white" href="#">
                        <i className="fab fa-pinterest"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a className="text-decoration-none text-white" href="#">
                        <i className="fab fa-google-plus"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row pt-5 content-desc" data-aos="fade-right">
              <p className="px-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat Duis aute irure dolor.
              </p>
            </div>
            <div className="row" data-aos="fade-right">
              <div className="d-flex flex-column flex-lg-row px-0 justify-content-between">
                <div className="location d-flex align-items-center pe-2 py-3">
                  <i className="fa-solid fa-location-dot text-white fa-2x border-bottom pb-2"></i>
                  <div className="ps-3">
                    <p className="mb-0">
                      157 White Oak Drive Kansas City <br />
                      689 Lynn Street South Boston
                    </p>
                  </div>
                </div>
                <div className="location d-flex align-items-center pe-2 py-3">
                  <i className="fa-solid fa-mobile text-white fa-2x border-bottom pb-2"></i>
                  <div className="ps-3">
                    <p className="mb-0">
                      (617)-276-8031 <br />
                      (617)-276-8031
                    </p>
                  </div>
                </div>
                <div className="location d-flex align-items-center pe-2 py-3">
                  <i className="fa-solid fa-envelope text-white fa-2x border-bottom pb-2"></i>
                  <div className="ps-3">
                    <p className="mb-0">
                      admin@fooday.com <br />
                      support@fooday.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="reservation-box" data-aos="fade-down-left">
              <div className="reservation-wrapper">
                <h2>Open Hour</h2>
                <div className="reservation-date-time">
                  <p>Tuesday: .......................... 7AM - 9PM</p>
                  <p>Wednesday: ..................... 7AM - 9PM</p>
                  <p>Thursday: ......................... 7AM - 9PM</p>
                  <p>Friday: ............................... 7AM - 9PM</p>
                  <p>Saturday: ........................... 7AM - 9PM</p>
                  <p>Sunday: ............................. 7AM - 9PM</p>
                  <p>Monday: ............................. Close</p>
                </div>
                <h2 className="pb-2">Reservation Numbers</h2>
                <h3>(617)-276-8031</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <p className="text-center pt-4 mt-3 pt-lg-0">
            &copy; {year} <b> Chop Republic.</b> A Flavour Nation. Design by{" "}
            <a
              href="https://www.linkedin.com/in/codewithshabbir/"
              className="fw-bold author-name"
            >
              Muhammad Shabbir
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
