export const categories = [
    { id: 1, name: 'Cameras', icon: 'camera-outline' },
    { id: 2, name: 'Lenses', icon: 'aperture-outline' },
    { id: 3, name: 'Drones', icon: 'airplane-outline' },
    { id: 4, name: 'Lighting', icon: 'flash-outline' },
    { id: 5, name: 'Audio', icon: 'mic-outline' },
];

export const gearItems = [
    // --- CAMERAS ---
    {
        id: 101,
        categoryId: 1,
        brand: 'Sony',
        name: 'Sony Alpha a7S III Cinema Kit',
        pricePerDay: 15000,
        securityDeposit: 100000,
        rating: 4.9,
        reviewCount: 42,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1624823183488-292193cb4a02?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1589715125374-1232824e4d58?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 120000,
        rating: 4.8,
        reviewCount: 35,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1620216252277-c99009774676?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1620216252277-c99009774676?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1616423664033-63518d3c6d48?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 80000,
        rating: 4.7,
        reviewCount: 28,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1588483977959-badc9893d43a?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1588483977959-badc9893d43a?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1533235339276-8805f778d105?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 40000,
        rating: 4.9,
        reviewCount: 56,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 50000,
        rating: 5.0,
        reviewCount: 19,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1616423664033-63518d3c6d48?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1616423664033-63518d3c6d48?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 25000,
        rating: 4.6,
        reviewCount: 62,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1564466021-a5effa2231be?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 150000,
        rating: 5.0,
        reviewCount: 15,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 40000,
        rating: 4.8,
        reviewCount: 45,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1506947411487-a56738267384?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 30000,
        rating: 4.8,
        reviewCount: 30,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1563363072-5d9c2409559c?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1563363072-5d9c2409559c?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&w=1000&q=80"
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
        securityDeposit: 15000,
        rating: 4.7,
        reviewCount: 88,
        isAvailable: true,
        image: 'https://images.unsplash.com/photo-1590845947391-ba13a66e9be3?auto=format&fit=crop&w=1000&q=80',
        gallery: [
            "https://images.unsplash.com/photo-1590845947391-ba13a66e9be3?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1524678606372-987d11fa9271?auto=format&fit=crop&w=1000&q=80"
        ],
        description: 'The world’s smallest and first truly wireless microphone system. Includes 2 transmitters and 1 receiver.',
        features: ["Dual Channel Recording", "Built-in Onboard Recording", "200m Range", "7 Hr Battery Life"],
        specs: { mount: "Clip/Shoe", type: "Digital 2.4GHz", inputs: "3.5mm TRS", weight: "30g" }
    }
];