/**
 * Mock data for Workshops and Hackathons only
 * (Bootcamps use existing bootcamp API)
 */

export interface Workshop {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  domain: string;
  keyTools: string[];
  mode: "Online" | "Offline" | "Hybrid";
  status: "Open" | "Closed" | "Completed";
  location: string;
  price?: number;
  slug: string;
  maxSeats?: number;
  enrolledCount?: number;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  domain: string;
  keyTools: string[];
  mode: "Online" | "Offline" | "Hybrid";
  status: "Open" | "Closed" | "Completed";
  location: string;
  prizePool?: string;
  slug: string;
  maxSeats?: number;
  enrolledCount?: number;
}

export const MOCK_WORKSHOPS: Workshop[] = [
  {
    id: "ws-001",
    title: "React Performance Optimization",
    description: "Master React performance patterns, profiling tools, and optimization techniques to build lightning-fast applications.",
    duration: "6 Hours",
    startDate: "2026-06-15",
    endDate: "2026-06-15",
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    domain: "Web Development",
    keyTools: ["React", "Chrome DevTools", "Lighthouse", "React Profiler"],
    mode: "Online",
    status: "Open",
    location: "Online",
    price: 2999,
    slug: "react-performance-optimization",
    maxSeats: 50,
    enrolledCount: 32,
  },
  {
    id: "ws-002",
    title: "Git Mastery Workshop",
    description: "From basics to advanced Git workflows, branching strategies, and collaboration best practices.",
    duration: "4 Hours",
    startDate: "2026-06-20",
    endDate: "2026-06-20",
    startTime: "2:00 PM",
    endTime: "6:00 PM",
    domain: "Developer Tools",
    keyTools: ["Git", "GitHub", "GitLab", "Terminal"],
    mode: "Online",
    status: "Open",
    location: "Online",
    price: 1999,
    slug: "git-mastery-workshop",
    maxSeats: 100,
    enrolledCount: 100,
  },
  {
    id: "ws-003",
    title: "Docker Fundamentals",
    description: "Learn containerization, Docker Compose, and deployment strategies for modern applications.",
    duration: "1 Day",
    startDate: "2026-07-05",
    endDate: "2026-07-05",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    domain: "DevOps",
    keyTools: ["Docker", "Docker Compose", "Kubernetes", "Linux"],
    mode: "Offline",
    status: "Closed",
    location: "Bangalore",
    slug: "docker-fundamentals",
    maxSeats: 30,
    enrolledCount: 30,
  },
  {
    id: "ws-004",
    title: "TypeScript Deep Dive",
    description: "Advanced TypeScript patterns, generics, utility types, and best practices for enterprise applications.",
    duration: "5 Hours",
    startDate: "2026-07-10",
    endDate: "2026-07-10",
    startTime: "1:00 PM",
    endTime: "6:00 PM",
    domain: "Programming Languages",
    keyTools: ["TypeScript", "VS Code", "TSConfig", "Type Guards"],
    mode: "Online",
    status: "Open",
    location: "Online",
    price: 2499,
    slug: "typescript-deep-dive",
    maxSeats: 75,
    enrolledCount: 45,
  },
  {
    id: "ws-005",
    title: "SQL Query Optimization",
    description: "Learn indexing, query planning, and performance tuning for PostgreSQL and MySQL databases.",
    duration: "Half Day",
    startDate: "2026-05-18",
    endDate: "2026-05-18",
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    domain: "Database Management",
    keyTools: ["PostgreSQL", "MySQL", "EXPLAIN", "Indexing"],
    mode: "Hybrid",
    status: "Completed",
    location: "Pune",
    slug: "sql-query-optimization",
    maxSeats: 40,
    enrolledCount: 38,
  },
];

export const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: "hk-001",
    title: "Build-a-thon 2026",
    description: "48-hour coding marathon to build innovative solutions. Team up, code, and win exciting prizes!",
    duration: "48 Hours",
    startDate: "2026-08-10",
    endDate: "2026-08-12",
    startTime: "6:00 PM",
    endTime: "6:00 PM",
    domain: "Full Stack Development",
    keyTools: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    mode: "Online",
    status: "Open",
    location: "Online",
    prizePool: "₹2,00,000",
    slug: "build-a-thon-2026",
    maxSeats: 200,
    enrolledCount: 145,
  },
  {
    id: "hk-002",
    title: "AI Innovation Challenge",
    description: "24-hour AI/ML hackathon focused on solving real-world problems with artificial intelligence.",
    duration: "24 Hours",
    startDate: "2026-09-05",
    endDate: "2026-09-06",
    startTime: "9:00 AM",
    endTime: "9:00 AM",
    domain: "AI & Machine Learning",
    keyTools: ["Python", "TensorFlow", "PyTorch", "OpenAI", "Hugging Face"],
    mode: "Online",
    status: "Open",
    location: "Online",
    slug: "ai-innovation-challenge",
    maxSeats: 150,
    enrolledCount: 150,
  },
  {
    id: "hk-003",
    title: "Web3 Hack Fest",
    description: "72-hour blockchain hackathon to build decentralized applications and smart contracts.",
    duration: "72 Hours",
    startDate: "2026-09-20",
    endDate: "2026-09-23",
    startTime: "12:00 PM",
    endTime: "12:00 PM",
    domain: "Blockchain & Web3",
    keyTools: ["Solidity", "Ethereum", "React", "Web3.js", "Hardhat"],
    mode: "Offline",
    status: "Closed",
    location: "Mumbai",
    prizePool: "₹3,00,000",
    slug: "web3-hack-fest",
    maxSeats: 100,
    enrolledCount: 100,
  },
  {
    id: "hk-004",
    title: "Code for Good Marathon",
    description: "48-hour social impact hackathon to build tech solutions for NGOs and social causes.",
    duration: "48 Hours",
    startDate: "2026-10-10",
    endDate: "2026-10-12",
    startTime: "8:00 AM",
    endTime: "8:00 AM",
    domain: "Social Impact Tech",
    keyTools: ["React", "Node.js", "PostgreSQL", "Flutter", "Firebase"],
    mode: "Hybrid",
    status: "Open",
    location: "Hybrid",
    slug: "code-for-good-marathon",
    maxSeats: 120,
    enrolledCount: 78,
  },
  {
    id: "hk-005",
    title: "Mobile App Hackfest",
    description: "36-hour mobile app development competition. Build the next big app and win big!",
    duration: "36 Hours",
    startDate: "2026-04-25",
    endDate: "2026-04-27",
    startTime: "10:00 AM",
    endTime: "10:00 PM",
    domain: "Mobile Development",
    keyTools: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
    mode: "Online",
    status: "Completed",
    location: "Online",
    prizePool: "₹1,75,000",
    slug: "mobile-app-hackfest",
    maxSeats: 180,
    enrolledCount: 165,
  },
];

// Helper to get CTA text
export function getWorkshopCTA(workshop: Workshop): string {
  return "Request Callback";
}

export function getHackathonCTA(hackathon: Hackathon): string {
  return "Request Callback";
}
