export const BRAND = {
  name: "DUBRIANI",
  tag: "Luxury Yacht Charter Dubai",
  headline: ["Luxury on", "the water."],
  intro: "Premium yacht charters in Dubai. Four handpicked yachts, unforgettable experiences. From private celebrations to corporate events on the Arabian Gulf.",
  contactEmail: "charter@dubriani.com",
  contactPhone: "+971 50 000 0000",
  base: "Dubai Marina · UAE",
};

export type YachtId = "alia" | "liberty" | "empress" | "zirve";

export type Yacht = {
  id: YachtId;
  index: string;
  name: string;
  type: string;
  short: string;
  tagline: string;
  description: string;
  accent: string;
  accent2: string;
  specs: { label: string; value: string }[];
  amenities: string[];
  rooms: { id: string; label: string; src: string; note: string }[];
  gallery: { src: string; caption: string }[];
  hero: string;
};

export const YACHTS: Yacht[] = [
  {
    id: "alia",
    index: "01",
    name: "Alia 62",
    type: "Motor Yacht",
    short: "62 ft motor yacht",
    tagline: "Refined elegance on the Gulf.",
    description:
      "A sleek 62-foot motor yacht with a beautifully appointed salon and generous outdoor spaces. Alia 62 offers an intimate setting for sunset cruises, private dinners and celebrations along the Dubai coastline.",
    accent: "#c9a96e",
    accent2: "#1a3a5c",
    specs: [
      { label: "Length", value: "62 ft" },
      { label: "Type", value: "Motor Yacht" },
      { label: "Guests", value: "Enquire" },
      { label: "Crew", value: "Professional" },
    ],
    amenities: [
      "Spacious salon",
      "Sun deck",
      "Swim platform",
      "Aft dining area",
      "Flybridge",
      "Sound system",
    ],
    rooms: [
      { id: "salon", label: "Main salon", src: "img/alia-salon.webp", note: "Cream sofas, dark wood accents and panoramic windows" },
      { id: "dining", label: "Dining area", src: "img/alia-dining.webp", note: "Indoor dining with views of the Gulf" },
      { id: "master", label: "Master cabin", src: "img/alia-master.webp", note: "Full-beam stateroom with en-suite" },
    ],
    gallery: [
      { src: "img/alia-exterior.webp", caption: "Alia 62 cruising along the Dubai coast" },
      { src: "img/alia-stern.webp", caption: "Swim platform and aft deck" },
    ],
    hero: "img/alia-exterior.webp",
  },
  {
    id: "liberty",
    index: "02",
    name: "Liberty 62",
    type: "Motor Yacht",
    short: "62 ft motor yacht",
    tagline: "Freedom meets sophistication.",
    description:
      "Liberty 62 combines a sporty profile with refined interiors. Her open flybridge and spacious aft deck make her ideal for lively gatherings, birthday parties and daytime cruises past Palm Jumeirah.",
    accent: "#b8945f",
    accent2: "#1e2d42",
    specs: [
      { label: "Length", value: "62 ft" },
      { label: "Type", value: "Motor Yacht" },
      { label: "Guests", value: "Enquire" },
      { label: "Crew", value: "Professional" },
    ],
    amenities: [
      "Open flybridge",
      "Salon lounge",
      "Swim platform",
      "Bow sunbathing area",
      "Aft deck dining",
      "Sound system",
    ],
    rooms: [
      { id: "salon", label: "Salon", src: "img/liberty-salon.webp", note: "Contemporary design with natural light" },
      { id: "dining", label: "Dining", src: "img/liberty-dining.webp", note: "Indoor dining for intimate gatherings" },
      { id: "flybridge", label: "Flybridge", src: "img/liberty-flybridge.webp", note: "Open-air lounge with panoramic views" },
    ],
    gallery: [
      { src: "img/liberty-exterior.webp", caption: "Liberty 62 at speed in the Arabian Gulf" },
      { src: "img/liberty-sunset.webp", caption: "Golden hour off the Dubai Marina" },
    ],
    hero: "img/liberty-exterior.webp",
  },
  {
    id: "empress",
    index: "03",
    name: "Empress 80",
    type: "Luxury Yacht",
    short: "80 ft luxury yacht",
    tagline: "Where grandeur sets sail.",
    description:
      "At 80 feet, Empress is the flagship of the fleet. Expansive decks, a formal dining room and generous entertaining spaces make her the natural choice for corporate events, milestone celebrations and VIP experiences.",
    accent: "#d4b87c",
    accent2: "#152a40",
    specs: [
      { label: "Length", value: "80 ft" },
      { label: "Type", value: "Luxury Yacht" },
      { label: "Guests", value: "Enquire" },
      { label: "Crew", value: "Professional" },
    ],
    amenities: [
      "Grand salon",
      "Formal dining room",
      "Multiple sun decks",
      "Swim platform",
      "Flybridge bar",
      "Premium sound system",
    ],
    rooms: [
      { id: "salon", label: "Grand salon", src: "img/empress-salon.webp", note: "Generous lounge with full-height windows" },
      { id: "dining", label: "Dining room", src: "img/empress-dining.webp", note: "Formal dining with dark wood finishes" },
      { id: "master", label: "Master stateroom", src: "img/empress-master.webp", note: "Full-beam suite with luxury en-suite" },
    ],
    gallery: [
      { src: "img/empress-exterior.webp", caption: "Empress 80 — the flagship of the fleet" },
      { src: "img/empress-aerial.webp", caption: "Aerial view off the Dubai coast" },
    ],
    hero: "img/empress-exterior.webp",
  },
  {
    id: "zirve",
    index: "04",
    name: "Zirve 72",
    type: "Catamaran",
    short: "72 ft catamaran",
    tagline: "Stability, space and style.",
    description:
      "A 72-foot catamaran with twin hulls that deliver exceptional stability and vast deck space. Zirve 72 is perfectly suited to larger groups, fishing charters and relaxed full-day cruises around the World Islands.",
    accent: "#a89060",
    accent2: "#1b3048",
    specs: [
      { label: "Length", value: "72 ft" },
      { label: "Type", value: "Catamaran" },
      { label: "Guests", value: "Enquire" },
      { label: "Crew", value: "Professional" },
    ],
    amenities: [
      "Wide beam salon",
      "Twin hull stability",
      "Expansive sun deck",
      "Swim platform",
      "Bow lounge",
      "Sound system",
    ],
    rooms: [
      { id: "salon", label: "Salon", src: "img/zirve-salon.webp", note: "Bright, wide-beam interior with sea views on both sides" },
      { id: "dining", label: "Dining", src: "img/zirve-dining.webp", note: "Open-plan dining with natural light" },
      { id: "master", label: "Master cabin", src: "img/zirve-master.webp", note: "Spacious cabin in the port hull" },
    ],
    gallery: [
      { src: "img/zirve-exterior.webp", caption: "Zirve 72 catamaran at anchor" },
      { src: "img/zirve-aerial.webp", caption: "Twin hulls from above" },
    ],
    hero: "img/zirve-exterior.webp",
  },
];

