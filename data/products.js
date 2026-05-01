// Foreign products → Indian alternatives.
// Prices are indicative INR ranges (MRP-style); always confirm at point of sale.
// "buy" links use search URLs on well-known Indian retailers — they resolve to a
// search results page so they remain valid even as SKUs change.
window.PRODUCTS = [
  // ----- Smartphones & wearables -----
  {
    id: "p-iphone",
    category: "Electronics",
    foreign: { name: "Apple iPhone", brand: "Apple", country: "US", priceInr: "₹60,000 – ₹2,00,000" },
    indian: [
      { name: "Lava Agni 3", brand: "Lava", priceInr: "₹20,000 – ₹25,000", madeIn: "India (Noida)" },
      { name: "Micromax IN Note", brand: "Micromax", priceInr: "₹10,000 – ₹15,000", madeIn: "India" }
    ],
    notes: "Apple is now assembling iPhones in India (Foxconn/Tata) — a 'Made in India' iPhone reduces import outflow."
  },
  {
    id: "p-galaxy",
    category: "Electronics",
    foreign: { name: "Samsung Galaxy series", brand: "Samsung", country: "KR", priceInr: "₹15,000 – ₹1,50,000" },
    indian: [
      { name: "Lava Agni / Blaze", brand: "Lava", priceInr: "₹12,000 – ₹25,000", madeIn: "India" },
      { name: "Micromax IN 2C", brand: "Micromax", priceInr: "₹7,000 – ₹10,000", madeIn: "India" }
    ],
    notes: "Most Samsungs sold in India are assembled in Noida; choosing Lava puts more value in India's hands."
  },
  {
    id: "p-xiaomi",
    category: "Electronics",
    foreign: { name: "Xiaomi / Redmi / POCO", brand: "Xiaomi", country: "CN", priceInr: "₹8,000 – ₹40,000" },
    indian: [
      { name: "Lava Yuva / Blaze", brand: "Lava", priceInr: "₹7,000 – ₹15,000", madeIn: "India" },
      { name: "Micromax IN series", brand: "Micromax", priceInr: "₹7,000 – ₹13,000", madeIn: "India" }
    ],
    notes: "Direct alternative to a Chinese brand."
  },
  {
    id: "p-applewatch",
    category: "Electronics",
    foreign: { name: "Apple Watch", brand: "Apple", country: "US", priceInr: "₹40,000 – ₹90,000" },
    indian: [
      { name: "Noise ColorFit", brand: "Noise", priceInr: "₹2,000 – ₹6,000", madeIn: "India" },
      { name: "Fire-Boltt Phoenix", brand: "Fire-Boltt", priceInr: "₹1,500 – ₹5,000", madeIn: "India" },
      { name: "boAt Wave", brand: "boAt", priceInr: "₹1,300 – ₹4,000", madeIn: "India" }
    ]
  },
  {
    id: "p-sony-headphones",
    category: "Electronics",
    foreign: { name: "Sony WH/WF series", brand: "Sony", country: "JP", priceInr: "₹3,000 – ₹35,000" },
    indian: [
      { name: "boAt Rockerz / Airdopes", brand: "boAt", priceInr: "₹999 – ₹4,000", madeIn: "India" },
      { name: "Noise Air Buds", brand: "Noise", priceInr: "₹999 – ₹3,500", madeIn: "India" },
      { name: "Mivi DuoPods", brand: "Mivi", priceInr: "₹999 – ₹3,000", madeIn: "India (Hyderabad)" }
    ]
  },
  {
    id: "p-jbl",
    category: "Electronics",
    foreign: { name: "JBL Bluetooth speaker", brand: "JBL (Harman)", country: "US", priceInr: "₹2,500 – ₹25,000" },
    indian: [
      { name: "boAt Stone series", brand: "boAt", priceInr: "₹1,200 – ₹5,000", madeIn: "India" },
      { name: "Mivi Roam", brand: "Mivi", priceInr: "₹999 – ₹3,500", madeIn: "India" }
    ]
  },

  // ----- Apparel & footwear -----
  {
    id: "p-nike",
    category: "Footwear",
    foreign: { name: "Nike running shoes", brand: "Nike", country: "US", priceInr: "₹4,000 – ₹15,000" },
    indian: [
      { name: "Campus Sutra running", brand: "Campus", priceInr: "₹800 – ₹2,500", madeIn: "India" },
      { name: "Bata Power", brand: "Bata India", priceInr: "₹700 – ₹2,000", madeIn: "India" },
      { name: "Relaxo Sparx", brand: "Relaxo", priceInr: "₹600 – ₹1,500", madeIn: "India" }
    ]
  },
  {
    id: "p-adidas",
    category: "Footwear",
    foreign: { name: "Adidas shoes", brand: "Adidas", country: "DE", priceInr: "₹3,500 – ₹15,000" },
    indian: [
      { name: "Campus", brand: "Campus", priceInr: "₹800 – ₹2,500", madeIn: "India" },
      { name: "HRX Active", brand: "HRX", priceInr: "₹1,200 – ₹3,000", madeIn: "India" }
    ]
  },
  {
    id: "p-crocs",
    category: "Footwear",
    foreign: { name: "Crocs clogs", brand: "Crocs", country: "US", priceInr: "₹2,500 – ₹6,000" },
    indian: [
      { name: "Relaxo / Flite", brand: "Relaxo", priceInr: "₹250 – ₹600", madeIn: "India" },
      { name: "Liberty Coolers", brand: "Liberty", priceInr: "₹400 – ₹900", madeIn: "India" },
      { name: "Paragon", brand: "Paragon", priceInr: "₹200 – ₹500", madeIn: "India" }
    ]
  },
  {
    id: "p-levis",
    category: "Apparel",
    foreign: { name: "Levi's jeans", brand: "Levi's", country: "US", priceInr: "₹2,500 – ₹6,000" },
    indian: [
      { name: "Killer Jeans", brand: "Killer (Kewal Kiran)", priceInr: "₹1,200 – ₹2,500", madeIn: "India" },
      { name: "Spykar", brand: "Spykar", priceInr: "₹1,400 – ₹3,000", madeIn: "India" },
      { name: "Mufti", brand: "Mufti", priceInr: "₹1,500 – ₹3,500", madeIn: "India" }
    ]
  },
  {
    id: "p-zara",
    category: "Apparel",
    foreign: { name: "Zara / H&M apparel", brand: "Inditex / H&M", country: "ES", priceInr: "₹1,500 – ₹6,000" },
    indian: [
      { name: "FabIndia", brand: "FabIndia", priceInr: "₹1,000 – ₹5,000", madeIn: "India" },
      { name: "Westside (Tata)", brand: "Trent", priceInr: "₹600 – ₹3,000", madeIn: "India" },
      { name: "W for Woman", brand: "TCNS", priceInr: "₹1,200 – ₹4,000", madeIn: "India" }
    ]
  },

  // ----- FMCG: Food & beverage -----
  {
    id: "p-coke",
    category: "Beverages",
    foreign: { name: "Coca-Cola", brand: "The Coca-Cola Co.", country: "US", priceInr: "₹40 / 750ml" },
    indian: [
      { name: "Campa Cola", brand: "Reliance Consumer", priceInr: "₹10 – ₹20 / 200ml", madeIn: "India" },
      { name: "Sosyo", brand: "Sosyo Hajoori", priceInr: "₹25 / 250ml", madeIn: "India (Surat)" },
      { name: "Bovonto", brand: "Kalimark", priceInr: "₹20 / 200ml", madeIn: "India (Tamil Nadu)" }
    ]
  },
  {
    id: "p-pepsi",
    category: "Beverages",
    foreign: { name: "Pepsi", brand: "PepsiCo", country: "US", priceInr: "₹40 / 750ml" },
    indian: [
      { name: "Campa Cola", brand: "Reliance Consumer", priceInr: "₹10 – ₹20", madeIn: "India" },
      { name: "RC Cola India", brand: "Trinity Beverages", priceInr: "₹15 – ₹25", madeIn: "India" }
    ]
  },
  {
    id: "p-maggi",
    category: "Food",
    foreign: { name: "Maggi noodles", brand: "Nestlé", country: "CH", priceInr: "₹14 / 70g" },
    indian: [
      { name: "Sunfeast YiPPee!", brand: "ITC", priceInr: "₹14 / 70g", madeIn: "India" },
      { name: "Patanjali Atta Noodles", brand: "Patanjali", priceInr: "₹15 / 60g", madeIn: "India" }
    ]
  },
  {
    id: "p-nescafe",
    category: "Beverages",
    foreign: { name: "Nescafé instant coffee", brand: "Nestlé", country: "CH", priceInr: "₹350 / 100g" },
    indian: [
      { name: "Tata Coffee Grand", brand: "Tata Consumer", priceInr: "₹290 / 100g", madeIn: "India" },
      { name: "Continental Xtra", brand: "Continental Coffee", priceInr: "₹280 / 100g", madeIn: "India" }
    ]
  },
  {
    id: "p-lipton",
    category: "Beverages",
    foreign: { name: "Lipton tea", brand: "Unilever (now Ekaterra)", country: "GB", priceInr: "₹250 / 250g" },
    indian: [
      { name: "Tata Tea Premium / Gold", brand: "Tata Consumer", priceInr: "₹160 / 250g", madeIn: "India" },
      { name: "Wagh Bakri", brand: "Wagh Bakri", priceInr: "₹180 / 250g", madeIn: "India (Ahmedabad)" },
      { name: "Society Tea", brand: "Hasmukhrai & Co.", priceInr: "₹170 / 250g", madeIn: "India" }
    ]
  },
  {
    id: "p-kitkat",
    category: "Food",
    foreign: { name: "KitKat / Munch", brand: "Nestlé", country: "CH", priceInr: "₹10 – ₹50" },
    indian: [
      { name: "Amul Dark / Milk Chocolate", brand: "Amul (GCMMF)", priceInr: "₹10 – ₹100", madeIn: "India" },
      { name: "Campco", brand: "Campco", priceInr: "₹10 – ₹80", madeIn: "India (Mangalore)" }
    ]
  },
  {
    id: "p-cadbury",
    category: "Food",
    foreign: { name: "Cadbury Dairy Milk", brand: "Mondelez", country: "GB", priceInr: "₹10 – ₹150" },
    indian: [
      { name: "Amul Milk Chocolate", brand: "Amul", priceInr: "₹10 – ₹120", madeIn: "India" },
      { name: "Campco", brand: "Campco", priceInr: "₹10 – ₹80", madeIn: "India" }
    ]
  },
  {
    id: "p-oreo",
    category: "Food",
    foreign: { name: "Oreo cookies", brand: "Mondelez", country: "US", priceInr: "₹30 / 120g" },
    indian: [
      { name: "Hide & Seek Black Bourbon", brand: "Parle", priceInr: "₹30 / 100g", madeIn: "India" },
      { name: "Britannia Bourbon", brand: "Britannia", priceInr: "₹30 / 100g", madeIn: "India" }
    ]
  },
  {
    id: "p-lays",
    category: "Food",
    foreign: { name: "Lay's chips", brand: "PepsiCo", country: "US", priceInr: "₹20 / 52g" },
    indian: [
      { name: "Balaji Wafers", brand: "Balaji", priceInr: "₹10 – ₹50", madeIn: "India (Rajkot)" },
      { name: "Haldiram's chips", brand: "Haldiram's", priceInr: "₹20 – ₹60", madeIn: "India" },
      { name: "Bikano / Bikaji chips", brand: "Bikaji", priceInr: "₹20 – ₹50", madeIn: "India" }
    ]
  },

  // ----- Personal care -----
  {
    id: "p-colgate",
    category: "Personal care",
    foreign: { name: "Colgate toothpaste", brand: "Colgate-Palmolive", country: "US", priceInr: "₹100 / 200g" },
    indian: [
      { name: "Patanjali Dant Kanti", brand: "Patanjali", priceInr: "₹85 / 200g", madeIn: "India" },
      { name: "Dabur Red Paste", brand: "Dabur", priceInr: "₹95 / 200g", madeIn: "India" },
      { name: "Vicco Vajradanti", brand: "Vicco", priceInr: "₹100 / 200g", madeIn: "India" }
    ]
  },
  {
    id: "p-pantene",
    category: "Personal care",
    foreign: { name: "Pantene / Head & Shoulders", brand: "Procter & Gamble", country: "US", priceInr: "₹250 / 340ml" },
    indian: [
      { name: "Indulekha Bringha", brand: "Indulekha (HUL acquired but Indian-origin)", priceInr: "₹250 / 100ml", madeIn: "India" },
      { name: "Patanjali Kesh Kanti", brand: "Patanjali", priceInr: "₹150 / 200ml", madeIn: "India" },
      { name: "Khadi Natural", brand: "Khadi", priceInr: "₹200 / 210ml", madeIn: "India" }
    ]
  },
  {
    id: "p-dove",
    category: "Personal care",
    foreign: { name: "Dove / Lux soap", brand: "Unilever (HUL)", country: "GB", priceInr: "₹50 – ₹80" },
    indian: [
      { name: "Mysore Sandal Soap", brand: "KSDL (Govt. of Karnataka)", priceInr: "₹60 / 75g", madeIn: "India" },
      { name: "Santoor", brand: "Wipro Consumer", priceInr: "₹40 / 100g", madeIn: "India" },
      { name: "Medimix", brand: "Cholayil", priceInr: "₹45 / 125g", madeIn: "India" }
    ]
  },
  {
    id: "p-gillette",
    category: "Personal care",
    foreign: { name: "Gillette razors", brand: "Procter & Gamble", country: "US", priceInr: "₹150 – ₹600" },
    indian: [
      { name: "LetsShave Pro", brand: "LetsShave", priceInr: "₹150 – ₹500", madeIn: "India (made in India, Korean tech)" },
      { name: "Bombay Shaving Co.", brand: "BSC", priceInr: "₹200 – ₹700", madeIn: "India" }
    ]
  },

  // ----- Home & appliances -----
  {
    id: "p-philips",
    category: "Appliances",
    foreign: { name: "Philips LED bulbs / appliances", brand: "Philips (Signify)", country: "NL", priceInr: "₹150 – ₹2,000" },
    indian: [
      { name: "Havells", brand: "Havells", priceInr: "₹120 – ₹2,000", madeIn: "India" },
      { name: "Bajaj Electricals", brand: "Bajaj", priceInr: "₹100 – ₹1,800", madeIn: "India" },
      { name: "Wipro Lighting", brand: "Wipro", priceInr: "₹110 – ₹1,500", madeIn: "India" }
    ]
  },
  {
    id: "p-bosch",
    category: "Appliances",
    foreign: { name: "Bosch / Whirlpool washing machine", brand: "Bosch / Whirlpool", country: "DE", priceInr: "₹25,000 – ₹70,000" },
    indian: [
      { name: "IFB Washers", brand: "IFB Industries", priceInr: "₹18,000 – ₹50,000", madeIn: "India (Goa)" },
      { name: "Godrej Washing Machines", brand: "Godrej Appliances", priceInr: "₹15,000 – ₹45,000", madeIn: "India" }
    ]
  },
  {
    id: "p-tupperware",
    category: "Home",
    foreign: { name: "Tupperware containers", brand: "Tupperware", country: "US", priceInr: "₹500 – ₹3,000" },
    indian: [
      { name: "Milton Steel/Plastic", brand: "Milton (Hamilton Housewares)", priceInr: "₹150 – ₹1,500", madeIn: "India" },
      { name: "Cello", brand: "Cello World", priceInr: "₹100 – ₹1,200", madeIn: "India" },
      { name: "Borosil glass", brand: "Borosil", priceInr: "₹250 – ₹2,000", madeIn: "India" }
    ]
  },
  {
    id: "p-ikea",
    category: "Home",
    foreign: { name: "IKEA furniture", brand: "IKEA", country: "SE", priceInr: "₹500 – ₹50,000" },
    indian: [
      { name: "Godrej Interio", brand: "Godrej", priceInr: "₹500 – ₹60,000", madeIn: "India" },
      { name: "Pepperfry", brand: "Pepperfry", priceInr: "₹700 – ₹70,000", madeIn: "India" },
      { name: "Nilkamal", brand: "Nilkamal", priceInr: "₹300 – ₹30,000", madeIn: "India" }
    ]
  },

  // ----- Software & services -----
  {
    id: "p-msoffice",
    category: "Software",
    foreign: { name: "Microsoft Office 365", brand: "Microsoft", country: "US", priceInr: "₹4,899 / yr" },
    indian: [
      { name: "Zoho Workplace", brand: "Zoho (Indian)", priceInr: "₹2,400 / user / yr", madeIn: "India (Chennai)" }
    ],
    notes: "Zoho is wholly Indian-owned, profitable, and globally competitive."
  },
  {
    id: "p-whatsapp",
    category: "Software",
    foreign: { name: "WhatsApp", brand: "Meta", country: "US", priceInr: "Free (data costs apply)" },
    indian: [
      { name: "Arattai", brand: "Zoho", priceInr: "Free", madeIn: "India" },
      { name: "Sandes", brand: "Govt. of India / NIC", priceInr: "Free", madeIn: "India" }
    ]
  },
  {
    id: "p-zoom",
    category: "Software",
    foreign: { name: "Zoom video meetings", brand: "Zoom", country: "US", priceInr: "₹1,300 / mo" },
    indian: [
      { name: "Zoho Meeting", brand: "Zoho", priceInr: "₹83 / host / mo", madeIn: "India" },
      { name: "JioMeet", brand: "Reliance Jio", priceInr: "Free", madeIn: "India" }
    ]
  },
  {
    id: "p-uber",
    category: "Services",
    foreign: { name: "Uber rides", brand: "Uber", country: "US", priceInr: "Variable" },
    indian: [
      { name: "Ola", brand: "ANI Technologies", priceInr: "Variable", madeIn: "India (Bengaluru)" },
      { name: "Namma Yatri / Rapido", brand: "Multiple", priceInr: "Variable", madeIn: "India" }
    ]
  },
  {
    id: "p-amazon",
    category: "Services",
    foreign: { name: "Amazon shopping", brand: "Amazon", country: "US", priceInr: "Variable" },
    indian: [
      { name: "Meesho", brand: "Meesho", priceInr: "Variable", madeIn: "India (Bengaluru)" },
      { name: "JioMart", brand: "Reliance Retail", priceInr: "Variable", madeIn: "India" },
      { name: "Snapdeal", brand: "Snapdeal", priceInr: "Variable", madeIn: "India" }
    ]
  }
];
