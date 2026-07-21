
// DENTORA-OS - SYSTEM CORE CONFIGURATION
// This file acts as the single source of truth for the application's core data.
// All data is derived from the initial System-Core-Config.txt skill file.

// SEO and Metadata Configuration
export const metadataConfig = {
  title: "Dentora | Clinical Dental Excellence",
  description: "Advanced dental solutions and personalized care for optimal oral health in Casablanca.",
  keywords: "Dental Clinic Casablanca, Implantology, Orthodontics, Teeth Whitening, Pediatric Dentistry",
};

// Theme and Branding Configuration
export const themeConfig = {
  colors: {
    primary: "#36C2CF",
    primary_dark: "#006971",
  },
};

// Internationalization (i18n) Configuration
export const i18nConfig = {
  defaultLocale: "fr",
  supportedLocales: ["fr", "ar"],
};

// Services Configuration
// Used to dynamically generate service sections and pages.
export const servicesConfig = [
  { slug: "implantology" },
  { slug: "orthodontics" },
  { slug: "whitening" },
  { slug: "pedodontics" },
];

// Navigation Configuration
// Defines the main navigation links. The labels are keys that map to the i18n dictionary.
export const navigationConfig = [
  { href: "#", labelKey: "nav.home" },
  { href: "#services", labelKey: "nav.services" },
  { href: "#about", labelKey: "nav.about" },
  { href: "#contact", labelKey: "nav.contact" },
  { href: "#booking", labelKey: "nav.booking" },
];

// Combine all configs into a single system object for easy access
export const dentoraSystem = {
  metadata: metadataConfig,
  theme: themeConfig,
  i18n: i18nConfig,
  services: servicesConfig,
  navigation: navigationConfig,
};

// DENTORA CORE CONFIGURATION
// This is the single source of truth derived from System-Core-Config.txt
export const DENTORA_CORE = {
  identity: {
    name: "Dentora",
    slogan: "Excellence en Médecine Dentaire",
    logo: "/public/logo.svg",
    favicon: "/public/favicon.ico"
  },
  connectivity: {
    whatsapp: "+2126XXXXXXXX",
    phone: "+2126XXXXXXXX",
    email: "contact@dentora.ma"
  },
  settings: {
    primaryLanguage: "fr",
    secondaryLanguage: "ar",
    currency: "MAD",
    enableWhatsAppBooking: true,
    enableGoogleReviews: true
  },
  subscription: {
    type: "ANNUAL_SUBSCRIPTION",
    status: "ACTIVE",
    expiryDate: "2027-03-29",
    features: ["Admin Dashboard", "PWA Support", "Multi-language"]
  },
  seo: {
    mainKeywords: ["Dentiste Casablanca", "Implantologie Maroc", "Orthodontie Invisible"],
    googleBusinessId: "YOUR_GOOGLE_PLACE_ID"
  }
};
