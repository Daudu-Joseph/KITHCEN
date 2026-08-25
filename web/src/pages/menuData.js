export const menuItemSlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const foodImages = {
  "amala.png": new URL("../../pic/amala.png", import.meta.url).href,
  "amayese.png": new URL("../../pic/amayese.png", import.meta.url).href,
  "asorted stew.png": new URL("../../pic/asorted stew.png", import.meta.url).href,
  "beff.png": new URL("../../pic/beff.png", import.meta.url).href,
  "bitter leaf.png": new URL("../../pic/bitter leaf.png", import.meta.url).href,
  "CHIN CHIN.png": new URL("../../pic/CHIN CHIN.png", import.meta.url).href,
  "chucen pie.png": new URL("../../pic/chucen pie.png", import.meta.url).href,
  "dod and gizzard.png": new URL("../../pic/dod and gizzard.png", import.meta.url).href,
  "drumstick chicken.png": new URL("../../pic/drumstick chicken.png", import.meta.url).href,
  "eba.png": new URL("../../pic/eba.png", import.meta.url).href,
  "edikang ikong.png": new URL("../../pic/edikang ikong.png", import.meta.url).href,
  "efo riro.png": new URL("../../pic/efo riro.png", import.meta.url).href,
  "egusi.png": new URL("../../pic/egusi.png", import.meta.url).href,
  "ewa riro.png": new URL("../../pic/ewa riro.png", import.meta.url).href,
  "ewedu.png": new URL("../../pic/ewedu.png", import.meta.url).href,
  "FISH ROOL.png": new URL("../../pic/FISH ROOL.png", import.meta.url).href,
  "fish pepeer soup.png": new URL("../../pic/fish pepeer soup.png", import.meta.url).href,
  "fish pie.png": new URL("../../pic/fish pie.png", import.meta.url).href,
  "freid fish.png": new URL("../../pic/freid fish.png", import.meta.url).href,
  "freid rice.png": new URL("../../pic/freid rice.png", import.meta.url).href,
  "fufu.png": new URL("../../pic/fufu.png", import.meta.url).href,
  "gizzad stick.png": new URL("../../pic/gizzad stick.png", import.meta.url).href,
  "goat meat pper soup.png": new URL("../../pic/goat meat pper soup.png", import.meta.url).href,
  "hard chicken.png": new URL("../../pic/hard chicken.png", import.meta.url).href,
  "mackrell fish.png": new URL("../../pic/mackrell fish.png", import.meta.url).href,
  "meat pie.png": new URL("../../pic/meat pie.png", import.meta.url).href,
  "meat stick.png": new URL("../../pic/meat stick.png", import.meta.url).href,
  "mixed okra.png": new URL("../../pic/mixed okra.png", import.meta.url).href,
  "moi moi leaf.png": new URL("../../pic/moi moi leaf.png", import.meta.url).href,
  "moi moi plasic.png": new URL("../../pic/moi moi plasic.png", import.meta.url).href,
  "ogbono.png": new URL("../../pic/ogbono.png", import.meta.url).href,
  "oha.png": new URL("../../pic/oha.png", import.meta.url).href,
  "plantain.png": new URL("../../pic/plantain.png", import.meta.url).href,
  "ponmo.png": new URL("../../pic/ponmo.png", import.meta.url).href,
  "pounded yam.png": new URL("../../pic/pounded yam.png", import.meta.url).href,
  "puff puff.png": new URL("../../pic/puff puff.png", import.meta.url).href,
  "red beam.png": new URL("../../pic/red beam.png", import.meta.url).href,
  "rice and beans.png": new URL("../../pic/rice and beans.png", import.meta.url).href,
  "sauaseg rool.png": new URL("../../pic/sauaseg rool.png", import.meta.url).href,
  "tilapia.png": new URL("../../pic/tilapia.png", import.meta.url).href,
  "togolese.png": new URL("../../pic/togolese.png", import.meta.url).href,
  "turkey.png": new URL("../../pic/turkey.png", import.meta.url).href,
  "whte rice.png": new URL("../../pic/whte rice.png", import.meta.url).href,
  "yam porrdage.png": new URL("../../pic/yam porrdage.png", import.meta.url).href,
};

