export default function HomePage() {
  return (
    <main>
      <section className="banner py-5">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-6 banner-content pe-5" data-aos="fade-right" data-aos-delay="0">
              <h1 className="display-2">Good Food.<br />Big Vibes.</h1>
                <p>
                  Discover a variety of freshly prepared meals, crafted to satisfy every craving with rich flavors, premium ingredients, and delightful taste experience for everyone.
                </p>
                <div className="book-a-table">
                  <div className="anim-layer"></div>
                  <a href="#">Book a table</a>
                </div>
            </div>
            <div className="col-md-6 banner-img" data-aos="fade-left" data-aos-delay="0">
              <img className="img img-fluid mt-5 mt-lg-0" src="/assets/images/hero-jollof-chicken-transparent.png" alt="Jollof rice with grilled chicken, plantain, and coleslaw" />
            </div>
          </div>
        </div>
      </section>
      
      <section className="services my-5 py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-md-3">
              <div className="cards px-4 py-5" data-aos="fade-right">
                <div className="anim-layer"></div>
                <div className="icon"> 
                  <i className="fa fa-3x fa-user-tie mb-4"></i>
                </div>
                <div className="heading">
                  <h5>Master Chefs</h5>
                </div>
                <div className="para">
                  <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cards px-4 py-5" data-aos="fade-down">
                <div className="anim-layer"></div>
                <div className="icon">
                  <i className="fa fa-3x fa-utensils mb-4"></i>
                </div>
                <div className="heading">
                  <h5>Quality Food</h5>
                </div>
                <div className="para">
                  <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cards px-4 py-5" data-aos="fade-up">
                <div className="anim-layer"></div>
                <div className="icon">
                  <i className="fa fa-3x fa-cart-plus mb-4"></i>
                </div>
                <div className="heading">
                  <h5>Online Order</h5>
                </div>
                <div className="para">
                  <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="cards px-4 py-5" data-aos="fade-left">
                <div className="anim-layer"></div>
                <div className="icon">
                  <i className="fa fa-3x fa-headset mb-4"></i>
                </div>
                <div className="heading">
                  <h5>24/7 Service</h5>
                </div>
                <div className="para">
                  <p>Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us py-5">
        <div className="container">
          <div className="row gy-5 g-lg-5 align-items-center justify-content-center">
              <div className="col-lg-6 about-img-box" data-aos="fade-right">
                  <div className="about-arch">
                    <img className="img-fluid" src="/assets/images/freshbox-about.avif" alt="Guest smiling with a burger against a red arch background" />
                  </div>
              </div>
              <div className="col-lg-6 about-content" data-aos="fade-left">
                  <p className="about-kicker mb-3"><span></span>About Us</p>
                  <h2 className="mb-4 dis">Exceptional Experience With Premium Quality, Rich Flavors</h2>
                  <p className="about-copy mb-4">
                    We bring together premium ingredients, expert craftmanship, and a passion for flavor, creating unforgettable dining experiences in every bite with rich taste and quality.
                  </p>
                  <div className="about-hours mb-4">
                    <h3>Opening Hours</h3>
                    <p className="mb-1">Mon - Thu: 10:00 AM - 01:00 AM</p>
                    <p className="mb-0">Fri - Sun: 11:00 AM - 10:00 PM</p>
                  </div>
                  <div className="book-a-table">
                    <div className="anim-layer"></div>
                    <a href="/menu">Order Now <i className="fa fa-arrow-right ms-2"></i></a>
                  </div>
              </div>
          </div>
        </div>
      </section>

      <section className="our-menu py-5 my-5">
        <div className="container">
          <div className="row" data-aos="fade-right">
            <div className="section-title text-center">
              <h5>Our Menu</h5>
              <h2 className="display-5 fw-bold">Tasty And Good Price</h2>
            </div>
          </div>
          <div className="row  position-relative">
            <div data-aos="fade-left" className="slider slider-indicators-wrapper justify-content-center">
              <div className="slider-indicators">
                <div className="indicators-icon active text-center">
                  <i className="fas fa-coffee fa-2x"></i>
                </div>
                <div className="indicators-title text-center">
                  <h5>
                    Breakfast
                  </h5>
                </div>
              </div>
              <div className="slider-indicators">
                <div className="indicators-icon text-center">
                  <i className="fas fa-utensils fa-2x"></i>
                </div>
                <div className="indicators-title text-center">
                  <h5>
                    Lunch
                  </h5>
                </div>
              </div>
              <div className="slider-indicators">
                <div className="indicators-icon text-center">
                  <i className="fas fa-hamburger fa-2x"></i>
                </div>
                <div className="indicators-title text-center">
                  <h5>
                    Dinner
                  </h5>
                </div>
              </div>
              <div className="slider-indicators">
                <div className="indicators-icon text-center">
                  <i className="fas fa-ice-cream fa-2x"></i>
                </div>
                <div className="indicators-title text-center">
                  <h5>
                    Desserts
                  </h5>
                </div>
              </div>
              <div className="slider-indicators">
                <div className="indicators-icon text-center">
                  <i className="fas fa-cocktail fa-2x"></i>
                </div>
                <div className="indicators-title text-center">
                  <h5>
                    Drink
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <div id="our-menus" className="slider" data-aos="fade-up">
            <div>
              <div className="row my-5 py-3">
              <div className="col-lg-5">
                <div className="pb-5 pb-lg-0">
                  <img width="90%" src="/assets/images/menu-slider-dessert.png" alt="" />
                </div>
              </div>
              <div className="col-lg-7">
                <div className="item-wrapper d-flex justify-content-between">
                  <div className="item-left">
                    <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                  </div>
                  <div className="item-right">
                    <span className="item-price">
                    <span className="price-symbol">$</span>
                      25.0</span>
                    <div className="item-btn">
                      <a href="#">Order</a>
                    </div>
                  </div>
                </div>
                <div className="item-wrapper d-flex justify-content-between">
                  <div className="item-left">
                    <h5>Uncle Herschel's Favorite</h5>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                  </div>
                  <div className="item-right">
                    <span className="item-price">
                    <span className="price-symbol">$</span>
                      45.0</span>
                    <div className="item-btn">
                      <a href="#">Order</a>
                    </div>
                  </div>
                </div>
                <div className="item-wrapper d-flex justify-content-between">
                  <div className="item-left">
                    <h5>Grandpa's Country Fried Breakfast</h5>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                  </div>
                  <div className="item-right">
                    <span className="item-price">
                    <span className="price-symbol">$</span>
                      30.0</span>
                    <div className="item-btn">
                      <a href="#">Order</a>
                    </div>
                  </div>
                </div>
                <div className="item-wrapper d-flex justify-content-between">
                  <div className="item-left">
                    <h5>Old Timer's Meat Breakfast</h5>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                  </div>
                  <div className="item-right">
                    <span className="item-price">
                    <span className="price-symbol">$</span>
                      12.0</span>
                    <div className="item-btn">
                      <a href="#">Order</a>
                    </div>
                  </div>
                </div>
                <div className="item-wrapper d-flex justify-content-between">
                  <div className="item-left">
                    <h5>Chinese Chicken Bread Spicy Soup</h5>
                    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                  </div>
                  <div className="item-right">
                    <span className="item-price">
                    <span className="price-symbol">$</span>
                      12.0</span>
                    <div className="item-btn">
                      <a href="#">Order</a>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div>
              <div className="row my-5 py-3 ">
                <div className="col-lg-5">
                  <div className="pb-5 pb-lg-0">
                    <img width="90%" src="/assets/images/menu-slider-dinner.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        25.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Uncle Herschel's Favorite</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        45.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Grandpa's Country Fried Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        30.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Old Timer's Meat Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Chinese Chicken Bread Spicy Soup</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row my-5 py-3 ">
                <div className="col-lg-5">
                  <div className="pb-5 pb-lg-0">
                    <img width="90%" src="/assets/images/menu-slider-dessert.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        25.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Uncle Herschel's Favorite</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        45.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Grandpa's Country Fried Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        30.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Old Timer's Meat Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Chinese Chicken Bread Spicy Soup</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="row my-5 py-3 ">
                <div className="col-lg-5">
                  <div className="pb-5 pb-lg-0">
                    <img width="90%" src="/assets/images/menu-slider-lunch.png" alt="" />
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        25.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Uncle Herschel's Favorite</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        45.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Grandpa's Country Fried Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        30.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Old Timer's Meat Breakfast</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left">
                      <h5>Chinese Chicken Bread Spicy Soup</h5>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                      <div className="item-btn">
                        <a href="#">Order</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials py-5 my-5">
        <div className="container py-5">
          <div className="row" data-aos="fade-right">
            <div className="section-title text-center">
              <h5>Testimonial</h5>
              <h2 className="display-5 fw-bold">Our Customer Says</h2>
            </div>
          </div>
          <div className="row">
            <div className="testimonial-slider-wrapper" data-aos="fade-up">
              <div className="slider-content pt-4 pb-4 mx-4">
                <div>
                  <div className="testi-content">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto vel ipsa dolore sunt vitae, culpa, dolor reiciendis facilis sed blanditiis repellat incidunt impedit iusto? Odio veniam beatae veritatis adipisci a!</p>
                  </div>
                  <div className="testi-info">
                    <span className="name">Timothy Doe</span>
                    <span className="position">Customer</span>
                  </div>
                </div>
                <div>
                  <div className="testi-content">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto vel ipsa dolore sunt vitae, culpa, dolor reiciendis facilis sed blanditiis repellat incidunt impedit iusto? Odio veniam beatae veritatis adipisci a!</p>
                  </div>
                  <div className="testi-info">
                    <span className="name">Sarah	Ruiz</span>
                    <span className="position">Director</span>
                  </div>
                </div>
                <div>
                  <div className="testi-content">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto vel ipsa dolore sunt vitae, culpa, dolor reiciendis facilis sed blanditiis repellat incidunt impedit iusto? Odio veniam beatae veritatis adipisci a!</p>
                  </div>
                  <div className="testi-info">
                    <span className="name">Tracey Lewis</span>
                    <span className="position">Designer</span>
                  </div>
                </div>
                <div>
                  <div className="testi-content">
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto vel ipsa dolore sunt vitae, culpa, dolor reiciendis facilis sed blanditiis repellat incidunt impedit iusto? Odio veniam beatae veritatis adipisci a!</p>
                  </div>
                  <div className="testi-info">
                    <span className="name">Jamie	Erickson</span>
                    <span className="position">Manager</span>
                  </div>
                </div>
              </div>
              <div className="slider-nav-wrapper mx-5">
                <div className="slider-nav">
                  <div className="slider-nav-img active">
                    <img src="/assets/images/testi-1.jpg" alt="" />
                  </div>
                  <div className="slider-nav-img">
                    <img src="/assets/images/testi-2.jpg" alt="" />
                  </div>
                  <div className="slider-nav-img">
                    <img src="/assets/images/testi-3.jpg" alt="" />
                  </div>
                  <div className="slider-nav-img">
                    <img src="/assets/images/testi-4.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-chefs py-5">
        <div className="container">
          <div className="row" data-aos="fade-right">
            <div className="section-title text-center">
              <h5>Meet Our</h5>
              <h2 className="display-6 fw-bold">Awesome Master Chefs</h2>
            </div>
          </div>

          <div className="row our-chef-slider-wrapper py-5" data-aos="fade-left">
            <div className="col-lg-4">
              <div className="our-chef-slider d-flex flex-column align-items-center gap-4">
                <img width="200px" src="/assets/images/team-1.png" alt="" />
                <div className="chef-slider-content">
                  <h5 className="text-center d-block">Teresa Doe</h5>
                  <p className="text-center mb-0">Head Chef</p>
                  <div className="d-flex justify-content-center">
                    <hr className="w-25 my-2" />
                  </div> 
                  <ul className="list-unstyled d-flex justify-content-center">
                    <li className="mx-2">
                      <a href="https://www.facebook.com" target="_blank" className="text-white">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.instagram.com" target="_blank" className="text-white">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.twitter.com" target="_blank" className="text-white">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.linkedin.com" target="_blank" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="our-chef-slider d-flex flex-column align-items-center gap-4">
                <img width="200px" src="/assets/images/team-2.png" alt="" />
                <div className="chef-slider-content">
                  <h5 className="text-center d-block">Teresa Doe</h5>
                  <p className="text-center mb-0">Head Chef</p>
                  <div className="d-flex justify-content-center">
                    <hr className="w-25 my-2" />
                  </div> 
                  <ul className="list-unstyled d-flex justify-content-center">
                    <li className="mx-2">
                      <a href="https://www.facebook.com" target="_blank" className="text-white">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.instagram.com" target="_blank" className="text-white">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.twitter.com" target="_blank" className="text-white">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.linkedin.com" target="_blank" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="our-chef-slider d-flex flex-column align-items-center gap-4">
                <img width="200px" src="/assets/images/team-3.png" alt="" />
                <div className="chef-slider-content">
                  <h5 className="text-center d-block">Teresa Doe</h5>
                  <p className="text-center mb-0">Head Chef</p>
                  <div className="d-flex justify-content-center">
                    <hr className="w-25 my-2" />
                  </div> 
                  <ul className="list-unstyled d-flex justify-content-center">
                    <li className="mx-2">
                      <a href="https://www.facebook.com" target="_blank" className="text-white">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.instagram.com" target="_blank" className="text-white">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.twitter.com" target="_blank" className="text-white">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.linkedin.com" target="_blank" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="our-chef-slider d-flex flex-column align-items-center gap-4">
                <img width="200px" src="/assets/images/team-4.png" alt="" />
                <div className="chef-slider-content">
                  <h5 className="text-center d-block">Teresa Doe</h5>
                  <p className="text-center mb-0">Head Chef</p>
                  <div className="d-flex justify-content-center">
                    <hr className="w-25 my-2" />
                  </div> 
                  <ul className="list-unstyled d-flex justify-content-center">
                    <li className="mx-2">
                      <a href="https://www.facebook.com" target="_blank" className="text-white">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.instagram.com" target="_blank" className="text-white">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.twitter.com" target="_blank" className="text-white">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li className="mx-2">
                      <a href="https://www.linkedin.com" target="_blank" className="text-white">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>
      
      <section className="reservation">
        <img className="d-md-none d-lg-block" src="/assets/images/find-a-table.png" alt="" />
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 py-5 reservation-content px-5" data-aos="fade-right">
              <div className="reservation-column py-5 px-3">
                <h2 className="text-center text-white display-6 fw-bold">Make A Reservation</h2>
                <p className="text-center text-white">You can call us directly at <span>225-88888</span></p>
                <div className="row mt-5 pt-3">
                  <div className="col-12 col-lg-6">
                    <div className="input d-flex align-items-center">
                      <i className="fa fa-phone py-2 px-3"></i>
                      <input className="form-control bg-transparent border-0 px-3" type="text" placeholder="Number" />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-4 mt-lg-0">
                    <div className="input d-flex align-items-center">
                      <i className="fa fa-person py-2 px-3"></i>
                      <select className="form-select bg-transparent border-0" name="" id="">
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
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-12 col-lg-6">
                    <div className="input d-flex align-items-center">
                      <i className="fa fa-calendar py-2 px-3"></i>
                      <input className="form-control datepicker bg-transparent border-0 px-3" type="date" placeholder="Number" />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 mt-4 mt-lg-0">
                    <div className="input d-flex align-items-center">
                      <i className="fa fa-clock py-2 px-3"></i>
                      <select type="text" placeholder="Time" className="form-select bg-transparent border-0">
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
                <div className="d-flex justify-content-center mt-5 pt-3">
                  <div className="book-a-table">
                    <div className="anim-layer"></div>
                    <a href="#">Find Table</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-md-block reservation-bg" data-aos="fade-left"></div>
          </div>
        </div>
      </section>

      <section className="our-services py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="section-title text-center" data-aos="fade-right">
              <h5>Our Service</h5>
              <h2 className="display-6 fw-bold">What We Focus On</h2>
            </div>
          </div>
          <div className="row pt-5">
            <div data-aos="fade-up-right" className="col-sm-12 col-md-6 col-lg-3 d-flex justify-content-center align-items-center flex-column">
              <div className="icon-box">
                <i className="fas fa-utensils fa-2x"></i>
                <span className="number">1</span>
              </div>
              <h4>Reservation</h4>
              <p className="text-center">Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et</p>
            </div>
            <div data-aos="fade-down" className="col-sm-12 col-md-6 col-lg-3 d-flex justify-content-center align-items-center flex-column">
              <div className="icon-box">
                <i className="fas fa-wine-glass-alt fa-2x"></i>
                <span className="number">2</span>
              </div>
              <h4>Private Event</h4>
              <p className="text-center">Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et</p>
            </div>
            <div data-aos="fade-up" className="col-sm-12 col-md-6 col-lg-3 d-flex justify-content-center align-items-center flex-column">
              <div className="icon-box">
                <i className="fas fa-laptop-house fa-2x"></i>
                <span className="number">3</span>
              </div>
              <h4>Online Order</h4>
              <p className="text-center">Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et</p>
            </div>
            <div data-aos="fade-up-left" className="col-sm-12 col-md-6 col-lg-3 d-flex justify-content-center align-items-center flex-column">
              <div className="icon-box">
                <i className="fas fa-motorcycle fa-2x"></i>
                <span className="number">4</span>
              </div>
              <h4>Fast Delivery</h4>
              <p className="text-center">Lorem ipsum dolor sit amet, tong consecteturto sed eiusmod incididunt utote labore et</p>
            </div>
          </div>
        </div>
      </section>

      <section className="our-gallery pt-5">
        <div className="container-fluid pt-5">
          <div className="row">
            <div className="section-title text-center" data-aos="fade-right">
              <h5>Our Gallery</h5>
              <h2 className="text-white display-6 fw-bold">Fooday Hot Dishes</h2>
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-md-3 p-0">
              <div data-aos="fade-down-right" className="gallery-image gallery-image-one"></div>
            </div>
            <div className="col-md-6 p-0">
              <div className="row m-0">
                <div className="col-md-8 p-0">
                  <div data-aos="fade-down" className="gallery-image-two"></div>
                </div>
                <div className="col-md-4 p-0">
                  <div data-aos="fade-down" className="gallery-image-three"></div>
                </div>
              </div>
              <div className="row m-0">
                <div className="col-md-4 p-0">
                  <div data-aos="fade-up" className="gallery-image-five"></div>
                </div>
                <div className="col-md-8 p-0">
                  <div data-aos="fade-up" className="gallery-image-six"></div>
                </div>
              </div>
            </div>
            <div className="col-md-3 p-0">
              <div data-aos="fade-up-left" className="gallery-image gallery-image-four"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="our-blog pt-5 my-5">
        <div className="container">
          <div className="row">
            <div className="section-title text-center" data-aos="fade-right">
              <h5>Updated from</h5>
              <h2 className="display-6 fw-bold">Our Featured Blog</h2>
            </div>
          </div>
          <div className="row pt-5">
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="card" data-aos="fade-up-right">
                <div className="blog-info d-flex py-3">
                  <div className="blog-view px-3">
                    <i className="fas fa-eye"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-comment px-3">
                    <i className="fas fa-comment"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-author">
                    <p className="mb-0 ps-3">Post By Admin</p>
                  </div>
                </div>
                <div className="blog-featured-img">
                  <img className="w-100" src="/assets/images/blog-grid-1.jpg" alt="" />
                </div>
                <div className="blog-content px-4 pt-5 pb-4 position-relative">
                  <div className="blog-date">
                    <span className="day">12</span>
                    <span className="month">Jun</span>
                  </div>
                  <h3 className="blog-title">
                    <a href="javascript:void(0)">How To Cook The Spicy Chinese Noodle For Cold Weather</a>
                  </h3>
                  <p className="blog-description">
                    Lorem ipsum dolor sit amet, consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="blog-readmore text-end">
                    <a className="text-black text-decoration-none" href="javascript:void(0)">
                        Read More 
                        <i className="fa fa-angle-double-right">
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="card" data-aos="fade-down">
                <div className="blog-info d-flex py-3">
                  <div className="blog-view px-3">
                    <i className="fas fa-eye"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-comment px-3">
                    <i className="fas fa-comment"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-author">
                    <p className="mb-0 ps-3">Post By Admin</p>
                  </div>
                </div>
                <div className="blog-featured-img">
                  <img className="w-100" src="/assets/images/blog-grid-1-1.jpg" alt="" />
                </div>
                <div className="blog-content px-4 pt-5 pb-4 position-relative">
                  <div className="blog-date">
                    <span className="day">12</span>
                    <span className="month">Jun</span>
                  </div>
                  <h3 className="blog-title">
                    <a href="javascript:void(0)">How To Cook The Spicy Chinese Noodle For Cold Weather</a>
                  </h3>
                  <p className="blog-description">
                    Lorem ipsum dolor sit amet, consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="blog-readmore text-end">
                    <a className="text-black text-decoration-none" href="javascript:void(0)">
                        Read More 
                        <i className="fa fa-angle-double-right">
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-5 mb-lg-0">
              <div className="card" data-aos="fade-up-left">
                <div className="blog-info d-flex py-3">
                  <div className="blog-view px-3">
                    <i className="fas fa-eye"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-comment px-3">
                    <i className="fas fa-comment"></i>
                    <span>18</span>
                  </div>
                  <div className="blog-author">
                    <p className="mb-0 ps-3">Post By Admin</p>
                  </div>
                </div>
                <div className="blog-featured-img">
                  <img className="w-100" src="/assets/images/blog-grid-1-2.jpg" alt="" />
                </div>
                <div className="blog-content px-4 pt-5 pb-4 position-relative">
                  <div className="blog-date">
                    <span className="day">12</span>
                    <span className="month">Jun</span>
                  </div>
                  <h3 className="blog-title">
                    <a href="javascript:void(0)">How To Cook The Spicy Chinese Noodle For Cold Weather</a>
                  </h3>
                  <p className="blog-description">
                    Lorem ipsum dolor sit amet, consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <div className="blog-readmore text-end">
                    <a className="text-black text-decoration-none" href="javascript:void(0)">
                        Read More 
                        <i className="fa fa-angle-double-right">
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="row pt-5">
          
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
