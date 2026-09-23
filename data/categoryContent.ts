export interface CategoryContentItem {
  sections: {
    title: string;
    description: string;
  }[];
  image?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export const categoryContent: Record<string, CategoryContentItem> = {
  beverages: {
    sections: [
      {
        title: "Explore Beverages",
        description: 
          "From your morning cup of chai to a chilled glass of rose sharbat on a warm afternoon, this is where you'll find the drinks that feel like home. Our Beverages range covers five everyday categories — coffee, flavoured milk powder, refreshers, soft drinks and tea — bringing familiar South Asian brands and flavours to your door across the Netherlands.\n\n" +
          "Browse Beverages by Type:\n" +
          "• Coffee: Instant coffee, 3-in-1 mixes and ground coffee for your everyday cup.\n" +
          "• Flavoured Milk Powder: Badam, saffron, rose and everyday flavours for a comforting glass of milk.\n" +
          "• Refreshers: Rose and fruit sharbat syrups, squash concentrates and summer coolers.\n" +
          "• Soft Drinks: Ready-to-drink carbonated sodas in classic and fruit flavours.\n" +
          "• Tea: Everyday black tea, masala chai blends and speciality teas.\n\n" +
          "*(Note: 'Tea' here refers to mainstream/culinary tea like black tea and masala chai, which is distinct from the wellness herbal teas under Herbal Food Supplements > Teas).*",
      },
    ],
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do you deliver these beverages across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "Are your beverages imported or locally sourced?",
        answer: "Sourcing varies by product — check the individual product page for origin and import details.",
      },
      {
        question: "Do you stock halal-certified beverages?",
        answer: "Halal certification status varies by product and brand; check the individual product page for certification details.",
      },
      {
        question: "Are your milk-based drinks suitable for vegetarians?",
        answer: "Most milk-based beverages are vegetarian, but check the individual product label, as some formulations vary.",
      },
      {
        question: "Do you carry sugar-free or low-sugar beverage options?",
        answer: "Product ranges vary — check the individual product page or filter by dietary preference once available on the site.",
      },
      {
        question: "What's the difference between Refreshers and Soft Drinks?",
        answer: "Refreshers are typically concentrated syrups (like rose or fruit sharbat) that you dilute with water or milk, while Soft Drinks are ready-to-drink carbonated beverages.",
      },
      {
        question: "Can I buy beverages in bulk?",
        answer: "Bulk or multi-pack options vary by product; check the individual product page for available pack sizes.",
      },
      {
        question: "How should I store flavoured milk powder and coffee?",
        answer: "Store powders in a cool, dry place in a sealed container to prevent moisture and clumping.",
      },
      {
        question: "Do your teas contain caffeine?",
        answer: "Black tea and masala chai naturally contain caffeine; check the individual product page for details.",
      },
      {
        question: "Are your refreshers and sharbats suitable for children?",
        answer: "Most fruit and rose sharbat syrups are enjoyed by all ages, but check the ingredient list for any allergens or added caffeine.",
      },
      {
        question: "What's the shelf life of your beverages?",
        answer: "Shelf life varies by product type — check the best-before date on individual packaging.",
      },
      {
        question: "Can I find festive or seasonal beverage flavours?",
        answer: "Seasonal and festive flavours may be available at certain times of year — check the site for current availability.",
      },
      {
        question: "Are your soft drinks and sharbats carbonated?",
        answer: "Soft Drinks are carbonated; Refreshers (sharbat syrups) are typically still and mixed with water or milk, though this can vary by product.",
      },
      {
        question: "Do you offer sample or trial packs?",
        answer: "Availability of trial or sample packs varies by product and promotion — check the site for current offers.",
      },
      {
        question: "Can I return a beverage product if it arrives damaged?",
        answer: "Please refer to our returns and refunds policy for guidance on damaged or faulty items.",
      },
    ],
  },
  flour: {
    sections: [
      {
        title: "Explore Flour",
        description: 
          "Flour is the foundation of South Asian cooking — from the daily chapati or roti made with wheat flour, to pakoras and dhokla made with gram flour, to the specialty flours used in regional dishes and gluten-free cooking. Our Flour range covers the everyday essentials plus specialty options for specific recipes and dietary needs.\n\n" +
          "Browse Flour by Type:\n" +
          "• Gram Flour: Besan (chickpea flour) for pakoras, dhokla, laddoo and traditional batters.\n" +
          "• Wheat Flour: Atta for daily roti and chapati, plus maida and other wheat-based flours.\n" +
          "• Other Flour Products: Rice flour, corn flour, semolina (sooji/rava) and millet flours for regional dishes and gluten-free cooking.\n\n" +
          "*(Note: Gram Flour (Besan) also appears as an ingredient on the Herbal Skin Products > Cleansers page (Besan Cleanser), since it's traditionally used as a skin cleanser as well as a cooking ingredient — consider cross-linking between the two for shoppers who search Besan for either purpose.)*",
      },
    ],
image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "Do you deliver flour products across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "Which of your flours are gluten-free?",
        answer: "Rice flour, corn flour and most millet flours are naturally gluten-free, while wheat flour (atta, maida) contains gluten. Check the individual product page for allergen and cross-contamination information.",
      },
      {
        question: "What's the difference between Gram Flour and Wheat Flour?",
        answer: "Gram Flour (Besan) is made from ground chickpeas and is naturally gluten-free, commonly used for pakoras and batters. Wheat Flour (Atta) is made from wheat and contains gluten, used for everyday roti and chapati.",
      },
      {
        question: "How should I store flour?",
        answer: "Store flour in an airtight container in a cool, dry place, and use within the timeframe indicated on the packaging to avoid pests and rancidity.",
      },
      {
        question: "Do you sell whole wheat versus refined flour?",
        answer: "Both whole wheat (atta) and refined (maida) flours are typically available — check the specific product page for the type you need.",
      },
      {
        question: "What is the shelf life of flour once opened?",
        answer: "This varies by flour type — wheat-based flours are typically best used within a few months of opening, while some specialty flours may have shorter shelf lives. Check individual packaging.",
      },
      {
        question: "Can I buy flour in bulk bags?",
        answer: "Bulk pack sizes vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Are your flours stone-ground or machine-milled?",
        answer: "Milling method varies by brand and product — check the individual product page for details.",
      },
      {
        question: "Is Besan the same as chickpea flour?",
        answer: "Yes — Besan and gram flour both refer to flour made from ground chickpeas (specifically chana dal).",
      },
      {
        question: "Do you sell organic flour?",
        answer: "Organic certification status varies by product — check the individual product page.",
      },
      {
        question: "Can flour attract pests if not stored properly?",
        answer: "Yes — flour should be stored in a sealed, airtight container to prevent pests and moisture, particularly in warmer or humid conditions.",
      },
      {
        question: "What's the best flour for making roti at home?",
        answer: "Wheat Flour (Atta), specifically fine whole wheat atta, is the traditional choice for making soft roti and chapati.",
      },
      {
        question: "Do you sell flour suitable for baking bread and cakes?",
        answer: "Maida (refined wheat flour) is commonly used for baking; check individual product pages for specific baking suitability.",
      },
      {
        question: "Are your flours suitable for vegans?",
        answer: "Most flours are naturally vegan, but check the individual product's ingredient list to confirm, especially for any blended or fortified products.",
      },
      {
        question: "What is Sooji/Rava and how is it different from flour?",
        answer: "Sooji or Rava is semolina — a coarser, granulated product from wheat, different from finely milled flour, commonly used for halwa, upma and idli.",
      },
    ],
  },

  "household-care": {
    sections: [
      {
        title: "Explore Household & Care",
        description: 
          "Alongside your weekly grocery shop, this category covers the everyday cleaning and household essentials that keep a home running — from dishwashing and laundry care to general surface cleaning and kitchen basics. As with our grocery range, expect familiar brands and formats that might be harder to track down in a typical Dutch supermarket.\n\n" +
          "Dishwashing & Laundry Care:\n" +
          "Everyday essentials like dishwashing liquid, dishwashing bar soap and laundry detergent (powder and liquid) for regular household use.\n\n" +
          "General Cleaning & Kitchen Basics:\n" +
          "Surface and floor cleaners, along with everyday kitchen basics like aluminium foil, cling film, matches and mosquito repellent coils/liquids — practical household items that round out a regular shop.\n\n" +
          "Shop Household & Care (Browse items like Dishwashing Liquid, Dishwashing Bar Soap, Laundry Detergent, Surface & Floor Cleaner, Aluminium Foil, Cling Film, Matches, and Mosquito Repellent Coils).",
      },
    ],
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do you deliver household and cleaning products across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "Are your cleaning products safe to use around children and pets?",
        answer: "Always follow the manufacturer's instructions and store products out of reach of children and pets, regardless of the specific product.",
      },
      {
        question: "Can I mix different cleaning products together?",
        answer: "No — never mix cleaning chemicals unless the label specifically states it's safe to do so, as some combinations can produce harmful fumes.",
      },
      {
        question: "Do you sell eco-friendly or biodegradable cleaning products?",
        answer: "Availability of eco-friendly options varies by product — check the individual product page for formulation details.",
      },
      {
        question: "Are mosquito repellent coils safe for indoor use?",
        answer: "Follow the manufacturer's instructions for ventilation and usage — most coils are intended for use in a ventilated space, not a fully sealed room, and should not be used near children, pets or while sleeping unless the label specifically states it's designed for that.",
      },
      {
        question: "What's the difference between dishwashing liquid and dishwashing bar soap?",
        answer: "Dishwashing liquid is used in a sink or with a sponge for everyday washing, while dishwashing bar soap is a solid format some households prefer for its economy and lower packaging waste.",
      },
      {
        question: "Can I buy household products in bulk?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
      {
        question: "How should I store laundry detergent?",
        answer: "Store in a cool, dry place out of reach of children, with the packaging sealed to prevent moisture affecting powder detergents.",
      },
      {
        question: "Are your cleaning products suitable for sensitive skin?",
        answer: "Sensitivity and skin-safety information varies by product — check the individual product's ingredient list, and consider using gloves for regular cleaning tasks.",
      },
      {
        question: "Do you sell products specifically for hard water areas?",
        answer: "Product availability for hard water conditions (common in parts of the Netherlands) varies — check individual product descriptions for suitability.",
      },
      {
        question: "What's the shelf life of cleaning products?",
        answer: "This varies by product type — check the best-before or expiry information on individual packaging.",
      },
      {
        question: "Are your household products tested on animals?",
        answer: "Cruelty-free and animal-testing status varies by product and should be confirmed on the individual product page.",
      },
      {
        question: "Can I return a household product if it's faulty or damaged?",
        answer: "Please refer to our returns and refunds policy for guidance on damaged or faulty items.",
      },
      {
        question: "Do you sell reusable or eco-friendly alternatives to foil and cling film?",
        answer: "Product range varies — check the site for reusable or eco-friendly kitchen wrap alternatives as they become available.",
      },
      {
        question: "Will more household categories (e.g. religious/puja items) be added separately?",
        answer: "Yes — Household & Care currently covers general cleaning and household essentials; other categories, such as Religious items, are organized separately on the site.",
      },
    ],
  },

"instant-foods-mixes": {
    sections: [
      {
        title: "Explore Instant Foods & Mixes",
        description: 
          "Not every meal needs to be cooked from scratch. This category covers powder mixes, kits and instant products that get a familiar South Asian dish on the table quickly — just add water, milk or oil, following the pack instructions.\n\n" +
          "Browse Instant Foods & Mixes by Type:\n" +
          "• Chutney: Instant chutney powders and mixes — prepared, not ready-made (see Sauces, Pickles & Condiments for jarred chutneys).\n" +
          "• Dessert Mix: Instant kheer, halwa, gulab jamun and custard mixes for a quick sweet treat.\n" +
          "• Instant Noodles: Packet and cup noodles for a fast meal or snack.\n" +
          "• Other Condiments: Instant condiment powders — chaat masala, raita mix and similar (see Sauces, Pickles & Condiments for ready-made jarred condiments).\n" +
          "• Other Instant Foods: Instant breakfast and snack mixes — idli, dosa, poha, upma and more.\n" +
          "• Quick Meals: Ready-prep meal kits — biryani, pulao and curry mixes you finish at home.\n\n" +
          "*(Note: Chutney and Other Condiments in this category are specifically the powder/mix-to-prepare versions — the ready-made jarred/bottled versions live under Sauces, Pickles & Condiments. Cross-link between the matching pairs so shoppers searching either 'chutney powder' or 'ready-made chutney' land in the right place.)*",
      },
    ],
image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "Do you deliver instant foods and mixes across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What's the difference between the Chutney here and the Chutney under Sauces, Pickles & Condiments?",
        answer: "This category's Chutney is a powder or mix you prepare yourself (add water or oil), while Sauces, Pickles & Condiments carries ready-made, jarred chutney you can eat straight away.",
      },
      {
        question: "Are instant mixes as authentic-tasting as homemade?",
        answer: "Instant mixes are designed to closely replicate traditional flavours and save preparation time, though taste can vary by brand — check reviews or product descriptions for guidance.",
      },
      {
        question: "Do your instant foods contain MSG or preservatives?",
        answer: "This varies by product — check the individual product's ingredient list for MSG, preservatives and other additives.",
      },
      {
        question: "Are these mixes suitable for vegetarians?",
        answer: "Most mixes in this category are vegetarian, but check the individual product label to confirm, especially for meal kits that may include non-vegetarian options.",
      },
      {
        question: "How long do instant foods and mixes last unopened?",
        answer: "Shelf life varies by product — check the best-before date on individual packaging, generally several months to over a year for sealed packets.",
      },
      {
        question: "Can I customize instant mixes with my own ingredients?",
        answer: "Yes — many people add their own vegetables, protein or spices to instant mixes to personalize the dish; check individual packaging for base preparation instructions.",
      },
      {
        question: "Are your instant noodles halal certified?",
        answer: "Halal certification status varies by brand — check the individual product page for certification details.",
      },
      {
        question: "Do you sell gluten-free instant mixes?",
        answer: "Availability varies by product — check the individual product's ingredient list, as many instant mixes are wheat-based and contain gluten.",
      },
      {
        question: "How do I prepare a dessert mix like kheer or halwa?",
        answer: "Preparation typically involves cooking the mix with milk or water and sugar according to pack instructions — check the specific product for exact steps.",
      },
      {
        question: "Are quick meal kits a full meal or do I need to add ingredients?",
        answer: "This varies by kit — some require you to add protein or vegetables, while others are more complete. Check the individual product description for what's included.",
      },
      {
        question: "Can children eat instant noodles and mixes?",
        answer: "Most instant foods are suitable for general consumption, but parents should check sodium, spice level and allergen content before serving to young children.",
      },
      {
        question: "Do you sell spicy and mild versions of these mixes?",
        answer: "Spice level varies by product and brand — check the individual product description, as some mixes note a spice level or offer milder alternatives.",
      },
      {
        question: "How should I store opened instant mixes?",
        answer: "Reseal in an airtight container or bag after opening and store in a cool, dry place, using within the timeframe indicated on the packaging.",
      },
      {
        question: "Can I buy instant foods and mixes in bulk?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
    ],
  },
"lentils-beans": {
    sections: [
      {
        title: "Explore Lentils & Beans",
        description: 
          "A pot of dal is one of the most common dishes on a South Asian table — comforting, protein-rich and endlessly variable by region and household. Our Lentils & Beans range covers the everyday split lentils used for daily dal, alongside the whole beans and legumes used for curries like Rajma and Chana.\n\n" +
          "Browse by Type:\n" +
          "• Lentils: Split dal varieties — Toor, Masoor, Moong, Chana and Urad — for everyday cooking.\n" +
          "• Beans: Whole beans and legumes — Rajma, Chana, Lobia and more — for curries and hearty mains.\n\n" +
          "*(Note: Each bullet above links to its corresponding subcategory page.)*",
      },
    ],
image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "Do you deliver lentils and beans across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What's the difference between lentils and beans?",
        answer: "Lentils (dal) are typically small, quick-cooking, and often sold split and husked, while beans are larger whole legumes (like kidney beans or chickpeas) that usually require longer cooking and often soaking beforehand.",
      },
      {
        question: "Do I need to soak lentils and beans before cooking?",
        answer: "This depends on the type — most split lentils (dal) don't require soaking, while whole beans (like Rajma and Chana) generally benefit from or require soaking for several hours before cooking.",
      },
      {
        question: "Are lentils and beans naturally gluten-free?",
        answer: "Yes — plain lentils and beans are naturally gluten-free, though always check for cross-contamination information if you have celiac disease, as products may be processed in facilities handling other grains.",
      },
      {
        question: "How should I store dried lentils and beans?",
        answer: "Store in an airtight container in a cool, dry place; properly stored, they can last a year or more, though flavour and cooking time may be best within the first several months.",
      },
      {
        question: "Are lentils and beans a good source of protein?",
        answer: "Lentils and beans are widely recognised as a good plant-based protein and fibre source, commonly used as a staple in vegetarian diets — exact nutritional values vary by type, check individual product labels for specifics.",
      },
      {
        question: "Why do some beans need longer cooking than others?",
        answer: "This depends on the bean's size, density and skin thickness — larger, denser beans like Rajma generally take longer to cook fully than smaller lentils.",
      },
      {
        question: "Can I buy lentils and beans in bulk?",
        answer: "Bulk pack sizes vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Do you sell organic lentils and beans?",
        answer: "Organic certification availability varies by product — check the individual product page.",
      },
      {
        question: "What's the difference between whole and split lentils?",
        answer: "Whole lentils retain their outer skin and take longer to cook, while split lentils have been hulled and split, cooking faster and breaking down more easily into a smoother dal.",
      },
      {
        question: "Are these lentils and beans suitable for vegans?",
        answer: "Yes — plain, dried lentils and beans are naturally vegan.",
      },
      {
        question: "How do I know if my lentils or beans are still fresh?",
        answer: "Fresh lentils and beans should look uniform in colour without excessive dust or shriveling; very old pulses may take significantly longer to cook or fail to soften properly.",
      },
      {
        question: "Can lentils and beans be cooked in a pressure cooker?",
        answer: "Yes — a pressure cooker is a common and efficient way to cook both lentils and beans, significantly reducing cooking time compared to a regular pot.",
      },
      {
        question: "Do you sell canned or pre-cooked beans as well as dried?",
        answer: "Product format availability varies — check the site for canned or pre-cooked options if dried isn't what you're looking for.",
      },
      {
        question: "Are lentils and beans suitable for a slow cooker?",
        answer: "Yes — many lentils and beans work well in a slow cooker, though very old or particularly dense beans may still benefit from pre-soaking for best results.",
      },
    ],
  },

  "oil-ghee": {
    sections: [
      {
        title: "Explore Oil & Ghee",
        description: 
          "The right fat is the starting point for almost every South Asian dish — from the pungent bite of mustard oil in Bengali and Punjabi cooking to a spoonful of ghee finishing off a dal. Our Oil & Ghee range covers the everyday cooking oils and traditional ghee used across South Asian kitchens.\n\n" +
          "Browse by Type:\n" +
          "• Cooking Oil: Mustard, sunflower, sesame, coconut and other everyday cooking oils.\n" +
          "• Ghee: Traditional cow and buffalo ghee, plus vegetable ghee (vanaspati).\n\n" +
          "*(Note: Each bullet above links to its corresponding subcategory page.)*",
      },
    ],
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do you deliver oil and ghee across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What's the difference between ghee and regular butter?",
        answer: "Ghee is clarified butter with the milk solids and water removed, giving it a higher smoke point, longer shelf life, and a distinct nutty flavour compared to regular butter.",
      },
      {
        question: "Is mustard oil legal to sell for cooking in the EU?",
        answer: "Regulations around mustard oil vary depending on erucic acid content and labelling — check the individual product page for compliance and intended-use information specific to the EU market.",
      },
      {
        question: "How should I store cooking oil and ghee?",
        answer: "Store in a cool, dry place away from direct sunlight; ghee doesn't require refrigeration if kept sealed and used with a clean, dry spoon, but check individual product guidance.",
      },
      {
        question: "Which oil is best for deep frying?",
        answer: "Oils with a higher smoke point, such as sunflower or vegetable oil, are generally preferred for deep frying — check the individual product's smoke point information.",
      },
      {
        question: "Is ghee suitable for lactose-intolerant people?",
        answer: "Ghee has most of the milk solids removed during clarification, so many lactose-intolerant individuals tolerate it better than butter, but this varies by individual — consult a healthcare professional if you have a diagnosed intolerance.",
      },
      {
        question: "What's the shelf life of an opened bottle of oil?",
        answer: "This varies by oil type — check the best-before date on individual packaging, and store away from heat and light to preserve freshness.",
      },
      {
        question: "Are your oils cold-pressed?",
        answer: "Extraction method varies by product — check the individual product page for cold-pressed or other processing details.",
      },
      {
        question: "Is ghee vegan?",
        answer: "No — traditional ghee is made from dairy (cow or buffalo milk). Vegetable ghee (vanaspati) is a separate, plant-based alternative — check the individual product page.",
      },
      {
        question: "Can I reuse cooking oil after frying?",
        answer: "Oil can sometimes be reused a limited number of times if strained and stored properly, but repeated reuse degrades quality and is generally not recommended for health and flavour reasons.",
      },
      {
        question: "Do you sell flavoured or infused oils?",
        answer: "Product range varies — check the site for any flavoured or infused oil options.",
      },
      {
        question: "What's the difference between pure ghee and vegetable ghee (vanaspati)?",
        answer: "Pure ghee is made from dairy butterfat, while vegetable ghee (vanaspati) is a hydrogenated vegetable oil product designed to mimic ghee's texture — check individual product labels, as they have different nutritional profiles.",
      },
      {
        question: "Can I buy oil and ghee in bulk or larger tins?",
        answer: "Bulk and larger pack sizes vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Are your oils suitable for high-heat cooking like tempering (tadka)?",
        answer: "Many oils used in South Asian cooking, like mustard and sunflower oil, are suited to the high heat used in tempering — check individual product smoke point details.",
      },
      {
        question: "Is ghee healthier than regular cooking oil?",
        answer: "Nutritional comparisons depend on the specific product and how it's used — ghee and various oils each have different fat compositions; consult a nutritionist or dietitian for guidance specific to your dietary needs.",
      },
    ],
  },

