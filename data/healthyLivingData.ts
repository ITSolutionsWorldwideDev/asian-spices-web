export type AllowedSlug =
  | "sleep-stress-relief"
  | "immune-support"
  | "digestion-gut-health"
  | "joint-skin-hair-health"
  | "grandmas-kitchen-remedies"
  | "capsules"
  | "powders"
  | "teas"
  | "face-oils"
  | "creams"
  | "cleansers"
  | "hair-oils"
  | "shampoos"
  | "hair-masks";

export type SlugContentItem = {
  heading: string;
  text: string;
  image: string;
  sectionImage?: string; // <-- Yeh line yahan add kar dein
  metaTitle?: string;
  metaDesc?: string;
  extraTitle?: string;
  extraDescription?: string;
  isCardLayout?: boolean; // <-- Yeh line yahan add kar dein
  intro?: {
    title: string;
    description: string;
  };
  sections?: {
    title: string;
    description: string;
  }[];
  faqs?: { question: string; answer: string }[];
};
export const herbBenefitSlugs: AllowedSlug[] = [
  "sleep-stress-relief",
  "immune-support",
  "digestion-gut-health",
  "joint-skin-hair-health",
  "grandmas-kitchen-remedies",
];

export const slugContent: Record<AllowedSlug, SlugContentItem> = {
 "sleep-stress-relief": {
  heading: "Herbs for Rest & Balance: Natural Support for Stress & Sleep",
  text: "True wellness depends on effective recovery. When the nervous system stays switched on, quality of sleep and mood can both suffer. Traditional herbal nervines and adaptogens have long been used to help soothe an overstimulated mind and support the body's own path back to restorative rest.",
  image: "promotes-relaxation.png",
  sectionImage: "h1.webp",          // Yeh section 2 wali image hai
  metaTitle: "Herbs for Sleep & Stress Relief | Natural Calm",
  metaDesc: "Shop calming herbs for sleep & stress relief — Ashwagandha, Valerian Root, Chamomile & Jatamansi. Traditional support for rest and relaxation.",
  sections: [
    {
      title: "Stress Less: Herbs Traditionally Used for Calm",
      description: "Herbs such as Ashwagandha a cornerstone of Himalayan and Ayurvedic tradition alongside Holy Basil (Tulsi) and Passionflower, have long been used to support the body during periods of everyday stress. Passionflower in particular has a traditional reputation for helping ease daily tension and mental overactivity.",
    },
    {
      title: "Sleep Well: Herbs for Restful Nights",
      description: "For a more restful night, Valerian Root, Chamomile and Lavender are among the most widely used herbs in traditional sleep routines. In Himalayan herbal tradition, Jatamansi (Spikenard) is valued as a calming botanical traditionally used to quiet an overactive mind before bed, without the grogginess sometimes associated with other sleep aids.",
    },
    {
      title: "Mood Lift: Herbs for Emotional Balance",
      description: "Botanicals like Saffron, St. John's Wort and Lemon Balm have a long tradition of use in supporting emotional balance and easing anxious overthinking. Himalayan Kashmiri Saffron is especially prized in traditional wellness practices for its association with mood support.",
    },
  ],
  faqs: [
    { question: "What herbs are traditionally used for stress relief?", answer: "Ashwagandha, Holy Basil (Tulsi) and Passionflower are among the most widely used herbs in traditional practices for supporting the body during everyday stress." },
    { question: "What is Ashwagandha and what is it traditionally used for?", answer: "Ashwagandha is a Himalayan and Ayurvedic adaptogenic root traditionally used to support the body's resilience to stress and to promote a sense of calm." },
    { question: "Can herbs help me fall asleep more easily?", answer: "Herbs like Valerian Root, Chamomile and Jatamansi have a long tradition of use in supporting relaxation before bed, often as part of an evening routine such as herbal tea." },
    { question: "What is Jatamansi (Spikenard)?", answer: "Jatamansi is a Himalayan herb traditionally used as a calming botanical to help quiet an overactive mind, commonly used in evening wellness routines." },
    { question: "Is it safe to take sleep herbs every night?", answer: "Many people use calming herbs like Chamomile or Valerian Root regularly, but you should follow product guidance and consult a healthcare professional, particularly for long-term use." },
    { question: "What's the difference between Ashwagandha and Valerian Root?", answer: "Ashwagandha is generally used throughout the day to support stress resilience, while Valerian Root is more specifically associated with evening use to support sleep." },
    { question: "Can herbs support mood as well as sleep?", answer: "Saffron, St. John's Wort and Lemon Balm have a long tradition of use in supporting emotional balance, separate from their use for sleep specifically." },
    { question: "Is Kashmiri Saffron different from regular saffron?", answer: "Kashmiri Saffron is a high-altitude Himalayan variety prized in traditional wellness practices; specific origin and grading details are listed on the product page." },
    { question: "Can I combine sleep and stress herbs?", answer: "Many people pair a daytime stress-support herb like Ashwagandha with an evening sleep herb like Valerian Root or Chamomile, introducing one new herb at a time." },
    { question: "Are these herbs safe with sleep or anxiety medication?", answer: "Some herbs, particularly St. John's Wort, can interact with prescription medication including antidepressants and contraceptives. Always check with a doctor or pharmacist before combining herbs with medication." },
    { question: "Will these herbs make me feel groggy the next day?", answer: "Traditional use of herbs like Jatamansi and Chamomile is associated with restful sleep without the next-day grogginess sometimes linked to other sleep aids, though individual responses vary." },
    { question: "How should I take Passionflower?", answer: "Passionflower is commonly used as a tea, tincture or capsule; check the specific product page for recommended preparation and use." },
    { question: "Can these herbs be used during pregnancy?", answer: "Several herbs in this category, including Ashwagandha and St. John's Wort, are not recommended during pregnancy or breastfeeding. Speak to a healthcare professional before use." },
    { question: "How long before bed should I take a sleep herb?", answer: "Many sleep herbs are traditionally taken 30–60 minutes before bedtime, but check the specific product guidance for best results." },
    { question: "What is Holy Basil (Tulsi) used for?", answer: "Holy Basil, also known as Tulsi, is a revered adaptogenic herb in Ayurvedic tradition, commonly used to support the body's response to stress and to promote overall calm." },
  ],
},
"immune-support": {
    heading: "Herbs for Immune Support: Defend & Protect Naturally",
    text: "The body is constantly working to defend itself against everyday environmental stressors and seasonal changes. Traditional herbal wellness has long turned to a combination of immune-supportive, antioxidant-rich and anti-inflammatory herbs to help support the body's natural defenses.",
    image: "supports-immunity.png",
    sectionImage: "h2.webp",
    metaTitle: "Herbs for Immune Support | Natural Defenses & Protection",
    metaDesc: "Shop natural immune support herbs — Echinacea, Elderberry, Guduchi & Amla. Traditional support for seasonal wellness, antioxidant defense, and comfort.",
    sections: [
      {
        title: "Immune Shield: Herbs Traditionally Used for Seasonal Support",
        description: "Herbs such as Echinacea, Elderberry and Astragalus Root are widely used in traditional wellness routines to support the body during seasonal shifts. From the Himalayas, Guduchi (Giloy) is valued in Ayurvedic tradition as a botanical traditionally associated with immune resilience, while Chirata has a long-standing traditional reputation as a bitter herb used during seasonal changes.",
      },
      {
        title: "Cell Protect: Antioxidant-Rich Herbs",
        description: "Antioxidant-rich botanicals like Green Tea (EGCG), Hibiscus and Amla (Indian Gooseberry) are traditionally used to help the body manage everyday oxidative stress. Himalayan Amla is especially prized for its naturally high vitamin C content and long-standing role in Ayurvedic wellness.",
      },
      {
        title: "Anti-Inflame: Herbs for Everyday Comfort",
        description: "Active compounds in Turmeric (curcumin) and Ginger (gingerols) traditionally paired with Himalayan Boswellia (Frankincense) have centuries of use in traditional practices for supporting everyday joint comfort and general wellbeing.",
      },
    ],
    faqs: [
      { question: "What herbs are traditionally used for immune support?", answer: "Echinacea, Elderberry, Astragalus Root and Himalayan Guduchi (Giloy) are among the most widely used herbs in traditional practices for supporting the body's natural defenses." },
      { question: "What is Guduchi (Giloy)?", answer: "Guduchi, also called Giloy, is a Himalayan herb with a long history in Ayurvedic tradition as a botanical associated with immune resilience." },
      { question: "Can Elderberry help during cold and flu season?", answer: "Elderberry has a long tradition of seasonal use, often taken as a syrup or tea during colder months as part of a wellness routine." },
      { question: "What is Chirata traditionally used for?", answer: "Chirata is a bitter Himalayan herb traditionally used during seasonal changes, valued in traditional practices for its cleansing properties." },
      { question: "What does 'antioxidant-rich' mean in herbal wellness?", answer: "It refers to compounds that help the body manage everyday oxidative stress from environmental factors; herbs like Amla, Green Tea and Hibiscus are traditionally valued for this property." },
      { question: "What is Himalayan Amla and how is it different from regular Amla?", answer: "Himalayan Amla (Indian Gooseberry) is wild-harvested at high altitude and prized in Ayurvedic tradition for its naturally high vitamin C content." },
      { question: "Can Turmeric and Ginger really support joint comfort?", answer: "Both have centuries of traditional use for everyday joint and wellness support, largely attributed to their active compounds, curcumin and gingerols respectively." },
      { question: "What is Boswellia (Himalayan Frankincense)?", answer: "Boswellia is a resin traditionally used in Himalayan and Ayurvedic practices to support everyday joint comfort, often paired with Turmeric and Ginger." },
      { question: "How should I take Turmeric for best absorption?", answer: "Turmeric is traditionally paired with black pepper, which is believed to support better absorption; see our Grandma's Kitchen Remedies page for a traditional Golden Milk recipe." },
      { question: "Can I take multiple immune herbs at once?", answer: "Some people combine herbs like Elderberry and Guduchi during seasonal transitions, but it's best to introduce one new herb at a time and consult a healthcare professional if unsure." },
      { question: "Are immune herbs safe to take long-term?", answer: "Some herbs, like Echinacea, are traditionally used short-term during specific seasons rather than continuously. Check individual product guidance." },
      { question: "Is Green Tea considered an herb in traditional wellness?", answer: "Yes, Green Tea (EGCG) is widely used in traditional and modern wellness practices for its antioxidant properties." },
      { question: "Can these herbs be taken alongside supplements like vitamin C?", answer: "Many people combine antioxidant herbs with everyday supplements, but check with a healthcare professional if you take multiple products together." },
      { question: "Are these immune herbs suitable for children?", answer: "Most immune-support herbs on this site are intended for adults. Speak to a pediatrician before giving herbal products to children." },
      { question: "Where does Himalayan Guduchi come from?", answer: "Sourcing and harvest region details for Guduchi are listed on the individual product page." },
    ],
  },

  "digestion-gut-health": {
    heading: "Herbs for Digestion, Heart & Detox: Natural Core Support",
    text: "Everyday wellbeing starts with a well-functioning gut and healthy cardiovascular system. Traditional herbal wellness treats digestion, heart health and natural detoxification as closely connected using gentle plant-based tonics to help keep these core systems running smoothly.",
    image: "aids-digestion.png",
    sectionImage: "h3.webp",
    metaTitle: "Herbs for Digestion, Heart & Detox | Natural Core Support",
    metaDesc: "Shop natural herbs for gut health, heart support & detox — Triphala, Arjuna, Milk Thistle & Peppermint. Traditional wellness for core body systems.",
    sections: [
      {
        title: "Gut Comfort: Herbs for Everyday Digestion",
        description: "Herbs like Peppermint, Fennel Seed and Slippery Elm have a long tradition of use for easing everyday digestive discomfort. Himalayan Triphala a classic blend of Amla, Haritaki and Bibhitaki holds a central place in Ayurvedic tradition as a gentle tonic traditionally used to support regularity and overall gut comfort.",
      },
      {
        title: "Heart Support: Traditional Cardiovascular Tonics",
        description: "Botanicals such as Hawthorn Berry, Garlic and Olive Leaf are widely used in traditional wellness practices to support vascular wellbeing. The Himalayan bark Arjuna (Terminalia arjuna) has a centuries-long reputation in Ayurvedic tradition as a heart-supportive tonic.",
      },
      {
        title: "Cleanse & Detox: Herbs for Natural Detox Support",
        description: "Herbs including Milk Thistle, Dandelion Root and Burdock Root are traditionally used to support the body's own detox organs. Himalayan Kutki (Picrorhiza kurroa) is a bitter herb long valued in Ayurvedic tradition for its association with liver wellness.",
      },
    ],
    faqs: [
      { question: "What herbs are traditionally used for digestion?", answer: "Peppermint, Fennel Seed and Himalayan Triphala are among the most widely used herbs in traditional wellness for supporting everyday digestion." },
      { question: "What is Triphala and what is it used for?", answer: "Triphala is a traditional Ayurvedic blend of three fruits Amla, Haritaki and Bibhitaki used as a gentle daily tonic traditionally associated with digestive regularity and gut comfort." },
      { question: "How is Triphala traditionally taken?", answer: "Triphala is commonly taken as a powder mixed with warm water, often in the evening; check the specific product page for guidance." },
      { question: "What herbs support heart health naturally?", answer: "Hawthorn Berry, Garlic, Olive Leaf and Himalayan Arjuna bark are traditionally used to support cardiovascular wellbeing." },
      { question: "What is Arjuna (Terminalia arjuna)?", answer: "Arjuna is a Himalayan bark with a long history in Ayurvedic tradition as a tonic associated with heart and cardiovascular wellness." },
      { question: "Can herbs really support natural detox?", answer: "Herbs like Milk Thistle, Dandelion Root and Himalayan Kutki have a long tradition of use in supporting the body's own detox organs, particularly the liver, though they are not a substitute for medical detox treatment." },
      { question: "What is Kutki (Picrorhiza kurroa)?", answer: "Kutki is a bitter Himalayan herb long used in Ayurvedic tradition for its association with liver wellness and healthy digestive bile production." },
      { question: "Is Peppermint good for bloating?", answer: "Peppermint has a long tradition of use for easing bloating and general digestive discomfort, often taken as a tea after meals." },
      { question: "Can I take digestive and heart herbs together?", answer: "Many people combine a digestive tonic like Fennel with a heart-supportive herb like Hawthorn, but introduce new herbs one at a time and check with a healthcare professional if you take medication." },
      { question: "Are detox herbs safe to use regularly?", answer: "Detox herbs like Milk Thistle and Dandelion Root are traditionally used in cycles rather than continuously; check product guidance and consult a healthcare professional for long-term use." },
      { question: "Is Garlic considered a wellness herb as well as a spice?", answer: "Yes, Garlic is both a kitchen staple and a botanical with a long tradition of use for supporting cardiovascular wellness." },
      { question: "Can these herbs interact with heart medication?", answer: "Herbs like Hawthorn and Garlic can interact with certain heart or blood-thinning medications. Always consult a doctor before combining herbs with prescribed treatment." },
      { question: "What is the best time of day to take digestive herbs?", answer: "Many digestive herbs, like Fennel or Peppermint, are traditionally taken after meals, while tonics like Triphala are often taken in the evening." },
      { question: "Are Slippery Elm and Fennel suitable for sensitive stomachs?", answer: "Both are traditionally considered gentle herbs, but individual sensitivity varies; start with a small amount and consult a healthcare professional if you have a diagnosed digestive condition." },
      { question: "Where does Himalayan Triphala come from?", answer: "Sourcing and harvest details for our Triphala blend are listed on the product page." },
    ],
  },
  "joint-skin-hair-health": {
    heading: "Herbs for Strength & Glow: Recovery, Joints, Skin & Hair",
    text: "Beyond how you feel internally, botanicals have long been used to support the body's structural and external wellbeing from post-activity recovery to healthy-looking skin, hair and nails. Traditional wellness treats strength and glow as two sides of the same coin: a body that recovers well tends to show it outwardly, too.",
    image: "enhances-energy-levels.png",
    sectionImage: "h4.webp",
    metaTitle: "Herbs for Joint, Skin & Hair Health | Strength & Glow",
    metaDesc: "Shop natural herbs for recovery, joints, skin & hair — Guggulu, Bhringraj, Neem & Tart Cherry. Traditional botanical support for structural and radiant health.",
    sections: [
      {
        title: "Move & Restore: Herbs for Recovery",
        description: "Herbs such as Tart Cherry, Willow Bark and Horsetail are traditionally used to support the body's recovery after physical activity. Himalayan Guggulu (Commiphora mukul) has a long history in Ayurvedic tradition as a resin associated with joint comfort and flexibility, often used alongside Willow Bark.",
      },
      {
        title: "Glow & Radiance: Herbs for Skin & Hair",
        description: "Botanicals like Nettle Leaf, Calendula and Gotu Kola are widely used in traditional practices to nourish skin and hair from within. Himalayan Bhringraj has a centuries-long reputation in Ayurvedic hair care traditions, while Neem is valued for its traditional association with clear, healthy-looking skin.",
      },
    ],
    faqs: [
      { question: "What herbs support recovery after exercise?", answer: "Tart Cherry, Willow Bark and Himalayan Guggulu are traditionally used to support the body's recovery after physical activity." },
      { question: "What is Guggulu (Commiphora mukul)?", answer: "Guggulu is a resin from the Himalayan and Indian region with a long history in Ayurvedic tradition, associated with joint comfort and flexibility." },
      { question: "What is Bhringraj traditionally used for?", answer: "Bhringraj is a Himalayan herb with a centuries-long reputation in Ayurvedic hair care tradition, commonly used to support healthy-looking hair." },
      { question: "How is Bhringraj typically used?", answer: "Bhringraj is traditionally used as an oil applied to the scalp, or taken as a powder; check the specific product page for preparation guidance." },
      { question: "What is Neem good for?", answer: "Neem has a long tradition of use in Ayurvedic skincare practices, valued for its association with clear, healthy-looking skin." },
      { question: "Can herbs really support joint comfort?", answer: "Herbs like Willow Bark and Guggulu have centuries of traditional use for supporting joint comfort and flexibility, particularly after physical activity." },
      { question: "What is Horsetail traditionally used for?", answer: "Horsetail is a mineral-rich herb traditionally associated with connective tissue and nail strength support." },
      { question: "Are these herbs used topically or taken internally?", answer: "It depends on the herb; Bhringraj and Calendula are commonly used topically (oil, balm), while Nettle Leaf and Tart Cherry are typically taken internally as tea or capsule. Check each product page." },
      { question: "Can Nettle Leaf support hair health?", answer: "Nettle Leaf has a long tradition of use in herbal hair care, often included in routines aimed at supporting scalp and hair wellness." },
      { question: "Is Gotu Kola good for both skin and mental clarity?", answer: "Yes, Gotu Kola appears in both our Strength & Glow and Energy & Vitality categories, reflecting its traditional dual use for skin nourishment and mental clarity." },
      { question: "How long does it take to see a difference in skin or hair from herbs?", answer: "Traditional use of skin and hair herbs like Bhringraj and Neem typically involves consistent use over several weeks to months as part of an ongoing routine." },
      { question: "Are Willow Bark and Tart Cherry safe to take together?", answer: "Many people combine recovery-focused herbs, but Willow Bark contains compounds similar to aspirin, so check with a healthcare professional if you have a bleeding disorder or take blood-thinning medication." },
      { question: "Can these herbs be used on sensitive skin?", answer: "Always patch-test a topical herb like Calendula or Neem oil before wider use, especially if you have sensitive or reactive skin." },
      { question: "Is Calendula suitable for daily skincare use?", answer: "Calendula has a long tradition of gentle daily use in herbal skincare, though individual sensitivity varies." },
      { question: "Where does Himalayan Bhringraj come from?", answer: "Sourcing and harvest region details for Bhringraj are listed on the product page." },
    ],
  },
  capsules: {
    heading: "Pure Wellness in Every Capsule",
    text: "Convenient, high-potency daily supplements crafted for maximum absorption.",
    image: "capsules.png",
  },
  powders: {
    heading: "Versatile Nutrition, Grounded Fresh",
    text: "Mix into smoothies, water, or bowls for a potent dose of daily superfoods.",
    image: "powders.png",
  },
  teas: {
    heading: "Sip Into Serenity and Health",
    text: "Hand-blended loose-leaf teas crafted for flavor, healing, and mindfulness.",
    image: "teas.png",
  },
  "face-oils": {
    heading: "Radiance Bottled Pure",
    text: "Nourishing botanical face oils to lock in moisture and restore your natural glow.",
    image: "face-oils.png",
  },
  creams: {
    heading: "Rich Moisture, Velvet Touch",
    text: "Deeply hydrating creams formulated with clean, skin-loving ingredients.",
    image: "creams.png",
  },
  cleansers: {
    heading: "Refresh and Purify Gently",
    text: "Wash away impurities without stripping your skin's natural moisture barrier.",
    image: "cleansers.png",
  },
  "hair-oils": {
    heading: "Strong Roots, Luscious Locks",
    text: "Traditional herbal hair oils designed to nourish follicles and add brilliant shine.",
    image: "hair-oils.png",
  },
  shampoos: {
    heading: "Clean Scalp, Healthy Hair",
    text: "Sulfate-free cleansing shampoos that respect your scalp's delicate microbiome.",
    image: "shampoos.png",
  },
  "hair-masks": {
    heading: "Intensive Repair and Restoration",
    text: "Deep-conditioning treatments to revive dry, chemically treated, or brittle hair.",
    image: "hair-masks.png",
  },


  "grandmas-kitchen-remedies": {
    heading: "Grandma's Kitchen Remedies: 10 Traditional Desi Home Remedies",
    text: "Long before wellness trends took over social media, the ultimate apothecary was sitting right on the kitchen counter. Generations of Desi grandmothers (Dadimas) have relied on ordinary pantry spices to put together simple, time-tested remedies for everyday discomforts. Below are ten classic recipes passed down through Desi households along with the traditional reasoning behind each one. As with any home remedy, these are shared for their cultural and traditional wellness value, not as a substitute for medical advice.",
    image: "aids-digestion.png",
    metaTitle: "Grandma's Kitchen Remedies | Traditional Herbal Wellness",
    metaDesc: "Discover time-tested kitchen remedies using traditional herbs and spices, passed down through generations for everyday wellness.",
    isCardLayout: true,
    sections: [
      {
        title: "1. The Liquid Gold Hug: Haldi Doodh (Golden Milk)",
        description: "The Vibe: A warm, soothing ritual traditionally used to support the immune system and joint comfort.\n\nThe Recipe: Warm milk (dairy or plant-based) infused with raw turmeric powder, fresh grated ginger, and a pinch of freshly ground black pepper.\n\nThe Tradition Behind It: Turmeric's active compound, curcumin, has a long tradition of use for supporting the body's response to everyday inflammation. Curcumin is naturally difficult for the body to absorb on its own; black pepper contains piperine, a compound traditionally believed to significantly improve turmeric's absorption.\n\nGrandma's Tip: Traditionally sipped before bed at the first sign of a scratchy throat, seasonal chill, or after a tough workout.",
      },
      {
        title: "2. The 5-Minute Bloat Buster: Ajwain & Ginger Shot",
        description: "The Vibe: A traditional go-to for after a heavy meal.\n\nThe Recipe: Carom seeds (Ajwain), crushed fresh ginger, and a pinch of black salt (Kala Namak) simmered in water for 5 minutes.\n\nThe Tradition Behind It: Ajwain seeds contain thymol, a natural compound traditionally associated with supporting digestion. This blend has long been used in Desi households to ease bloating and a heavy, sluggish feeling after eating.\n\nGrandma's Tip: Strain and sip warm like a savory digestive tea after a rich or heavy meal.",
      },
      {
        title: "3. The Natural Soother: Clove & Honey Rescue",
        description: "The Vibe: A traditional sweet-and-spicy remedy for a nagging cough or tooth discomfort.\n\nThe Recipe: Whole cloves (Laung) crushed into a spoonful of raw honey.\n\nThe Tradition Behind It: Cloves contain eugenol, a compound long used in traditional dentistry for its numbing and antibacterial properties. Paired with honey—a traditional soother for irritated tissue—this combination has been a household remedy for generations.\n\nGrandma's Tip: A whole clove is traditionally tucked near an aching tooth for local comfort, or crushed with honey to ease a nighttime cough.",
      },
      {
        title: "4. The Daily De-Puff Tonic: CCF Water (Jeera-Dhania-Saunf)",
        description: "The Vibe: A cooling daily ritual associated with gut comfort and clear skin.\n\nThe Recipe: Equal parts Cumin (Jeera), Coriander (Dhania) and Fennel (Saunf) seeds boiled together in water for 10 minutes, then strained.\n\nThe Tradition Behind It: This classic trio is a household staple: Cumin is traditionally linked to metabolism support, Coriander to cooling internal heat, and Fennel to easing cramping and water retention.\n\nGrandma's Tip: Fill a flask with warm CCF water and sip throughout the day.",
      },
      {
        title: "5. The Sore-Throat Slayer: Ginger-Tulsi Kadha (Spiced Immune Shot)",
        description: "The Vibe: A traditional fiery herbal kick used at the first sign of a seasonal chill.\n\nThe Recipe: Freshly crushed ginger, 5–6 Holy Basil (Tulsi) leaves, black pepper, and a dash of raw honey or jaggery, simmered in water until reduced by half.\n\nThe Tradition Behind It: Tulsi is an adaptogenic herb long used in Ayurvedic tradition to support the body's immune response, while ginger has a traditional reputation for soothing scratchy, inflamed throats.\n\nGrandma's Tip: Traditionally drunk steaming hot first thing in the morning at the first hint of a sore throat.",
      },
      {
        title: "6. The Cooling Fire Extinguisher: Gond Katira & Rose Cooler",
        description: "The Vibe: A traditional chilled remedy for hot weather and skin comfort.\n\nThe Recipe: Soak a small piece of edible tragacanth gum (Gond Katira) in water overnight until it becomes soft and jelly-like. Mix a spoonful into cold milk or water with a splash of rose syrup or rose water.\n\nThe Tradition Behind It: Gond Katira is traditionally considered a natural cooling agent (Sheetal) used to help regulate body temperature during hot weather, and is often paired with rose for its soothing traditional reputation.\n\nGrandma's Tip: Traditionally eaten during peak afternoon heat to help cool down.",
      },
      {
        title: "7. The Digestive Reset: Kala Namak & Lemon Shot",
        description: "The Vibe: A quick citrus flush traditionally used after a heavy meal.\n\nThe Recipe: Squeeze half a fresh lemon into warm water, add a pinch of roasted cumin powder, and stir in a pinch of Indian black salt (Kala Namak).\n\nThe Tradition Behind It: Kala Namak is rich in natural sulfur and iron compounds and has a traditional reputation for supporting digestion, while lemon juice is traditionally used to help the body's digestive process along.\n\nGrandma's Tip: Traditionally drunk right after a rich or greasy meal.",
      },
      {
        title: "8. The Skin-Clarity Ritual: Neem & Honey Elixir",
        description: "The Vibe: A bitter-sweet ritual traditionally associated with clear, healthy-looking skin.\n\nThe Recipe: A handful of fresh, washed Neem leaves ground into a paste, rolled into a small ball, and taken with a spoonful of raw honey or warm water.\n\nThe Tradition Behind It: Neem is renowned in traditional Ayurvedic practice as a purifying herb, and its bitter compounds are traditionally associated with supporting clear skin from within.\n\nGrandma's Tip: Traditionally swallowed whole, without chewing, given its intense bitterness.",
      },
      {
        title: "9. The Natural Nightcap: Nutmeg Warm Milk (Jaiphal Doodh)",
        description: "The Vibe: A silky, soothing traditional nightcap for restless nights.\n\nThe Recipe: A tiny pinch (less than 1/8 tsp) of freshly grated nutmeg (Jaiphal) swirled into warm milk with a drop of ghee or almond oil before bed.\n\nThe Tradition Behind It: Nutmeg contains myristicin, a compound traditionally associated with relaxation, while warm milk supplies tryptophan, an amino acid the body uses to support natural sleep processes.\n\nGrandma's Tip: Keep the nutmeg dose small—traditional wisdom holds that too much can leave you feeling groggy rather than rested.",
      },
      {
        title: "10. The Joint & Motion Soother: Methi Seed Water (Fenugreek Tonic)",
        description: "The Vibe: A morning ritual traditionally used to support joint comfort.\n\nThe Recipe: Soak a teaspoon of Fenugreek seeds (Methi) in a glass of water overnight. In the morning, drink the infused water and eat the softened seeds.\n\nThe Tradition Behind It: Fenugreek seeds are rich in mucilaginous fibre and have a long tradition of use for supporting joint comfort and healthy digestion.\n\nGrandma's Tip: Enjoy first thing in the morning on an empty stomach for maximum absorption.",
      }
    ],
    faqs: [
      { question: "What is Haldi Doodh (Golden Milk) used for?", answer: "Golden Milk is a traditional turmeric-and-milk drink used in Desi households, especially before bed or at the first sign of a seasonal chill." },
      { question: "Why is black pepper added to turmeric milk?", answer: "Black pepper contains piperine, a compound traditionally believed to help the body absorb turmeric's curcumin more effectively." },
      { question: "What is CCF water and what is it used for?", answer: "CCF water is a traditional infusion of Cumin, Coriander and Fennel seeds, commonly sipped throughout the day to support digestion and reduce bloating." },
      { question: "How do I make an Ajwain and ginger digestive shot?", answer: "Simmer carom seeds (Ajwain), crushed ginger and a pinch of black salt in water for five minutes, then strain and sip warm after a heavy meal." },
      { question: "What is Kala Namak (black salt) traditionally used for?", answer: "Kala Namak is a mineral-rich salt traditionally used in digestive tonics, valued for its distinct sulfurous flavour and traditional association with digestive comfort." },
      { question: "Is honey and clove a real traditional remedy for sore throats?", answer: "Yes, crushed clove mixed with raw honey is a long-standing Desi household remedy traditionally used to ease throat irritation and coughing." },
      { question: "What is Gond Katira and how is it used?", answer: "Gond Katira (tragacanth gum) is soaked in water until it becomes jelly-like, then mixed into cold milk or water—a traditional cooling remedy used during hot weather." },
      { question: "Are these remedies safe for everyone?", answer: "These are traditional household recipes, not medical treatments. Some ingredients (like Neem or Nutmeg in large amounts) aren't suitable for everyone—check with a healthcare professional if you're pregnant, on medication, or unsure." },
      { question: "How much nutmeg is safe to use in Jaiphal Doodh?", answer: "Traditional recipes use a very small pinch—less than 1/8 teaspoon. Larger amounts of nutmeg are not recommended." },
      { question: "What is Methi (Fenugreek) water traditionally used for?", answer: "Fenugreek seeds soaked overnight and consumed in the morning are a traditional remedy associated with joint comfort and digestive support." },
      { question: "Can I use plant-based milk for Golden Milk?", answer: "Yes, Golden Milk is traditionally made with dairy milk but works equally well with plant-based alternatives like oat or almond milk." },
      { question: "What is the traditional use of Neem and honey?", answer: "A small ball of ground Neem leaves taken with honey or water is a traditional Desi remedy associated with clear, healthy-looking skin." },
      { question: "How long can I store CCF water or kadha at home?", answer: "Fresh preparations are traditionally made in small batches and consumed within a day, as they're best enjoyed fresh rather than stored long-term." },
      { question: "Are these remedies backed by scientific research?", answer: "Some individual compounds (like curcumin in turmeric or thymol in ajwain) have been studied, but these recipes are shared as traditional household wisdom rather than clinically proven treatments." },
      { question: "Can children have these kitchen remedies?", answer: "Some ingredients, like honey, are not suitable for children under one year old, and others (like Neem) may need adult-only dosing. Check with a pediatrician before giving any remedy to a child." },
      { question: "What's the difference between a kitchen remedy and a herbal supplement?", answer: "Kitchen remedies use whole, everyday pantry spices in simple home preparations, while herbal supplements are typically standardized extracts sold in capsule or powder form for consistent dosing." },
    ],
  },
 }