export default function MenuPage() {
  return (
    <main className="menu-page">
        <section className="page-banner d-flex align-items-center">
          <div className="container"> 
            <div className="row">
              <div className="banner-content">
                <h2 className="text-white display-3 text-center" data-aos="fade-right" data-aos-delay="0">Menu</h2>
                <div className="divider" data-aos="fade-up-right" data-aos-delay="0">
                    <div className="dot mb-2"></div>
                </div>
                <p className="text-center">The various dishes are waiting for your coming to enjoy its</p>
            </div>
            </div>
          </div>
        </section>

        <section className="our-menu pt-5 my-5">
            <div className="container">
                <div className="row" data-aos="fade-right">
                    <h2 className="text-center display-6 fw-bold">Breakfast Time</h2>
                    <div className="menu-line d-flex justify-content-center align-items-center">
                        <span></span>
                    </div>
                </div>
              <div className="row  position-relative" data-aos="fade-left">
                <div className="slider slider-indicators-wrapper justify-content-center">
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

        <section className="chef-choise pt-3 pb-5">
          <div className="container py-5">
            <div className="row" data-aos="fade-right">
              <div className="section-title text-center pb-5">
                <h5>Chef Choice</h5>
                <h2 className="text-white display-6 fw-bold">Daily Special</h2>
              </div>
            </div>
            <div className="row">
              <div className="d-none d-lg-block col-lg-6" data-aos="fade-right">
                <img className="img-fluid" src="/assets/images/product-decorate.jpg" alt="" />
              </div>
              <div className="col-12 col-lg-6" data-aos="fade-left">
                <div className="chef-choise-slider ps-3">
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left d-flex flex-row">
                      <img className="rounded-circle" src="/assets/images/product-2a.jpg" width="70px" height="70px" alt="" />
                      <div className="ps-3">
                        <h5 className="text-white">The Cracker Barrel's Country Boy Breakfast</h5>
                        <p className="mb-0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        25.0</span>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left d-flex flex-row">
                      <img className="rounded-circle" src="/assets/images/product-2b.jpg" width="70px" height="70px" alt="" />
                      <div className="ps-3">
                        <h5 className="text-white">Uncle Herschel's Favorite</h5>
                        <p className="mb-0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        45.0</span>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left d-flex flex-row">
                      <img className="rounded-circle" src="/assets/images/product-2c.jpg" width="70px" height="70px" alt="" />
                      <div className="ps-3">
                        <h5 className="text-white">Grandpa's Country Fried Breakfast</h5>
                        <p className="mb-0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        30.0</span>
                    </div>
                  </div>
                  <div className="item-wrapper d-flex justify-content-between">
                    <div className="item-left d-flex flex-row">
                      <img className="rounded-circle" src="/assets/images/product-2d.jpg" width="70px" height="70px" alt="" />
                      <div className="ps-3">
                        <h5 className="text-white">Old Timer's Meat Breakfast</h5>
                        <p className="mb-0">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="item-price">
                      <span className="price-symbol">$</span>
                        12.0</span>
                    </div>
                  </div>
                </div>
                  <div className="chef-choise-icons ps-4 mt-3 mt-lg-0">
                    <i className="fa fa-chevron-up" aria-hidden="true"></i>
                    <i className="fa fa-chevron-down ms-4" aria-hidden="true"></i>
                  </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lunch-time my-5 pb-0 pb-lg-5">
            <div className="container">
                <div className="row" data-aos="fade-right">
                    <h2 className="text-center display-6 fw-bold">Lunch Time</h2>
                    <div className="menu-line d-flex justify-content-center align-items-center">
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6" data-aos="fade-right">
                        <div className="item-wrapper d-flex justify-content-between">
                          <div className="item-left">
                            <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                          </div>
                          <div className="item-right">
                            <span className="item-price">
                            <span className="price-symbol">$</span>
                              25.0</span>
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
                          </div>
                        </div>
                    </div>
                    <div className="col-lg-6" data-aos="fade-left">
                      <div className="item-wrapper d-flex justify-content-between">
                        <div className="item-left">
                          <h5>The Cracker Barrel's Country Boy Breakfast</h5>
                          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum </p>
                        </div>
                        <div className="item-right">
                          <span className="item-price">
                          <span className="price-symbol">$</span>
                            25.0</span>
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
                        </div>
                      </div>
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
