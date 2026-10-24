import type { NewProduct } from '../lib/products'

// Products Helena already buys, with the brand she settled on and the
// verdict from her product analyses (migrated 2026-10-23). No photos, by
// her decision: the registry is about the brand, not the picture.
export const SEED_PRODUCTS: NewProduct[] = [
  // Kitchen base
  {
    nameEn: 'Olive Oil',
    namePt: 'Azeite',
    brand: 'Pompeian Organic Extra Virgin Olive Oil (Smooth)',
    category: 'base',
    verdict: 'keep',
    notes: 'Store away from heat and light.',
  },
  {
    nameEn: 'Eggs',
    namePt: 'Ovos',
    brand: 'Vital Farms Organic Pasture-Raised · 18 count',
    category: 'base',
    verdict: 'keep',
  },
  {
    nameEn: 'Butter, unsalted',
    namePt: 'Manteiga sem sal',
    brand: 'Kerrygold Pure Irish Butter',
    category: 'base',
    verdict: 'keep',
  },
  {
    nameEn: 'Black Beans, dry',
    namePt: 'Feijão preto',
    brand: 'Signature Select · 16 oz',
    category: 'base',
    verdict: 'keep',
    notes: 'Soak overnight; pressure cook in the Cosori.',
  },
  {
    nameEn: 'Beef Soup Bones',
    brand: 'Signature Select',
    category: 'base',
    verdict: 'keep',
    notes: 'For homemade bone stock.',
  },
  // Monthly pantry
  {
    nameEn: 'Brown Basmati Rice',
    brand: 'Lundberg Family Farms',
    category: 'pantry',
    verdict: 'keep',
    notes: 'Everyday rice.',
  },
  {
    nameEn: 'White Basmati Rice',
    brand: 'Lundberg Family Farms · 2 lb',
    category: 'pantry',
    verdict: 'keep',
    notes: 'For specific dishes.',
  },
  {
    nameEn: 'Apple Cider Vinegar',
    brand: 'Bragg Organic Raw Unfiltered',
    category: 'pantry',
    verdict: 'keep',
    notes: 'Plain version, with the Mother. Not the Honey blends.',
  },
  {
    nameEn: 'Coconut Water',
    brand: 'Vita Coco Pure',
    category: 'pantry',
    verdict: 'keep',
    notes: 'Pure or Original only; check for 0 g added sugars.',
  },
  {
    nameEn: 'Rolled Oats',
    brand: "Bob's Red Mill Organic Old Fashioned",
    category: 'pantry',
    verdict: 'keep',
    notes: 'Recommended brand.',
  },
  {
    nameEn: 'Corn Flour (for funge)',
    brand: "Bob's Red Mill Corn Flour",
    category: 'pantry',
    verdict: 'keep',
    notes: 'Must say Corn Flour. Not Masa Harina, not Cornmeal.',
  },
  {
    nameEn: 'Granola',
    brand: 'Purely Elizabeth Ancient Grain Granola Original',
    category: 'pantry',
    verdict: 'keep',
    notes: 'Avoid the peanut butter versions (allergy).',
  },
  // Weekly fresh
  {
    nameEn: 'Ribeye Steak',
    brand: 'Private Selection Natural USDA Choice Angus · 12 oz',
    category: 'fresh',
    verdict: 'moderation',
    store: 'Fred Meyer',
    notes: 'Max 1x per week; 120 to 150 g per person, plenty of vegetables.',
  },
  {
    nameEn: 'Top Sirloin Steak',
    brand: 'Private Selection',
    category: 'fresh',
    verdict: 'keep',
    store: 'Fred Meyer',
    notes: 'Lean everyday cut.',
  },
  {
    nameEn: 'Filet Mignon',
    brand: 'Private Selection',
    category: 'fresh',
    verdict: 'keep',
    store: 'Fred Meyer',
    notes: 'Lean; for occasions.',
  },
  {
    nameEn: 'Linguica',
    namePt: 'Linguiça',
    brand: 'Silva Linguica Portuguese Sausage',
    category: 'fresh',
    verdict: 'moderation',
    notes: 'A flavoring, not the main protein. Load up on vegetables on linguica days.',
  },
  // Freezer
  {
    nameEn: 'Tilapia Fillets',
    brand: 'Kroger Boneless & Skinless',
    category: 'freezer',
    verdict: 'keep',
  },
  {
    nameEn: 'Cooked Shrimp',
    brand: 'Kroger Cooked Shrimp Extra Large',
    category: 'freezer',
    verdict: 'keep',
    notes: 'Already cooked; brief reheating only.',
  },
  // Other
  {
    nameEn: 'Pineapple Juice',
    brand: 'Simply Pineapple Juice Drink',
    category: 'other',
    verdict: 'substitute',
    notes: 'Has added sugar. Daily use: homemade pineapple juice. Simply only occasionally.',
  },
]
