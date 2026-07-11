// VESTRA Product Data 
// Last updated: 2026-07-11

const VESTRA_DATA = {
  brand: {
    name: "VESTRA",
    tagline: "Professional Care, Premium Results",
    description: "Uganda's premium laundry solutions brand. Professional-grade detergents, stain removers, and garment care products for commercial and home use.",
    phone: "+256707128442",
    email: "vestradetergent@gmail.com",
    address: "VESTRA HQ, Kampala, Uganda",
    whatsapp: "+256707128442"
  },

  categories: ["All", "Stain Care", "Everyday", "Garment Finish"],

  products: [
    {
      id: 1,
      name: "VESTRA Heavy-Duty Stain Remover",
      category: "Stain Care",
      description: "V3.1 Professional Formula. Tough on stains, gentle on fabrics. Optimized for grease, oils, blood, wine, mud, ink and other toughest stains. Powerful stain breakdown with deep cleaning action and long-lasting freshness. 1 Litre.",
      price: 50000,
      stock: 50,
      lowStockThreshold: 5,
      image: "https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=670d9e6d-edec-462e-af11-3e7cdbe6cc18&object_id=public-72bc64e5-b16f-4380-a360-6ed6fa5f68cd",
      sku: "VES-HDSR-1L",
      rating: 4.9,
      reviewsCount: 58,
      featured: true,
      size: "1 Litre",
      benefits: ["Deep cleaning action", "Fabric whitening", "Long-lasting freshness", "Portable stain breakdown"],
      stainsTarget: ["Grease", "Oils", "Blood", "Wine", "Mud", "Ink"]
    },
    {
      id: 2,
      name: "VESTRA Stain Pro — Tannin &amp; Sap Remover",
      category: "Stain Care",
      description: "New professional formula for the toughest tannin and sap stains. Powerful plant-based stain removal that works on tea, coffee, wine, fruit juice, grass, leaves and tree sap. Safe on colors and most fabrics. Fresh long-lasting fragrance. 1 Litre — for commercial &amp; home laundry.",
      price: 40000,
      stock: 20,
      lowStockThreshold: 2,
      image: "https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=670d9e6d-edec-462e-af11-3e7cdbe6cc18&object_id=public-0ec4cfcf-51b5-4a06-a75a-fd5f3d82d661",
      sku: "VES-STPRO-1L",
      rating: 4.8,
      reviewsCount: 41,
      featured: true,
      size: "1 Litre",
      benefits: ["Plant-based formula", "Safe on colors", "Fresh fragrance", "Long-lasting results"],
      stainsTarget: ["Tea", "Coffee", "Wine", "Fruit juice", "Grass", "Tree sap"]
    },
    {
      id: 3,
      name: "VESTRA Rust Stain Remover",
      category: "Stain Care",
      description: "Professional formula liquid — fabric-safe. Powerful rust removal that dissolves tough rust stains at the source. Gentle on fabrics, tough on rust. Prevents re-deposition by locking away iron for long-lasting results. Yield: 1 Litre.",
      price: 40000,
      stock: 90,
      lowStockThreshold: 15,
      image: "https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=670d9e6d-edec-462e-af11-3e7cdbe6cc18&object_id=public-3b338c33-e8f0-46dc-9615-d7dc50816e0b",
      sku: "VES-RUST-1L",
      rating: 4.7,
      reviewsCount: 29,
      featured: true,
      size: "1 Litre",
      benefits: ["Fabric-safe formula", "Prevents re-deposition", "Professional strength", "Quick action"],
      stainsTarget: ["Rust", "Iron deposits", "Metal stains"]
    },
    {
      id: 4,
      name: "VESTRA Heavy Duty Detergent",
      category: "Everyday",
      description: "Professional care, premium results. Powerful clean — fresher, brighter. 10x Enzyme Power for deep clean action on tough stains. Deep clean &amp; fibre care protects fabrics and keeps them looking new. Works in hot &amp; cold water. Long-lasting fresh fragrance. Safe for all washes — cotton, blends, synthetics, delicates. For all machines &amp; hand wash. 5L.",
      price: 20000,
      stock: 79,
      lowStockThreshold: 15,
      image: "https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=670d9e6d-edec-462e-af11-3e7cdbe6cc18&object_id=public-2a294581-4c66-4049-bae2-6a68717a9ff6",
      sku: "VES-HDD-5L",
      rating: 4.9,
      reviewsCount: 112,
      featured: true,
      size: "5 Litres",
      benefits: ["10x Enzyme Power", "Works in hot &amp; cold water", "Safe for all machines", "Long-lasting fragrance"],
      stainsTarget: ["All-purpose", "Everyday stains", "Deep clean"]
    },
    {
      id: 5,
      name: "VESTRA Pro Finish — Garment Structurizing Spray",
      category: "Garment Finish",
      description: "Pro Series garment structurizing spray. Delivers a crisp structure with anti-flake technology and a fast-dry formula. Perfect professional finish for suits, shirts and structured garments. 500 ml.",
      price: 50000,
      stock: 140,
      lowStockThreshold: 20,
      image: "https://app.zaro.ai/api/console/workspaces/oss/read?workspace_id=670d9e6d-edec-462e-af11-3e7cdbe6cc18&object_id=public-de556d6b-4533-4d79-8f6b-cdfe3e94a669",
      sku: "VES-PROF-500",
      rating: 4.8,
      reviewsCount: 35,
      featured: true,
      size: "500 ml",
      benefits: ["Crisp structure", "Anti-flake technology", "Fast-dry formula", "Professional finish"],
      stainsTarget: []
    }
  ],

  reviews: [
    { id: 1, productId: 1, customerName: "Jane Customer", rating: 5, comment: "This Heavy-Duty Stain Remover is a lifesaver! Removed grease stains from my husband's overalls in one wash.", date: "2026-02-25" },
    { id: 2, productId: 4, customerName: "Robert Kato", rating: 5, comment: "Heavy Duty Detergent smells amazing and my whites are actually white again. 10x enzyme power is real.", date: "2026-04-05" },
    { id: 3, productId: 2, customerName: "Jane Customer", rating: 5, comment: "Stain Pro handled a wine spill on my white shirt that I thought was permanent. Impressive!", date: "2026-06-10" }
  ],

  stats: {
    productsSold: 9,
    happyCustomers: 3,
    reviews: 3,
    yearsExp: 5
  }
};