"sauces-pickles-condiments": {
    sections: [
      {
        title: "Explore Sauces, Pickles & Condiments",
        description: 
          "This category covers the ready-made jars and bottles that finish a meal in seconds — chutneys, pickles, pastes and sauces you open and use straight away, rather than a powder or mix you prepare yourself.\n\n" +
          "Browse Sauces, Pickles & Condiments by Type:\n" +
          "• Chutney: Ready-to-eat jarred chutney — mango, mint, tamarind and more (see Instant Foods & Mixes for prepare-at-home chutney powders).\n" +
          "• Other Condiments: Ready-made condiments like tamarind concentrate, vinegar and pickled extras.\n" +
          "• Pastes: Ginger-garlic, tamarind and chili pastes for everyday cooking shortcuts.\n" +
          "• Pickles: Classic South Asian pickles — mango, lime, mixed vegetable and more.\n" +
          "• Sauces: Ready-made sauces including chili garlic, soy and Indo-Chinese style sauces.\n\n" +
          "*(Note: Chutney and Other Condiments here are specifically ready-to-eat, jarred/bottled products — cross-link the matching pairs both ways with Instant Foods & Mixes so shoppers land correctly whether they search 'ready-made chutney' or 'chutney powder'.)*",
      },
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do you deliver sauces, pickles and condiments across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What's the difference between the Chutney here and the Chutney under Instant Foods & Mixes?",
        answer: "This category's Chutney is ready-to-eat, straight from the jar. The version under Instant Foods & Mixes is a powder or mix you prepare yourself at home.",
      },
      {
        question: "Are your pickles homemade-style or commercially produced?",
        answer: "Sourcing and production style vary by brand — check the individual product page for details.",
      },
      {
        question: "Do pickles need to be refrigerated after opening?",
        answer: "Many oil-based pickles are shelf-stable even after opening if kept away from moisture, but always check the specific product's storage instructions, as this can vary.",
      },
      {
        question: "Are your sauces and pastes vegetarian?",
        answer: "Most are vegetarian, but check the individual product label to confirm, especially for any sauces containing fish or shrimp-based ingredients common in some Southeast Asian-style sauces.",
      },
      {
        question: "Do you sell spicy and mild versions of pickles and sauces?",
        answer: "Spice level varies by product — check the individual product description, as many pickles and sauces note a spice level or offer milder alternatives.",
      },
      {
        question: "What's the shelf life of an opened jar of pickle or chutney?",
        answer: "This varies by product — check the label for specific storage and use-by guidance after opening.",
      },
      {
        question: "Can I use these pastes as a substitute for fresh ginger and garlic?",
        answer: "Yes — pastes like Ginger-Garlic Paste are commonly used as a time-saving substitute for fresh ingredients in everyday cooking.",
      },
      {
        question: "Are your pickles preserved in oil or vinegar?",
        answer: "This varies by pickle — traditional South Asian pickles are typically oil-based, while some Western-style pickles use vinegar brine. Check the individual product's ingredient list.",
      },
      {
        question: "Do you sell sugar-free or low-sugar chutney options?",
        answer: "Availability varies by brand — check the individual product page for nutritional details.",
      },
      {
        question: "Are these condiments halal certified?",
        answer: "Halal certification status varies by product and brand — check the individual product page for certification details.",
      },
      {
        question: "Can I buy sauces and pickles in bulk?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Do your sauces contain preservatives?",
        answer: "This varies by product — check the individual product's ingredient list for preservatives and additives.",
      },
      {
        question: "Are these products suitable for vegans?",
        answer: "Most pickles, pastes and plant-based sauces are vegan, but check individual ingredient lists to confirm, especially for condiments that may include dairy or fish-based ingredients.",
      },
      {
        question: "Can I return a jar if it arrives broken or leaking?",
        answer: "Please refer to our returns and refunds policy for guidance on damaged items.",
      },
    ],
  },
"snacks-sweets": {
    sections: [
      {
        title: "Explore Snacks & Sweets",
        description: 
          "From a crunchy handful of namkeen with evening chai to a box of mithai for a festival or celebration, this category covers the everyday and special-occasion treats that round out a South Asian pantry.\n\n" +
          "Browse Snacks & Sweets by Type:\n" +
          "• Biscuits, Cookies & Rusk: Everyday tea-time biscuits, cookies and rusk.\n" +
          "• Mouth Fresheners: Saunf and mukhwas blends traditionally enjoyed after a meal.\n" +
          "• Namkeen: Savoury fried and roasted snack mixes — sev, bhujia, chivda and more.\n" +
          "• Snacks: Papad, chips and other everyday savoury snacks.\n" +
          "• Sweets: Ready-to-eat mithai — barfi, ladoo, rasgulla and more.\n\n" +
          "*(Note: Sweets here are ready-to-eat mithai; powder/mix-to-prepare desserts live under Instant Foods & Mixes — cross-link where a product overlaps so they don't compete as duplicate content.)*",
      },
    ],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1000",   faqs: [
      {
        question: "Do you deliver snacks and sweets across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What is namkeen?",
        answer: "Namkeen refers to savoury, often fried or roasted snack mixes — like sev, bhujia and chivda — traditionally enjoyed with tea or as a light snack.",
      },
      {
        question: "What is mithai?",
        answer: "Mithai is the general term for traditional South Asian sweets, such as barfi, ladoo and rasgulla, often given as gifts or served at celebrations.",
      },
      {
        question: "Are your snacks and sweets suitable for vegetarians?",
        answer: "Most are vegetarian, but check the individual product label to confirm, especially for any ghee or dairy-based sweets if you follow a vegan diet.",
      },
      {
        question: "Do your sweets contain nuts?",
        answer: "Many traditional sweets contain or are garnished with nuts (like pistachio, almond or cashew) — check the individual product's allergen information.",
      },
      {
        question: "What's the shelf life of packaged Indian sweets?",
        answer: "This varies significantly by sweet type — some have a longer shelf life due to sugar content, while others (especially milk-based sweets) are best consumed quickly. Check the individual product's best-before date.",
      },
      {
        question: "Are namkeen and snacks spicy?",
        answer: "Spice level varies by product — check the individual product description, as some namkeen varieties are milder than others.",
      },
      {
        question: "Do you sell sugar-free sweets?",
        answer: "Sugar-free or reduced-sugar options vary by brand — check the site or individual product pages for availability.",
      },
      {
        question: "Are your biscuits and cookies suitable for dipping in tea?",
        answer: "Yes — many of our biscuit varieties (like Marie and rusk) are specifically popular for dipping in chai.",
      },
      {
        question: "Can I buy snacks and sweets in gift boxes for festivals?",
        answer: "Gift box or festive packaging availability varies by season — check the site for current offerings around major festivals.",
      },
      {
        question: "Are these products halal certified?",
        answer: "Halal certification status varies by product and brand — check the individual product page for certification details.",
      },
      {
        question: "Do your sweets need to be refrigerated?",
        answer: "This varies by sweet — milk-based sweets often require refrigeration, while others are shelf-stable. Check individual product storage instructions.",
      },
      {
        question: "Are your snacks fried or baked?",
        answer: "This varies by product — check the individual product page, as namkeen is traditionally fried while some snacks and biscuits are baked or roasted.",
      },
      {
        question: "Can I buy snacks and sweets in bulk?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Do you sell gluten-free snacks or sweets?",
        answer: "Availability varies — many namkeen and sweets are gram-flour or rice-based and naturally gluten-free, while biscuits and rusk typically contain wheat. Check individual product ingredient lists.",
      },
    ],
  },

  "spices": {
    sections: [
      {
        title: "Explore Spices",
        description: 
          "This is where it all starts — the spices that give South Asian cooking its depth and character. Our full spice range is organised by form and use, so whether you need a single whole spice for tempering, a ground powder for a quick curry, or a ready-blended masala, you can go straight to what you need.\n\n" +
          "Browse Spices by Type:\n" +
          "• Whole Spices: Unground seeds, pods, bark and leaves — cumin, cardamom, cinnamon and more.\n" +
          "• Spice Powder: Single-ingredient ground spices — turmeric, chili, coriander and cumin powder.\n" +
          "• Spice Mix: Ready-blended masalas — garam masala, curry powder, tandoori masala and more.\n" +
          "• Aromas & Colours: Saffron, rose and kewra water, food colour and edible silver leaf.\n" +
          "• Salt: Table, black, rock and pink Himalayan salt.\n" +
          "• Other Spices: Asafoetida, dried fenugreek leaves, dried mango powder and more.\n\n" +
          "*(Note: Spice Mix here covers standalone masala blends only — meal-kit versions live under Instant Foods & Mixes > Quick Meals; cross-link where the same masala appears in both contexts.)*",
      },
    ],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do you deliver spices across the Netherlands?",
        answer: "Yes — AsianSpices.online currently ships across the Netherlands, with further European markets planned as those regions come online.",
      },
      {
        question: "What's the difference between a spice powder and a spice mix?",
        answer: "A spice powder is a single ground spice (like turmeric powder), while a spice mix (masala) combines multiple spices into one ready-to-use blend (like garam masala).",
      },
      {
        question: "Should I buy whole spices or ground spice powder?",
        answer: "Whole spices generally retain their flavour and aroma longer and are preferred for tempering (tadka) and slow-cooked dishes, while ground spice powder is more convenient for quick, everyday cooking.",
      },
      {
        question: "How should I store spices to keep them fresh?",
        answer: "Store spices in airtight containers away from direct light, heat and moisture; whole spices generally stay potent longer than ground spices.",
      },
      {
        question: "Are your spices tested for quality and purity?",
        answer: "Testing and quality certification details vary by supplier — check the individual product page for specifics.",
      },
      {
        question: "What's the shelf life of ground spices versus whole spices?",
        answer: "Whole spices typically retain their flavour for 2–3 years if stored properly, while ground spices are best used within about a year, as they lose potency faster once ground.",
      },
      {
        question: "Do your spice blends contain allergens?",
        answer: "This varies by blend — check the individual product's ingredient list, as some spice mixes contain mustard, celery or gluten-containing anti-caking agents, which are required allergen declarations under EU law.",
      },
      {
        question: "Are your spices organic?",
        answer: "Organic certification availability varies by product — check the individual product page.",
      },
      {
        question: "Can I buy spices in bulk?",
        answer: "Bulk pack sizes vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Are your spices irradiated or treated for pests?",
        answer: "Treatment methods vary by supplier and origin country — check the individual product page for sourcing and processing details.",
      },
      {
        question: "What's the best way to grind whole spices at home?",
        answer: "A dedicated spice grinder or mortar and pestle works well; toasting whole spices lightly before grinding is a common technique to enhance their aroma.",
      },
      {
        question: "Are your spices suitable for vegetarians and vegans?",
        answer: "Most spices and spice blends are vegetarian and vegan, but check the individual product's ingredient list to confirm, as a small number of blends may include non-vegan additives.",
      },
      {
        question: "Do you sell spice gift sets or starter kits?",
        answer: "Gift set or starter kit availability varies by season and promotion — check the site for current offerings.",
      },
      {
        question: "Where do your spices come from?",
        answer: "Sourcing and origin details vary by product — check the individual product page.",
      },
      {
        question: "Are your spices halal certified?",
        answer: "Halal certification status varies by product and brand — check the individual product page for certification details.",
      },
    ],
  },

};


export const subcategoryContentMap: Record<
  string,
  {
    sections: { title: string; description: string }[];
    image: string;
    faqs: { question: string; answer: string }[];
  }
