export const LAUNCH_CONFIG = {
  // Feature flag: Toggle Coming Soon mode on homepage. Set to true to redirect to /coming-soon by default.
  IS_COMING_SOON_MODE: true,

  event: {
    badge: "1ST EDITION. FOUNDING YEAR",
    title: "Northeast India's Product & Community Meet",
    subtitle:
      "Live product launches, real founders, student and creator panels, and SynthTank — where the best ideas in the room get engineering support to go build. One day, in Guwahati.",
    date: "Sunday, Aug 16, 2026",
    time: "10:00 AM – 5:00 PM",
    venue: "Agora, The Space, Guwahati",
    rsvpContacts: ["6000067052", "9678782973"],
    targetDateIso: "2026-08-16T10:00:00+05:30",
  },

  whatsSync: {
    title: "WHAT'S SYNC?",
    heading: "Guwahati's new meeting point for builders",
    description1:
      "SYNC is a new annual product and community event for Northeast India's tech ecosystem — students figuring out what's next, creators and freelancers running real businesses, founders with an idea, and the investors and institutions backing all of it.",
    description2:
      "This year it's hosted by SynthWeb, a Guwahati-based product engineering company marking two years of building — launching two of its own products live, and opening the floor to everyone building alongside it.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
  },

  happeningCards: [
    {
      id: "growthcraft",
      title: "GrowthCraft launch",
      subtitle: "Live demo + early-access sign-up for students.",
      badge: "LIVE DEMO",
      icon: "growthcraft",
      details:
        "Offline-first EdTech platform designed for college campuses across Northeast India. Hands-on learning logged manually by mentors.",
    },
    {
      id: "amuthi",
      title: "Amuthi launch",
      subtitle: "Live demo + early-bird access for creators & freelancers.",
      badge: "PRODUCT LAUNCH",
      icon: "amuthi",
      details:
        "Turns scattered bookings and DMs into one real business setup with instant calendar sync and client invoicing.",
    },
    {
      id: "synthtank",
      title: "SynthTank",
      subtitle: "Pitch your idea — get built with, or hire us at a minimal rate.",
      badge: "PITCH SESSION",
      icon: "synthtank",
      details:
        "Live pitch session where selected founders get direct engineering execution and tech backing from SynthWeb.",
    },
    {
      id: "panels",
      title: "Student & creator panels",
      subtitle: "Real talk on careers, hiring, and running your own thing.",
      badge: "PANEL DISCUSSION",
      icon: "panels",
      details:
        "Unfiltered conversations with builders and freelancers who navigated early-stage challenges in Northeast India.",
    },
    {
      id: "techtalk",
      title: "Tech talk",
      subtitle: "[SPEAKER / TOPIC TBD] — one focused session, not a lecture.",
      badge: "KEYNOTE",
      icon: "techtalk",
      details:
        "A concentrated technical breakdown focusing on engineering execution, architecture, and shipping real software.",
    },
    {
      id: "stalls",
      title: "Stalls & demos",
      subtitle: "Explore what other local ventures are building, up close.",
      badge: "EXPO & STALLS",
      icon: "stalls",
      details:
        "Hands-on demo booths featuring regional tech startups, student projects, and creator tools.",
    },
  ],

  timeline: [
    { time: "10:00 AM", title: "Arrival & networking" },
    { time: "10:30 AM", title: "Welcome + GrowthCraft demo" },
    { time: "11:15 AM", title: "Student panel" },
    { time: "12:15 PM", title: "Amuthi demo + creator panel" },
    { time: "1:30 PM", title: "Lunch & stalls" },
    { time: "2:30 PM", title: "Tech talk + SynthTank" },
    { time: "4:00 PM", title: "Fireside + open networking" },
    { time: "5:00 PM", title: "Close + group photo" },
  ],

  audienceCards: [
    {
      title: "Students",
      text: "Meet founders directly, join the panel, get early access to GrowthCraft.",
    },
    {
      title: "Creators & freelancers",
      text: "See how Amuthi turns scattered bookings and DMs into one real business setup — early-bird access on the day.",
    },
    {
      title: "Founders & builders",
      text: "Pitch at SynthTank — walk away with a build partner or a minimal-rate hire.",
    },
    {
      title: "Investors & incubators",
      text: "First look at what's being built in Guwahati, and who's building it.",
    },
    {
      title: "Press & media",
      text: "A real regional tech story — not another company press release.",
    },
    {
      title: "Other ventures",
      text: "Set up a stall, showcase your product, and network — minimal registration fee.",
    },
  ],
};
