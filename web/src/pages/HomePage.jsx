const menuPreviewCategories = [
  {
    name: "Starters",
    icon: "fa-utensils",
    image: "/assets/images/menu-slider-lunch.png",
    items: [
      { name: "Gizzard Stick", description: "Seasoned gizzard skewers with proper pepper heat.", price: "£1.70 per stick" },
      { name: "Suya (Small Takeaway)", description: "Smoky spiced beef, sliced and ready for sharing.", price: "£15" },
      { name: "Stick Meat", description: "Peppered meat skewers with deep grilled flavour.", price: "£1.70 per stick" },
    ],
  },
  {
    name: "Swallow",
    customIcon: "swallow-ball",
    image: "/assets/images/menu-slider-dessert.png",
    items: [
      { name: "Pounded Yam", description: "Soft, stretchy swallow made for rich soups.", price: "£1.50 each" },
      { name: "Eba", description: "Classic garri swallow, smooth and filling.", price: "£1.50 each" },
      { name: "Amala", description: "Deep, earthy swallow with true Naija comfort.", price: "£1.50 each" },
    ],
  },
  {
    name: "Sides",
    customIcon: "meat-skewer",
    image: "/assets/images/menu-slider-lunch.png",
    items: [
      { name: "Plantain", description: "Golden fried dodo, sweet at the edge.", price: "£1.50 per portion" },
      { name: "Moi Moi (Leaf)", description: "Steamed bean pudding wrapped for extra flavour.", price: "£2.50 each" },
      { name: "Moi Moi (Plastic)", description: "Smooth savoury moi moi, ready with rice or soup.", price: "£2 each" },
    ],
  },
  {
    name: "Peppered Proteins",
    icon: "fa-drumstick-bite",
    image: "/assets/images/menu-slider-dinner.png",
    items: [
      { name: "Turkey", description: "Peppered turkey cooked for trays and parties.", price: "£250 per cooler" },
      { name: "Beef", description: "Rich beef pieces finished with Chop Republic heat.", price: "£400 per cooler" },
      { name: "Drumstick Chicken", description: "Chicken drumsticks with bold pepper flavour.", price: "£250 per cooler" },
    ],
  },
  {
    name: "Soups",
    icon: "fa-bowl-food",
    image: "/assets/images/menu-slider-dessert.png",
    items: [
      { name: "Egusi", description: "Melon seed soup with deep savoury flavour.", price: "£80 per 5 litres" },
      { name: "Efo Riro", description: "Leafy Yoruba stew cooked rich and aromatic.", price: "£75 per 5 litres" },
      { name: "Ogbono Soup", description: "Silky draw soup, made for swallow.", price: "£80 per 5 litres" },
    ],
  },
  {
    name: "Rice Dishes",
    icon: "fa-bowl-rice",
    image: "/assets/images/hero-jollof-chicken-transparent.png",
    items: [
      { name: "Jollof Rice", description: "Smoky party-style rice with tomato pepper depth.", price: "£100 per cooler" },
      { name: "Fried Rice", description: "Colourful savoury rice with vegetables and seasoning.", price: "£150 per cooler" },
      { name: "Rice & Beans", description: "A hearty classic ready for stew and protein.", price: "£120 per cooler" },
    ],
  },
  {
    name: "Specials",
    icon: "fa-crown",
    image: "/assets/images/menu-slider-dinner.png",
    items: [
      { name: "Ayamase", description: "Green pepper stew with serious flavour.", price: "£70 per 5 litres" },
      { name: "Yam Porridge", description: "Soft yam cooked down into a rich savoury pot.", price: "£150 per cooler" },
      { name: "Grilled Tilapia", description: "Whole grilled tilapia with Chop Republic seasoning.", price: "£12 each" },
    ],
  },
  {
    name: "Pastries",
    icon: "fa-cookie-bite",
    image: "/assets/images/menu-slider-dessert.png",
    items: [
      { name: "Puff Puff", description: "Soft golden bites, sweet and easy to share.", price: "£80 per cooler" },
      { name: "Chicken Pie", description: "Flaky pastry packed with seasoned chicken filling.", price: "£2.50 each" },
      { name: "Meat Pie", description: "Classic savoury pastry with rich meat filling.", price: "£2.50 each" },
    ],
  },
];

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
                  <h2 className="mb-4 dis">
                    Exceptional Experience With Premium Quality,
                    <br />
                    Rich Flavors
                  </h2>
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
                    <a href="/about">More About Us <i className="fa fa-arrow-right ms-2"></i></a>
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
              <h2 className="display-5 fw-bold">Popular From The Menu</h2>
            </div>
          </div>
          <div className="row position-relative">
            <div data-aos="fade-left" className="slider slider-indicators-wrapper justify-content-center">
              {menuPreviewCategories.map((category, index) => (
                <div className="slider-indicators" key={category.name}>
                  <div className={`indicators-icon ${index === 0 ? "active " : ""}text-center`}>
                    {category.customIcon ? (
                      <span className={`menu-category-icon ${category.customIcon}`}></span>
                    ) : (
                      <i className={`fas ${category.icon} fa-2x`}></i>
                    )}
                  </div>
                  <div className="indicators-title text-center">
                    <h5>{category.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div id="our-menus" className="slider" data-aos="fade-up">
            {menuPreviewCategories.map((category) => (
              <div key={category.name}>
                <div className="row my-5 py-3 align-items-center">
                  <div className="col-lg-5">
                    <div className="menu-preview-image pb-5 pb-lg-0">
                      <img src={category.image} alt={`${category.name} preview`} />
                    </div>
                  </div>
                  <div className="col-lg-7">
                    {category.items.map((item) => (
                      <div className="item-wrapper d-flex justify-content-between" key={item.name}>
                        <div className="item-left">
                          <h5>{item.name}</h5>
                          <p>{item.description}</p>
                        </div>
                        <div className="item-right">
                          <span className="item-price">{item.price}</span>
                        </div>
                      </div>
                    ))}
                    <div className="menu-preview-action">
                      <div className="book-a-table menu-leaf-button">
                        <div className="anim-layer"></div>
                        <a href="/menu">
                          View Full Menu <i className="fa fa-arrow-right ms-2"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="services home-menu-services py-4">
        <div className="container">
          <div className="row">
            <div className="services-heading text-center">
              <p><span></span>Why Choose Us</p>
              <h2>Loved By Food Lovers</h2>
              <h3>
                We combine quality ingredients, expert cooking, and exceptional service to deliver
                an unforgettable dining experience.
              </h3>
            </div>
          </div>
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
                  <p>Our cooks bring proper seasoning, skill, and care to every Chop Republic order.</p>
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
                  <p>Fresh ingredients and bold flavour make every tray, soup, side, and snack stand out.</p>
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
                  <p>Browse the menu, add your favourites, and place your order quickly from anywhere.</p>
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
                  <p>Need help with an order? We are ready to respond and guide you through WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials py-5">
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

      <section className="our-chefs py-4">
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

      <section className="home-faq py-5">
        <div className="container">
          <div className="home-faq-layout">
            <div className="home-faq-intro">
              <p><span></span>FAQ</p>
              <h2>Frequently Asked Questions</h2>
              <h3>
                Got questions? We've got quick answers to help you order, pay, and enjoy your food
                with confidence.
              </h3>
            </div>

            <div className="home-faq-list" aria-label="Frequently asked questions">
              <details className="home-faq-item">
                <summary>How do I place an order?</summary>
                <p>
                  Add your meals to the cart, enter your phone number and address, then place the
                  order. We'll contact you on WhatsApp to validate it and confirm payment.
                </p>
              </details>
              <details className="home-faq-item">
                <summary>How long does delivery take?</summary>
                <p>
                  Delivery time depends on your location and order size. Once your order is
                  validated on WhatsApp, we'll share the estimated arrival time.
                </p>
              </details>
              <details className="home-faq-item">
                <summary>Do you offer catering or bulk orders?</summary>
                <p>
                  Yes. We prepare trays, coolers, soups, proteins, pastries, and party portions for
                  events. Send your request through the contact page or WhatsApp checkout.
                </p>
              </details>
              <details className="home-faq-item">
                <summary>Can I add a note to my order?</summary>
                <p>
                  Yes. Use the order note box at checkout for delivery instructions, spice
                  preference, timing, or anything we should confirm before preparing your food.
                </p>
              </details>
              <details className="home-faq-item">
                <summary>What if the food I search for is not available?</summary>
                <p>
                  The search will let you know we don't have that item and then show other meals
                  from our menu that you can try instead.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