> = {
  "coffee": {
    sections: [
      {
        title: "Explore Coffee",
        description: 
          "Whether it's a quick instant cup to start the day or a familiar 3-in-1 sachet the way it's made back home, our Coffee range covers the everyday essentials, plus ground coffee for those who prefer to brew their own.\n\n" +
          "Instant & 3-in-1 Coffee Mixes:\n" +
          "Convenient sachet mixes combining coffee, creamer and sugar in one — just add hot water. A familiar format for anyone used to South Asian coffee culture, and an easy grab-and-go option for busy mornings.\n\n" +
          "Ground & Filter Coffee:\n" +
          "For those who prefer to brew their own cup, our ground and filter coffee options offer more control over strength and flavour, suited to a French press, filter machine or traditional South Indian filter coffee setup.\n\n" +
          "Shop Coffee (Link each item to its live product page/filtered listing when available):\n" +
          "• Instant Coffee\n" +
          "• 3-in-1 Coffee Mix\n" +
          "• Ground Coffee\n" +
          "• Filter Coffee",
      },
    ],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What's the difference between instant coffee and 3-in-1 coffee mix?",
        answer: "Instant coffee is just coffee (add your own milk/sugar), while a 3-in-1 mix combines coffee, creamer and sugar in a single sachet for convenience.",
      },
      {
        question: "How do I make South Indian filter coffee?",
        answer: "Filter coffee is typically brewed using a traditional metal filter, then mixed with hot milk and sugar to taste — check individual product packaging for specific brewing guidance.",
      },
      {
        question: "Do you sell decaffeinated coffee?",
        answer: "Decaf availability varies by product — check the individual product page.",
      },
      {
        question: "How should I store ground coffee?",
        answer: "Store in an airtight container in a cool, dry place away from direct sunlight to preserve freshness.",
      },
      {
        question: "Are your coffee products vegetarian?",
        answer: "Most coffee products are vegetarian; 3-in-1 mixes containing dairy creamer are not vegan — check individual product labels.",
      },
      {
        question: "Can I buy coffee in bulk packs?",
        answer: "Bulk and multi-pack options vary by product; check the individual product page for available sizes.",
      },
      {
        question: "What's the shelf life of instant coffee?",
        answer: "Unopened instant coffee typically has a long shelf life — check the best-before date on individual packaging.",
      },
      {
        question: "Do you sell coffee whiteners or creamers separately?",
        answer: "Product range varies — check the site for available creamer and whitener products.",
      },
      {
        question: "Is your coffee ethically sourced?",
        answer: "Sourcing and certification details vary by brand and product — check the individual product page.",
      },
      {
        question: "How much caffeine is in a cup of instant coffee?",
        answer: "Caffeine content varies by brand and serving size — check the individual product label for specific details.",
      },
      {
        question: "Can I use 3-in-1 coffee mix to make iced coffee?",
        answer: "Yes — many people dissolve the sachet in a small amount of hot water first, then add ice and extra milk to taste.",
      },
      {
        question: "Do you sell coffee gift sets or hampers?",
        answer: "Gift set availability varies by season and promotion — check the site for current offerings.",
      },
      {
        question: "What's the difference between ground coffee and filter coffee blends?",
        answer: "Filter coffee blends are typically ground and roasted specifically for South Indian-style filter brewing, often with a different roast profile than standard ground coffee — check individual product descriptions.",
      },
      {
        question: "Are there low-sugar 3-in-1 coffee options?",
        answer: "Low-sugar or sugar-free options vary by brand; check the individual product page for nutritional details.",
      },
      {
        question: "Can I subscribe to regular coffee deliveries?",
        answer: "Subscription availability depends on current site features — check your account settings or the site for subscription options.",
      },
    ],
  },
  "flavoured-milk-powder": {
    sections: [
      {
        title: "Explore Flavoured Milk Powder",
        description: 
          "A warm or chilled glass of flavoured milk is a household favourite across South Asia — stirred up in minutes with a spoonful of powder. Our range spans traditional Badam and Saffron blends through to everyday favourites the whole family enjoys.\n\n" +
          "Traditional Flavours:\n" +
          "Rich, aromatic blends like Badam (Almond), Saffron (Kesar) and Rose milk powder are a household staple, often served warm before bed or chilled on a hot day — a comforting, familiar taste for many.\n\n" +
          "Everyday Favourites:\n" +
          "Classic flavours like Chocolate, Strawberry and Mango milk powder are popular with kids and adults alike, mixed easily into hot or cold milk for a quick, familiar treat.\n\n" +
          "Shop Flavoured Milk Powder:\n" +
          "• Badam (Almond) Milk Powder\n" +
          "• Saffron (Kesar) Milk Powder\n" +
          "• Rose Milk Powder\n" +
          "• Pistachio Milk Powder\n" +
          "• Chocolate Milk Powder\n" +
          "• Strawberry Milk Powder\n" +
          "• Mango Milk Powder",
      },
    ],
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How do I make flavoured milk with the powder?",
        answer: "Simply stir a spoonful of powder into a glass of warm or cold milk until dissolved — check the specific product's recommended quantity.",
      },
      {
        question: "Is Badam milk powder the same as almond milk?",
        answer: "No — Badam milk powder is a flavoured mix added to dairy milk, while almond milk is a separate plant-based milk alternative made from almonds.",
      },
      {
        question: "Are flavoured milk powders suitable for children?",
        answer: "Most flavoured milk powders are popular with children, but check the ingredient list for allergens and added sugar content.",
      },
      {
        question: "Can I make flavoured milk with plant-based milk instead of dairy?",
        answer: "Many people do mix flavoured milk powders with plant-based milk, though the flavour and texture may vary slightly from dairy milk.",
      },
      {
        question: "How should I store flavoured milk powder?",
        answer: "Store in an airtight container in a cool, dry place to prevent clumping and preserve flavour.",
      },
      {
        question: "Do flavoured milk powders contain caffeine?",
        answer: "Most flavoured milk powders (like Badam or Saffron) don't contain caffeine — check the individual product label to confirm.",
      },
      {
        question: "Is Saffron milk powder made with real saffron?",
        answer: "Saffron content and sourcing varies by brand — check the individual product's ingredient list for details.",
      },
      {
        question: "Can flavoured milk powder be used in desserts or baking?",
        answer: "Yes — many people use flavoured milk powders in desserts like kheer, milkshakes or baked goods for extra flavour.",
      },
      {
        question: "Are these milk powders suitable for vegetarians?",
        answer: "Most flavoured milk powders are vegetarian, but check the individual product label, as some contain non-vegetarian additives in rare cases.",
      },
      {
        question: "What's the difference between Rose and Badam milk powder?",
        answer: "Rose milk powder has a floral flavour profile, while Badam milk powder has a nutty almond flavour — both are traditional favourites, often served chilled.",
      },
      {
        question: "How much sugar is in flavoured milk powder?",
        answer: "Sugar content varies by brand and flavour — check the individual product's nutritional information.",
      },
      {
        question: "Can I use flavoured milk powder to make a milkshake?",
        answer: "Yes — most flavoured milk powders work well blended with cold milk and ice for a quick milkshake.",
      },
      {
        question: "Do you sell sugar-free flavoured milk powder?",
        answer: "Sugar-free options vary by brand; check the site or individual product pages for availability.",
      },
      {
        question: "What's the shelf life of flavoured milk powder?",
        answer: "Unopened milk powder typically has a long shelf life — check the best-before date on individual packaging.",
      },
      {
        question: "Are flavoured milk powders gluten-free?",
        answer: "Gluten content varies by brand and formulation — check the individual product's ingredient list to confirm.",
      },
    ],
  },
  "refreshers": {
    sections: [
      {
        title: "Explore Refreshers",
        description: 
          "A glass of chilled rose sharbat is practically a rite of summer across South Asia — a concentrated syrup diluted with cold water or milk for an instantly refreshing drink. Our Refreshers range covers the classic syrups and coolers that define a hot afternoon.\n\n" +
          "Classic Rose & Fruit Sharbats:\n" +
          "Rose syrup is the best-known name in this category, alongside Khus (Vetiver) Syrup, Mango Squash and Lemon Squash — all concentrated syrups meant to be diluted with water, milk or soda.\n\n" +
          "Summer Coolers & Falooda Syrups:\n" +
          "Falooda-style syrups and fruit-flavoured coolers are traditionally mixed with milk, ice and toppings like basil seeds or vermicelli for a more indulgent dessert-style drink.\n\n" +
          "Shop Refreshers:\n" +
          "• Rose Syrup\n" +
          "• Khus (Vetiver) Syrup\n" +
          "• Mango Squash\n" +
          "• Lemon Squash\n" +
          "• Falooda Syrup",
      },
    ],
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How do I make a drink with sharbat syrup?",
        answer: "Dilute a small amount of syrup with cold water, milk or soda water to taste — check the specific product's recommended ratio.",
      },
      {
        question: "What is Rose Syrup made from?",
        answer: "Rose syrup is a rose-flavoured concentrate, traditionally used to make a refreshing rose milk or rose water drink — check the individual product's ingredient list for exact composition.",
      },
      {
        question: "What is Khus (Vetiver) Syrup?",
        answer: "Khus syrup is made from vetiver root, prized for its distinctive earthy, cooling flavour, traditionally enjoyed during hot weather.",
      },
      {
        question: "Can I mix sharbat syrup with milk instead of water?",
        answer: "Yes — Rose Syrup in particular is commonly mixed with cold milk to make a traditional rose milk drink.",
      },
      {
        question: "What is Falooda and how do I make it at home?",
        answer: "Falooda is a dessert-style drink traditionally made by layering falooda syrup, milk, vermicelli, basil seeds and sometimes ice cream — check the specific syrup's packaging for a simple preparation guide.",
      },
      {
        question: "How should I store sharbat syrup after opening?",
        answer: "Most syrups should be refrigerated after opening and used within the timeframe stated on the packaging.",
      },
      {
        question: "Are these syrups suitable for children?",
        answer: "Most fruit and rose syrups are enjoyed by all ages, but check the ingredient list for any allergens or caffeine content.",
      },
      {
        question: "Do sharbat syrups need to be diluted, or can they be drunk directly?",
        answer: "These are concentrated syrups and are intended to be diluted with water, milk or soda before drinking.",
      },
      {
        question: "What's the difference between a squash and a syrup?",
        answer: "Both are concentrates diluted before drinking; 'squash' is typically a citrus or fruit-based concentrate, while 'syrup' often refers to floral or specialty flavours like rose or khus.",
      },
      {
        question: "How long does an opened bottle of syrup last?",
        answer: "This varies by product — check the packaging for specific storage guidance and shelf life after opening.",
      },
      {
        question: "Can I use these syrups in cocktails or mocktails?",
        answer: "Yes — rose, khus and fruit syrups are popular ingredients in mocktails and cocktails for their distinctive flavour.",
      },
      {
        question: "Are your sharbat syrups suitable for vegetarians and vegans?",
        answer: "Most fruit and floral syrups are vegan-friendly, but check the individual product's ingredient list to confirm.",
      },
      {
        question: "Do you sell sugar-free sharbat syrup?",
        answer: "Sugar-free options vary by brand — check the site or individual product pages for availability.",
      },
      {
        question: "What's a good ratio of syrup to water?",
        answer: "This varies by brand and personal taste — start with the ratio suggested on the packaging and adjust from there.",
      },
      {
        question: "Can I use sharbat syrup to flavour desserts?",
        answer: "Yes — many people use rose or fruit syrups to flavour desserts like kulfi, ice cream or fruit salads.",
      },
    ],
  },
  "soft-drinks": {
    sections: [
      {
        title: "Explore Soft Drinks",
        description: 
          "Sometimes it's the familiar fizz of a soft drink from home that you're really after. Our Soft Drinks range brings together classic carbonated favourites — colas, lemon-lime and fruit flavours — that might be harder to find on a regular Dutch supermarket shelf.\n\n" +
          "Carbonated Soft Drinks:\n" +
          "Familiar colas, lemon-lime and cream soda flavours, imported for those looking for a specific taste of home rather than a generic supermarket alternative.\n\n" +
          "Ready-to-Drink Fruit Sodas:\n" +
          "Mango, apple and other fruit-flavoured carbonated sodas — a popular, ready-to-drink alternative to sharbat syrups for those wanting something already fizzy and chilled.\n\n" +
          "Shop Soft Drinks:\n" +
          "• Cola\n" +
          "• Lemon-Lime Soda\n" +
          "• Mango Soda\n" +
          "• Apple Soda\n" +
          "• Cream Soda",
      },
    ],
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Are your soft drinks imported?",
        answer: "Sourcing varies by product — check the individual product page for origin details.",
      },
      {
        question: "Do you sell diet or sugar-free soft drinks?",
        answer: "Availability varies by brand — check the site or individual product pages for sugar-free options.",
      },
      {
        question: "How should soft drinks be stored?",
        answer: "Store in a cool place away from direct sunlight; refrigerate before serving for best taste.",
      },
      {
        question: "Are your soft drinks halal?",
        answer: "Halal certification status varies by brand — check the individual product page for details.",
      },
      {
        question: "Can I buy soft drinks in multipacks?",
        answer: "Multipack availability varies by product — check the individual product page for pack sizes.",
      },
      {
        question: "What's the shelf life of an unopened soft drink?",
        answer: "This varies by brand — check the best-before date printed on individual packaging.",
      },
      {
        question: "Do you sell glass-bottle soft drinks?",
        answer: "Packaging format (can, plastic or glass bottle) varies by product — check the individual product page.",
      },
      {
        question: "Are these soft drinks caffeine-free?",
        answer: "Caffeine content varies — colas typically contain caffeine, while most fruit-flavoured sodas do not. Check the individual product label to confirm.",
      },
      {
        question: "Can I return soft drinks if the packaging is damaged on arrival?",
        answer: "Please refer to our returns and refunds policy for guidance on damaged items.",
      },
      {
        question: "Do you carry seasonal or limited-edition soft drink flavours?",
        answer: "Seasonal availability varies — check the site for current offerings.",
      },
      {
        question: "Are mango and apple soda made with real fruit juice?",
        answer: "Ingredient composition varies by brand — check the individual product's ingredient list for details.",
      },
      {
        question: "Can children drink these soft drinks?",
        answer: "Most soft drinks are suitable for general consumption, but parents should check sugar and caffeine content before giving them to young children.",
      },
      {
        question: "Do you offer soft drinks in bulk for events?",
        answer: "Bulk ordering availability varies — contact customer service for large orders.",
      },
      {
        question: "Are these soft drinks vegan?",
        answer: "Most carbonated soft drinks are vegan, but check the individual product's ingredient list to confirm.",
      },
      {
        question: "What's the difference between your soft drinks and standard Dutch supermarket brands?",
        answer: "Our range focuses on South Asian and imported flavours that may not be widely available in mainstream Dutch supermarkets.",
      },
    ],
  },
  "tea": {
    sections: [
      {
        title: "Explore Tea",
        description: 
          "Tea is a daily ritual for many South Asian households — multiple cups a day, brewed strong with milk and spices. This category covers everyday black tea and masala chai blends. (Looking for caffeine-free wellness infusions like Tulsi or Chamomile instead? Those live under Herbal Food Supplements > Teas.)\n\n" +
          "Everyday Black Tea & Masala Chai:\n" +
          "Loose-leaf and tea-bag black tea for a strong, everyday cup, alongside pre-mixed Masala Chai blends combining black tea with warming spices like cardamom, ginger and cinnamon — ready to simmer with milk.\n\n" +
          "Speciality Teas:\n" +
          "For something different, Kashmiri Chai (Pink Tea) offers a distinctive pink colour and salty-sweet flavour, while Green Tea is available for those who prefer a lighter, everyday brew.\n\n" +
          "Shop Tea:\n" +
          "• Black Tea (Loose Leaf)\n" +
          "• Black Tea Bags\n" +
          "• Masala Chai Blend\n" +
          "• Kashmiri Chai (Pink Tea)\n" +
          "• Green Tea",
      },
    ],
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What's the difference between this Tea category and the Herbal Teas under Herbal Food Supplements?",
        answer: "This category covers everyday black tea and masala chai for regular drinking; Herbal Food Supplements > Teas covers caffeine-free wellness infusions like Tulsi or Chamomile.",
      },
      {
        question: "How do I make masala chai?",
        answer: "Traditionally, black tea and whole spices are simmered together with milk and water, then sweetened to taste — check the specific product's packaging for a suggested method.",
      },
      {
        question: "Does masala chai contain caffeine?",
        answer: "Yes — masala chai is made with black tea, which naturally contains caffeine.",
      },
      {
        question: "What is Kashmiri Chai (Pink Tea)?",
        answer: "Kashmiri Chai, also called pink tea or noon chai, is a distinctive tea traditionally made with baking soda (which creates its pink colour) and served with a pinch of salt.",
      },
      {
        question: "Is your black tea loose-leaf or tea bags?",
        answer: "Both formats are available — check the individual product page for specifics.",
      },
      {
        question: "How should I store tea to keep it fresh?",
        answer: "Store in an airtight container away from light, heat and moisture, and use within about 12 months of opening for best flavour.",
      },
      {
        question: "Can I make masala chai without a stovetop?",
        answer: "Some masala chai blends can be steeped like a regular tea bag in hot water and milk, though the traditional simmered method typically produces a stronger flavour.",
      },
      {
        question: "Does green tea in this category differ from the wellness Green Tea listed elsewhere?",
        answer: "It's the same base ingredient; this listing is positioned for everyday drinking, while the Herbal Food Supplements listing is positioned around its traditional wellness use.",
      },
      {
        question: "Are your teas ethically sourced?",
        answer: "Sourcing and certification details vary by brand — check the individual product page.",
      },
      {
        question: "How much tea should I use per cup?",
        answer: "This varies by tea type and strength preference — check the individual product's brewing guidance.",
      },
      {
        question: "Is masala chai suitable for children?",
        answer: "Masala chai contains caffeine from black tea, so many parents choose to limit or avoid it for young children — check with a pediatrician if unsure.",
      },
      {
        question: "Can I buy pre-mixed masala chai spice blends without tea leaves?",
        answer: "Product availability varies — check the site for spice-only chai masala blends versus pre-mixed tea-and-spice products.",
      },
      {
        question: "What's the difference between loose-leaf tea and tea bags?",
        answer: "Loose-leaf tea generally offers a fuller flavour and more control over strength, while tea bags are more convenient for a quick, consistent cup.",
      },
      {
        question: "Do you sell tea gift sets?",
        answer: "Gift set availability varies by season and promotion — check the site for current offerings.",
      },
      {
        question: "Can I use black tea to make iced tea?",
        answer: "Yes — black tea can be brewed strong, cooled and served over ice, sweetened to taste.",
      },
    ],
  },

