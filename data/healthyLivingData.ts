export type AllowedSlug =
  | "sleep-stress-relief"
  | "immune-support"
  | "digestion-gut-health"
  | "joint-skin-hair-health"
  | "weight-loss"
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
  "weight-loss",
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
  "weight-loss": {
    heading: "Weight Management Support: Traditional Herbs for a Balanced Routine",
    text: "A healthy weight is supported by many things working together — diet, activity, sleep and stress all play a role, and no single herb replaces any of them. What traditional herbal wellness offers is support alongside those fundamentals: botanicals long used to support a normally functioning metabolism, a feeling of fullness after meals, and a sense of lightness as part of an everyday balanced routine.\n\nThe herbs below are shared in that spirit — as traditional support for a healthy, active lifestyle, not as a substitute for medical advice or a promise of any specific result.",
    image: "enhances-energy-levels.png",
    sectionImage: "h1.webp",
    metaTitle: "Weight Management Support | Herbal Metabolism Support",
    metaDesc: "Shop herbs traditionally used to support metabolism and satiety as part of a balanced diet and active lifestyle — Green Tea, Guggul, Glucomannan & more.",
    sections: [
      {
        title: "Traditional Metabolism Support",
        description:
          "Herbs such as Green Tea Extract, Ginger and Black Pepper (Piperine) have a long tradition of use in supporting a normally functioning metabolism as part of a balanced routine. From Ayurvedic tradition, Guggul (Commiphora mukul) has historically been associated with metabolic support in classical texts, alongside its more established traditional use for joint comfort.",
      },
      {
        title: "Fiber & Fullness Support",
        description:
          "Glucomannan (Konjac) is the one ingredient on this page with an actual EU-authorised weight-loss claim: \"in the context of an energy-restricted diet, contributes to weight loss\" — but only when providing a daily intake of 3g in three 1g doses, taken with 1–2 glasses of water before meals, and only as part of an energy-restricted diet. It also requires a choking-risk warning for anyone with swallowing difficulties or who doesn't take it with enough fluid. This exact wording, dosage and warning must be verified by legal/compliance before publishing — it cannot be shortened or paraphrased.\n\nOther fiber-rich botanicals, such as Psyllium Husk and Fenugreek (Methi), are traditionally used to support a feeling of fullness after meals, which is a permitted claim category (satiety) distinct from a weight-loss claim.",
      },
      {
        title: "Traditional Digestive Support",
        description:
          "Digestive tonics like Triphala and the classic Cumin-Coriander-Fennel (CCF) Blend (see our Grandma's Kitchen Remedies page) are traditionally used to support digestion and a feeling of lightness, and pair naturally with an active, balanced routine.",
      },
      {
        title: "Shop the Herbs in This Guide",
        description:
          "• Green Tea Extract\n" +
          "• Ginger\n" +
          "• Black Pepper (Piperine)\n" +
          "• Guggul (Commiphora mukul)\n" +
          "• Glucomannan (Konjac)\n" +
          "• Psyllium Husk\n" +
          "• Fenugreek (Methi)\n" +
          "• Triphala",
      },
    ],
    faqs: [
      {
        question: "Can herbs alone cause weight loss?",
        answer:
          "No single herb is a substitute for a balanced diet and regular physical activity. Traditional herbs are best understood as support alongside these fundamentals, not a replacement for them.",
      },
      {
        question: "Is Glucomannan proven to cause weight loss?",
        answer:
          "Glucomannan is the only ingredient with an EU-authorised weight-loss claim, but that claim only applies in the context of an energy-restricted diet and a specific daily intake (3g, in three 1g doses, with water, before meals) — it isn't a claim that the ingredient alone causes weight loss.",
      },
      {
        question: "How much weight will I lose using these products?",
        answer:
          "We can't state or imply a specific amount or rate of weight loss — EU regulation prohibits this for all products, and individual results vary significantly based on diet, activity and many other factors.",
      },
      {
        question: "Are these products a substitute for diet and exercise?",
        answer:
          "No — these herbs are intended as traditional support alongside a balanced diet and regular physical activity, not a replacement for either.",
      },
      {
        question: "What does 'supports metabolism' actually mean?",
        answer:
          "It means the herb has a traditional or scientific association with normal metabolic processes — it does not mean the herb causes weight loss on its own.",
      },
      {
        question: "Is Green Tea Extract safe to take daily?",
        answer:
          "Green Tea Extract is commonly used daily by many people, but it does contain natural caffeine — check the product label for guidance and consult a healthcare professional if you're sensitive to caffeine or take medication.",
      },
      {
        question: "What is Guggul traditionally used for?",
        answer:
          "Guggul is a resin from Ayurvedic tradition historically associated with metabolic support in classical texts, and more established in modern use for joint comfort.",
      },
      {
        question: "How should I take Glucomannan safely?",
        answer:
          "Always take Glucomannan with plenty of water, as recommended on the product label — inadequate fluid intake or swallowing difficulties can pose a choking risk, which is why this warning is legally required on the product.",
      },
      {
        question: "Can fiber supplements like Psyllium help me feel full?",
        answer:
          "Psyllium Husk and similar fiber-rich ingredients are traditionally used to support a feeling of fullness after meals, which may support portion awareness as part of a balanced diet.",
      },
      {
        question: "Are weight-management herbs safe for everyone?",
        answer:
          "No — these products are not suitable for everyone. They're not recommended for anyone who is pregnant, breastfeeding, underweight, has a history of disordered eating, or has an existing health condition, without first consulting a healthcare professional.",
      },
      {
        question: "Can I combine multiple weight-management herbs together?",
        answer:
          "Some people combine herbs from different categories on this page, but it's best to introduce one new herb at a time, follow labeled dosages, and consult a healthcare professional, especially if combining with medication.",
      },
      {
        question: "Why don't your product descriptions mention specific weight-loss results?",
        answer:
          "EU regulation prohibits any claim referencing a specific rate or amount of weight loss for any product. We describe traditional use and general support instead, so you have accurate information to make your own decision.",
      },
      {
        question: "Is it healthy to take weight-management supplements long-term?",
        answer:
          "This depends on the specific herb — some are intended for continuous use, others for cycles. Long-term use of any supplement should be discussed with a healthcare professional, particularly a dietitian.",
      },
      {
        question: "Can these herbs interact with medication?",
        answer:
          "Some herbs, including Green Tea Extract and Guggul, can interact with certain medications. Always check with a doctor or pharmacist before combining herbal supplements with prescribed treatment.",
      },
      {
        question: "What's the healthiest way to approach weight management?",
        answer:
          "Most health professionals recommend a sustainable, balanced approach — a varied diet, regular movement, adequate sleep and stress management — with any supplement, herbal or otherwise, playing a supporting role rather than being relied on alone.",
      },
    ],
  },
  capsules: {
    heading: "Herbal Supplement Capsules: Convenient Daily Wellness",
    text: "For anyone who wants the benefits of traditional herbs without measuring, mixing or tasting anything, capsules are the simplest way to build a herb into a daily routine. Each capsule contains a pre-measured amount of powdered herb, so dosing stays consistent every time.",
    image: "capsules.png",
    metaTitle: "Herbal Supplement Capsules | Convenient Daily Wellness",
    metaDesc: "Shop herbal supplement capsules — Ashwagandha, Turmeric, Shilajit, Ginseng & more. Pre-measured, easy-to-take herbal capsules for your daily routine.",
    sections: [
      {
        title: "Why Choose Capsules",
        description:
          "Capsules are popular for three reasons: consistent dosing (no guesswork with a spoon), no taste (useful for bitter herbs like Kutki or Chirata), and portability — they travel well and fit into a morning or evening routine alongside other supplements.",
      },
      {
        title: "How to Take Herbal Capsules",
        description:
          "Most herbal capsules are taken with water, either on an empty stomach or with food depending on the herb — always follow the guidance on the product label. If you have difficulty swallowing capsules, some (though not all) can be opened and mixed into food or a smoothie; check the specific product page before doing this.",
      },
      {
        title: "Shop the Herbs & Spices in This Guide",
        description:
          "• Ashwagandha Capsules\n" +
          "• Turmeric Capsules\n" +
          "• Shilajit Capsules\n" +
          "• Panax Ginseng Capsules\n" +
          "• Triphala Capsules\n" +
          "• Guggulu Capsules\n" +
          "• Milk Thistle Capsules\n" +
          "• Brahmi (Bacopa Monnieri) Capsules\n" +
          "• Guduchi (Giloy) Capsules\n" +
          "• Arjuna Capsules",
      },
    ],
    faqs: [
      {
        question: "What are herbal capsules made from?",
        answer:
          "Herbal capsules typically contain powdered herb inside a gelatin or vegetarian (cellulose-based) shell. Shell material is listed on each product page.",
      },
      {
        question: "Are herbal capsules vegan or vegetarian-friendly?",
        answer:
          "Some are — check the shell material on the specific product page, as gelatin capsules are not vegan or vegetarian.",
      },
      {
        question: "Should I take herbal capsules with food or on an empty stomach?",
        answer:
          "This depends on the herb. Some, like Ashwagandha, are commonly taken with food to reduce any stomach sensitivity, while others are taken on an empty stomach for faster absorption. Check the label for specific guidance.",
      },
      {
        question: "Can I open a capsule and mix the powder into food?",
        answer:
          "Some capsules can be opened and mixed into food or a drink, but not all — check the specific product page, as some herbs are formulated for capsule delivery specifically.",
      },
      {
        question: "How many capsules should I take per day?",
        answer:
          "Recommended dosage varies by herb and product; always follow the label instructions and don't exceed the recommended daily amount.",
      },
      {
        question: "Do herbal capsules expire?",
        answer:
          "Yes, capsules have a best-by date printed on the packaging. Store in a cool, dry place to preserve potency until then.",
      },
      {
        question: "Can I take multiple herbal capsules together?",
        answer:
          "Many people combine capsules from different categories (for example, an energy herb in the morning and a calming herb in the evening), but introduce one new herb at a time and check for interactions.",
      },
      {
        question: "Why do some capsules cost more than others?",
        answer:
          "Price differences usually reflect the herb's rarity, sourcing region (e.g., high-altitude Himalayan herbs), extraction method, and concentration per capsule.",
      },
      {
        question: "Are capsules more effective than powders?",
        answer:
          "Not necessarily — capsules and powders of the same herb typically contain the same material, just in a different delivery format. Capsules offer convenience and precise dosing; powders offer flexibility.",
      },
      {
        question: "Can I travel with herbal capsules?",
        answer:
          "Yes, capsules are one of the most travel-friendly herbal formats since they don't require measuring or refrigeration.",
      },
      {
        question: "Is it safe to take herbal capsules long-term?",
        answer:
          "This depends on the herb — some are intended for continuous daily use, while others (like Milk Thistle) are traditionally used in cycles. Check product guidance.",
      },
      {
        question: "Are herbal capsules safe during pregnancy?",
        answer:
          "Several herbs available in capsule form, including Ashwagandha and Guggulu, are not recommended during pregnancy. Always consult a healthcare professional first.",
      },
      {
        question: "What size are your herbal capsules?",
        answer:
          "Capsule size (and mg per capsule) varies by product and is listed on each individual product page.",
      },
      {
        question: "Can children take herbal capsules?",
        answer:
          "Most herbal capsules on this site are formulated with adults in mind. Speak to a pediatrician before giving any herbal supplement to a child.",
      },
      {
        question: "How should I store herbal capsules?",
        answer:
          "Keep capsules in their original container, sealed, in a cool, dry place away from direct sunlight and humidity.",
      },
    ],
  },
  powders: {
    heading: "Herbal Supplement Powders: Traditional Botanical Powders",
    text: "Powdered herbs are the most traditional form of herbal supplementation — the same format used in Ayurvedic and Himalayan households for generations. A powder gives you full flexibility: stir it into water, blend it into a smoothie, or use it in a classic preparation like Golden Milk or Triphala water.",
    image: "powders.png",
    metaTitle: "Herbal Supplement Powders | Traditional Botanicals",
    metaDesc: "Shop herbal powders — Turmeric, Triphala, Ashwagandha, Amla & more. Traditional botanical powders for smoothies, Golden Milk and daily rituals.",
    sections: [
      {
        title: "Why Choose Powders",
        description:
          "Powders offer three advantages over capsules: dosing flexibility (you decide the amount, from a pinch to a full teaspoon), versatility in the kitchen — turmeric and fenugreek powder can go straight into cooking as well as wellness drinks — and, generally, better value per serving since there's no capsule-manufacturing cost.",
      },
      {
        title: "How to Use Herbal Powders",
        description:
          "Most powders are mixed with warm water, milk (dairy or plant-based), or a smoothie base. Herbs like Turmeric are traditionally paired with black pepper and a fat source (like milk or ghee) to support absorption. Store powders in an airtight container to protect against moisture, which can affect both potency and shelf life.",
      },
      {
        title: "Shop the Herbs & Spices in This Guide",
        description:
          "• Turmeric Powder\n" +
          "• Ashwagandha Powder\n" +
          "• Triphala Powder\n" +
          "• Amla (Indian Gooseberry) Powder\n" +
          "• Fenugreek (Methi) Powder\n" +
          "• Maca Root Powder\n" +
          "• Ginger Powder\n" +
          "• Moringa Powder\n" +
          "• Cumin-Coriander-Fennel (CCF) Blend Powder",
      },
    ],
    faqs: [
      {
        question: "How much herbal powder should I take per day?",
        answer:
          "Recommended serving size varies by herb — check the product label for guidance, typically starting with a smaller amount (such as 1/4 to 1/2 teaspoon) and adjusting from there.",
      },
      {
        question: "What's the best way to mix herbal powders?",
        answer:
          "Most powders mix well into warm water, milk, or a smoothie. Stronger-tasting or bitter powders are often masked better in a smoothie with fruit than in plain water.",
      },
      {
        question: "Why is black pepper added to turmeric powder preparations?",
        answer:
          "Black pepper contains piperine, a compound traditionally believed to help the body absorb turmeric's curcumin more effectively.",
      },
      {
        question: "Can I cook with these herbal powders?",
        answer:
          "Yes — powders like Turmeric, Ginger and Fenugreek are traditional kitchen spices as well as wellness herbs, so they can go directly into cooking.",
      },
      {
        question: "How should I store herbal powders?",
        answer:
          "Keep powders in a sealed, airtight container away from direct light and moisture. Humidity is the biggest risk to both flavor and potency.",
      },
      {
        question: "How long do herbal powders stay fresh?",
        answer:
          "Most herbal powders stay potent for 12–24 months when stored properly, though this varies by herb — check the product's best-by date.",
      },
      {
        question: "Are powders more potent than capsules?",
        answer:
          "Not necessarily — powders and capsules of the same herb usually come from the same base material. Powders simply let you control the exact amount yourself.",
      },
      {
        question: "Can I take herbal powder on an empty stomach?",
        answer:
          "This depends on the herb — some, like Triphala, are traditionally taken in the evening on a fairly empty stomach, while others are better taken with food. Check specific product guidance.",
      },
      {
        question: "Is it normal for herbal powders to taste bitter?",
        answer:
          "Yes, many traditional herbs (like Triphala, Kutki or Neem) are naturally bitter — this is expected and often considered part of their traditional use, though mixing with honey or a smoothie can help.",
      },
      {
        question: "Can I use herbal powder in baking?",
        answer:
          "Some powders, like Ginger or Turmeric, work well in baking; others (like Ashwagandha) are more commonly used in drinks. Check individual recipes and product guidance.",
      },
      {
        question: "Are herbal powders suitable for smoothies?",
        answer:
          "Yes — powders blend easily into smoothies and are one of the most popular ways to take herbs like Maca Root, Moringa and Ashwagandha.",
      },
      {
        question: "Do herbal powders need refrigeration?",
        answer:
          "Most herbal powders don't require refrigeration and are best kept in a cool, dry pantry — check the specific product label.",
      },
      {
        question: "Is herbal powder the same as ground spice from the supermarket?",
        answer:
          "Sourcing, potency and purity can vary significantly — our herbal powders are sourced and processed specifically for wellness use, with sourcing details listed per product.",
      },
      {
        question: "Can I use these powders during pregnancy?",
        answer:
          "Several powders, including Ashwagandha and Fenugreek in concentrated amounts, are not recommended during pregnancy. Always check with a healthcare professional.",
      },
      {
        question: "What's the difference between Triphala powder and Triphala capsules?",
        answer:
          "Both contain the same traditional blend of Amla, Haritaki and Bibhitaki — the powder form is traditionally mixed with warm water, while capsules offer a tasteless, pre-measured alternative.",
      },
    ],
  },
  teas: {
    heading: "Herbal Wellness Tea: Traditional Botanical Tea Blends",
    text: "Tea is the slowest and most ritual-based way to take a herb — and often the most enjoyable. Steeping dried leaves, roots or flowers in hot water has been a daily practice across cultures for centuries, from Ayurvedic Tulsi tea to Himalayan herbal infusions, long before 'wellness tea' became a modern shelf category.",
    image: "teas.png",
    metaTitle: "Herbal Wellness Tea | Traditional Botanical Blends",
    metaDesc: "Shop herbal wellness teas — Tulsi, Chamomile, Ginger, Valerian Root & more. Traditional botanical tea blends for calm, digestion and everyday wellness.",
    sections: [
      {
        title: "Why Choose Herbal Tea",
        description:
          "Tea offers something capsules and powders don't: a built-in pause. The few minutes it takes to steep and sip a cup of Chamomile or Holy Basil (Tulsi) tea double as a small daily ritual, alongside the herb's traditional benefits. Herbal teas are also naturally hydrating and generally deliver a gentler dose than a concentrated powder or capsule.",
      },
      {
        title: "How to Brew for Best Results",
        description:
          "Most herbal teas are steeped in water just off the boil (around 90–95°C) for 5–10 minutes, covered, to retain the herb's natural oils. Delicate flowers like Chamomile and Lemon Balm prefer slightly cooler water and a shorter steep, while roots like Valerian and Ginger benefit from a longer steep or gentle simmer to draw out their full flavor and traditional properties.",
      },
      {
        title: "Shop the Herbs & Spices in This Guide",
        description:
          "• Holy Basil (Tulsi) Tea\n" +
          "• Chamomile Tea\n" +
          "• Valerian Root Tea\n" +
          "• Ginger Tea\n" +
          "• Lemon Balm Tea\n" +
          "• Hibiscus Tea\n" +
          "• Fennel (Saunf) Tea\n" +
          "• Peppermint Tea\n" +
          "• Green Tea",
      },
    ],
    faqs: [
      {
        question: "How long should I steep herbal tea?",
        answer:
          "Most herbal teas are steeped for 5–10 minutes, covered. Delicate flowers like Chamomile need less time, while roots like Valerian or Ginger often benefit from a longer steep.",
      },
      {
        question: "Does herbal tea contain caffeine?",
        answer:
          "Most single-herb wellness teas (Tulsi, Chamomile, Valerian, Ginger) are naturally caffeine-free, with the exception of Green Tea, which contains a modest amount of natural caffeine.",
      },
      {
        question: "What's the best herbal tea for winding down in the evening?",
        answer:
          "Chamomile, Valerian Root and Lemon Balm are among the most traditionally used herbal teas for an evening wind-down routine.",
      },
      {
        question: "Can I drink herbal tea every day?",
        answer:
          "Many herbal teas, like Chamomile and Tulsi, are traditionally drunk daily, but some (like Valerian) are better reserved for occasional use — check specific product guidance.",
      },
      {
        question: "How many cups of herbal tea can I drink per day?",
        answer:
          "This varies by herb; most wellness teas suggest 1–3 cups daily, but always check the specific product label for guidance.",
      },
      {
        question: "Can I drink herbal tea cold or as iced tea?",
        answer:
          "Yes — most herbal teas, especially Hibiscus and Peppermint, work well as a cold brew or chilled iced tea.",
      },
      {
        question: "Is herbal tea safe during pregnancy?",
        answer:
          "Not all herbal teas are considered safe during pregnancy — some, like Tulsi in large amounts, are best avoided. Always check with a healthcare professional before drinking a new herbal tea while pregnant.",
      },
      {
        question: "What water temperature is best for herbal tea?",
        answer:
          "Most herbal teas are brewed with water just off the boil, around 90–95°C, rather than a full boil, to protect delicate aromatic oils.",
      },
      {
        question: "Can I add honey or lemon to herbal tea?",
        answer:
          "Yes — honey and lemon are commonly added to herbal teas like Ginger or Tulsi, and are traditionally paired together for soothing a scratchy throat.",
      },
      {
        question: "How should I store loose-leaf herbal tea?",
        answer:
          "Store loose tea in an airtight container away from light, heat and moisture, and use within about 12 months of opening for the best flavor.",
      },
      {
        question: "What's the difference between herbal tea and green/black tea?",
        answer:
          "Herbal teas (also called infusions) are made from herbs, flowers or roots and are naturally caffeine-free, while green and black tea come from the Camellia sinensis plant and contain natural caffeine.",
      },
      {
        question: "Can herbal tea help with digestion after a meal?",
        answer:
          "Peppermint and Fennel tea are among the most traditionally used herbal teas for easing digestive discomfort after a meal.",
      },
      {
        question: "Are your herbal teas loose-leaf or tea bags?",
        answer:
          "Format (loose-leaf vs. bagged) varies by product — check the individual product page for packaging details.",
      },
      {
        question: "Can I reuse tea leaves for a second cup?",
        answer:
          "Some herbal teas can be steeped a second time at a milder strength, but flavor and potency will be reduced compared to the first steep.",
      },
      {
        question: "Can children drink herbal tea?",
        answer:
          "Some herbal teas are generally considered gentle, but not all are suitable for children — check with a pediatrician before giving herbal tea to a child.",
      },
    ],
  },
  "face-oils": {
    heading: "Herbal Face Oil: Traditional Botanical Oils for Nourished Skin",
    text: "Face oils are one of the oldest forms of skin care, used across Ayurvedic and Himalayan traditions long before modern serums existed. A good herbal face oil is typically applied after cleansing to nourish the skin, help lock in moisture, and leave a naturally healthy-looking finish.",
    image: "face-oils.png",
    metaTitle: "Herbal Face Oil | Traditional Botanical Skin Oils",
    metaDesc: "Shop herbal face oils — Rosehip, Kumkumadi, Neem & Sandalwood-infused oil. Traditional botanical oils to nourish, balance and lock in moisture.",
    sections: [
      {
        title: "Nourish & Balance: Everyday Face Oils",
        description:
          "Lightweight carrier oils like Sweet Almond Oil, Jojoba Oil and Rosehip Oil are traditionally used to nourish the skin without feeling heavy, and are suitable for daily use across most skin types.",
      },
      {
        title: "Traditional Glow: Ayurvedic & Himalayan Oil Blends",
        description:
          "The classic Ayurvedic blend Kumkumadi Oil — traditionally infused with saffron and a combination of herbs — has centuries of use in Ayurvedic tradition, associated with radiance and evening out the look of the complexion. Neem Oil is traditionally used for its purifying reputation, often chosen by those with blemish-prone skin, while Himalayan Sandalwood-Infused Oil is valued in traditional practices for its calming aroma and association with soothed, balanced skin.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Kumkumadi Oil\n" +
          "• Rosehip Oil\n" +
          "• Neem Oil\n" +
          "• Sandalwood-Infused Oil\n" +
          "• Sweet Almond Oil\n" +
          "• Jojoba Oil\n" +
          "• Moringa Oil\n" +
          "• Tea Tree Facial Oil",
      },
    ],
    faqs: [
      {
        question: "What is a herbal face oil used for?",
        answer:
          "A herbal face oil is typically applied after cleansing to nourish the skin, help lock in moisture, and leave a naturally healthy-looking finish.",
      },
      {
        question: "What is Kumkumadi Oil?",
        answer:
          "Kumkumadi Oil is a classic Ayurvedic face oil traditionally infused with saffron and other botanicals, associated in tradition with radiance and an even-looking complexion.",
      },
      {
        question: "Is face oil suitable for oily skin?",
        answer:
          "Yes — many lightweight oils like Jojoba are traditionally used even on oilier skin types, as they can help balance the skin's own oil production. Choose a lighter formulation if you have oily or acne-prone skin.",
      },
      {
        question: "When should I apply face oil in my routine?",
        answer:
          "Face oil is typically applied after cleansing (and after a water-based serum, if used), as the last step to help lock in hydration.",
      },
      {
        question: "How many drops of face oil should I use?",
        answer:
          "Most face oils only require 2–4 drops per application — a little goes a long way. Check specific product guidance.",
      },
      {
        question: "Can I use face oil every day?",
        answer:
          "Many herbal face oils are formulated for daily use, once or twice a day, but check the specific product page for guidance suited to your skin type.",
      },
      {
        question: "Is Neem Oil good for blemish-prone skin?",
        answer:
          "Neem Oil has a long tradition of use in Ayurvedic skincare for blemish-prone skin, valued for its purifying reputation.",
      },
      {
        question: "Can face oil clog pores?",
        answer:
          "Some oils are heavier than others — lighter oils like Jojoba and Rosehip are traditionally chosen for their non-heavy feel, but individual skin response varies. Patch test before full use.",
      },
      {
        question: "What is Sandalwood-Infused Oil traditionally used for?",
        answer:
          "Sandalwood-infused oil is valued in Himalayan and Ayurvedic tradition for its calming aroma and association with soothed, balanced-looking skin.",
      },
      {
        question: "Can I mix face oil with my moisturizer?",
        answer:
          "Yes — many people mix a few drops of face oil into their cream for extra nourishment, particularly in colder or drier weather.",
      },
      {
        question: "Is Rosehip Oil good for scarring or uneven texture?",
        answer:
          "Rosehip Oil has a long tradition of use in skincare routines focused on skin texture and tone, though results vary by individual.",
      },
      {
        question: "How should I store herbal face oil?",
        answer:
          "Store face oils in a cool, dark place away from direct sunlight, which can degrade the oil's quality over time.",
      },
      {
        question: "Can face oil be used on sensitive skin?",
        answer:
          "Some face oils are gentle enough for sensitive skin, but always patch test first, especially with fragranced blends like Kumkumadi Oil.",
      },
      {
        question: "Does face oil expire?",
        answer:
          "Yes — natural oils generally have a shelf life of 6–12 months once opened; check the product's Period-After-Opening symbol.",
      },
      {
        question: "Can I use face oil around my eyes?",
        answer:
          "Some lighter oils can be used gently around the eye area, but avoid direct contact with the eyes themselves. Check individual product guidance.",
      },
    ],
  },
  creams: {
    heading: "Herbal Face Cream: Traditional Botanical Moisturizers",
    text: "A good herbal cream is the everyday backbone of a skin care routine — richer than a face oil, and designed to keep skin comfortably hydrated throughout the day or overnight. Traditional botanical creams combine soothing, moisture-rich ingredients with herbs long valued for their skin-supportive reputation.",
    image: "creams.png",
    metaTitle: "Herbal Face Cream | Natural Botanical Moisturizers",
    metaDesc: "Shop herbal face creams — Aloe Vera, Turmeric, Calendula & Shea Butter. Natural botanical moisturizers for everyday hydration and skin comfort.",
    sections: [
      {
        title: "Everyday Hydration: Botanical Moisturizers",
        description:
          "Ingredients like Aloe Vera, Shea Butter and Calendula are widely used in traditional and modern skin care for their soothing, moisture-rich reputation, making them well suited to everyday use across most skin types.",
      },
      {
        title: "Traditional Radiance: Ayurvedic & Himalayan Cream Blends",
        description:
          "Himalayan Turmeric Cream draws on turmeric's long-standing traditional association with an even, healthy-looking complexion. Multani Mitti (Fuller's Earth) Cream is a classic Ayurvedic ingredient traditionally used for its purifying, mattifying reputation, while Manjistha Cream has a long history in Ayurvedic tradition as a botanical associated with skin clarity.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Aloe Vera Cream\n" +
          "• Turmeric Cream\n" +
          "• Calendula Cream\n" +
          "• Shea Butter Cream\n" +
          "• Multani Mitti (Fuller's Earth) Cream\n" +
          "• Manjistha Cream\n" +
          "• Neem Cream",
      },
    ],
    faqs: [
      {
        question: "What is a herbal face cream used for?",
        answer:
          "A herbal face cream is a daily moisturizer formulated with botanical ingredients, used to keep skin hydrated and comfortable throughout the day or overnight.",
      },
      {
        question: "What is Multani Mitti (Fuller's Earth)?",
        answer:
          "Multani Mitti is a classic Ayurvedic clay-based ingredient traditionally used for its purifying, mattifying reputation, often chosen for oilier skin types.",
      },
      {
        question: "Is Turmeric Cream good for uneven skin tone?",
        answer:
          "Turmeric has a long-standing traditional association with an even, healthy-looking complexion, and is a common ingredient in Ayurvedic brightening creams.",
      },
      {
        question: "Can I use herbal cream both morning and night?",
        answer:
          "Yes — many herbal creams are formulated for twice-daily use, though richer night creams may be designed specifically for overnight hydration. Check product guidance.",
      },
      {
        question: "What is Manjistha traditionally used for in skincare?",
        answer:
          "Manjistha is a botanical with a long history in Ayurvedic tradition, associated with supporting skin clarity and an even-looking tone.",
      },
      {
        question: "Is Aloe Vera Cream good for sensitive or irritated skin?",
        answer:
          "Aloe Vera has a long tradition of use in skincare for its soothing reputation, often chosen for sensitive or easily irritated skin — but always patch test first.",
      },
      {
        question: "Can herbal creams stain the skin, given ingredients like Turmeric?",
        answer:
          "Turmeric-based creams can occasionally leave a slight temporary tint on very fair skin; this typically fades shortly after application and washes off with cleanser.",
      },
      {
        question: "Are herbal creams suitable for oily skin?",
        answer:
          "Lighter formulations, and ingredients like Multani Mitti, are traditionally favored for oilier skin types, while richer creams with Shea Butter suit drier skin.",
      },
      {
        question: "How much cream should I apply?",
        answer:
          "A small, pea-sized amount is usually enough to cover the face and neck — check specific product guidance for richer or more concentrated formulas.",
      },
      {
        question: "Do herbal creams contain SPF?",
        answer:
          "SPF content varies by product — check the individual product label, and consider a separate sunscreen if the cream doesn't include SPF.",
      },
      {
        question: "Can I use herbal cream under makeup?",
        answer:
          "Yes — most herbal moisturizing creams work well as a base under makeup once fully absorbed.",
      },
      {
        question: "How should I store herbal face cream?",
        answer:
          "Store in a cool, dry place with the lid tightly closed to prevent contamination and preserve the natural ingredients.",
      },
      {
        question: "Does herbal cream expire?",
        answer:
          "Yes — check the Period-After-Opening symbol on the packaging, typically 6–12 months once opened.",
      },
      {
        question: "Is Neem Cream good for blemish-prone skin?",
        answer:
          "Neem has a long tradition of use in Ayurvedic skincare for its purifying reputation, often chosen by those with blemish-prone or oily skin.",
      },
      {
        question: "Can herbal cream be used on the body as well as the face?",
        answer:
          "Some herbal face creams are formulated specifically for facial skin; check the product page to confirm whether a cream is suitable for body use as well.",
      },
    ],
  },
  cleansers: {
    heading: "Herbal Face Cleanser: Traditional Botanical Face Wash",
    text: "Cleansing is the first and most repeated step in any skin care routine, which is why the choice of cleanser matters. Traditional herbal cleansers are formulated to lift away dirt, oil and impurities gently, without leaving the skin feeling tight or stripped the way some harsher, foaming washes can.",
    image: "cleansers.png",
    metaTitle: "Herbal Face Cleanser | Natural Botanical Face Wash",
    metaDesc: "Shop herbal face cleansers — Neem, Turmeric, Besan & Rose Water. Gentle botanical face wash traditionally used to clear impurities without stripping skin.",
    sections: [
      {
        title: "Gentle Daily Cleansing",
        description:
          "Ingredients like Aloe Vera, Rose Water and Besan (Chickpea Flour) are traditionally used in gentle daily cleansers, valued for clearing the skin without over-drying it — Besan in particular is a staple of traditional Ayurvedic bathing and cleansing rituals.",
      },
      {
        title: "Purifying Traditions: Neem & Turmeric Cleansers",
        description:
          "For those seeking a deeper cleanse, Neem and Turmeric cleansers draw on centuries of Ayurvedic tradition, both valued for their purifying reputation and commonly chosen by those with oilier or blemish-prone skin. Tea Tree is another traditional favorite, often included in cleansers aimed at clearer-looking skin.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Neem Face Cleanser\n" +
          "• Turmeric Face Cleanser\n" +
          "• Besan (Chickpea Flour) Cleanser\n" +
          "• Aloe Vera Cleanser\n" +
          "• Rose Water Cleanser\n" +
          "• Tea Tree Cleanser\n" +
          "• Multani Mitti (Fuller's Earth) Cleanser",
      },
    ],
    faqs: [
      {
        question: "What is a herbal face cleanser used for?",
        answer:
          "A herbal face cleanser is a gentle, botanical-based face wash used to lift away dirt, oil, makeup and impurities without over-drying the skin.",
      },
      {
        question: "What is Besan (Chickpea Flour) traditionally used for in skincare?",
        answer:
          "Besan is a staple of traditional Ayurvedic bathing and cleansing rituals, mixed into a paste and used as a gentle exfoliating cleanser.",
      },
      {
        question: "Is Neem Face Cleanser good for oily or acne-prone skin?",
        answer:
          "Neem has a long tradition of use in Ayurvedic skincare, valued for its purifying reputation and commonly chosen by those with oilier or blemish-prone skin.",
      },
      {
        question: "How often should I use a herbal cleanser?",
        answer:
          "Most herbal cleansers are designed for twice-daily use — morning and evening — but check individual product guidance, especially for exfoliating formulas.",
      },
      {
        question: "Can herbal cleansers remove makeup?",
        answer:
          "Some herbal cleansers, particularly oil-based ones, can remove makeup effectively; check the specific product page, as not all cleansers are formulated for makeup removal.",
      },
      {
        question: "Is Turmeric Cleanser safe for daily use?",
        answer:
          "Turmeric cleansers are generally used daily or every other day; very fair skin may notice a slight temporary tint that fades after rinsing.",
      },
      {
        question: "What is Rose Water Cleanser traditionally used for?",
        answer:
          "Rose Water has a long tradition of use in skincare for its gentle, soothing reputation, often used as a light daily cleanser or toner.",
      },
      {
        question: "Can herbal cleansers dry out my skin?",
        answer:
          "Herbal cleansers are generally formulated to be gentler than harsh foaming washes, but individual skin response varies — if you notice dryness or tightness, consider a cream-based rather than a clay-based cleanser.",
      },
      {
        question: "What's the difference between a cleanser and an exfoliating cleanser?",
        answer:
          "A standard cleanser lifts away surface dirt and oil, while an exfoliating cleanser (like one with Besan) also gently removes dead skin cells, and is typically used less frequently — a few times a week rather than daily.",
      },
      {
        question: "Can I use a herbal cleanser if I have sensitive skin?",
        answer:
          "Many herbal cleansers are formulated to be gentle, but always patch test first, especially with ingredients like Turmeric or Tea Tree that can be more active.",
      },
      {
        question: "Is Multani Mitti (Fuller's Earth) Cleanser suitable for dry skin?",
        answer:
          "Multani Mitti has a traditionally mattifying, purifying reputation and tends to suit oilier skin types better than very dry skin — those with dry skin may prefer a cream-based cleanser instead.",
      },
      {
        question: "Should I use warm or cold water with a herbal cleanser?",
        answer:
          "Lukewarm water is generally recommended for cleansing, as very hot water can be drying and very cold water may not effectively remove oil-based impurities.",
      },
      {
        question: "Can herbal cleansers be used to remove sunscreen?",
        answer:
          "Oil-based or richer herbal cleansers are typically more effective at removing sunscreen than very light, water-based ones — check the specific product page.",
      },
      {
        question: "Do herbal cleansers foam?",
        answer:
          "Formulation varies by product — some herbal cleansers foam lightly, while others (like clay or oil-based cleansers) don't foam at all. This doesn't affect how well they clean the skin.",
      },
      {
        question: "How should I store herbal cleansers?",
        answer:
          "Keep cleansers tightly sealed in a cool, dry place, and avoid introducing water into powder or clay-based formulas until you're ready to use them.",
      },
    ],
  },
  "hair-oils": {
    heading: "Herbal Hair Oils: Traditional Ayurvedic Scalp & Hair Oils",
    text: "Hair oiling is one of the oldest and most consistent rituals in Ayurvedic hair care — a weekly scalp massage that's stayed largely unchanged for centuries. Herbal hair oils combine a nourishing carrier oil (often sesame or coconut) with botanicals traditionally infused to support the scalp and the look and feel of hair over time.",
    image: "hair-oils.png",
    metaTitle: "Herbal Hair Oils | Ayurvedic Scalp & Hair Oils",
    metaDesc: "Shop herbal hair oils — Bhringraj, Amla, Brahmi & Fenugreek. Traditional Ayurvedic oils massaged into the scalp to nourish hair and support scalp comfort.",
    sections: [
      {
        title: "Traditional Scalp & Hair Nourishment",
        description:
          "Himalayan Bhringraj — often called the 'king of hair' in Ayurvedic tradition — is one of the most widely used oils for scalp nourishment. Amla (Indian Gooseberry) Oil and Brahmi (Bacopa Monnieri) Oil are traditionally used alongside Bhringraj, often blended together, to support the appearance of stronger, healthier-looking hair over consistent use.",
      },
      {
        title: "Everyday Conditioning Oils",
        description:
          "Base oils like Coconut Oil and Fenugreek (Methi)-Infused Oil are traditionally used for everyday conditioning, valued for their moisturizing reputation. Curry Leaf Oil and Rosemary Oil are also widely used in traditional hair care routines, often added to a base oil in small amounts as part of a scalp massage blend.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Bhringraj Hair Oil\n" +
          "• Amla Hair Oil\n" +
          "• Brahmi (Bacopa Monnieri) Hair Oil\n" +
          "• Fenugreek (Methi) Hair Oil\n" +
          "• Coconut Hair Oil\n" +
          "• Curry Leaf Hair Oil\n" +
          "• Rosemary Hair Oil",
      },
    ],
    faqs: [
      {
        question: "What is Bhringraj Hair Oil traditionally used for?",
        answer:
          "Bhringraj is often called the 'king of hair' in Ayurvedic tradition, and its oil is one of the most widely used botanicals for supporting scalp nourishment and the appearance of healthy hair.",
      },
      {
        question: "How often should I use herbal hair oil?",
        answer:
          "Many people use hair oil 1–3 times a week, applying it before a wash and leaving it on for a few hours or overnight, though frequency can vary by hair type.",
      },
      {
        question: "How long should I leave hair oil in before washing?",
        answer:
          "Traditional use ranges from 30 minutes to overnight, depending on the oil and your hair type — check the specific product guidance.",
      },
      {
        question: "Can hair oil help with hair growth?",
        answer:
          "Ingredients like Bhringraj and Amla have a long tradition of use in routines associated with supporting scalp health, which is often linked to the appearance of healthier-looking hair over time, though individual results vary.",
      },
      {
        question: "Is coconut oil good for all hair types?",
        answer:
          "Coconut oil is widely used across hair types, but it can feel heavy on very fine hair — those with finer hair may prefer a lighter oil or a smaller amount.",
      },
      {
        question: "Can I apply hair oil to dry or wet hair?",
        answer:
          "Hair oil is traditionally applied to dry hair and scalp before washing, though some lighter oils are also used on damp hair as a finishing treatment. Check specific product guidance.",
      },
      {
        question: "Does Amla Hair Oil help with premature greying?",
        answer:
          "Amla has a traditional reputation in Ayurvedic hair care associated with hair health, though there's no guarantee regarding premature greying, which has multiple underlying causes.",
      },
      {
        question: "Can herbal hair oil cause scalp irritation?",
        answer:
          "As with any topical product, some people may experience sensitivity — always patch test on a small area of skin before full scalp application.",
      },
      {
        question: "How much oil should I use per application?",
        answer:
          "This varies by hair length and thickness — start with a small amount (a few teaspoons) and increase as needed to cover your scalp and hair evenly.",
      },
      {
        question: "Can I leave herbal hair oil in overnight?",
        answer:
          "Yes, many people leave hair oil in overnight as a deeper treatment — just use a towel on your pillow to avoid staining.",
      },
      {
        question: "Is Brahmi Oil the same as Bhringraj Oil?",
        answer:
          "No — they're different herbs, though both are widely used in Ayurvedic hair care and are sometimes blended together in the same product.",
      },
      {
        question: "How do I wash out herbal hair oil completely?",
        answer:
          "You may need to shampoo twice to fully remove oil residue, particularly with heavier oils like coconut or sesame-based blends.",
      },
      {
        question: "Can hair oil help with a dry, itchy scalp?",
        answer:
          "Some herbal oils, like coconut and Bhringraj, are traditionally used for their moisturizing reputation and may help with dryness, but persistent itching should be assessed by a dermatologist.",
      },
      {
        question: "How should I store herbal hair oil?",
        answer:
          "Store in a cool, dry place away from direct sunlight; some oils may benefit from refrigeration in very warm climates — check the product label.",
      },
      {
        question: "Can I use herbal hair oil on color-treated hair?",
        answer:
          "Most herbal hair oils are gentle enough for colored hair, but check the specific product page, as some infused oils may not be recommended immediately after coloring.",
      },
    ],
  },
  shampoos: {
    heading: "Herbal Shampoos: Traditional Botanical Hair Cleansers",
    text: "Long before commercial shampoo existed, Ayurvedic households relied on a handful of naturally cleansing botanicals to wash hair — gentler than many modern formulas, but just as effective at clearing everyday buildup. Our herbal shampoos draw on these same traditional cleansing agents.",
    image: "shampoos.png",
    metaTitle: "Herbal Shampoos | Traditional Botanical Hair Wash",
    metaDesc: "Shop herbal shampoos — Shikakai, Reetha, Hibiscus & Amla. Traditional Ayurvedic hair wash formulas that cleanse gently without stripping natural oils.",
    sections: [
      {
        title: "Traditional Cleansing Botanicals",
        description:
          "Shikakai (sometimes called 'fruit for hair') and Reetha (Soapnut) are two of the most historically significant Ayurvedic cleansing agents, both naturally foaming and traditionally used to wash hair gently without over-stripping its natural oils.",
      },
      {
        title: "Everyday Herbal Shampoo Blends",
        description:
          "Blended formulas commonly include Hibiscus, Amla and Neem, each contributing a different traditional benefit — Hibiscus for its conditioning reputation, Amla for scalp nourishment, and Neem for its purifying properties — making these a popular everyday choice for those seeking a gentler wash.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Shikakai Shampoo\n" +
          "• Reetha (Soapnut) Shampoo\n" +
          "• Hibiscus Shampoo\n" +
          "• Amla Shampoo\n" +
          "• Neem Shampoo",
      },
    ],
    faqs: [
      {
        question: "What is Shikakai and why is it used in shampoo?",
        answer:
          "Shikakai is sometimes called 'fruit for hair' in Ayurvedic tradition and is a naturally foaming cleansing agent traditionally used to wash hair gently without over-stripping its natural oils.",
      },
      {
        question: "What is Reetha (Soapnut)?",
        answer:
          "Reetha, or soapnut, is a naturally foaming fruit traditionally used in Ayurveda as a gentle hair and scalp cleanser.",
      },
      {
        question: "Are herbal shampoos as effective at cleansing as regular shampoo?",
        answer:
          "Herbal shampoos are generally gentler and may produce less foam than sulfate-based shampoos, but they're traditionally considered effective at clearing everyday dirt and oil buildup.",
      },
      {
        question: "How often should I use herbal shampoo?",
        answer:
          "Most herbal shampoos can be used as often as you'd normally wash your hair, though those with drier hair may prefer washing every other day.",
      },
      {
        question: "Can herbal shampoo help with an oily scalp?",
        answer:
          "Neem and Amla-based shampoos are traditionally chosen for oilier scalps, valued for their purifying reputation.",
      },
      {
        question: "Is herbal shampoo suitable for color-treated hair?",
        answer:
          "Many herbal shampoos are gentle enough for colored hair, but check the specific product page, as ingredient combinations vary.",
      },
      {
        question: "Why does herbal shampoo foam less than regular shampoo?",
        answer:
          "Herbal shampoos often rely on naturally foaming agents like Shikakai and Reetha rather than synthetic sulfates, which typically produce a lighter lather — this doesn't mean it's cleaning less effectively.",
      },
      {
        question: "Can herbal shampoo help with dandruff?",
        answer:
          "Neem-based shampoos are traditionally associated with scalp comfort, but persistent dandruff should be assessed by a dermatologist.",
      },
      {
        question: "Do I need conditioner after using herbal shampoo?",
        answer:
          "This depends on your hair type — herbal shampoos are generally gentler than sulfate shampoos, but those with dry or textured hair may still prefer a conditioner or hair oil afterward.",
      },
      {
        question: "Is herbal shampoo suitable for children?",
        answer:
          "Some gentle herbal shampoos are suitable for children, but check the specific product label, and consult a pediatrician if unsure.",
      },
      {
        question: "Can I use herbal shampoo daily?",
        answer:
          "Many herbal shampoos are mild enough for daily use, but check the specific product guidance, especially for very dry or curly hair types.",
      },
      {
        question: "What's the difference between Amla Shampoo and Hibiscus Shampoo?",
        answer:
          "Amla is traditionally associated with scalp nourishment, while Hibiscus is traditionally valued for its conditioning reputation — many blends combine both.",
      },
      {
        question: "How should I store herbal shampoo?",
        answer:
          "Store in a cool, dry place, and keep the cap tightly closed to preserve the formula's natural ingredients.",
      },
      {
        question: "Does herbal shampoo expire?",
        answer:
          "Yes — check the Period-After-Opening symbol on the packaging, typically 6–12 months once opened.",
      },
      {
        question: "Can herbal shampoo be used on a sensitive scalp?",
        answer:
          "Herbal shampoos are often gentler than sulfate-based formulas, but always patch test and check the ingredient list if you have a known sensitivity.",
      },
    ],
  },
  "hair-masks": {
    heading: "Herbal Hair Masks: Traditional Deep Conditioning Treatments",
    text: "A hair mask is the deep-conditioning step in a traditional hair care routine — a more concentrated treatment than daily oil or shampoo, usually applied once a week to give hair extra nourishment and support its overall condition.",
    image: "hair-masks.png",
    metaTitle: "Herbal Hair Masks | Traditional Deep Conditioning",
    metaDesc: "Shop herbal hair masks — Henna, Fenugreek, Hibiscus & Bhringraj. Traditional deep-conditioning treatments for weekly hair and scalp nourishment.",
    sections: [
      {
        title: "Traditional Deep-Conditioning Masks",
        description:
          "Henna is one of the most well-known Ayurvedic hair mask ingredients, traditionally used for its conditioning reputation as well as its natural reddish tint. Fenugreek (Methi) Hair Mask and Hibiscus Hair Mask are traditionally used for their moisturizing and conditioning reputation, especially for dry or frizzy hair.",
      },
      {
        title: "Nourishing Combination Blends",
        description:
          "Combination masks blending Bhringraj, Amla and Shikakai bring together several traditional Ayurvedic ingredients in one weekly treatment, each contributing its own long-standing role in hair care tradition.",
      },
      {
        title: "Shop the Ingredients in This Guide",
        description:
          "• Henna Hair Mask\n" +
          "• Fenugreek (Methi) Hair Mask\n" +
          "• Hibiscus Hair Mask\n" +
          "• Bhringraj Hair Mask\n" +
          "• Amla-Reetha-Shikakai Combination Mask",
      },
    ],
    faqs: [
      {
        question: "What is a herbal hair mask used for?",
        answer:
          "A herbal hair mask is a concentrated, deep-conditioning treatment usually applied weekly to give hair extra nourishment beyond what daily oil or shampoo provides.",
      },
      {
        question: "How often should I use a hair mask?",
        answer:
          "Most herbal hair masks are used once a week, though those with very dry or damaged hair may use them slightly more often.",
      },
      {
        question: "What is Henna Hair Mask traditionally used for?",
        answer:
          "Henna is a well-known Ayurvedic hair mask ingredient traditionally valued for its conditioning reputation, along with its natural reddish tint on hair.",
      },
      {
        question: "Will a Henna Hair Mask change my hair color?",
        answer:
          "Yes — Henna can impart a natural reddish tint, particularly on lighter or grey hair. Check the specific product page and consider a strand test first if color change is a concern.",
      },
      {
        question: "How long should I leave a herbal hair mask on?",
        answer:
          "This varies by product, but many traditional masks are left on for 30 minutes to a few hours, and some (like Henna) are left on longer for the reddish tint to develop.",
      },
      {
        question: "Is Fenugreek Hair Mask good for dry or frizzy hair?",
        answer:
          "Fenugreek has a long tradition of use for its moisturizing and conditioning reputation, often chosen for dry or frizzy hair types.",
      },
      {
        question: "Do I apply hair mask before or after shampoo?",
        answer:
          "This depends on the specific mask — some are applied before shampooing as a pre-wash treatment, others after as a conditioning step. Check the product's specific instructions.",
      },
      {
        question: "Can herbal hair masks help with dry, damaged hair?",
        answer:
          "Masks combining Hibiscus, Fenugreek and Amla are traditionally used for their moisturizing reputation, often chosen by those with dry or damaged hair.",
      },
      {
        question: "How do I rinse out a herbal hair mask?",
        answer:
          "Most masks are rinsed thoroughly with warm water; powder or clay-based masks (like Henna) may require a shampoo wash afterward to fully remove residue.",
      },
      {
        question: "Can I mix my own herbal hair mask at home?",
        answer:
          "Some herbal hair mask powders are designed to be mixed with water, yogurt or oil at home before application — check the specific product's mixing instructions.",
      },
      {
        question: "Is a hair mask the same as a conditioner?",
        answer:
          "A hair mask is generally more concentrated and left on longer than a standard conditioner, making it a deeper, less frequent treatment.",
      },
      {
        question: "Can herbal hair masks be used on color-treated hair?",
        answer:
          "Most herbal hair masks are gentle enough for colored hair, but Henna specifically can alter hair color — check the product page if this is a concern.",
      },
      {
        question: "How should I store herbal hair mask powder?",
        answer:
          "Store powder-based masks in an airtight container away from moisture, which can cause clumping and affect potency over time.",
      },
      {
        question: "Can herbal hair masks be left on overnight?",
        answer:
          "Some lighter oil-based masks can be left on overnight, but powder or clay-based masks like Henna are generally not recommended for overnight use — check specific product guidance.",
      },
      {
        question: "Are herbal hair masks suitable for a sensitive scalp?",
        answer:
          "Always patch test before full application, as some ingredients (particularly Henna) can occasionally cause sensitivity in certain individuals.",
      },
    ],
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