export type Experience = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "birthday",
    title: "Birthday Celebrations",
    tagline: "A milestone on the water.",
    description:
      "Celebrate in style aboard a private yacht with bespoke decorations, catering and entertainment cruising past the Dubai skyline.",
    image: "img/experience-birthday.webp",
  },
  {
    id: "corporate",
    title: "Corporate Events",
    tagline: "Business meets the bay.",
    description:
      "Impress clients and reward teams with a corporate charter featuring presentation facilities and premium hospitality.",
    image: "img/experience-corporate.webp",
  },
  {
    id: "romantic",
    title: "Romantic Cruises",
    tagline: "Just the two of you.",
    description:
      "An intimate sunset cruise for couples with private dining, champagne and uninterrupted views of the Arabian Gulf.",
    image: "img/experience-romantic.webp",
  },
  {
    id: "sunset",
    title: "Sunset Tours",
    tagline: "Golden hour on the Gulf.",
    description:
      "Watch the sun set behind the skyline from the open water — the quintessential Dubai evening aboard a luxury yacht.",
    image: "img/experience-sunset.webp",
  },
  {
    id: "fishing",
    title: "Fishing Trips",
    tagline: "Cast off, reel in.",
    description:
      "Deep-sea fishing charters with professional equipment and an experienced crew in the waters off Dubai.",
    image: "img/experience-fishing.webp",
  },
];

export const ABOUT = {
  heading: ["Not just a charter.", "An experience."],
  body: [
    "Dubriani curates premium yacht experiences on the Arabian Gulf. Every charter is tailored — from the yacht and the route to the catering, decorations and entertainment — so you step aboard and enjoy.",
    "Based in Dubai Marina, our professional crews know these waters and take care of every detail, whether it is a quiet sunset for two or a celebration for a hundred.",
  ],
  stats: [
    { value: "4", label: "Yachts in the fleet" },
    { value: "Dubai", label: "Marina base" },
    { value: "5", label: "Experience types" },
    { value: "24/7", label: "Concierge service" },
  ],
};

export const DESTINATIONS = [
  { name: "Palm Jumeirah", image: "img/destination-palm.webp" },
  { name: "Dubai Marina", image: "img/destination-marina.webp" },
  { name: "Burj Al Arab", image: "img/destination-burj.webp" },
  { name: "World Islands", image: "img/destination-world.webp" },
];
