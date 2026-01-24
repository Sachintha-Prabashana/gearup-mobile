import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

// 1. Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// --- DATA PART 1: CATEGORIES ---
const categories = [
    { id: 1, name: 'Cameras', icon: 'camera-outline' },
    { id: 2, name: 'Lenses', icon: 'aperture-outline' },
    { id: 3, name: 'Drones', icon: 'airplane-outline' },
    { id: 4, name: 'Lighting', icon: 'flash-outline' },
    { id: 5, name: 'Audio', icon: 'mic-outline' },
];

// --- DATA PART 2: ITEMS (With NEW Images) ---
const gearItems = [
    // --- CAMERAS ---
    {
        id: 101,
        categoryId: 1,
        brand: 'Sony',
        name: 'Sony Alpha a7S III Cinema Kit',
        pricePerDay: 15000,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 2",
        rating: 4.9,
        reviewCount: 42,
        isAvailable: true,
        image: 'https://i.ytimg.com/vi/tRl8Bfb5ELk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBOq_Zu9s2Tv7i3MtSm9WSklLnQ2g',
        gallery: [
            "https://d1rzxhvrtciqq1.cloudfront.net/uploads/images/listingimage/949265/image/original-4cbd42ff3fd98b65139058ca519fa17e.jpg",
            "https://i.ytimg.com/vi/dB9IqnXc2DQ/maxresdefault.jpg",
            "https://d1rzxhvrtciqq1.cloudfront.net/uploads/images/listingimage/780108/image/original-8ee24abc10fd32f5fcf197d66c4b2a9f.jpg"
        ],
        description: 'The industry standard for low-light video. This kit includes a SmallRig cage and extra batteries, making it perfect for run-and-gun filmmaking.',
        features: ["4K 120p Recording", "10-bit 4:2:2 Color", "Includes 160GB CFexpress Card", "3x NP-FZ100 Batteries"],
        specs: { mount: "Sony E-Mount", sensor: "Full Frame", resolution: "12.1 MP", weight: "614g" }
    },
    {
        id: 102,
        categoryId: 1,
        brand: 'Canon',
        name: 'Canon EOS R5 Body',
        pricePerDay: 16500,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 2",
        rating: 4.8,
        reviewCount: 35,
        isAvailable: true,
        image: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:1254,cw:3344,ch:2508,q:80,w:2560/qVmauAWyU7cEs4nEjxNb6Z.jpg',
        gallery: [
            "https://www.justcanon.in/cdn/shop/files/EOS-R6-Mark-III-RF2-01_500X700.jpg?v=1763017195",
            "https://d1ea30dbll17d8.cloudfront.net/12/1/images/catalog/i/276848-ffordes_photo_Left_RF24-105F4L.jpg"
        ],
        description: 'A powerhouse for hybrid shooters. Capable of 8K Raw video and 45MP stills. Ideal for high-end commercial work.',
        features: ["8K RAW Video", "45MP Stills", "In-Body Stabilization", "Dual Card Slots (CFexpress + SD)"],
        specs: { mount: "Canon RF", sensor: "Full Frame", resolution: "45 MP", weight: "738g" }
    },
    {
        id: 103,
        categoryId: 1,
        brand: 'Blackmagic',
        name: 'BMPCC 6K Pro',
        pricePerDay: 12000,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 2",
        rating: 4.7,
        reviewCount: 28,
        isAvailable: true,
        image: 'https://media.wired.com/photos/6601d1a10cc9c9864381ee75/master/pass/blackmagic_design_cinema_camera_6k_1787634-Offwhite-Background-SOURCE-Blackmagic.jpg',
        gallery: [
            "https://media.wired.com/photos/6601d1a10cc9c9864381ee75/master/pass/blackmagic_design_cinema_camera_6k_1787634-Offwhite-Background-SOURCE-Blackmagic.jpg",
            "https://emania.vteximg.com.br/arquivos/ids/193348-1000-1000/Camera-Cinema-Pocket-4K-Blackmagic-Design--7.jpg?v=636906140958270000"
        ],
        description: 'Cinema quality in a handheld form factor. Features built-in ND filters and Generation 5 Color Science.',
        features: ["6K BRAW Recording", "Built-in ND Filters", "Tiltable HDR Screen", "Includes Samsung T5 1TB SSD"],
        specs: { mount: "Canon EF", sensor: "Super 35", resolution: "6K", weight: "1238g" }
    },

    // --- LENSES ---
    {
        id: 201,
        categoryId: 2,
        brand: 'Sony',
        name: 'Sony FE 24-70mm f/2.8 GM',
        pricePerDay: 5500,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 1",
        rating: 4.9,
        reviewCount: 56,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80",
            "https://www.fixationuk.com/wp-content/uploads/2022/04/SONY-FE-24-70MM-F2.8-GM-II.jpg"
        ],
        description: 'The ultimate "do-it-all" lens. Sharp corner-to-corner with beautiful bokeh. Essential for event photography.',
        features: ["G-Master Optical Quality", "Fast f/2.8 Aperture", "Dust & Moisture Resistant", "Nano AR Coating"],
        specs: { mount: "Sony E-Mount", focalLength: "24-70mm", aperture: "f/2.8", weight: "886g" }
    },
    {
        id: 202,
        categoryId: 2,
        brand: 'Canon',
        name: 'Canon RF 70-200mm f/2.8 L IS',
        pricePerDay: 6500,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 1",
        rating: 5.0,
        reviewCount: 19,
        isAvailable: true,
        image: 'https://amateurphotographer.com/wp-content/uploads/sites/7/2019/11/DSC02087.jpg',
        gallery: [
            "https://amateurphotographer.com/wp-content/uploads/sites/7/2019/11/DSC02087.jpg",
            "https://cdn01.dcfever.com/articles/news/2019/11/191114_rf70-200_re_01.jpg"
        ],
        description: 'Incredibly compact for a telephoto zoom. Offers 5 stops of image stabilization, perfect for handheld shooting.',
        features: ["L-Series Quality", "5-Stop Image Stabilization", "Compact Design", "Dual Nano USM Motors"],
        specs: { mount: "Canon RF", focalLength: "70-200mm", aperture: "f/2.8", weight: "1070g" }
    },
    {
        id: 203,
        categoryId: 2,
        brand: 'Sigma',
        name: 'Sigma 35mm f/1.4 Art (Sony E)',
        pricePerDay: 3500,
        securityDeposit: 0,
        verificationRequired: false,
        verificationLevel: "None",
        rating: 4.6,
        reviewCount: 62,
        isAvailable: true,
        image: 'https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/08/sigma-35mm-art-sony-review-lead.jpg',
        gallery: [
            "https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2018/08/sigma-35mm-art-sony-review-lead.jpg",
            "https://adamrhodesphotography.co.uk/wp-content/uploads/2023/08/sigma-35mm-f1.4-art-lens-2023-review.jpg"
        ],
        description: 'Sharp, fast, and affordable. The classic choice for street photography and environmental portraits.',
        features: ["Hyper Sonic Motor", "Wide f/1.4 Aperture", "Brass Bayonet Mount", "Art Line Build Quality"],
        specs: { mount: "Sony E-Mount", focalLength: "35mm", aperture: "f/1.4", weight: "665g" }
    },

    // --- DRONES ---
    {
        id: 301,
        categoryId: 3,
        brand: 'DJI',
        name: 'DJI Mavic 3 Cine',
        pricePerDay: 22000,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 3",
        rating: 5.0,
        reviewCount: 15,
        isAvailable: true,
        image: 'https://amdcrew.com.au/cdn/shop/files/5745523-dji-mavic-3-pro-fly-more-combo-dji-rc-8.jpg?v=1708658701',
        gallery: [
            "https://amdcrew.com.au/cdn/shop/files/5745523-dji-mavic-3-pro-fly-more-combo-dji-rc-8.jpg?v=1708658701",
            "https://drone-safe-store.s3.eu-west-2.amazonaws.com/6334/conversions/dji-mavic-3-deals-1646918997fQ7WA-progressive.webp",
            "https://gizmodo.com/app/uploads/2023/04/ccc9793bb4b1405526d3780c038600a6.jpg"
        ],
        description: 'Professional aerial filmmaking tool. Supports Apple ProRes 422 HQ and features a dual-camera system.',
        features: ["5.1K Video", "46 Min Flight Time", "RC Pro Controller Included", "1TB Built-in SSD"],
        specs: { mount: "N/A", sensor: "4/3 CMOS", resolution: "20 MP", weight: "899g" }
    },
    {
        id: 302,
        categoryId: 3,
        brand: 'DJI',
        name: 'DJI Mini 3 Pro Fly More',
        pricePerDay: 8500,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 2",
        rating: 4.8,
        reviewCount: 45,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80",
            "https://d2j6dbq0eux0bg.cloudfront.net/images/36264078/3097277675.jpg"
        ],
        description: 'Sub-250g drone that packs a punch. True vertical shooting for social media. Includes 3 batteries.',
        features: ["4K 60p HDR", "True Vertical Shooting", "34 Min Flight Time", "Tri-Directional Obstacle Sensing"],
        specs: { mount: "N/A", sensor: "1/1.3-inch CMOS", resolution: "48 MP", weight: "249g" }
    },

    // --- LIGHTING ---
    {
        id: 401,
        categoryId: 4,
        brand: 'Aputure',
        name: 'Aputure 300d II Light Storm',
        pricePerDay: 7000,
        securityDeposit: 0,
        verificationRequired: true,
        verificationLevel: "Level 1",
        rating: 4.8,
        reviewCount: 30,
        isAvailable: true,
        image: 'https://cdn11.bigcommerce.com/s-78a3gbd1n9/images/stencil/1280x1280/products/33580/127936/AP-300DII-KIT__65050.1707098632.jpg?c=2',
        gallery: [
            "https://cdn11.bigcommerce.com/s-78a3gbd1n9/images/stencil/1280x1280/products/33580/127936/AP-300DII-KIT__65050.1707098632.jpg?c=2",
            "https://m.media-amazon.com/images/I/51FnTVFNirL.jpg"
        ],
        description: 'A powerful daylight-balanced point source LED. 20% brighter than its predecessor. Comes with a softbox.',
        features: ["5500K Daylight Balanced", "CRI 96+", "App Control via Sidus Link", "V-Mount Battery Compatible"],
        specs: { mount: "Bowens Mount", output: "350W", colorTemp: "5500K", weight: "3kg" }
    },

    // --- AUDIO ---
    {
        id: 501,
        categoryId: 5,
        brand: 'Rode',
        name: 'Rode Wireless GO II Dual',
        pricePerDay: 3500,
        securityDeposit: 0,
        verificationRequired: false,
        verificationLevel: "None",
        rating: 4.7,
        reviewCount: 88,
        isAvailable: true,
        image: 'https://i.otto.de/i/otto/317ac4de-5e51-502e-b0f9-61bb2a638182/rode-mikrofon-rode-wireless-go-ii-mit-2x-lavalier-go-mit-windschutz-und-lade-case-spar-set-drahtlos.jpg?$formatz$',
        gallery: [
            "https://i.otto.de/i/otto/317ac4de-5e51-502e-b0f9-61bb2a638182/rode-mikrofon-rode-wireless-go-ii-mit-2x-lavalier-go-mit-windschutz-und-lade-case-spar-set-drahtlos.jpg?$formatz$",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0X1lH5Qo7d9dnUWzgO1ln6J75Exy4kixeyw&s"
        ],
        description: 'The world’s smallest and first truly wireless microphone system. Includes 2 transmitters and 1 receiver.',
        features: ["Dual Channel Recording", "Built-in Onboard Recording", "200m Range", "7 Hr Battery Life"],
        specs: { mount: "Clip/Shoe", type: "Digital 2.4GHz", inputs: "3.5mm TRS", weight: "30g" }
    }
];

// Helper: Keywords Auto-Generate
const createKeywords = (name) => {
    const arr = [];
    let curName = '';
    name.split(' ').forEach(word => {
        curName += word.toLowerCase();
        arr.push(curName);
        curName += ' ';
    });
    return arr;
};

// --- UPLOAD FUNCTION ---
async function seedDatabase() {
    const batch = db.batch();

    console.log(` Starting Upload Process...`);

    // 1. CATEGORIES COLLECTION එකට දැමීම
    categories.forEach((cat) => {
        const docRef = db.collection('categories').doc(String(cat.id));
        batch.set(docRef, cat, { merge: true });
    });
    console.log(`Added ${categories.length} Categories to 'categories' collection`);

    gearItems.forEach((item) => {
        const docRef = db.collection('products').doc(String(item.id));

        const itemWithMetadata = {
            ...item,
            searchKeywords: createKeywords(item.name),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        batch.set(docRef, itemWithMetadata, { merge: true });
    });
    console.log(`Added ${gearItems.length} Items to 'products' collection`);

    // 3. COMMIT
    try {
        await batch.commit();
        console.log('Success! All data uploaded to both collections.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seedDatabase();