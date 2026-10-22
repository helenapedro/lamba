// Seed for the first shopping list, migrated from Helena's living list
// (Oct 22 to Nov 22). It is written to Firestore once, on first sign-in,
// when the account has no list yet.
export interface SeedItem {
  section: string
  nameEn: string
  namePt?: string
  brand?: string
  quantity?: string
  store?: string
  notes?: string
  recurringCount?: number
}

export const SEED_LIST_TITLE = 'Oct 22 to Nov 22'

export const SEED_ITEMS: SeedItem[] = [
  // Kitchen base
  { section: 'base', nameEn: 'Olive Oil', brand: 'Pompeian Organic Extra Virgin Olive Oil', recurringCount: 8 },
  { section: 'base', nameEn: 'Unsalted Butter', namePt: 'Manteiga sem sal', brand: 'Kerrygold Pure Irish Butter', notes: '2 blocks of 8 oz bought Oct 21' },
  { section: 'base', nameEn: 'Garlic', namePt: 'Alho', recurringCount: 5 },
  { section: 'base', nameEn: 'Lemons', namePt: 'Limão', recurringCount: 5 },
  { section: 'base', nameEn: 'Eggs', quantity: '18 count', brand: 'Vital Farms Organic Pasture-Raised' },
  { section: 'base', nameEn: 'Rolled Oats', namePt: 'Aveia em flocos' },
  { section: 'base', nameEn: 'Black Beans', namePt: 'Feijão preto', brand: 'Signature Select, dry', quantity: '16 oz' },
  { section: 'base', nameEn: 'Brown Basmati Rice', brand: 'Lundberg Family Farms', notes: 'Everyday rice' },
  { section: 'base', nameEn: 'White Basmati Rice', brand: 'Lundberg Family Farms', quantity: '2 lb', notes: 'For specific dishes' },
  { section: 'base', nameEn: 'Seasonal Fruit', quantity: '3 varieties', notes: 'Rotate weekly' },

  // Monthly pantry
  { section: 'pantry', nameEn: 'Rolled Oats', brand: "Bob's Red Mill Organic Old Fashioned" },
  { section: 'pantry', nameEn: 'Whole Wheat Pasta', namePt: 'Massa integral' },
  { section: 'pantry', nameEn: 'Lentils', namePt: 'Lentilha' },
  { section: 'pantry', nameEn: 'Chickpeas', namePt: 'Grão-de-bico' },
  { section: 'pantry', nameEn: 'Red Lentils', brand: "Bob's Red Mill", notes: 'For soups' },
  { section: 'pantry', nameEn: 'Corn Flour', brand: "Bob's Red Mill Corn Flour", notes: 'For funge. Not masa harina.' },
  { section: 'pantry', nameEn: 'Canned Tomatoes', namePt: 'Tomate pelado em lata' },
  { section: 'pantry', nameEn: 'Chia Seeds' },
  { section: 'pantry', nameEn: 'Flaxseeds' },
  { section: 'pantry', nameEn: 'Pumpkin Seeds' },
  { section: 'pantry', nameEn: 'Walnuts', namePt: 'Nozes', recurringCount: 2 },
  { section: 'pantry', nameEn: 'Almonds', namePt: 'Amêndoas' },
  { section: 'pantry', nameEn: 'Natural Almond Butter', notes: 'Peanut allergy household' },
  { section: 'pantry', nameEn: 'Honey', namePt: 'Mel' },
  { section: 'pantry', nameEn: 'Coconut Water', brand: 'Vita Coco Pure', notes: 'Check 0g added sugars' },
  { section: 'pantry', nameEn: 'Soy Sauce' },
  { section: 'pantry', nameEn: 'Cashews', namePt: 'Caju' },
  { section: 'pantry', nameEn: 'Dried Prunes', notes: 'No added sugar' },
  { section: 'pantry', nameEn: 'Granola', brand: 'Purely Elizabeth Ancient Grain Original', notes: 'Avoid peanut butter versions' },
  { section: 'pantry', nameEn: 'Apple Cider Vinegar', brand: 'Bragg Organic Raw Unfiltered', notes: 'Bought Oct 21' },
  { section: 'pantry', nameEn: 'Ground Cinnamon' },
  { section: 'pantry', nameEn: 'Ground Cumin', recurringCount: 4 },
  { section: 'pantry', nameEn: 'Paprika', recurringCount: 5 },
  { section: 'pantry', nameEn: 'Ground Turmeric' },
  { section: 'pantry', nameEn: 'Black Pepper' },
  { section: 'pantry', nameEn: 'Dried Oregano' },
  { section: 'pantry', nameEn: 'Garlic Powder', recurringCount: 3 },
  { section: 'pantry', nameEn: 'Ground Nutmeg' },
  { section: 'pantry', nameEn: 'Sesame Oil' },

  // Weekly fresh
  { section: 'fresh', nameEn: 'Seasonal Fruit', quantity: '2 to 3 varieties', notes: 'Late Oct: apples, pears, grapes, figs, cranberries. Nov: pomegranates, persimmons, clementines' },
  { section: 'fresh', nameEn: 'Fresh Pineapple', namePt: 'Ananás', quantity: '1 per week' },
  { section: 'fresh', nameEn: 'Frozen Pineapple Chunks', notes: 'For smoothies' },
  { section: 'fresh', nameEn: 'Sweet Potatoes', namePt: 'Batata-doce', recurringCount: 2 },
  { section: 'fresh', nameEn: 'White Potatoes' },
  { section: 'fresh', nameEn: 'Plantain', namePt: 'Banana-pão' },
  { section: 'fresh', nameEn: 'Yuca', namePt: 'Mandioca' },
  { section: 'fresh', nameEn: 'Butternut Squash' },
  { section: 'fresh', nameEn: 'Broccoli' },
  { section: 'fresh', nameEn: 'Cauliflower' },
  { section: 'fresh', nameEn: 'Brussels Sprouts' },
  { section: 'fresh', nameEn: 'Kale' },
  { section: 'fresh', nameEn: 'Spinach' },
  { section: 'fresh', nameEn: 'Carrots', namePt: 'Cenoura', recurringCount: 2 },
  { section: 'fresh', nameEn: 'Beets' },
  { section: 'fresh', nameEn: 'Cabbage' },
  { section: 'fresh', nameEn: 'Onions', namePt: 'Cebola', recurringCount: 2 },
  { section: 'fresh', nameEn: 'Fresh Ginger' },
  { section: 'fresh', nameEn: 'Green Onions' },
  { section: 'fresh', nameEn: 'Limes' },
  { section: 'fresh', nameEn: 'Chicken Breast', notes: 'Alternate with drumsticks or thighs, skinless' },
  { section: 'fresh', nameEn: 'Salmon Fillets', notes: 'Or trout' },
  { section: 'fresh', nameEn: 'Ground Turkey' },
  { section: 'fresh', nameEn: 'Ribeye Steak', brand: 'Private Selection Angus', quantity: '12 oz', store: 'Fred Meyer', notes: '1x per week' },
  { section: 'fresh', nameEn: 'Shrimp', namePt: 'Camarão' },
  { section: 'fresh', nameEn: 'Red Onion', namePt: 'Cebola roxa', recurringCount: 3 },
  { section: 'fresh', nameEn: 'Cilantro' },
  { section: 'fresh', nameEn: 'Feta Cheese' },
  { section: 'fresh', nameEn: 'Beef Soup Bones', brand: 'Signature Select', notes: 'For homemade bone stock' },
  { section: 'fresh', nameEn: 'Portuguese Sausage', brand: 'Silva Linguica', notes: 'Moderation: use as seasoning' },
  { section: 'fresh', nameEn: 'Eggs', quantity: '18 count' },
  { section: 'fresh', nameEn: 'Greek Yogurt', notes: 'Plain' },
  { section: 'fresh', nameEn: 'Milk or Oat Milk' },

  // Freezer
  { section: 'freezer', nameEn: 'Frozen Berries' },
  { section: 'freezer', nameEn: 'Frozen Mango' },
  { section: 'freezer', nameEn: 'Edamame' },
  { section: 'freezer', nameEn: 'Frozen Peas' },
]