"gram-flour": {
    sections: [
      {
        title: "Explore Gram Flour",
        description:
          "Gram Flour, known as Besan, is one of the most versatile flours in South Asian cooking — ground from chickpeas (chana dal) and naturally gluten-free. It's the base for everything from crispy pakoras to soft dhokla and sweet laddoo.\n\n" +
          "Everyday Cooking Uses:\n" +
          "Besan is best known as the base for pakoras and other fried snacks, thanks to the light, crisp coating it creates. It's also the key ingredient in steamed dishes like dhokla and khaman, and forms the batter base for many traditional curries like kadhi.\n\n" +
          "Sweets & Traditional Preparations:\n" +
          "Roasted Besan is the foundation of classic sweets like besan laddoo and mysore pak. It's also traditionally used outside the kitchen — as a gentle exfoliating face cleanser mixed with water or milk, a use covered in more detail on our Herbal Skin Products > Cleansers page.\n\n" +
          "Shop Gram Flour:\n" +
          "• Gram Flour (Besan) – Fine\n" +
          "• Gram Flour (Besan) – Coarse\n" +
          "• Roasted Besan",
      },
    ],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Is Gram Flour (Besan) gluten-free?",
        answer: "Yes — Besan is made from ground chickpeas and is naturally gluten-free. If you have celiac disease or a severe gluten allergy, check the individual product page for cross-contamination information.",
      },
      {
        question: "What is Besan traditionally used for?",
        answer: "Besan is used for savoury dishes like pakoras, dhokla and kadhi, as well as sweets like besan laddoo, and even as a traditional skin cleanser.",
      },
      {
        question: "What's the difference between fine and coarse Besan?",
        answer: "Fine Besan is typically used for batters and sweets, while coarse Besan is sometimes preferred for certain textured dishes — check the specific recipe you're making.",
      },
      {
        question: "Can I substitute Besan for wheat flour in recipes?",
        answer: "Besan has a distinct nutty flavour and different binding properties than wheat flour, so it's not usually a direct 1:1 substitute — it's best used in recipes specifically designed for it.",
      },
      {
        question: "How should I store Gram Flour?",
        answer: "Store in an airtight container in a cool, dry place; refrigeration can help extend freshness in warmer climates.",
      },
      {
        question: "What is Roasted Besan used for?",
        answer: "Roasted Besan has a deeper, nuttier flavour and is commonly used for sweets like besan laddoo and certain savoury dishes that benefit from a toasted taste.",
      },
      {
        question: "How do I make pakora batter with Besan?",
        answer: "Besan is typically mixed with water and spices to form a thick batter that vegetables or other ingredients are dipped into before frying — check individual recipes for specific ratios.",
      },
      {
        question: "Can Besan be used for a face mask?",
        answer: "Yes — Besan is a traditional Ayurvedic ingredient used as a gentle cleansing face mask, often mixed with water, milk or yogurt. See our Herbal Skin Products > Cleansers page for more detail.",
      },
      {
        question: "Is Besan suitable for vegans?",
        answer: "Yes — Gram Flour is naturally vegan, made purely from ground chickpeas.",
      },
      {
        question: "What's the shelf life of Gram Flour?",
        answer: "Unopened Besan typically has a shelf life of several months to a year; check the best-before date on individual packaging, and store properly once opened.",
      },
      {
        question: "Is Gram Flour high in protein?",
        answer: "Chickpeas are naturally higher in protein than many grain flours, though exact nutritional values vary by product — check the individual product's nutrition label.",
      },
      {
        question: "Can I use Besan to make dhokla at home?",
        answer: "Yes — Besan is the primary ingredient in traditional steamed dhokla, combined with yogurt, spices and a leavening agent.",
      },
      {
        question: "Why does my Besan batter sometimes taste bitter?",
        answer: "This can happen if the Besan is old or improperly stored — always check freshness and store in an airtight container away from heat and moisture.",
      },
      {
        question: "Do you sell organic Gram Flour?",
        answer: "Organic certification availability varies by product — check the individual product page.",
      },
      {
        question: "Can Gram Flour be used in baking?",
        answer: "Yes — some recipes use Besan in baked goods for a distinct flavour and gluten-free structure, though it behaves differently than wheat flour in baking.",
      },
    ],
  },
  "wheat-flour": {
    sections: [
      {
        title: "Explore Wheat Flour",
        description:
          "Wheat flour, or Atta, is the daily staple behind roti, chapati and paratha in South Asian households — a household purchase that gets repeated often. Our range covers whole wheat atta for everyday flatbreads, plus refined maida for baking and specific recipes.\n\n" +
          "Everyday Roti & Chapati Flour:\n" +
          "Fine Whole Wheat Atta is the traditional choice for soft, everyday roti, chapati and paratha — milled from the whole wheat grain, including the bran, for a heartier texture and flavour than refined flour.\n\n" +
          "Refined Flour & Baking:\n" +
          "Maida (refined wheat flour) is used for specific dishes like naan, puri and many baked goods, offering a finer, softer texture than whole wheat atta.\n\n" +
          "Shop Wheat Flour:\n" +
          "• Whole Wheat Atta (Fine)\n" +
          "• Whole Wheat Atta (Chakki Fresh)\n" +
          "• Maida (Refined Flour)\n" +
          "• Self-Raising Flour",
      },
    ],
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is the difference between Atta and Maida?",
        answer: "Atta is whole wheat flour, milled from the entire wheat grain including the bran, while Maida is refined flour with the bran and germ removed, giving it a finer texture and lighter colour.",
      },
      {
        question: "Does Wheat Flour contain gluten?",
        answer: "Yes — both Atta and Maida are made from wheat and naturally contain gluten. They are not suitable for those with celiac disease or a gluten intolerance.",
      },
      {
        question: "What is 'chakki fresh' Atta?",
        answer: "Chakki-style atta is stone-ground, a traditional milling method some consider to better preserve the flour's texture and flavour compared to roller-milled flour.",
      },
      {
        question: "How much water do I need to make roti dough?",
        answer: "This varies slightly by brand and flour freshness — most packaging includes a general dough-making guide, and consistency is usually adjusted by feel.",
      },
      {
        question: "How should I store Wheat Flour?",
        answer: "Store in an airtight container in a cool, dry place, and use within the timeframe recommended on the packaging.",
      },
      {
        question: "Can I use Maida for making roti instead of Atta?",
        answer: "Maida can be used, but traditional roti is typically made with whole wheat Atta for its texture and flavour — Maida is more commonly used for naan, puri and baked goods.",
      },
      {
        question: "Is whole wheat Atta healthier than Maida?",
        answer: "Whole wheat flour retains the bran and germ of the grain, giving it more fibre than refined Maida — but exact nutritional comparisons depend on the specific product; check individual nutrition labels.",
      },
      {
        question: "What is Self-Raising Flour used for?",
        answer: "Self-Raising Flour includes a built-in raising agent and is typically used for baking cakes and certain quick breads, rather than traditional roti or chapati.",
      },
      {
        question: "What's the shelf life of Wheat Flour?",
        answer: "Unopened wheat flour typically lasts several months to a year — check the best-before date on individual packaging, and store properly once opened to avoid pests and moisture.",
      },
      {
        question: "Can I make naan with regular Atta?",
        answer: "Naan is traditionally made with Maida for its soft, pillowy texture, though some recipes use a blend of Atta and Maida.",
      },
      {
        question: "Do you sell organic Wheat Flour?",
        answer: "Organic certification availability varies by product — check the individual product page.",
      },
      {
        question: "Why does my roti sometimes turn out hard?",
        answer: "This can be due to flour freshness, dough hydration, resting time or rolling technique — try adjusting the water ratio and letting the dough rest before rolling.",
      },
      {
        question: "Can Wheat Flour be used for both sweet and savoury dishes?",
        answer: "Yes — depending on the type, wheat flour is used across sweet dishes (like certain desserts) and savoury dishes (roti, paratha, puri).",
      },
      {
        question: "Is Atta suitable for vegans?",
        answer: "Yes — plain Atta is naturally vegan, made purely from wheat.",
      },
      {
        question: "What's the difference between fine and coarse Atta?",
        answer: "Fine Atta produces a softer roti texture, while coarser Atta retains more bran and gives a heartier, more textured result — personal preference and regional tradition both play a role.",
      },
    ],
  },
  "other-flour-products": {
    sections: [
      {
        title: "Explore Other Flour Products",
        description:
          "Beyond everyday wheat and gram flour, South Asian cooking draws on a wide range of specialty flours — from semolina for halwa and upma, to naturally gluten-free millet flours used across regional cuisines and increasingly popular for gluten-free cooking.\n\n" +
          "Everyday Specialty Flours:\n" +
          "Semolina (Sooji/Rava) is a coarse wheat product used for halwa, upma and idli, while Rice Flour and Corn Flour (Makki ka Atta) are staple gluten-free flours used for dishes like rice-flour dosas, rice cakes and makki roti.\n\n" +
          "Millet & Regional Flours:\n" +
          "Naturally gluten-free millet flours — Ragi (Finger Millet), Bajra (Pearl Millet) and Jowar (Sorghum) — are traditional staples in several regional cuisines and are increasingly popular as gluten-free alternatives for roti and baking. Sattu (Roasted Gram Flour) is another traditional specialty flour, most often mixed into a savoury or sweet drink.\n\n" +
          "Shop Other Flour Products:\n" +
          "• Semolina (Sooji/Rava)\n" +
          "• Rice Flour\n" +
          "• Corn Flour (Makki ka Atta)\n" +
          "• Ragi (Finger Millet) Flour\n" +
          "• Bajra (Pearl Millet) Flour\n" +
          "• Jowar (Sorghum) Flour\n" +
          "• Sattu (Roasted Gram Flour)",
      },
    ],
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Is Semolina (Sooji/Rava) the same as flour?",
        answer: "Semolina is a coarser, granulated product made from wheat, different from finely milled flour — it's used for dishes like halwa, upma and idli rather than roti.",
      },
      {
        question: "Are Ragi, Bajra and Jowar flours gluten-free?",
        answer: "Yes — Ragi (finger millet), Bajra (pearl millet) and Jowar (sorghum) are all naturally gluten-free grains. Check individual packaging for cross-contamination information if you have celiac disease.",
      },
      {
        question: "What is Sattu and how is it used?",
        answer: "Sattu is roasted gram flour, traditionally mixed with water, lemon and spices to make a refreshing drink (sattu paani), and also used in some regional sweets and savoury dishes.",
      },
      {
        question: "What's the difference between Rice Flour and regular flour?",
        answer: "Rice Flour is made from ground rice, is naturally gluten-free, and has a different texture and binding property than wheat flour — commonly used for dosas, rice cakes and certain desserts.",
      },
      {
        question: "Can I make roti with millet flours like Bajra or Jowar?",
        answer: "Yes — Bajra and Jowar rotis are traditional regional staples, though the dough often requires a different technique than wheat roti due to the lack of gluten.",
      },
      {
        question: "What is Corn Flour (Makki ka Atta) used for?",
        answer: "Makki ka Atta is coarsely ground corn flour, traditionally used to make makki di roti, a specialty flatbread popular in Punjabi cuisine.",
      },
      {
        question: "How should I store specialty flours like Ragi or Bajra flour?",
        answer: "Store in an airtight container in a cool, dry place; millet flours can have a shorter shelf life than wheat flour, so check individual packaging and use within the recommended timeframe.",
      },
      {
        question: "Is Semolina suitable for those avoiding gluten?",
        answer: "No — Semolina (Sooji/Rava) is made from wheat and contains gluten.",
      },
      {
        question: "What's the difference between fine and coarse Rice Flour?",
        answer: "Fine rice flour is typically used for smoother batters and desserts, while coarser rice flour may be used for specific textured dishes — check the recipe you're making.",
      },
      {
        question: "Can I mix millet flours with wheat flour for roti?",
        answer: "Yes — many people blend millet flours with wheat flour to ease the transition, as pure millet dough can be more difficult to roll than wheat dough.",
      },
      {
        question: "What is Jowar flour used for besides roti?",
        answer: "Jowar flour is also used in some regional flatbreads, porridges and increasingly in gluten-free baking.",
      },
      {
        question: "Do these specialty flours have a shorter shelf life than wheat flour?",
        answer: "Millet flours in particular can be more prone to rancidity due to their oil content — check individual packaging for best-before dates and store properly.",
      },
      {
        question: "Is Corn Flour the same as cornstarch?",
        answer: "No — Corn Flour (Makki ka Atta) in South Asian cooking refers to ground corn/maize flour used for flatbreads, which is different from cornstarch (a fine thickening starch used in Western cooking).",
      },
      {
        question: "Are these specialty flours suitable for vegans?",
        answer: "Yes — all the flours in this category are naturally vegan.",
      },
      {
        question: "What's a good beginner recipe using Ragi flour?",
        answer: "Ragi flour is commonly used to make a simple porridge or flatbread (Ragi roti) — check individual product packaging or recipe resources for beginner-friendly methods.",
      },
    ],
  },
  "chutney": {
    sections: [
      {
        title: "Explore Chutney Powders & Mixes",
        description:
          "These are instant chutney powders and mixes — you add oil, water or yogurt at home to finish them, rather than a ready-to-eat jarred chutney (find those under Sauces, Pickles & Condiments). A pantry staple for a quick, freshly-mixed side to go with dosa, idli or a simple meal.\n\n" +
          "South Indian-Style Chutney Powders:\n" +
          "Coconut Chutney Powder and Gunpowder (Idli/Podi) Mix are classic South Indian dry chutney powders, traditionally mixed with a little oil or ghee just before serving alongside idli, dosa or rice.\n\n" +
          "Everyday Chutney Mixes:\n" +
          "Tamarind Chutney Mix and Tomato Chutney Mix are rehydrated with water and cooked briefly, offering a quicker alternative to preparing chutney from scratch while still finishing the dish yourself at home.\n\n" +
          "Shop Chutney Powders & Mixes:\n" +
          "• Coconut Chutney Powder\n" +
          "• Gunpowder (Idli/Podi) Mix\n" +
          "• Tamarind Chutney Mix\n" +
          "• Tomato Chutney Mix",
      },
    ],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How do I prepare chutney powder?",
        answer: "Most chutney powders are mixed with a small amount of oil or ghee just before serving — check the specific product's packaging for exact ratios.",
      },
      {
        question: "What is Gunpowder (Podi) chutney?",
        answer: "Gunpowder, or podi, is a dry, spiced lentil-and-chili powder traditionally mixed with oil or ghee and served with idli, dosa or rice.",
      },
      {
        question: "Is this the same as ready-made chutney in a jar?",
        answer: "No — these are powders or mixes you finish at home yourself. Ready-to-eat jarred chutney is listed separately under Sauces, Pickles & Condiments.",
      },
      {
        question: "How long does chutney powder last once opened?",
        answer: "Unopened, chutney powders typically last several months; once opened, store in an airtight container and use within the timeframe on the packaging.",
      },
      {
        question: "Are chutney powders spicy?",
        answer: "Spice level varies by product — check the individual product description for guidance, as some are milder than others.",
      },
      {
        question: "Can I add chutney powder to other dishes, not just idli/dosa?",
        answer: "Yes — many people sprinkle chutney powders over rice, mix into yogurt, or use as a seasoning for other snacks.",
      },
      {
        question: "Are chutney powders vegan?",
        answer: "Most are vegan if mixed with oil rather than ghee — check the individual product's ingredient list and preparation suggestion.",
      },
      {
        question: "How do I prepare Tamarind Chutney Mix?",
        answer: "Typically the mix is dissolved in water and briefly cooked or heated according to pack instructions — check the specific product for exact steps.",
      },
      {
        question: "Do chutney powders contain nuts?",
        answer: "Some coconut or nut-based chutney powders may contain or be processed near nuts — check the individual product's allergen information.",
      },
      {
        question: "Is chutney powder gluten-free?",
        answer: "Many chutney powders are naturally gluten-free (lentil, coconut or spice-based), but check the individual product's ingredient list to confirm.",
      },
      {
        question: "Can I store leftover prepared chutney in the fridge?",
        answer: "Once mixed with oil or water, prepared chutney should generally be refrigerated and consumed within a few days — check specific product guidance.",
      },
      {
        question: "What's the difference between Coconut Chutney Powder and Gunpowder?",
        answer: "Coconut Chutney Powder is primarily coconut-based, while Gunpowder (Podi) is a spiced lentil-and-chili blend — both are dry powders mixed with oil before serving.",
      },
      {
        question: "Can I use chutney mix as a dip?",
        answer: "Yes — once prepared, chutney can be used as a dip for snacks as well as a side for South Indian dishes.",
      },
      {
        question: "How spicy is Tomato Chutney Mix compared to fresh chutney?",
        answer: "Spice level is set by the brand's recipe and can vary — check the individual product description.",
      },
      {
        question: "Are these chutney mixes suitable for children?",
        answer: "Most are suitable, but check spice level and prepare a milder version if serving to young children.",
      },
    ],
  },
  "dessert-mix": {
    sections: [
      {
        title: "Explore Dessert Mix",
        description:
          "A festive dinner or a simple weeknight craving both call for something sweet — and these mixes get a familiar South Asian dessert on the table without hours in the kitchen.\n\n" +
          "Milk-Based Sweets:\n" +
          "Kheer Mix and Custard Powder are cooked with milk and sugar for a quick, creamy dessert, while Gulab Jamun Mix provides the dough base for frying and soaking in sugar syrup — a festive favourite made simple.\n\n" +
          "Halwa & Traditional Sweet Mixes:\n" +
          "Halwa Mix (such as suji/semolina halwa) and other traditional sweet mixes offer a shortcut to classic desserts, typically cooked with ghee, sugar and water or milk.\n\n" +
          "Shop Dessert Mixes:\n" +
          "• Kheer Mix\n" +
          "• Gulab Jamun Mix\n" +
          "• Halwa Mix (Suji/Semolina)\n" +
          "• Custard Powder",
      },
    ],
image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "How do I prepare Kheer Mix?",
        answer: "Kheer Mix is typically cooked with milk and sugar until thickened — check the specific product's packaging for exact quantities and timing.",
      },
      {
        question: "How do I make Gulab Jamun from the mix?",
        answer: "The mix is combined with a small amount of milk or water to form a dough, shaped into balls, fried, and then soaked in sugar syrup — check individual packaging for step-by-step instructions.",
      },
      {
        question: "Are dessert mixes vegetarian?",
        answer: "Most dessert mixes are vegetarian; check the individual product label for confirmation, especially regarding dairy content for those with dietary restrictions.",
      },
      {
        question: "Do dessert mixes contain nuts?",
        answer: "Some kheer and halwa mixes contain or are processed near nuts — check the individual product's allergen information.",
      },
      {
        question: "Can I make these desserts vegan by substituting plant-based milk?",
        answer: "Many people substitute plant-based milk in Kheer or Custard, though texture and flavour may vary slightly from the traditional dairy version.",
      },
      {
        question: "How long does Gulab Jamun Mix last unopened?",
        answer: "Unopened mix typically has a shelf life of several months to a year — check the best-before date on individual packaging.",
      },
      {
        question: "Is Halwa Mix the same as store-bought halwa?",
        answer: "Halwa Mix is a powder base you cook yourself with ghee, sugar and liquid, rather than a ready-to-eat product.",
      },
      {
        question: "Can I adjust the sweetness of these dessert mixes?",
        answer: "Yes — most recipes allow you to adjust added sugar to taste, though the mix itself may already contain some sugar; check the ingredient list.",
      },
      {
        question: "How should I store an opened dessert mix?",
        answer: "Reseal in an airtight container and store in a cool, dry place, using within the timeframe indicated on the packaging.",
      },
      {
        question: "Are these dessert mixes gluten-free?",
        answer: "This varies — Kheer and Custard are often gluten-free depending on thickener used, while Halwa Mix made from semolina (suji) contains gluten. Check individual product labels.",
      },
      {
        question: "Can I prepare Custard Powder without milk?",
        answer: "Custard Powder is traditionally prepared with milk for the classic texture and flavour; water-based preparation isn't typically recommended.",
      },
      {
        question: "What occasions are these dessert mixes typically used for?",
        answer: "These are popular for festivals, celebrations and everyday cravings alike — quick enough for a weeknight, festive enough for a special occasion.",
      },
      {
        question: "Can children eat these dessert mixes?",
        answer: "Most are suitable for children, though check sugar content and any allergen information first.",
      },
      {
        question: "How many servings does one pack of Kheer Mix make?",
        answer: "Serving size varies by product — check the individual packaging for exact yield.",
      },
      {
        question: "Do you sell sugar-free dessert mix options?",
        answer: "Sugar-free or reduced-sugar options vary by brand — check the site or individual product pages for availability.",
      },
    ],
  },
  "instant-noodles": {
    sections: [
      {
        title: "Explore Instant Noodles",
        description:
          "A quick, familiar bowl of noodles — ready in minutes, whether it's a nostalgic masala flavour or a simple everyday pack for a fast meal or snack.\n\n" +
          "Packet Noodles:\n" +
          "Traditional packet-style instant noodles with a separate seasoning packet, cooked on the stovetop in a few minutes — the classic, familiar format many grew up with.\n\n" +
          "Cup & Bowl Noodles:\n" +
          "Just-add-hot-water cup and bowl noodles, ideal for a fast meal at the office, on the go, or when you don't want to use a stove.\n\n" +
          "Shop Instant Noodles:\n" +
          "• Masala Packet Noodles\n" +
          "• Chicken-Flavour Packet Noodles\n" +
          "• Vegetable Packet Noodles\n" +
          "• Cup Noodles",
      },
    ],
image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "How long do instant noodles take to cook?",
        answer: "Most packet noodles cook in 2–4 minutes; cup noodles typically need 3–5 minutes with hot water — check individual packaging for exact timing.",
      },
      {
        question: "Are your instant noodles halal?",
        answer: "Halal certification status varies by brand — check the individual product page for certification details.",
      },
      {
        question: "Do instant noodles contain MSG?",
        answer: "This varies by brand — check the individual product's ingredient list for MSG and other flavour enhancers.",
      },
      {
        question: "Are there vegetarian instant noodle options?",
        answer: "Yes — vegetable and masala-flavoured noodles are typically vegetarian, but always check the individual product label to confirm, as some seasoning packets may contain non-vegetarian ingredients.",
      },
      {
        question: "Can I add my own vegetables or egg to instant noodles?",
        answer: "Yes — many people customize instant noodles with added vegetables, egg or protein to make a more complete meal.",
      },
      {
        question: "Are cup noodles microwaveable?",
        answer: "This varies by product — check the individual packaging, as some cup noodles are designed for hot water only and are not microwave-safe in their cup.",
      },
      {
        question: "How spicy are masala instant noodles?",
        answer: "Spice level varies by brand — check the individual product description for guidance.",
      },
      {
        question: "What's the shelf life of instant noodles?",
        answer: "Unopened instant noodles typically have a shelf life of several months to about a year — check the best-before date on individual packaging.",
      },
      {
        question: "Are instant noodles suitable for children?",
        answer: "Most instant noodles are suitable for children, though parents may want to check sodium content and adjust spice level.",
      },
      {
        question: "Can I buy instant noodles in bulk cartons?",
        answer: "Bulk or multi-pack cartons vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Do you sell gluten-free instant noodles?",
        answer: "Availability varies — most traditional wheat-based noodles contain gluten; check the individual product's ingredient list for gluten-free alternatives if needed.",
      },
      {
        question: "What's the difference between packet and cup noodles?",
        answer: "Packet noodles are typically cooked on the stovetop with a separate seasoning sachet, while cup noodles are pre-portioned and prepared by simply adding hot water.",
      },
      {
        question: "Are instant noodles a healthy meal option?",
        answer: "Instant noodles are a convenient, quick meal option; for a more balanced meal, many people add vegetables and a protein source.",
      },
      {
        question: "Do your instant noodles contain nuts?",
        answer: "Some flavours may contain or be processed near nuts — check the individual product's allergen information.",
      },
      {
        question: "Can I use the seasoning packet for other recipes?",
        answer: "Some people do use noodle seasoning packets to flavour other quick dishes, though this isn't the packet's intended primary use.",
      },
    ],
  },
  "other-condiments": {
    sections: [
      {
        title: "Explore Other Condiment Mixes",
        description:
          "This category covers instant condiment powders and mixes — seasonings you finish at home with fresh ingredients, water or yogurt, rather than a ready-to-eat jarred product (find those under Sauces, Pickles & Condiments).\n\n" +
          "Seasoning Powders:\n" +
          "Chaat Masala is the go-to tangy, spiced seasoning sprinkled over fruit, snacks and street-food-style dishes, while Pickle Masala Mix lets you prepare a quick homemade-style pickle by combining the spice mix with fresh vegetables and oil.\n\n" +
          "Instant Yogurt & Salad Mixes:\n" +
          "Raita Mix is stirred into plain yogurt for a quick cooling side dish, and similar instant salad seasoning mixes offer a fast way to season fresh vegetables.\n\n" +
          "Shop Other Condiment Mixes:\n" +
          "• Chaat Masala\n" +
          "• Raita Mix\n" +
          "• Pickle Masala Mix\n" +
          "• Instant Salad Seasoning Mix",
      },
    ],
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Chaat Masala used for?",
        answer: "Chaat Masala is a tangy, spiced seasoning blend sprinkled over fruit, snacks, salads and street-food-style dishes for extra flavour.",
      },
      {
        question: "How do I use Raita Mix?",
        answer: "Raita Mix is stirred into plain yogurt, usually with a little water, to make a quick cooling side dish — check the specific product's packaging for exact ratios.",
      },
      {
        question: "How do I make pickle with Pickle Masala Mix?",
        answer: "The mix is typically combined with fresh vegetables (like mango or lemon) and oil, then left to mature for a period before eating — check individual packaging for the specific method and timing.",
      },
      {
        question: "Is this different from ready-made pickle in a jar?",
        answer: "Yes — Pickle Masala Mix is a spice blend you use to make pickle yourself at home; ready-made jarred pickle is listed separately under Sauces, Pickles & Condiments.",
      },
      {
        question: "Is Chaat Masala spicy?",
        answer: "Chaat Masala is more tangy and savoury than strongly spicy, though heat level can vary slightly by brand — check the individual product description.",
      },
      {
        question: "Are these condiment mixes vegetarian?",
        answer: "Yes, these seasoning mixes are generally vegetarian — check the individual product label to confirm.",
      },
      {
        question: "How long does Chaat Masala last once opened?",
        answer: "Stored in an airtight container away from moisture, Chaat Masala typically stays fresh for several months to a year — check the packaging for guidance.",
      },
      {
        question: "Can I use Chaat Masala on foods other than fruit and chaat?",
        answer: "Yes — many people use it on roasted snacks, salads, eggs and even popcorn for a tangy kick.",
      },
      {
        question: "Is Raita Mix suitable for vegans?",
        answer: "Raita Mix itself is typically a dry spice blend and may be vegan, but it's traditionally mixed with dairy yogurt — check the individual product for vegan yogurt alternatives suitability.",
      },
      {
        question: "Are these condiment mixes gluten-free?",
        answer: "Many spice-based condiment mixes are naturally gluten-free, but check the individual product's ingredient list to confirm, as some blends include additives.",
      },
      {
        question: "How much Pickle Masala Mix do I need per kilogram of vegetables?",
        answer: "This varies by product — check the specific packaging for the recommended ratio.",
      },
      {
        question: "Can I store homemade pickle made from the mix at room temperature?",
        answer: "This depends on the specific pickle recipe and preparation method — check individual product guidance, as some homemade pickles require refrigeration.",
      },
      {
        question: "Do these condiment mixes contain preservatives?",
        answer: "This varies by product — check the individual product's ingredient list.",
      },
      {
        question: "What's the difference between Chaat Masala and regular table salt seasoning?",
        answer: "Chaat Masala is a complex blend of multiple spices (including dried mango powder, cumin and black salt), offering a tangy, layered flavour beyond plain salt.",
      },
      {
        question: "Can children eat foods seasoned with these condiment mixes?",
        answer: "Most are suitable for children in moderate amounts, though check ingredient lists for any specific concerns.",
      },
    ],
  },
  "other-instant-foods": {
    sections: [
      {
        title: "Explore Other Instant Foods",
        description:
          "This category rounds up instant breakfast and snack mixes that don't fit neatly into chutney, dessert or noodles — the everyday quick-prep basics like idli, dosa, poha and upma mixes that make a fast, familiar breakfast possible any day of the week.\n\n" +
          "Instant Idli & Dosa Mixes:\n" +
          "Idli Mix and Dosa Mix are pre-prepared rice-and-lentil batters (usually instant powder or ready batter) that skip the traditional soaking-and-grinding process, letting you make South Indian breakfast staples in a fraction of the usual time.\n\n" +
          "Poha & Upma Mixes:\n" +
          "Instant Poha (flattened rice) and Upma Mix (semolina-based) are quick-cooking breakfast options, typically combined with vegetables and a simple tempering of spices.\n\n" +
          "Shop Other Instant Foods:\n" +
          "• Idli Mix\n" +
          "• Dosa Mix\n" +
          "• Instant Poha\n" +
          "• Upma Mix",
      },
    ],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How do I prepare Idli Mix?",
        answer: "Idli Mix is typically combined with water to form a batter, then steamed in an idli mould — check individual packaging for exact water ratio and steaming time.",
      },
      {
        question: "Is Dosa Mix the same as Idli Mix?",
        answer: "They're related but different — Dosa Mix is typically formulated for a thinner, spreadable batter cooked on a flat griddle, while Idli Mix is thicker and steamed.",
      },
      {
        question: "How long does it take to prepare instant Poha?",
        answer: "Instant Poha is one of the quickest options, often ready in under 15 minutes once combined with vegetables and tempering spices — check individual packaging for specific timing.",
      },
      {
        question: "What is Upma Mix made from?",
        answer: "Upma is traditionally made from semolina (sooji/rava), cooked with vegetables and a tempering of mustard seeds, curry leaves and other spices.",
      },
      {
        question: "Are these breakfast mixes vegetarian?",
        answer: "Yes — Idli, Dosa, Poha and Upma mixes are all traditionally vegetarian.",
      },
      {
        question: "Is Idli Mix gluten-free?",
        answer: "Traditional Idli Mix (rice and lentil-based) is typically gluten-free, but check the individual product's ingredient list to confirm, especially for any added ingredients.",
      },
      {
        question: "Is Upma Mix gluten-free?",
        answer: "No — traditional Upma is made from semolina (a wheat product) and contains gluten.",
      },
      {
        question: "Can I add vegetables to these instant mixes?",
        answer: "Yes — most people add vegetables like onion, carrot and peas to Poha, Upma, Dosa and even Idli batter for extra flavour and nutrition.",
      },
      {
        question: "How should I store instant Idli or Dosa Mix?",
        answer: "Store in a cool, dry place in an airtight container; once mixed into batter, refrigerate and use within the timeframe suggested on the packaging.",
      },
      {
        question: "Is instant Poha the same as flattened rice sold elsewhere?",
        answer: "Yes — Poha refers to flattened rice; \"instant\" versions are typically pre-processed for faster preparation, but the base ingredient is the same.",
      },
      {
        question: "Can I make these dishes without the instant mix, from scratch?",
        answer: "Yes, traditional recipes exist for all of these dishes from scratch — the instant mixes are designed to save preparation time, particularly the soaking and grinding steps for Idli and Dosa.",
      },
      {
        question: "How many servings does one pack of Dosa Mix make?",
        answer: "Serving size varies by product — check the individual product's packaging for exact yield.",
      },
      {
        question: "Are these mixes suitable for a quick weekday breakfast?",
        answer: "Yes — Poha and Upma in particular are popular for their speed, often ready in 10–15 minutes.",
      },
      {
        question: "Can children eat these breakfast dishes?",
        answer: "Yes, these are common family breakfast dishes across South Asian households and are generally suitable for children.",
      },
      {
        question: "Do these mixes contain nuts?",
        answer: "Upma and Poha recipes sometimes include or are garnished with peanuts or cashews — check the individual product's ingredient and allergen information.",
      },
    ],
  },
  "quick-meals": {
    sections: [
      {
        title: "Explore Quick Meals",
        description:
          "For a full main meal without starting entirely from scratch, these kits and mixes provide the spice blend and instructions — you typically add your own rice, protein or vegetables to finish the dish at home.\n\n" +
          "Rice-Based Meal Mixes:\n" +
          "Biryani Masala Mix and Pulao Mix provide the spice base for these classic rice dishes — combine with rice, your choice of protein or vegetables, and follow the pack method for a faster route to a full, flavourful meal.\n\n" +
          "Curry & Dal Kits:\n" +
          "Curry Kits provide a pre-measured spice blend (and sometimes a base sauce) for a specific curry, while Instant Dal Mix offers a quicker route to a comforting lentil side or main.\n\n" +
          "Shop Quick Meals:\n" +
          "• Biryani Masala Mix\n" +
          "• Pulao Mix\n" +
          "• Curry Kit\n" +
          "• Instant Dal Mix",
      },
    ],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Do I need to add my own protein and vegetables to these kits?",
        answer: "Most kits are designed for you to add your own protein (chicken, vegetables, paneer, etc.) — check the individual product description for exactly what's included versus what you need to add.",
      },
      {
        question: "How do I make Biryani using the masala mix?",
        answer: "Typically, you cook your chosen protein/vegetables and rice with the biryani masala mix following the layering and cooking method described on the packaging.",
      },
      {
        question: "What's the difference between Biryani Masala Mix and Pulao Mix?",
        answer: "Biryani Masala Mix is generally more intensely spiced for the classic biryani flavour profile, while Pulao Mix tends to be milder, suited to a simpler rice dish.",
      },
      {
        question: "Are these quick meal kits vegetarian?",
        answer: "Kit bases are often vegetarian and suitable for adding your own vegetarian or non-vegetarian protein — check the individual product label to confirm the mix itself contains no meat-derived ingredients if that matters to you.",
      },
      {
        question: "How spicy are the curry kits?",
        answer: "Spice level varies by kit — check the individual product description, as some offer mild, medium and hot versions.",
      },
      {
        question: "Can I make these meals vegan?",
        answer: "Many kits can be made vegan by using plant-based protein and omitting any dairy garnish — check the individual product's base ingredients to confirm the kit itself is vegan-friendly.",
      },
      {
        question: "How long does it take to cook a meal using these kits?",
        answer: "This varies by kit — check the individual product's packaging for total cooking time, which is generally faster than a fully from-scratch version.",
      },
      {
        question: "What is Instant Dal Mix made from?",
        answer: "Instant Dal Mix typically contains pre-spiced lentils or a lentil-based powder, designed to cook faster than starting entirely from raw dal and separate spices.",
      },
      {
        question: "Are these kits gluten-free?",
        answer: "This varies by product — check the individual product's ingredient list, as some spice blends include gluten-containing anti-caking agents or thickeners.",
      },
      {
        question: "How many people does one Biryani Masala Mix pack serve?",
        answer: "Serving size varies by product — check the individual packaging for the recommended quantity of rice and protein per pack.",
      },
      {
        question: "Can I freeze leftovers made from these meal kits?",
        answer: "Most cooked rice and curry dishes can be frozen and reheated, but always follow safe food storage and reheating practices.",
      },
      {
        question: "Do these kits include rice, or just the spice mix?",
        answer: "Most kits provide the spice mix and instructions only — rice is purchased separately unless the product page states rice is included.",
      },
      {
        question: "Are these meal kits suitable for beginners who don't cook much South Asian food?",
        answer: "Yes — these kits are designed to simplify the process with pre-measured spices and step-by-step instructions, making them a good starting point.",
      },
      {
        question: "Can children eat meals made from these kits?",
        answer: "Most dishes can be made child-friendly by reducing the spice level or choosing a milder kit — check individual product spice ratings.",
      },
      {
        question: "Do you offer combo packs (e.g. Biryani Mix + Rice) for convenience?",
        answer: "Combo or bundle availability varies by current promotions — check the site for current offers.",
      },
    ],
  },
  "lentils": {
    sections: [
      {
        title: "Explore Lentils (Dal)",
        description:
          "Dal is the everyday backbone of South Asian home cooking — quick-cooking, comforting and endlessly versatile depending on which lentil you reach for. Our range covers the five most commonly used split lentils.\n\n" +
          "Everyday Dal Varieties:\n" +
          "Toor Dal (Pigeon Pea) and Masoor Dal (Red Lentil) are two of the most widely cooked everyday dals — Masoor in particular is prized for its quick cooking time and mild flavour, needing no soaking.\n\n" +
          "Specialty & Recipe-Specific Dal:\n" +
          "Moong Dal (Split Yellow Gram) is light and easy to digest, often used for simple dal or khichdi. Chana Dal (Split Chickpea) has a nuttier, firmer bite, while Urad Dal (Black Gram) is the traditional base for dishes like dal makhani and South Indian batters.\n\n" +
          "Shop Lentils (Dal):\n" +
          "• Toor Dal (Pigeon Pea)\n" +
          "• Masoor Dal (Red Lentil)\n" +
          "• Moong Dal (Split Yellow Gram)\n" +
          "• Chana Dal (Split Chickpea)\n" +
          "• Urad Dal (Black Gram)",
      },
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Which dal cooks the fastest?",
        answer: "Masoor Dal (red lentil) is generally the fastest-cooking, often ready in 15–20 minutes without soaking.",
      },
      {
        question: "Do I need to soak Toor Dal before cooking?",
        answer: "Toor Dal doesn't strictly require soaking, but soaking for 20–30 minutes can help it cook faster and more evenly.",
      },
      {
        question: "What is Urad Dal used for besides dal makhani?",
        answer: "Urad Dal is also the traditional base for South Indian batters (idli, dosa) and various lentil-based snacks, in addition to dishes like dal makhani.",
      },
      {
        question: "What's the difference between Chana Dal and regular chickpeas?",
        answer: "Chana Dal is split and husked chickpeas (specifically from a smaller variety), with a different texture and faster cooking time than whole chickpeas.",
      },
      {
        question: "Is Moong Dal easy to digest?",
        answer: "Moong Dal, particularly the split and skinned yellow variety, is traditionally considered one of the gentler, easier-to-digest lentils, which is why it's a common choice during illness or for simple meals.",
      },
      {
        question: "How long does dal take to cook on the stovetop?",
        answer: "This varies by type — Masoor Dal can cook in 15–20 minutes, while Toor and Chana Dal may take 30–45 minutes, and using a pressure cooker significantly reduces these times.",
      },
      {
        question: "Can I mix different dals together?",
        answer: "Yes — many recipes, like panchmel dal, combine multiple lentil varieties for a more complex flavour and texture.",
      },
      {
        question: "How should I store dal to keep it fresh?",
        answer: "Store in an airtight container in a cool, dry place; well-stored dal can last a year or more, though for best flavour, use within several months.",
      },
      {
        question: "What's the difference between whole Urad Dal and split Urad Dal?",
        answer: "Whole Urad Dal retains its black skin and takes longer to cook, producing a heartier texture, while split (and often skinned) Urad Dal cooks faster and is commonly used for batters.",
      },
      {
        question: "Is dal a complete protein?",
        answer: "Lentils are a good source of plant protein but are generally considered more complete when paired with a grain like rice, which together provide a fuller amino acid profile.",
      },
      {
        question: "Can I use a pressure cooker for all types of dal?",
        answer: "Yes — a pressure cooker works well for all dal varieties and significantly cuts cooking time.",
      },
      {
        question: "Why does my Toor Dal sometimes taste bitter?",
        answer: "This can happen if the dal is old or not rinsed thoroughly before cooking — rinse well and check the product's freshness/best-before date.",
      },
      {
        question: "Are these lentils suitable for babies and toddlers?",
        answer: "Well-cooked, mashed dal (particularly Moong Dal) is commonly used as an early food in South Asian households, but always consult a pediatrician regarding appropriate first foods and preparation.",
      },
      {
        question: "What's a simple way to prepare Masoor Dal?",
        answer: "Masoor Dal is typically boiled until soft, then tempered with a mix of spices fried in oil or ghee — check individual product packaging for a simple base recipe.",
      },
      {
        question: "Can I sprout Moong Dal at home?",
        answer: "Whole Moong (not split) is commonly sprouted at home; split Moong Dal is less suited to sprouting due to its processed form.",
      },
    ],
  },
  "beans": {
    sections: [
      {
        title: "Explore Beans",
        description:
          "Whole beans bring heartier, slower-cooked curries to the table — think Rajma Chawal or Chole. Our Beans range covers the classic legumes used across South Asian cooking, from kidney beans to chickpeas.\n\n" +
          "Everyday Curry Beans:\n" +
          "Rajma (Kidney Beans) and Kabuli Chana (White Chickpeas) are two of the most-cooked beans in South Asian households, forming the base of classic curries like Rajma Chawal and Chole.\n\n" +
          "Specialty Beans & Legumes:\n" +
          "Kala Chana (Black Chickpeas) has a denser texture and nuttier flavour than its white counterpart, often used in curries and festive dishes. Lobia (Black-Eyed Peas) and Whole Soybeans round out the range for regional and everyday recipes.\n\n" +
          "Shop Beans:\n" +
          "• Rajma (Kidney Beans)\n" +
          "• Kabuli Chana (White Chickpeas)\n" +
          "• Kala Chana (Black Chickpeas)\n" +
          "• Lobia (Black-Eyed Peas)\n" +
          "• Whole Soybeans",
      },
    ],
image: "https://images.unsplash.com/photo-1564894809611-1742fc40ed80?auto=format&fit=crop&q=80&w=1000",    faqs: [
      {
        question: "Do I need to soak Rajma before cooking?",
        answer: "Yes — Rajma (kidney beans) should be soaked for at least 6–8 hours or overnight, and then fully boiled before eating, as undercooked kidney beans contain a natural toxin that soaking and thorough cooking neutralises.",
      },
      {
        question: "Is it dangerous to undercook kidney beans?",
        answer: "Yes — raw or undercooked red kidney beans contain a natural toxin (phytohaemagglutinin) that can cause food poisoning. Proper soaking and full boiling (including a rolling boil for at least 10 minutes, not just a slow simmer) is essential before eating.",
      },
      {
        question: "What's the difference between Kabuli Chana and Kala Chana?",
        answer: "Kabuli Chana is the larger, lighter-coloured chickpea commonly used for Chole, while Kala Chana is smaller, darker and denser, with a nuttier flavour and firmer texture.",
      },
      {
        question: "How long should I soak chickpeas before cooking?",
        answer: "Chickpeas (Kabuli or Kala Chana) are typically soaked for 8 hours or overnight for best results, then cooked until tender.",
      },
      {
        question: "Can I use a pressure cooker for Rajma and Chana?",
        answer: "Yes — a pressure cooker is commonly used to significantly reduce cooking time for both, though soaking beforehand is still recommended.",
      },
      {
        question: "What is Lobia (Black-Eyed Peas) used for?",
        answer: "Lobia is used in a variety of regional curries and salads, valued for its relatively quicker cooking time compared to other whole beans.",
      },
      {
        question: "Do Lobia (black-eyed peas) need soaking?",
        answer: "Lobia generally requires less soaking time than Rajma or Chana, though soaking for a couple of hours can still help reduce cooking time.",
      },
      {
        question: "Are these beans a good source of protein?",
        answer: "Beans are widely recognised as a strong source of plant-based protein and fibre, commonly used as a staple in vegetarian and vegan diets.",
      },
      {
        question: "How should I store dried beans?",
        answer: "Store in an airtight container in a cool, dry place; well-stored beans can last a year or more, though very old beans may take longer to cook and soften.",
      },
      {
        question: "Can I skip soaking if I'm short on time?",
        answer: "Soaking significantly reduces cooking time and, for kidney beans specifically, is an important food-safety step — a quick-soak method (boiling briefly, then resting covered for an hour) can be used if you're short on time, but shouldn't be skipped entirely for Rajma.",
      },
      {
        question: "What is Whole Soybean used for in South Asian cooking?",
        answer: "Whole soybeans are used in various regional dishes and are valued for their high protein content; they typically require thorough soaking and cooking similar to other dense beans.",
      },
      {
        question: "Are canned beans a substitute for dried beans in recipes?",
        answer: "Yes, canned beans (already cooked) can be substituted for convenience, though cooking dried beans yourself allows more control over texture and seasoning.",
      },
      {
        question: "Why do my beans sometimes stay hard even after cooking?",
        answer: "This can happen with very old beans, or if salt/acidic ingredients (like tomatoes) are added too early in cooking, which can toughen the skins — add these after the beans have softened.",
      },
      {
        question: "Are these beans suitable for a slow cooker?",
        answer: "Yes, though pre-soaking is still recommended, particularly for Rajma, both for safety and to ensure even cooking in a slow cooker.",
      },
      {
        question: "What's a classic dish made with Rajma?",
        answer: "Rajma Chawal — kidney bean curry served with rice — is one of the most iconic comfort food dishes made with Rajma.",
      },
    ],
  },
  "cooking-oil": {
    sections: [
      {
        title: "Explore Cooking Oil",
        description:
          "The choice of oil shapes the flavour of a dish as much as the spices do — from the pungent, distinctive taste of mustard oil in eastern and northern regional cooking, to the neutral everyday base of sunflower oil.\n\n" +
          "Regional & Flavourful Oils:\n" +
          "Mustard Oil is a defining ingredient in Bengali and Punjabi cooking, prized for its sharp, pungent flavour, while Sesame (Til) Oil and Groundnut (Peanut) Oil bring their own distinct, nutty notes to regional dishes.\n\n" +
          "Everyday Neutral Oils:\n" +
          "Sunflower Oil and Vegetable Oil are the most commonly used everyday cooking oils for their neutral flavour and versatility, while Coconut Oil is a staple in South Indian and coastal regional cooking.\n\n" +
          "Shop Cooking Oil:\n" +
          "• Mustard Oil\n" +
          "• Sunflower Oil\n" +
          "• Sesame (Til) Oil\n" +
          "• Groundnut (Peanut) Oil\n" +
          "• Coconut Oil\n" +
          "• Vegetable Oil",
      },
    ],
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Mustard Oil used for?",
        answer: "Mustard Oil is a staple in Bengali, Punjabi and other regional South Asian cooking, valued for its sharp, pungent flavour, often used for pickling, frying and tempering.",
      },
      {
        question: "Is Mustard Oil safe to cook with?",
        answer: "Mustard oil regulations and labelling vary in the EU depending on erucic acid content — check the individual product page for specific compliance and intended-use information.",
      },
      {
        question: "What's the smoke point of Sunflower Oil?",
        answer: "Sunflower oil generally has a high smoke point, making it suitable for frying, though exact figures vary by product — check the individual product label.",
      },
      {
        question: "What is Groundnut (Peanut) Oil used for?",
        answer: "Groundnut oil is prized for its high smoke point and mild nutty flavour, commonly used for frying and in certain regional curries.",
      },
      {
        question: "Is your Sesame Oil the toasted (dark) or light variety?",
        answer: "Both varieties may be available — check the individual product page, as toasted sesame oil has a stronger, nuttier flavour typically used for finishing dishes, while light sesame oil is more neutral and used for cooking.",
      },
      {
        question: "Can I substitute one cooking oil for another in a recipe?",
        answer: "Yes, though flavour and smoke point will vary — mustard and sesame oil in particular have distinctive flavours that will change the character of a dish compared to a neutral oil.",
      },
      {
        question: "Are these oils cold-pressed?",
        answer: "Extraction method varies by product — check the individual product page for cold-pressed (kachi ghani) or refined processing details.",
      },
      {
        question: "How should I store cooking oil?",
        answer: "Store in a cool, dry place away from direct sunlight and heat, which can cause oil to degrade or turn rancid more quickly.",
      },
      {
        question: "Are these oils suitable for deep frying?",
        answer: "Oils with a higher smoke point, such as sunflower, groundnut and refined vegetable oil, are generally better suited to deep frying than oils with a lower smoke point.",
      },
      {
        question: "Is Coconut Oil solid or liquid at room temperature?",
        answer: "Coconut oil is solid at cooler room temperatures and liquefies when warmed — this is a normal characteristic of the oil, not a quality issue.",
      },
      {
        question: "What's the shelf life of an opened bottle of oil?",
        answer: "This varies by oil type — check the best-before date on individual packaging, and store properly to preserve freshness.",
      },
      {
        question: "Are your cooking oils refined or unrefined?",
        answer: "This varies by product — check the individual product page, as refined and unrefined (raw/cold-pressed) oils differ in flavour, smoke point and processing.",
      },
      {
        question: "Can I use Mustard Oil for skin or hair care as well as cooking?",
        answer: "Mustard oil sold for culinary use and mustard oil formulated for topical/cosmetic use may differ in processing and purity — for topical use, check our Herbal Skin Products and Herbal Hair Products ranges for products specifically formulated for that purpose.",
      },
      {
        question: "Do you sell oil in smaller or trial-size bottles?",
        answer: "Pack size availability varies by product — check the individual product page.",
      },
      {
        question: "Are these oils suitable for vegans?",
        answer: "Yes — all plant-based cooking oils in this category are naturally vegan.",
      },
    ],
  },
  "ghee": {
    sections: [
      {
        title: "Explore Ghee",
        description:
          "A spoonful of ghee finishes a dal, enriches a paratha, or forms the base of a sweet — a household staple that's as much about flavour and ritual as it is about cooking. Our range covers traditional dairy ghee alongside vegetable-based alternatives.\n\n" +
          "Traditional Dairy Ghee:\n" +
          "Cow Ghee is the most widely used and traditionally preferred ghee in Ayurvedic and everyday cooking, prized for its rich aroma. Buffalo Ghee has a denser texture and a slightly different flavour profile, also widely used across South Asian households.\n\n" +
          "Vegetable Ghee:\n" +
          "Vegetable Ghee (Vanaspati) is a plant-based alternative designed to mimic the texture and cooking properties of dairy ghee, often chosen by those avoiding dairy or looking for a more affordable everyday option.\n\n" +
          "Shop Ghee:\n" +
          "• Cow Ghee\n" +
          "• Buffalo Ghee\n" +
          "• Vegetable Ghee (Vanaspati)",
      },
    ],
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is ghee made from?",
        answer: "Traditional ghee is made by simmering butter to separate and remove the milk solids and water, leaving pure clarified butterfat with a rich, nutty flavour.",
      },
      {
        question: "What's the difference between Cow Ghee and Buffalo Ghee?",
        answer: "Cow ghee is generally lighter in colour and considered more aromatic, while buffalo ghee tends to be whiter, denser and slightly richer in flavour — both are widely used depending on regional and personal preference.",
      },
      {
        question: "Does ghee need to be refrigerated?",
        answer: "Ghee is typically shelf-stable at room temperature if kept sealed and a clean, dry spoon is used each time, but always check the individual product's storage guidance.",
      },
      {
        question: "Is Vegetable Ghee (Vanaspati) the same as real ghee?",
        answer: "No — Vanaspati is a hydrogenated vegetable oil product formulated to mimic the texture and cooking properties of dairy ghee, but it's nutritionally and compositionally different from traditional dairy ghee.",
      },
      {
        question: "Is ghee suitable for lactose-intolerant people?",
        answer: "Ghee has most of the lactose and milk solids removed during the clarification process, which is why many lactose-intolerant individuals tolerate it better than butter — but individual tolerance varies, so consult a healthcare professional if you have concerns.",
      },
      {
        question: "What's the shelf life of ghee?",
        answer: "Pure ghee has a notably long shelf life due to the removal of milk solids and water — often many months to over a year when stored properly, but check the individual product's best-before date.",
      },
      {
        question: "Can I use ghee for high-heat frying?",
        answer: "Yes — ghee has a relatively high smoke point, making it suitable for frying and sautéing, in addition to its traditional use as a finishing touch.",
      },
      {
        question: "Is ghee vegan-friendly?",
        answer: "No — traditional cow and buffalo ghee are dairy products. Vegetable Ghee (Vanaspati) is a separate, plant-based alternative, but check the individual product's ingredient list, as formulations vary.",
      },
      {
        question: "Why is my ghee sometimes solid and sometimes liquid?",
        answer: "Ghee's texture changes naturally with temperature — it becomes more liquid in warmer conditions and solidifies when cool. This is a normal characteristic, not a sign of spoilage.",
      },
      {
        question: "What's the difference between ghee and cooking oil?",
        answer: "Ghee is a dairy-derived clarified fat with a distinct nutty flavour, while cooking oils are typically plant-derived — both are used in South Asian cooking, often for different dishes or purposes.",
      },
      {
        question: "Is A2 ghee different from regular ghee?",
        answer: "A2 ghee is made from milk of cow breeds that produce only the A2 beta-casein protein, which some people prefer; check the individual product page for whether this specific type is available and its sourcing details.",
      },
      {
        question: "Can ghee be used in baking?",
        answer: "Yes — ghee is sometimes used in baking as a butter substitute, lending a distinct flavour, though results can vary by recipe.",
      },
      {
        question: "How much ghee should I use in cooking?",
        answer: "This varies by recipe and personal preference — ghee is often used in moderation as a flavour-enhancing finishing touch as well as a cooking fat.",
      },
      {
        question: "Are there different grades or qualities of ghee?",
        answer: "Quality can vary by production method, sourcing and purity — check the individual product page for specific sourcing and quality information.",
      },
      {
        question: "Can I substitute Vegetable Ghee for dairy ghee in a recipe?",
        answer: "Yes, though the flavour will differ noticeably from traditional dairy ghee — Vegetable Ghee is often chosen specifically as a dairy-free alternative rather than a flavour-matched substitute.",
      },
    ],
  },


 
  "pastes": {
    sections: [
      {
        title: "Explore Cooking Pastes",
        description:
          "Pastes are one of the biggest time-savers in South Asian cooking — pre-blended so you can skip the daily chopping, peeling and grinding, and go straight to cooking.\n\n" +
          "Everyday Cooking Bases:\n" +
          "Ginger-Garlic Paste is the single most-used base in South Asian cooking, forming the start of countless curries and dishes. Tomato Paste offers a concentrated base for gravies and sauces.\n\n" +
          "Flavour & Heat Pastes:\n" +
          "Green Chili Paste adds heat without the need to chop fresh chilies, while Tamarind Paste provides the tangy depth used across many regional curries and chutneys.\n\n" +
          "Shop Pastes:\n" +
          "• Ginger-Garlic Paste\n" +
          "• Ginger Paste\n" +
          "• Garlic Paste\n" +
          "• Tomato Paste\n" +
          "• Green Chili Paste\n" +
          "• Tamarind Paste",
      },
    ],
    image: "https://images.unsplash.com/photo-1551462147-3f005f1e1f14?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How much Ginger-Garlic Paste should I use compared to fresh?",
        answer: "A general guideline is about 1 teaspoon of paste per clove of garlic or inch of ginger, though this can vary by recipe and personal taste.",
      },
      {
        question: "How long does Ginger-Garlic Paste last after opening?",
        answer: "Refrigerate after opening and use within the timeframe stated on the label, generally a few weeks to a couple of months depending on preservatives used.",
      },
      {
        question: "Do these pastes contain preservatives?",
        answer: "This varies by brand — check the individual product's ingredient list, as some pastes include citric acid or other preservatives to extend shelf life.",
      },
      {
        question: "Can I freeze leftover paste in portions?",
        answer: "Yes — many people freeze ginger-garlic or chili paste in ice cube trays for easy, pre-portioned use later.",
      },
      {
        question: "Is Tamarind Paste the same as Tamarind Concentrate?",
        answer: "They're similar but Concentrate is typically more reduced and stronger — check the individual product's consistency and recommended usage on the label.",
      },
      {
        question: "Are these pastes vegan?",
        answer: "Most cooking pastes are vegan, but check the individual product's ingredient list to confirm.",
      },
      {
        question: "How spicy is Green Chili Paste?",
        answer: "Spice level varies by brand and the type of chili used — check the individual product description for guidance.",
      },
      {
        question: "Can I substitute paste for fresh ginger and garlic in any recipe?",
        answer: "Generally yes, though texture and intensity can differ slightly from fresh — adjust quantity to taste.",
      },
      {
        question: "Are these pastes gluten-free?",
        answer: "Most cooking pastes are naturally gluten-free, but check the individual product's ingredient list to confirm, as some may include additives.",
      },
      {
        question: "What's the difference between Ginger-Garlic Paste and separate Ginger Paste/Garlic Paste?",
        answer: "Ginger-Garlic Paste is a pre-blended combination for convenience, while separate pastes let you control the ratio of each ingredient individually.",
      },
      {
        question: "How should I store an unopened jar of paste?",
        answer: "Store in a cool, dry place; refrigerate after opening as indicated on the label.",
      },
      {
        question: "Can Tomato Paste be used as a substitute for fresh tomatoes?",
        answer: "Yes, though it's more concentrated — use a smaller amount and add water if a recipe calls for fresh tomato volume.",
      },
      {
        question: "Do these pastes have added salt?",
        answer: "This varies by product — check the individual product's ingredient list and adjust seasoning in your recipe accordingly.",
      },
      {
        question: "Why does my Ginger-Garlic Paste sometimes turn slightly pink or discoloured?",
        answer: "This is a natural enzymatic reaction that can occur in ginger-garlic paste and is generally not a safety concern, but always check the product looks and smells normal before use, and discard if there are signs of spoilage.",
      },
      {
        question: "Are these pastes suitable for making marinades?",
        answer: "Yes — ginger-garlic, chili and tamarind pastes are all commonly used as a base for marinades.",
      },
    ],
  },
  "pickles": {
    sections: [
      {
        title: "Explore Indian Pickles (Achaar)",
        description:
          "No South Asian meal feels quite complete without a spoonful of achaar on the side. Our pickle range covers the classic, oil-preserved pickles found in households across the region — spicy, tangy and packed with flavour.\n\n" +
          "Classic Fruit Pickles:\n" +
          "Mango Pickle is the most iconic South Asian pickle, made from raw mango preserved in oil and spices, alongside Lime Pickle, known for its intensely tangy, salty flavour.\n\n" +
          "Vegetable & Garlic Pickles:\n" +
          "Mixed Vegetable Pickle combines several vegetables in one jar, while Garlic Pickle and Green Chili Pickle offer a more intense, pungent option for those who like extra heat with their meal.\n\n" +
          "Shop Pickles:\n" +
          "• Mango Pickle (Achaar)\n" +
          "• Lime Pickle\n" +
          "• Mixed Vegetable Pickle\n" +
          "• Garlic Pickle\n" +
          "• Green Chili Pickle",
      },
    ],
    image: "https://images.unsplash.com/photo-1515942661994-bbf6f1712a7a?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How long does an opened jar of pickle last?",
        answer: "Traditional oil-based South Asian pickles are generally shelf-stable for a long time if kept dry and away from contamination (always use a clean, dry spoon), but check the individual product's label for specific guidance.",
      },
      {
        question: "Do these pickles need to be refrigerated?",
        answer: "Many traditional oil-based pickles don't require refrigeration if stored properly, but always check the individual product's specific storage instructions, as this can vary by recipe and brand.",
      },
      {
        question: "Is Mango Pickle very spicy?",
        answer: "Spice level varies by brand and recipe — check the individual product description, as some are milder than others.",
      },
      {
        question: "What is achaar?",
        answer: "Achaar is the South Asian term for pickle — vegetables or fruit preserved in oil, vinegar or brine with a blend of spices.",
      },
      {
        question: "Are these pickles vegan?",
        answer: "Most South Asian pickles are vegan, but check the individual product's ingredient list to confirm.",
      },
      {
        question: "Why is there a layer of oil on top of the pickle?",
        answer: "This is normal — the oil layer helps preserve the pickle and prevent spoilage; use a clean, dry spoon each time to maintain this.",
      },
      {
        question: "How much pickle should I eat with a meal?",
        answer: "Pickle is traditionally eaten in small quantities as a flavourful side, generally a spoonful alongside the main meal rather than a large serving.",
      },
      {
        question: "Are these pickles gluten-free?",
        answer: "Most traditional pickles are naturally gluten-free, but check the individual product's ingredient list to confirm, as some blends include additives.",
      },
      {
        question: "What's the difference between Lime Pickle and Mango Pickle?",
        answer: "Lime Pickle has a more intensely sour, salty flavour, while Mango Pickle tends to have a more rounded tangy-spicy profile — both are classic South Asian condiments.",
      },
      {
        question: "Can pickle be eaten on its own as a snack?",
        answer: "While traditionally a meal accompaniment, some people do enjoy a small amount of pickle on its own or with bread/rice as a quick snack.",
      },
      {
        question: "Do you sell low-oil or reduced-spice pickle options?",
        answer: "Availability varies by brand — check the individual product page for specific formulation details.",
      },
      {
        question: "Why does my pickle sometimes develop white spots or mould?",
        answer: "This can happen if moisture enters the jar (e.g. from a wet spoon) — always use a clean, dry utensil and ensure the pickle stays submerged in oil to prevent spoilage.",
      },
      {
        question: "Can children eat these pickles?",
        answer: "Pickles are often quite spicy and salty — offer small amounts and check the individual product's spice level before giving to children.",
      },
      {
        question: "What dishes pair well with Mixed Vegetable Pickle?",
        answer: "It's commonly served with rice, dal, roti or paratha as a flavourful side.",
      },
      {
        question: "Are your pickles made with mustard oil or another type of oil?",
        answer: "Oil type varies by product and recipe — check the individual product's ingredient list, as mustard oil is traditional for many North Indian and Pakistani-style pickles.",
      },
    ],
  },
  "sauces": {
    sections: [
      {
        title: "Explore Sauces",
        description:
          "From everyday table sauces to the bold, punchy flavours of Indo-Chinese cooking, this category covers ready-made sauces used both as a finishing condiment and as a cooking ingredient.\n\n" +
          "Everyday Table Sauces:\n" +
          "Tomato Ketchup and Soy Sauce are pantry staples for everyday cooking and as table condiments, familiar in both South Asian and wider Asian cuisine.\n\n" +
          "Indo-Chinese Style Sauces:\n" +
          "Chili Garlic Sauce and Schezwan Sauce are the bold, spicy sauces behind popular Indo-Chinese dishes like Chili Chicken and Schezwan Noodles — pantry staples for a quick homemade version of a takeaway favourite.\n\n" +
          "Shop Sauces:\n" +
          "• Tomato Ketchup\n" +
          "• Soy Sauce\n" +
          "• Chili Garlic Sauce\n" +
          "• Schezwan Sauce\n" +
          "• Tamarind Sauce (Ready-Made)",
      },
    ],
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Schezwan Sauce used for?",
        answer: "Schezwan Sauce is a bold, spicy sauce used in Indo-Chinese cooking, commonly stir-fried with noodles, rice or vegetables for dishes like Schezwan Noodles.",
      },
      {
        question: "Is Chili Garlic Sauce the same as Schezwan Sauce?",
        answer: "They're similar but distinct — Chili Garlic Sauce tends to be more straightforward chili-and-garlic flavoured, while Schezwan Sauce usually includes a more complex spice blend.",
      },
      {
        question: "Are these sauces spicy?",
        answer: "Chili Garlic and Schezwan sauces are typically spicy by design — check the individual product description for exact heat level, as this varies by brand.",
      },
      {
        question: "Is your Soy Sauce gluten-free?",
        answer: "Traditional soy sauce is generally not gluten-free, as it's made from fermented wheat and soybeans — check the individual product's ingredient list, as gluten-free (tamari-style) options may be available.",
      },
      {
        question: "How do I make Schezwan Noodles at home using this sauce?",
        answer: "Stir-fry cooked noodles with vegetables and a few spoonfuls of Schezwan Sauce to taste — check the specific product's packaging for a suggested recipe.",
      },
      {
        question: "Are these sauces vegetarian?",
        answer: "Most are vegetarian, but check the individual product's ingredient list, as some Indo-Chinese sauces can contain non-vegetarian ingredients like oyster or fish sauce — always confirm on the label.",
      },
      {
        question: "Do these sauces need to be refrigerated after opening?",
        answer: "This varies by product — check the individual product's storage instructions, as some sauces are shelf-stable while others require refrigeration once opened.",
      },
      {
        question: "What's the shelf life of an opened bottle of sauce?",
        answer: "This varies by product — check the label for specific use-by guidance after opening.",
      },
      {
        question: "Can I use Chili Garlic Sauce as a dipping sauce?",
        answer: "Yes — it's commonly used both as a cooking ingredient and as a dipping sauce for snacks like spring rolls or fried appetizers.",
      },
      {
        question: "Are these sauces suitable for vegans?",
        answer: "Most plant-based sauces are vegan, but check the individual product's ingredient list to confirm, especially for any that may include honey or fish-based ingredients.",
      },
      {
        question: "How much sodium is in these sauces?",
        answer: "Sodium content varies by product — check the individual product's nutrition label, as sauces like soy sauce are typically high in sodium.",
      },
      {
        question: "Can I use Tomato Ketchup in cooking, not just as a condiment?",
        answer: "Yes — ketchup is sometimes used as a cooking ingredient in Indo-Chinese and fusion dishes for its tangy-sweet flavour.",
      },
      {
        question: "Are these sauces suitable for children?",
        answer: "Ketchup and mild soy sauce are generally fine; Chili Garlic and Schezwan sauces are spicier and best used sparingly for children or avoided depending on spice tolerance.",
      },
      {
        question: "Do you sell low-sodium sauce options?",
        answer: "Availability varies by brand — check the site or individual product pages for low-sodium alternatives.",
      },
      {
        question: "What dishes commonly use Tamarind Sauce (ready-made)?",
        answer: "Ready-made Tamarind Sauce is often used as a dipping sauce for snacks or drizzled over chaat-style dishes, similar to tamarind chutney but typically thinner in consistency.",
      },
    ],
  },