const foodImage = (filename) => foodImages[filename];

export const menuCategories = [
  {
    name: "Starters",
    image: "/assets/images/product-2a.jpg",
    items: [
      { name: "Gizzard Stick", price: "£1.70 per stick", description: "Seasoned gizzard skewers with pepper heat.", image: foodImage("gizzad stick.png") },
      { name: "Suya (Small Takeaway)", price: "£15", description: "Smoky suya spice, sliced and ready to share." },
      { name: "Stick Meat", price: "£1.70 per stick", description: "Grilled meat skewers with Chop Republic seasoning.", image: foodImage("meat stick.png") },
      { name: "Dodo & Gizzard", price: "£180 per tray", description: "Sweet plantain tossed with rich peppered gizzard.", image: foodImage("dod and gizzard.png") },
    ],
  },
  {
    name: "Swallow",
    image: "/assets/images/menu-slider-dessert.png",
    items: [
      { name: "Pounded Yam", price: "£1.50 each", description: "Soft, stretchy swallow made for rich soups.", image: foodImage("pounded yam.png") },
      { name: "Eba", price: "£1.50 each", description: "Classic garri swallow, smooth and filling.", image: foodImage("eba.png") },
      { name: "Amala", price: "£1.50 each", description: "Deep, earthy swallow with proper comfort.", image: foodImage("amala.png") },
      { name: "Fufu", price: "£1.50 each", description: "Traditional swallow, soft and satisfying.", image: foodImage("fufu.png") },
    ],
  },
  {
    name: "Sides",
    image: "/assets/images/about-4.jpg",
    items: [
      { name: "Plantain", price: "£1.50 per portion", description: "Golden fried dodo, sweet at the edge.", image: foodImage("plantain.png") },
      { name: "Moi Moi (Leaf)", price: "£2.50 each", description: "Steamed bean pudding wrapped for extra flavour.", image: foodImage("moi moi leaf.png") },
      { name: "Moi Moi (Plastic)", price: "£2 each", description: "Smooth savoury moi moi, ready with rice or soup.", image: foodImage("moi moi plasic.png") },
    ],
  },
  {
    name: "Peppered Proteins",
    image: "/assets/images/menu-slider-dinner.png",
    items: [
      { name: "Turkey", price: "£250 per cooler", description: "Peppered turkey cooked for trays and parties.", image: foodImage("turkey.png") },
      { name: "Assorted Stew", price: "£90 per 5 litres", description: "Rich assorted stew with deep pepper flavour.", image: foodImage("asorted stew.png") },
      { name: "Beef", price: "£400 per cooler", description: "Tender beef finished with Chop Republic heat.", image: foodImage("beff.png") },
      { name: "Hard Chicken", price: "£300 per cooler", description: "Classic hard chicken in bold pepper sauce.", image: foodImage("hard chicken.png") },
      { name: "Drumstick Chicken", price: "£250 per cooler", description: "Chicken drumsticks with savoury pepper flavour.", image: foodImage("drumstick chicken.png") },
      { name: "Fried Fish", price: "£150 per tray", description: "Crisp fried fish, seasoned and ready to serve.", image: foodImage("freid fish.png") },
      { name: "Mackerel Fish", price: "£130 per tray", description: "Flavourful mackerel with a peppered finish.", image: foodImage("mackrell fish.png") },
      { name: "Ponmo", price: "£100 per tray", description: "Soft ponmo cooked in rich pepper sauce.", image: foodImage("ponmo.png") },
    ],
  },
  {
    name: "Soups",
    image: "/assets/images/bg1_0.jpg",
    items: [
      { name: "Gbegiri", price: "£20 per litre", description: "Smooth bean soup with classic Yoruba flavour." },
      { name: "Bitter Leaf Soup", price: "£90 per 5 litres", description: "Deep, savoury soup with bitter leaf richness.", image: foodImage("bitter leaf.png") },
      { name: "Edikang Ikong", price: "£90 per 5 litres", description: "Leafy, hearty soup packed with flavour.", image: foodImage("edikang ikong.png") },
      { name: "Egusi", price: "£80 per 5 litres", description: "Melon seed soup with a rich savoury base.", image: foodImage("egusi.png") },
      { name: "Mixed Okra Soup", price: "£90 per 5 litres", description: "Okra soup with a generous mixed texture.", image: foodImage("mixed okra.png") },
      { name: "Ogbono Soup", price: "£80 per 5 litres", description: "Silky draw soup, made for swallow.", image: foodImage("ogbono.png") },
      { name: "Oha Soup", price: "£80 per 5 litres", description: "Fragrant oha soup with homestyle depth.", image: foodImage("oha.png") },
      { name: "Efo Riro", price: "£75 per 5 litres", description: "Leafy Yoruba stew cooked rich and aromatic.", image: foodImage("efo riro.png") },
      { name: "Ewedu", price: "£20 per litre", description: "Smooth ewedu, light and perfect with swallow.", image: foodImage("ewedu.png") },
    ],
  },
  {
    name: "Rice Dishes",
    image: "/assets/images/hero-jollof-chicken-transparent.png",
    items: [
      { name: "Jollof Rice", price: "£100 per cooler", description: "Smoky party-style rice with tomato pepper depth." },
      { name: "Fried Rice", price: "£150 per cooler", description: "Colourful savoury rice with vegetables and seasoning.", image: foodImage("freid rice.png") },
      { name: "White Rice", price: "£50 per cooler", description: "Simple, fluffy white rice ready for sauce.", image: foodImage("whte rice.png") },
      { name: "Rice & Beans", price: "£120 per cooler", description: "A hearty classic ready for stew and protein.", image: foodImage("rice and beans.png") },
    ],
  },
  {
    name: "Specials",
    image: "/assets/images/featured-box-bg-1.jpg",
    items: [
      { name: "Ayamase", price: "£70 per 5 litres", description: "Green pepper stew with serious flavour.", image: foodImage("amayese.png") },
      { name: "Yam Porridge", price: "£150 per cooler", description: "Soft yam cooked down into a rich savoury pot.", image: foodImage("yam porrdage.png") },
      { name: "Goat Meat Assorted Pepper Soup", price: "£70 per 5 litres", description: "Warming pepper soup with assorted goat meat.", image: foodImage("goat meat pper soup.png") },
      { name: "Ewa Riro & Sauce", price: "£80 per 5 litres", description: "Stewed beans with a rich companion sauce.", image: foodImage("ewa riro.png") },
      { name: "Togolese Beans & Sauce", price: "£80 per 5 litres", description: "Comforting beans and sauce with big flavour.", image: foodImage("togolese.png") },
      { name: "Red Bream Fish", price: "£180 per tray", description: "Red bream prepared for sharing trays.", image: foodImage("red beam.png") },
      { name: "Grilled Tilapia", price: "£12 each", description: "Whole grilled tilapia with Chop Republic seasoning.", image: foodImage("tilapia.png") },
      { name: "Catfish Pepper Soup", price: "£90 per 5 litres / £15 per catfish", description: "Catfish pepper soup with deep aromatic heat.", image: foodImage("fish pepeer soup.png") },
    ],
  },
  {
    name: "Pastries",
    image: "/assets/images/blog-grid-1.jpg",
    items: [
      { name: "Puff Puff", price: "£80 per cooler", description: "Soft golden bites, sweet and easy to share.", image: foodImage("puff puff.png") },
      { name: "Chicken Pie", price: "£2.50 each", description: "Flaky pastry packed with seasoned chicken filling.", image: foodImage("chucen pie.png") },
      { name: "Meat Pie", price: "£2.50 each", description: "Classic savoury pastry with rich meat filling.", image: foodImage("meat pie.png") },
      { name: "Fish Pie", price: "£2 each", description: "Flaky pastry filled with savoury fish.", image: foodImage("fish pie.png") },
      { name: "Fish Roll", price: "£2 each", description: "Crisp roll with seasoned fish filling.", image: foodImage("FISH ROOL.png") },
      { name: "Sausage Roll", price: "£3 each", description: "Golden pastry wrapped around sausage filling.", image: foodImage("sauaseg rool.png") },
      { name: "Chin Chin", price: "£2", description: "Crunchy sweet bites for snacking.", image: foodImage("CHIN CHIN.png") },
    ],
  },
];
