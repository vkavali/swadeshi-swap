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
  },

  // ----- More Electronics -----
  {
    id: "p-laptop-hp",
    category: "Electronics",
    foreign: { name: "HP / Dell / Lenovo laptop", brand: "HP / Dell / Lenovo", country: "US", priceInr: "₹40,000 – ₹1,50,000" },
    indian: [
      { name: "Primebook 4G", brand: "Primebook", priceInr: "₹15,000 – ₹25,000", madeIn: "India" },
      { name: "Wings Nuvobook", brand: "Wings", priceInr: "₹25,000 – ₹40,000", madeIn: "India" }
    ],
    notes: "Indian laptop OEMs are early but growing under PLI. Most global brands now also assemble in India."
  },
  {
    id: "p-tv-lg",
    category: "Electronics",
    foreign: { name: "LG / Samsung TV", brand: "LG / Samsung", country: "KR", priceInr: "₹25,000 – ₹2,00,000" },
    indian: [
      { name: "Onida Smart TV", brand: "Onida (MIRC Electronics)", priceInr: "₹15,000 – ₹50,000", madeIn: "India" },
      { name: "BPL TV", brand: "BPL", priceInr: "₹12,000 – ₹40,000", madeIn: "India" }
    ]
  },
  {
    id: "p-camera",
    category: "Electronics",
    foreign: { name: "Canon / Nikon DSLR", brand: "Canon / Nikon", country: "JP", priceInr: "₹40,000 – ₹2,50,000" },
    indian: [
      { name: "Smartphone w/ Indian brand (Lava Agni 3)", brand: "Lava", priceInr: "₹20,000 – ₹25,000", madeIn: "India" }
    ],
    notes: "No mainstream Indian camera OEM. For most users, a flagship Indian-brand smartphone now matches DSLR for casual use."
  },
  {
    id: "p-dyson",
    category: "Appliances",
    foreign: { name: "Dyson vacuum / fan", brand: "Dyson", country: "GB", priceInr: "₹25,000 – ₹70,000" },
    indian: [
      { name: "Eureka Forbes vacuum", brand: "Eureka Forbes", priceInr: "₹6,000 – ₹25,000", madeIn: "India" },
      { name: "Atomberg fan", brand: "Atomberg", priceInr: "₹3,500 – ₹8,000", madeIn: "India" }
    ]
  },
  {
    id: "p-roomba",
    category: "Appliances",
    foreign: { name: "iRobot Roomba", brand: "iRobot", country: "US", priceInr: "₹25,000 – ₹80,000" },
    indian: [
      { name: "Milagrow robot vacuum", brand: "Milagrow", priceInr: "₹12,000 – ₹40,000", madeIn: "India" }
    ]
  },

  // ----- Cars -----
  {
    id: "p-toyota",
    category: "Automotive",
    foreign: { name: "Toyota / Honda sedan", brand: "Toyota / Honda", country: "JP", priceInr: "₹10L – ₹40L" },
    indian: [
      { name: "Tata Nexon / Harrier", brand: "Tata Motors", priceInr: "₹8L – ₹25L", madeIn: "India" },
      { name: "Mahindra XUV / Scorpio-N", brand: "Mahindra", priceInr: "₹13L – ₹26L", madeIn: "India" }
    ]
  },
  {
    id: "p-hyundai",
    category: "Automotive",
    foreign: { name: "Hyundai / Kia SUV", brand: "Hyundai / Kia", country: "KR", priceInr: "₹8L – ₹30L" },
    indian: [
      { name: "Tata Punch / Nexon", brand: "Tata Motors", priceInr: "₹6L – ₹15L", madeIn: "India" },
      { name: "Mahindra XUV300 / 700", brand: "Mahindra", priceInr: "₹8L – ₹26L", madeIn: "India" }
    ]
  },
  {
    id: "p-tesla",
    category: "Automotive",
    foreign: { name: "Tesla / BYD EV", brand: "Tesla / BYD", country: "US", priceInr: "₹40L+" },
    indian: [
      { name: "Tata Nexon EV / Punch EV", brand: "Tata.ev", priceInr: "₹10L – ₹20L", madeIn: "India" },
      { name: "Mahindra XEV 9e / BE 6", brand: "Mahindra", priceInr: "₹19L – ₹30L", madeIn: "India" }
    ]
  },

  // ----- Watches & accessories -----
  {
    id: "p-rolex",
    category: "Accessories",
    foreign: { name: "Rolex / Omega luxury watch", brand: "Rolex / Omega", country: "CH", priceInr: "₹3L – ₹50L" },
    indian: [
      { name: "Titan Edge / Nebula", brand: "Titan", priceInr: "₹5,000 – ₹2,00,000", madeIn: "India" },
      { name: "Jaipur Watch Company", brand: "JWC", priceInr: "₹15,000 – ₹1,50,000", madeIn: "India" }
    ]
  },
  {
    id: "p-parker",
    category: "Stationery",
    foreign: { name: "Parker / Mont Blanc pens", brand: "Parker / Mont Blanc", country: "GB", priceInr: "₹1,000 – ₹50,000" },
    indian: [
      { name: "Cello pens", brand: "Cello (BIC India)", priceInr: "₹10 – ₹500", madeIn: "India" },
      { name: "Reynolds", brand: "Reynolds (GM Pens)", priceInr: "₹10 – ₹200", madeIn: "India" },
      { name: "Camlin Klick", brand: "Camlin (Kokuyo)", priceInr: "₹10 – ₹300", madeIn: "India" },
      { name: "Linc", brand: "Linc Pens", priceInr: "₹10 – ₹400", madeIn: "India" }
    ]
  },

  // ----- Cosmetics & personal care extras -----
  {
    id: "p-loreal",
    category: "Personal care",
    foreign: { name: "L'Oréal / Maybelline makeup", brand: "L'Oréal / Maybelline", country: "FR", priceInr: "₹300 – ₹3,000" },
    indian: [
      { name: "Lakmé", brand: "Lakmé (HUL, Indian-origin)", priceInr: "₹200 – ₹2,000", madeIn: "India" },
      { name: "SUGAR Cosmetics", brand: "SUGAR", priceInr: "₹400 – ₹2,500", madeIn: "India" },
      { name: "MyGlamm", brand: "MyGlamm", priceInr: "₹300 – ₹2,000", madeIn: "India" }
    ]
  },
  {
    id: "p-nivea",
    category: "Personal care",
    foreign: { name: "Nivea / Ponds lotion", brand: "Beiersdorf / Unilever", country: "DE", priceInr: "₹150 – ₹500" },
    indian: [
      { name: "Boroplus", brand: "Emami", priceInr: "₹50 – ₹250", madeIn: "India" },
      { name: "Himalaya moisturiser", brand: "Himalaya", priceInr: "₹100 – ₹400", madeIn: "India (Indian-origin)" },
      { name: "Mamaearth", brand: "Honasa Consumer", priceInr: "₹250 – ₹600", madeIn: "India" }
    ]
  },
  {
    id: "p-axe",
    category: "Personal care",
    foreign: { name: "Axe / Old Spice deodorant", brand: "Unilever / P&G", country: "GB", priceInr: "₹200 – ₹400" },
    indian: [
      { name: "Wild Stone", brand: "McNROE", priceInr: "₹150 – ₹350", madeIn: "India" },
      { name: "Set Wet", brand: "Marico", priceInr: "₹150 – ₹300", madeIn: "India" },
      { name: "Beardo", brand: "Beardo (Marico)", priceInr: "₹250 – ₹600", madeIn: "India" }
    ]
  },

  // ----- Food & beverage extras -----
  {
    id: "p-redbull",
    category: "Beverages",
    foreign: { name: "Red Bull / Monster energy", brand: "Red Bull / Monster", country: "US", priceInr: "₹110 / 250ml" },
    indian: [
      { name: "Sting", brand: "PepsiCo India (made in India)", priceInr: "₹20 / 250ml", madeIn: "India" },
      { name: "Charged by Thums Up", brand: "Coca-Cola India", priceInr: "₹50 / 250ml", madeIn: "India" },
      { name: "Hell Energy India", brand: "Hell Energy", priceInr: "₹100 / 250ml", madeIn: "India (Hungarian brand, Indian-bottled)" }
    ]
  },
  {
    id: "p-tropicana",
    category: "Beverages",
    foreign: { name: "Tropicana / Minute Maid juice", brand: "PepsiCo / Coca-Cola", country: "US", priceInr: "₹100 / 1L" },
    indian: [
      { name: "Real / Real Activ", brand: "Dabur", priceInr: "₹110 / 1L", madeIn: "India" },
      { name: "B Natural", brand: "ITC", priceInr: "₹100 / 1L", madeIn: "India" },
      { name: "Paper Boat", brand: "Hector Beverages", priceInr: "₹50 / 250ml", madeIn: "India" }
    ]
  },
  {
    id: "p-cereal",
    category: "Food",
    foreign: { name: "Kellogg's cereal", brand: "Kellogg's", country: "US", priceInr: "₹250 / 475g" },
    indian: [
      { name: "Bagrry's Muesli", brand: "Bagrry's", priceInr: "₹400 / 500g", madeIn: "India" },
      { name: "Soulfull Ragi Bites", brand: "Tata Soulfull", priceInr: "₹140 / 200g", madeIn: "India" }
    ]
  },
  {
    id: "p-oats",
    category: "Food",
    foreign: { name: "Quaker Oats", brand: "PepsiCo", country: "US", priceInr: "₹220 / 1kg" },
    indian: [
      { name: "Tata Soulfull Millet Oats", brand: "Tata Soulfull", priceInr: "₹150 / 500g", madeIn: "India" },
      { name: "Patanjali Oats", brand: "Patanjali", priceInr: "₹140 / 500g", madeIn: "India" }
    ]
  },
  {
    id: "p-ketchup",
    category: "Food",
    foreign: { name: "Heinz ketchup", brand: "Kraft Heinz", country: "US", priceInr: "₹150 / 500g" },
    indian: [
      { name: "Maggi Hot & Sweet (HUL)", brand: "Nestlé India (locally made)", priceInr: "₹110 / 500g", madeIn: "India" },
      { name: "Kissan ketchup", brand: "HUL (locally made)", priceInr: "₹120 / 500g", madeIn: "India" },
      { name: "Veeba", brand: "Veeba", priceInr: "₹130 / 500g", madeIn: "India" }
    ]
  },
  {
    id: "p-nutella",
    category: "Food",
    foreign: { name: "Nutella spread", brand: "Ferrero", country: "IT", priceInr: "₹500 / 350g" },
    indian: [
      { name: "Hershey's Spread (made in India)", brand: "Hershey India", priceInr: "₹220 / 350g", madeIn: "India" },
      { name: "Lotte ChocoPie? — alt: The Whole Truth", brand: "The Whole Truth", priceInr: "₹400 / 250g", madeIn: "India" }
    ]
  },

  // ----- Toys -----
  {
    id: "p-lego",
    category: "Toys",
    foreign: { name: "LEGO bricks", brand: "LEGO", country: "DE", priceInr: "₹500 – ₹15,000" },
    indian: [
      { name: "Funskool building sets", brand: "Funskool (MRF group)", priceInr: "₹400 – ₹3,000", madeIn: "India (Goa)" },
      { name: "Centy Toys", brand: "Centy", priceInr: "₹100 – ₹1,000", madeIn: "India" }
    ]
  },
  {
    id: "p-mattel",
    category: "Toys",
    foreign: { name: "Mattel / Hasbro toys (Barbie, Hot Wheels)", brand: "Mattel / Hasbro", country: "US", priceInr: "₹500 – ₹5,000" },
    indian: [
      { name: "Funskool", brand: "Funskool", priceInr: "₹200 – ₹2,500", madeIn: "India" }
    ]
  },

  // ----- Pet care -----
  {
    id: "p-pedigree",
    category: "Pet care",
    foreign: { name: "Pedigree dog food", brand: "Mars", country: "US", priceInr: "₹350 / 1.2kg" },
    indian: [
      { name: "Drools", brand: "Drools (IB Group)", priceInr: "₹300 / 1.2kg", madeIn: "India" },
      { name: "Heads Up For Tails", brand: "HUFT", priceInr: "₹450 / 1.5kg", madeIn: "India" }
    ]
  },

  // ----- Streaming & SaaS -----
  {
    id: "p-netflix",
    category: "Services",
    foreign: { name: "Netflix subscription", brand: "Netflix", country: "US", priceInr: "₹149 – ₹649 / mo" },
    indian: [
      { name: "JioHotstar", brand: "Reliance + Disney JV", priceInr: "₹149 – ₹499 / mo", madeIn: "India" },
      { name: "ZEE5", brand: "Zee Entertainment", priceInr: "₹99 – ₹349 / mo", madeIn: "India" },
      { name: "SonyLIV", brand: "Sony Pictures Networks India", priceInr: "₹299 – ₹999 / yr", madeIn: "India" }
    ]
  },
  {
    id: "p-spotify",
    category: "Services",
    foreign: { name: "Spotify Premium", brand: "Spotify", country: "SE", priceInr: "₹119 / mo" },
    indian: [
      { name: "JioSaavn Pro", brand: "JioSaavn", priceInr: "₹99 / mo", madeIn: "India" },
      { name: "Gaana Plus", brand: "Gaana (Times Internet)", priceInr: "₹99 / mo", madeIn: "India" },
      { name: "Wynk Music", brand: "Bharti Airtel", priceInr: "Free / ₹99 / mo", madeIn: "India" }
    ]
  },
  {
    id: "p-slack",
    category: "Software",
    foreign: { name: "Slack workplace chat", brand: "Salesforce", country: "US", priceInr: "₹730 / user / mo" },
    indian: [
      { name: "Zoho Cliq", brand: "Zoho", priceInr: "₹90 / user / mo", madeIn: "India" },
      { name: "Flock", brand: "Flock (Directi)", priceInr: "₹390 / user / mo", madeIn: "India" }
    ]
  },
  {
    id: "p-dropbox",
    category: "Software",
    foreign: { name: "Dropbox cloud storage", brand: "Dropbox", country: "US", priceInr: "₹830 / mo (2TB)" },
    indian: [
      { name: "Zoho WorkDrive", brand: "Zoho", priceInr: "₹220 / user / mo", madeIn: "India" },
      { name: "Digiboxx", brand: "Digiboxx", priceInr: "₹30 / mo (2TB)", madeIn: "India" }
    ]
  },
  {
    id: "p-paypal",
    category: "Services",
    foreign: { name: "PayPal payments", brand: "PayPal", country: "US", priceInr: "Variable" },
    indian: [
      { name: "Razorpay", brand: "Razorpay", priceInr: "2% per txn", madeIn: "India (Bengaluru)" },
      { name: "Paytm", brand: "One97 Communications", priceInr: "Variable", madeIn: "India (Noida)" },
      { name: "Cashfree", brand: "Cashfree", priceInr: "Variable", madeIn: "India" }
    ]
  },

  // ----- Pharma / health -----
  {
    id: "p-supplements",
    category: "Health",
    foreign: { name: "Centrum / GNC multivitamins", brand: "Pfizer / GNC", country: "US", priceInr: "₹500 – ₹2,500" },
    indian: [
      { name: "Himalaya Wellness", brand: "Himalaya", priceInr: "₹150 – ₹800", madeIn: "India" },
      { name: "Dabur Chyawanprash", brand: "Dabur", priceInr: "₹250 – ₹600", madeIn: "India" },
      { name: "Patanjali Divya range", brand: "Patanjali", priceInr: "₹150 – ₹500", madeIn: "India" }
    ]
  }
];