"biscuits-cookies-rusk": {
    sections: [
      {
        title: "Explore Everyday Biscuits, Cookies & Rusk",
        description:
          "A cup of chai isn't quite complete without something to dip in it. This category covers the everyday biscuits, cookies and rusk that are a staple of tea time across South Asian households.\n\n" +
          "Everyday Biscuits & Rusk:\n" +
          "Marie Biscuits and Rusk (Toast) are the most classic tea-time pairing — light, not overly sweet, and ideal for dipping. Digestive Biscuits offer a heartier, wheat-based alternative.\n\n" +
          "Cream Biscuits & Cookies:\n" +
          "Cream-filled biscuits and flavoured cookies offer a sweeter treat, popular with both kids and adults as an everyday snack or lunchbox addition.\n\n" +
          "Shop Biscuits, Cookies & Rusk:\n" +
          "• Marie Biscuits\n" +
          "• Digestive Biscuits\n" +
          "• Rusk (Toast)\n" +
          "• Cream Biscuits\n" +
          "• Assorted Cookies",
      },
    ],
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What are Marie Biscuits?",
        answer: "Marie Biscuits are light, mildly sweet, round biscuits, one of the most popular tea-time biscuits across South Asia, often dipped in chai.",
      },
      {
        question: "What is Rusk (Toast)?",
        answer: "Rusk is a twice-baked, dry bread biscuit, crisp in texture and traditionally dipped in tea to soften before eating.",
      },
      {
        question: "Are these biscuits suitable for children?",
        answer: "Most biscuits and rusk are suitable for children, though check sugar content and any allergen information first.",
      },
      {
        question: "Do your biscuits contain nuts?",
        answer: "Some cookies and cream biscuit varieties may contain or be processed near nuts — check the individual product's allergen information.",
      },
      {
        question: "Are Digestive Biscuits actually good for digestion?",
        answer: "The name is traditional/historical rather than a health claim — digestive biscuits are simply a type of wholemeal biscuit, and we don't make specific health claims about their effect on digestion.",
      },
      {
        question: "How should I store biscuits and rusk to keep them crisp?",
        answer: "Store in an airtight container in a cool, dry place; exposure to humidity can cause biscuits and rusk to lose their crispness.",
      },
      {
        question: "Are your biscuits suitable for vegetarians?",
        answer: "Most biscuits are vegetarian, but check the individual product label to confirm, as some may contain gelatin or other animal-derived ingredients in specific formulations.",
      },
      {
        question: "What's the shelf life of packaged biscuits?",
        answer: "Unopened biscuits typically have a shelf life of several months to a year — check the best-before date on individual packaging.",
      },
      {
        question: "Do you sell sugar-free biscuit options?",
        answer: "Sugar-free or reduced-sugar options vary by brand — check the site or individual product pages for availability.",
      },
      {
        question: "Are your biscuits suitable for vegans?",
        answer: "This varies by product, as many biscuits contain milk or butter — check the individual product's ingredient list to confirm vegan suitability.",
      },
      {
        question: "What's the difference between Rusk and regular biscuits?",
        answer: "Rusk is baked twice for extra crispness and a drier texture, specifically designed to be dipped and softened in tea, whereas regular biscuits are baked once.",
      },
      {
        question: "Can I buy biscuits in bulk packs?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Do these biscuits contain palm oil?",
        answer: "This varies by product — check the individual product's ingredient list for specific fat/oil content.",
      },
      {
        question: "Are cream biscuits more indulgent than digestive biscuits?",
        answer: "Generally yes — cream biscuits tend to have higher sugar and fat content due to their filling, compared to plainer digestive or Marie biscuits. Check nutrition labels for specifics.",
      },
      {
        question: "Can I use crushed biscuits in dessert recipes?",
        answer: "Yes — crushed Marie biscuits and digestive biscuits are commonly used as a base for no-bake desserts and cheesecake crusts.",
      },
    ],
  },

  "mouth-fresheners": {
    sections: [
      {
        title: "Explore Saunf & Mukhwas Blends",
        description:
          "A small spoonful of a fragrant seed mix after a meal is a familiar ritual in many South Asian households — traditionally used to freshen breath and settle the stomach after eating.\n\n" +
          "Fennel-Based Mixes:\n" +
          "Saunf (Fennel Seed), plain or sugar-coated (Meetha Saunf), is the most common and widely recognised mouth freshener — traditionally chewed after a meal.\n\n" +
          "Mixed Seed Blends:\n" +
          "Mukhwas blends combine fennel with other seeds (such as sesame or coriander seed), sugar crystals, and sometimes dried fruit or coconut, for a more elaborate after-meal mix.\n\n" +
          "Shop Mouth Fresheners:\n" +
          "• Saunf (Plain Fennel Seed)\n" +
          "• Meetha Saunf (Sugar-Coated Fennel)\n" +
          "• Mukhwas Mixed Seed Blend",
      },
    ],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Saunf and why is it eaten after meals?",
        answer: "Saunf is fennel seed, traditionally chewed after a meal in many South Asian households as a mouth freshener; some also consider it traditionally associated with settling the stomach after eating.",
      },
      {
        question: "What is Mukhwas?",
        answer: "Mukhwas is a broad term for after-meal seed and spice mixes (often fennel-based) designed to freshen breath and aid digestion.",
      },
    ],
  },

  "snacks": {
    sections: [
      {
        title: "Explore Papad, Chips & Everyday Savoury Bites",
        description:
          "This category rounds up everyday savoury snacks that don't fit neatly into namkeen or mouth fresheners — the papad, chips and roasted bites that are a familiar part of snacking across South Asian households.\n\n" +
          "Papad:\n" +
          "Papad (thin, dried lentil or rice wafers) are roasted or fried before eating, traditionally served alongside a meal or enjoyed on their own as a crispy snack.\n\n" +
          "Chips & Roasted Snacks:\n" +
          "Banana Chips and Potato Chips (often spiced with South Asian seasoning) offer a familiar, crunchy snack, while roasted chana and other roasted snacks provide a lighter, less indulgent option.\n\n" +
          "Shop Snacks:\n" +
          "• Papad (Lentil Wafers)\n" +
          "• Banana Chips\n" +
          "• Spiced Potato Chips\n" +
          "• Roasted Chana",
      },
    ],
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "How do I cook Papad?",
        answer: "Papad can be roasted directly over a flame, grilled, microwaved or deep-fried, depending on preference — check the individual product's packaging for specific instructions.",
      },
      {
        question: "What is Papad made from?",
        answer: "Papad is traditionally made from lentil flour (like urad dal), though rice-based and other regional variations exist — check the individual product's ingredient list.",
      },
      {
        question: "Are Banana Chips sweet or savoury?",
        answer: "This varies by product — some banana chips are lightly salted and savoury, while others are sweetened; check the individual product description.",
      },
      {
        question: "Are these snacks gluten-free?",
        answer: "This varies — lentil-based papad and chips are often gluten-free, but check the individual product's ingredient list to confirm, as some are wheat-based or processed near gluten-containing products.",
      },
      {
        question: "How should I store Papad?",
        answer: "Store in an airtight container in a cool, dry place; papad can absorb moisture and become difficult to roast or fry evenly if exposed to humidity.",
      },
      {
        question: "Are Spiced Potato Chips very spicy?",
        answer: "Spice level varies by product — check the individual product description for guidance.",
      },
      {
        question: "Can Papad be eaten raw, without cooking?",
        answer: "No — papad is traditionally roasted, grilled or fried before eating, which also improves its texture and flavour.",
      },
      {
        question: "Are these snacks suitable for vegetarians and vegans?",
        answer: "Most papad and chips are vegetarian and vegan, but check the individual product's ingredient list to confirm, as some spice blends may include non-vegan additives.",
      },
      {
        question: "What's the shelf life of Papad and chips?",
        answer: "Unopened, these snacks typically have a shelf life of several months to a year — check the best-before date on individual packaging.",
      },
      {
        question: "Are Banana Chips fried in coconut oil?",
        answer: "This varies by brand and regional recipe — check the individual product's ingredient list for the specific oil used.",
      },
      {
        question: "Can I microwave Papad instead of frying it?",
        answer: "Yes — many papad varieties can be microwaved for a lower-oil alternative to frying; check individual product instructions for timing.",
      },
      {
        question: "Is Roasted Chana a healthier snack option?",
        answer: "Roasted chana is generally a lighter, less oily option compared to fried snacks, being simply roasted rather than deep-fried, though nutritional comparisons depend on the specific product — check individual labels.",
      },
      {
        question: "Do these snacks contain nuts?",
        answer: "Some spiced chips and roasted snack blends may contain or be processed near nuts — check the individual product's allergen information.",
      },
      {
        question: "Can I buy these snacks in bulk?",
        answer: "Bulk or multi-pack options vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Are these snacks suitable for children?",
        answer: "Most are suitable, though check spice level for Spiced Potato Chips before serving to young children.",
      },
    ],
  },

  "sweets": {
    sections: [
      {
        title: "Explore Ready-to-Eat Mithai",
        description:
          "These are ready-to-eat mithai — open and serve straight away, no preparation needed. (Looking for a mix you prepare yourself, like Gulab Jamun Mix or Kheer Mix? Those are under Instant Foods & Mixes > Dessert Mix.) Whether for a festival, a gift, or simply a sweet craving, this category covers the classic mithai found in South Asian sweet shops.\n\n" +
          "Milk-Based Sweets:\n" +
          "Barfi (a dense, fudge-like sweet) and Rasgulla (soft, spongy cheese balls in light syrup) represent two of the most popular milk-based mithai styles, alongside ready-to-eat Gulab Jamun in syrup.\n\n" +
          "Festive & Gifting Sweets:\n" +
          "Ladoo (round, dense sweet balls, often made from besan or semolina) and Soan Papdi (a flaky, layered sweet) are popular choices for festivals and gifting, often available in decorative boxes.\n\n" +
          "Shop Sweets (Mithai):\n" +
          "• Barfi\n" +
          "• Rasgulla\n" +
          "• Gulab Jamun (Ready-to-Eat)\n" +
          "• Ladoo\n" +
          "• Soan Papdi",
      },
    ],
    image: "https://images.unsplash.com/photo-1734807189812-f115687a2d50?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Is this sweet ready to eat, or do I need to prepare it?",
        answer: "These sweets are ready to eat straight from the packaging — no preparation needed.",
      },
      {
        question: "What's the difference between this and Dessert Mix under Instant Foods & Mixes?",
        answer: "This is a ready-made, ready-to-eat sweet; Dessert Mix is a powder you prepare yourself at home (like Gulab Jamun Mix or Kheer Mix).",
      },
      {
        question: "What is Barfi made from?",
        answer: "Barfi is typically made from condensed or reduced milk (khoya) and sugar, often flavoured with cardamom, pistachio or other traditional flavourings.",
      },
      {
        question: "Do these sweets need to be refrigerated?",
        answer: "This varies by sweet — milk-based sweets like Rasgulla and fresh Barfi often require refrigeration, while some drier sweets like certain Ladoo varieties are more shelf-stable. Check individual product storage instructions.",
      },
      {
        question: "What's the shelf life of Indian sweets?",
        answer: "This varies significantly — fresh milk-based sweets have a shorter shelf life, while drier sweets can last longer. Check the individual product's best-before date and storage instructions.",
      },
      {
        question: "Are these sweets suitable for vegetarians?",
        answer: "Yes — traditional Indian sweets are generally vegetarian, though check individual product labels to confirm, as some may use rennet-based ingredients in rare cases.",
      },
      {
        question: "Do your sweets contain nuts?",
        answer: "Many sweets, particularly Barfi and Ladoo varieties, contain or are garnished with nuts like pistachio, almond or cashew — check the individual product's allergen information.",
      },
      {
        question: "What is Soan Papdi?",
        answer: "Soan Papdi is a flaky, layered sweet with a light, crumbly texture, popular as a gifting sweet, especially around festivals.",
      },
      {
        question: "Are these sweets suitable for gifting?",
        answer: "Yes — many of these sweets, especially Soan Papdi and boxed Barfi, are traditionally given as gifts during festivals and celebrations.",
      },
      {
        question: "Can I buy these sweets in a mixed assortment box?",
        answer: "Assortment box availability varies by season and product — check the site for current offerings, particularly around major festivals.",
      },
      {
        question: "Are these sweets high in sugar?",
        answer: "Traditional Indian sweets are generally sugar-rich by nature — check the individual product's nutrition label for specific values, and consult a healthcare professional if managing sugar intake.",
      },
      {
        question: "Is Rasgulla served hot or cold?",
        answer: "Rasgulla is traditionally served chilled, soaked in its light sugar syrup.",
      },
      {
        question: "Can I freeze these sweets to extend shelf life?",
        answer: "This varies by sweet type — some sweets freeze reasonably well, while others (especially syrup-based ones like Rasgulla) may not maintain the same texture after freezing. Check individual product guidance.",
      },
      {
        question: "Are there sugar-free versions of these sweets available?",
        answer: "Sugar-free or reduced-sugar options vary by brand — check the site or individual product pages for availability.",
      },
      {
        question: "What occasions are these sweets typically eaten for?",
        answer: "These sweets are enjoyed both as everyday treats and specifically during festivals, celebrations and as gifts for guests.",
      },
    ],
  },
  
  "whole-spices": {
    sections: [
      {
        title: "Explore Whole Spices",
        description:
          "Whole spices hold onto their essential oils and aroma far longer than their ground counterparts, which is why they're the starting point for tempering (tadka) and many slow-cooked dishes. Toasted and ground fresh, they deliver a noticeably deeper flavour than pre-ground powder.\n\n" +
          "Everyday Tempering Spices:\n" +
          "Cumin Seeds, Mustard Seeds and Fenugreek Seeds are the workhorses of everyday tempering, typically bloomed in hot oil or ghee at the start or end of cooking to release their aroma.\n\n" +
          "Aromatic Pods, Bark & Leaves:\n" +
          "Green and Black Cardamom, Cinnamon Sticks, Cloves, Star Anise and Bay Leaves bring warmth and depth to rice dishes, curries and garam masala blends, most often used whole and removed before serving.\n\n" +
          "Shop Whole Spices:\n" +
          "• Cumin Seeds\n" +
          "• Coriander Seeds\n" +
          "• Mustard Seeds\n" +
          "• Fenugreek Seeds\n" +
          "• Green Cardamom\n" +
          "• Black Cardamom\n" +
          "• Cinnamon Sticks\n" +
          "• Cloves\n" +
          "• Star Anise\n" +
          "• Bay Leaves\n" +
          "• Black Peppercorns\n" +
          "• Whole Dried Red Chilies",
      },
    ],
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "Why do whole spices last longer than ground spices?",
        answer: "Whole spices retain their essential oils inside an intact seed, pod or bark, which slows the loss of aroma and flavour compared to ground spices, where more surface area is exposed to air.",
      },
      {
        question: "How do I temper (tadka) with whole spices?",
        answer: "Whole spices like cumin or mustard seeds are typically added to hot oil or ghee for a short time until they sizzle and release their aroma, either at the start of cooking or as a finishing touch.",
      },
      {
        question: "What's the difference between green and black cardamom?",
        answer: "Green cardamom has a lighter, more floral flavour and is used in both sweet and savoury dishes, while black cardamom has a smokier, more intense flavour and is used mainly in savoury dishes and garam masala.",
      },
      {
        question: "Should I remove whole spices like bay leaves and cinnamon before eating?",
        answer: "Yes — whole spices like bay leaves, cinnamon sticks and star anise are traditionally used to infuse flavour during cooking and are usually removed or set aside before eating.",
      },
      {
        question: "How should I store whole spices?",
        answer: "Store in airtight containers away from direct light, heat and moisture; whole spices generally stay flavourful for 2–3 years if stored properly.",
      },
      {
        question: "Can I grind whole spices myself at home?",
        answer: "Yes — a dedicated spice grinder or mortar and pestle works well, and many cooks prefer grinding fresh just before use for maximum flavour.",
      },
      {
        question: "Are whole spices gluten-free?",
        answer: "Yes — plain whole spices are naturally gluten-free.",
      },
      {
        question: "What's the best way to toast whole spices before grinding?",
        answer: "Whole spices are typically dry-roasted in a pan over low-medium heat for a minute or two until fragrant, then cooled before grinding, to enhance their aroma.",
      },
      {
        question: "Are whole spices more expensive than ground spices?",
        answer: "Pricing varies by spice and brand — whole spices aren't necessarily more expensive, and their longer shelf life can make them better value over time.",
      },
      {
        question: "Can I use whole dried red chilies instead of chili powder?",
        answer: "Yes — whole dried red chilies are commonly used in tempering or ground fresh for a different texture and flavour profile than pre-made chili powder.",
      },
      {
        question: "How many whole cloves or cardamom pods should I use in a recipe?",
        answer: "This varies by recipe — start with the quantity suggested and adjust to taste, as whole spices can be quite potent.",
      },
      {
        question: "Do whole spices go bad or lose potency over time?",
        answer: "Yes — while they last longer than ground spices, whole spices will gradually lose aroma and flavour over time, especially if not stored properly.",
      },
      {
        question: "What's the difference between black peppercorns and ground black pepper?",
        answer: "Whole peppercorns retain more flavour over time and are often freshly ground just before use, while pre-ground black pepper loses potency more quickly once exposed to air.",
      },
      {
        question: "Can I buy whole spices in bulk?",
        answer: "Bulk pack sizes vary by product — check the individual product page for available sizes.",
      },
      {
        question: "Are whole spices suitable for pickling as well as cooking?",
        answer: "Yes — whole spices like mustard seeds, fenugreek and whole red chilies are commonly used in pickling as well as everyday cooking.",
      },
    ],
  },
  "aromas-colours": {
    sections: [
      {
        title: "Explore Aromas & Colours",
        description:
          "Some ingredients aren't about flavour so much as the finishing touch — the golden hue of saffron rice, the floral lift of rose water in a dessert, or the decorative shimmer of edible silver leaf on mithai. This category covers those special-occasion aromatics and colourants.\n\n" +
          "Aromatic Waters & Saffron:\n" +
          "Saffron (Kesar) is prized for both its distinctive aroma and golden colour, used in biryani, desserts and festive dishes. Rose Water and Kewra (Screwpine) Water are floral essences traditionally added to desserts, drinks and some rice dishes for fragrance.\n\n" +
          "Food Colour & Decorative Finishes:\n" +
          "Edible Food Colour (in liquid, gel or powder form) is used to tint rice, sweets and drinks, while Edible Silver Leaf (Vark) is a traditional decorative garnish for festive mithai and special-occasion dishes.\n\n" +
          "Shop Aromas & Colours:\n" +
          "• Saffron (Kesar)\n" +
          "• Rose Water\n" +
          "• Kewra (Screwpine) Water\n" +
          "• Edible Food Colour\n" +
          "• Edible Silver Leaf (Vark)",
      },
    ],
    image: "https://images.unsplash.com/photo-1643471672168-f4a4b6cfa440?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Saffron used for in cooking?",
        answer: "Saffron is used for both its distinctive aroma and golden-orange colour, commonly added to biryani, kheer, desserts and festive rice dishes.",
      },
      {
        question: "How much Saffron should I use in a recipe?",
        answer: "Saffron is very potent, so a small pinch (a few strands) is typically enough per dish — check the individual product's guidance, as using too much can make a dish taste bitter.",
      },
      {
        question: "What's the difference between Rose Water and Kewra Water?",
        answer: "Rose water has a floral, rose-petal aroma, while Kewra water comes from the screwpine (pandanus) flower and has a distinct, slightly sweet, tropical aroma — both are used similarly in desserts and drinks but impart different flavours.",
      },
      {
        question: "Is edible Food Colour safe to use?",
        answer: "Food colours sold for culinary use are formulated to be food-safe, but always check the individual product's ingredient list and use as directed, particularly regarding recommended quantities.",
      },
      {
        question: "What is Edible Silver Leaf (Vark) made from?",
        answer: "Vark is a very thin, edible sheet of pure silver, traditionally used as a decorative garnish on mithai and festive dishes — check the individual product page for specific purity and sourcing details.",
      },
      {
        question: "How do I know if Saffron is genuine and high quality?",
        answer: "Quality indicators include deep red-orange colour, a strong aroma, and threads that release colour gradually when soaked rather than instantly — check the individual product page for sourcing and grading information.",
      },
      {
        question: "How should I use Saffron to get the most flavour and colour?",
        answer: "Saffron threads are often soaked briefly in warm water or milk before adding to a dish, which helps release their colour and aroma more evenly.",
      },
      {
        question: "Is this the same Saffron as mentioned in your Health Benefits of Herbs pages?",
        answer: "It's the same ingredient — this listing is positioned for everyday and festive cooking, while the Health Benefits of Herbs pages discuss its traditional wellness use; cross-linking between the two is planned.",
      },
      {
        question: "How should I store Rose Water and Kewra Water?",
        answer: "Store in a cool, dark place, and refrigerate after opening if indicated on the label, to preserve their aroma.",
      },
      {
        question: "Are Rose Water and Kewra Water safe to drink diluted in water?",
        answer: "Culinary rose and kewra water are generally used in small amounts diluted in drinks or desserts — check the individual product's label for recommended use, and ensure the product is specifically labelled for culinary/food use rather than cosmetic use only.",
      },
      {
        question: "Is Edible Silver Leaf safe to eat?",
        answer: "Pure edible silver leaf intended for culinary use is generally considered safe when sourced and produced correctly for food use — check the individual product's certification and sourcing details.",
      },
      {
        question: "What's the shelf life of Saffron?",
        answer: "Saffron can retain its potency for a couple of years if stored properly in an airtight container away from light and heat, though its aroma will gradually fade over time.",
      },
      {
        question: "Can I use Food Colour in savoury dishes as well as desserts?",
        answer: "Yes — edible food colour is used in both savoury dishes (like colouring rice for biryani) and desserts.",
      },
      {
        question: "Are these products suitable for vegetarians and vegans?",
        answer: "Saffron, rose water and kewra water are plant-derived and vegan; edible silver leaf is a mineral product and generally considered vegetarian, though not always considered vegan by some standards — check individual product details if this matters to you.",
      },
      {
        question: "Why is Saffron so expensive compared to other spices?",
        answer: "Saffron comes from the hand-picked stigmas of the crocus flower, requiring a very large number of flowers to produce a small amount of the spice, which is why it's one of the most expensive spices by weight.",
      },
    ],
  },
  "salt": {
    sections: [
      {
        title: "Explore Salt",
        description:
          "Not all salt is the same in South Asian cooking — each type brings a different flavour, colour or traditional use, from the sulfurous tang of black salt in chaat to the specific rock salt used during religious fasting.\n\n" +
          "Everyday & Specialty Salts:\n" +
          "Table Salt is the everyday cooking staple, while Black Salt (Kala Namak) brings a distinctive sulfurous, tangy flavour used in chaat, raita and digestive spice mixes.\n\n" +
          "Rock Salt & Pink Himalayan Salt:\n" +
          "Rock Salt (Sendha Namak) is traditionally used during religious fasting (vrat) in some households, as it's considered unprocessed. Pink Himalayan Salt is a mineral-rich rock salt valued for its colour and mild flavour.\n\n" +
          "Shop Salt:\n" +
          "• Table Salt\n" +
          "• Black Salt (Kala Namak)\n" +
          "• Rock Salt (Sendha Namak)\n" +
          "• Pink Himalayan Salt",
      },
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Black Salt (Kala Namak) and what does it taste like?",
        answer: "Black Salt has a distinctive sulfurous, tangy flavour, quite different from regular table salt, commonly used in chaat, raita and digestive spice mixes like chaat masala.",
      },
      {
        question: "What is Rock Salt (Sendha Namak) traditionally used for?",
        answer: "Sendha Namak is traditionally used during religious fasting (vrat) in some Hindu households, as it's considered a purer, less processed form of salt suitable for fasting diets.",
      },
      {
        question: "What's the difference between Rock Salt and Pink Himalayan Salt?",
        answer: "Both are mineral-rich rock salts, but they can come from different sources and vary slightly in colour, mineral content and traditional use — check individual product pages for sourcing details.",
      },
      {
        question: "Is Black Salt the same as regular table salt with food colouring?",
        answer: "No — Black Salt gets its distinctive flavour and smell from natural sulfur compounds formed during its traditional processing, not from added colouring; check the individual product's ingredient list for full details.",
      },
      {
        question: "Can I substitute Black Salt for regular salt in any recipe?",
        answer: "Not always — Black Salt's distinctive sulfurous flavour works well in specific dishes like chaat but may not suit every recipe the way plain table salt would.",
      },
      {
        question: "Is Pink Himalayan Salt healthier than regular table salt?",
        answer: "Nutritional comparisons between salt types are minor in typical usage amounts — consult a healthcare professional or dietitian for advice specific to your dietary needs, particularly around sodium intake.",
      },
      {
        question: "How should I store salt?",
        answer: "Store in a dry, airtight container; salt can clump if exposed to humidity, particularly unrefined varieties like rock salt.",
      },
      {
        question: "Is Black Salt suitable for people with iodine deficiency concerns?",
        answer: "Unlike iodized table salt, specialty salts like Black Salt, Rock Salt and Pink Himalayan Salt are generally not iodized — consult a healthcare professional if iodine intake is a specific concern for you.",
      },
      {
        question: "What dishes use Black Salt besides chaat?",
        answer: "Black Salt is also used in raita, some pickle recipes, digestive spice mixes, and certain vegan egg-flavour recipes, where its sulfurous note mimics an eggy flavour.",
      },
      {
        question: "Is Rock Salt the same product as Pink Himalayan Salt?",
        answer: "They can overlap, as pink Himalayan salt is a specific type of rock salt, but \"Sendha Namak\" traditionally refers to rock salt used for religious fasting — check individual product pages, as sourcing and grading can differ.",
      },
      {
        question: "Does salt expire?",
        answer: "Plain salt itself doesn't spoil, though packaging and any additives (like anti-caking agents) may have a best-before date — check individual product labelling.",
      },
      {
        question: "Are these salts suitable for vegetarians and vegans?",
        answer: "Yes — all salt varieties on this site are naturally vegetarian and vegan.",
      },
      {
        question: "Can I use Black Salt in cocktails or drinks?",
        answer: "Yes — Black Salt is sometimes used in savoury drinks and shots (like a digestive lemon-black salt drink) for its distinctive tang.",
      },
      {
        question: "How much salt is safe to consume daily?",
        answer: "General dietary sodium guidance is available from health authorities; consult a healthcare professional or dietitian for advice specific to your health needs.",
      },
      {
        question: "Can I buy salt in bulk?",
        answer: "Bulk pack sizes vary by product — check the individual product page for available sizes.",
      },
    ],
  },
  "other-spices": {
    sections: [
      {
        title: "Explore Other Spices",
        description:
          "This category rounds up the specialty spices and dried herbs that don't fit neatly into whole spices, powders or blends — smaller-volume but essential ingredients that finish off many classic South Asian dishes.\n\n" +
          "Specialty Flavour Enhancers:\n" +
          "Asafoetida (Hing) is a pungent resin, used in tiny amounts and typically bloomed in hot oil at the start of cooking — a defining ingredient in many dal and vegetarian dishes.\n\n" +
          "Dried Herbs & Souring Agents:\n" +
          "Dried Fenugreek Leaves (Kasuri Methi) add a distinctive, slightly bitter aroma crumbled over curries, while Dried Mango Powder (Amchur) is used as a tangy souring agent in place of fresh lemon or tamarind.\n\n" +
          "Shop Other Spices:\n" +
          "• Asafoetida (Hing)\n" +
          "• Dried Fenugreek Leaves (Kasuri Methi)\n" +
          "• Dried Mango Powder (Amchur)\n" +
          "• Curry Leaves (Dried)",
      },
    ],
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1000",
    faqs: [
      {
        question: "What is Asafoetida (Hing) and how is it used?",
        answer: "Asafoetida is a pungent resin, typically sold as a fine powder, used in very small amounts (often a pinch) bloomed in hot oil at the start of cooking, especially common in lentil and vegetarian dishes.",
      },
      {
        question: "Why is Asafoetida used in such small quantities?",
        answer: "Hing has a very strong, pungent raw aroma that mellows significantly when cooked in hot oil — using too much can overpower a dish, so a small pinch is typically sufficient.",
      },
      {
        question: "Does Asafoetida (Hing) contain gluten?",
        answer: "Some commercial asafoetida powders are blended with wheat flour as a carrier/anti-caking agent — check the individual product's ingredient list carefully if you need a gluten-free option.",
      },
      {
        question: "What is Kasuri Methi (dried fenugreek leaves) used for?",
        answer: "Kasuri Methi is crumbled over curries, dals and rice dishes toward the end of cooking, adding a distinctive, slightly bitter, aromatic finish.",
      },
      {
        question: "What is Amchur (dried mango powder) used for?",
        answer: "Amchur is a tangy souring agent, used as an alternative to lemon juice or tamarind in dishes where a dry, tart flavour is preferred, and is also a component of chaat masala.",
      },
      {
        question: "How should I store Asafoetida?",
        answer: "Store in a tightly sealed container, as its aroma can be quite strong and may affect other stored spices if not sealed properly.",
      },
      {
        question: "Is Asafoetida vegetarian and vegan?",
        answer: "Pure asafoetida resin itself is plant-derived and vegan, but check the individual product's ingredient list, as some commercial blends include other additives.",
      },
      {
        question: "How much Kasuri Methi should I use in a dish?",
        answer: "A small handful, crumbled between your fingers, is typically enough to season a dish — check the specific recipe you're following for exact quantities.",
      },
      {
        question: "Can I substitute Amchur with lemon juice?",
        answer: "Yes, lemon juice can work as a substitute in many recipes, though it will add moisture that Amchur (a dry powder) wouldn't, so adjust other liquid quantities accordingly.",
      },
      {
        question: "What are dried Curry Leaves used for?",
        answer: "Dried curry leaves are used similarly to fresh curry leaves, tempered in hot oil to release their aroma, though fresh leaves are generally considered more aromatic when available.",
      },
      {
        question: "Is dried Kasuri Methi the same as fresh fenugreek leaves?",
        answer: "They come from the same plant, but drying concentrates and changes the flavour — Kasuri Methi has a more intense, slightly bitter aroma compared to fresh fenugreek leaves.",
      },
      {
        question: "How long does Asafoetida stay potent once opened?",
        answer: "Properly sealed, asafoetida can retain its potency for a long time, often a year or more — check the individual product's best-before date.",
      },
      {
        question: "Are these specialty spices suitable for vegans?",
        answer: "Most are plant-derived and vegan, but check individual product ingredient lists to confirm, as commercial hing blends in particular can vary.",
      },
      {
        question: "Can I buy these specialty spices in smaller quantities, since I only need a little?",
        answer: "Pack size availability varies by product — check the individual product page, as items like Asafoetida and Amchur are often sold in smaller quantities given how little is used per dish.",
      },
      {
        question: "What dishes commonly use both Amchur and Kasuri Methi together?",
        answer: "Certain North Indian curries and paneer dishes (like methi malai or various paneer curries) commonly combine both for their distinct tangy and aromatic notes.",
      },
    ],
  },
};

