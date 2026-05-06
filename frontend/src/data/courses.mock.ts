export interface MockCourse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  discountedPrice: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "MERN" | "UI/UX" | "DataScience" | "DevOps" | "Other";
  durationHours: number;
  totalLessons: number;
  instructorId: string;
  instructorName: string;
  enrollmentCount: number;
  avgRating: number;
}

export const coursesMock: MockCourse[] = [
  {
    _id: "c1",
    title: "Full-Stack MERN Development",
    slug: "full-stack-mern",
    description:
      "Build production-grade apps with MongoDB, Express, React & Node.js. From REST APIs to deployment.",
    thumbnail: "/placeholder.svg",
    price: 14999,
    discountedPrice: 8999,
    level: "Intermediate",
    category: "MERN",
    durationHours: 120,
    totalLessons: 84,
    instructorId: "m1",
    instructorName: "Arjun Mehta",
    enrollmentCount: 2340,
    avgRating: 4.8,
  },
  {
    _id: "c2",
    title: "React & Next.js Mastery",
    slug: "react-nextjs-mastery",
    description:
      "Master modern React patterns, server components, and build performant web apps with Next.js.",
    thumbnail: "/placeholder.svg",
    price: 12999,
    discountedPrice: 7499,
    level: "Intermediate",
    category: "MERN",
    durationHours: 90,
    totalLessons: 68,
    instructorId: "m2",
    instructorName: "Priya Sharma",
    enrollmentCount: 1890,
    avgRating: 4.9,
  },
  {
    _id: "c3",
    title: "Node.js Backend Engineering",
    slug: "nodejs-backend",
    description:
      "Design scalable APIs, implement auth, caching, queues, and deploy microservices on AWS.",
    thumbnail: "/placeholder.svg",
    price: 11999,
    discountedPrice: 6999,
    level: "Advanced",
    category: "MERN",
    durationHours: 80,
    totalLessons: 56,
    instructorId: "m3",
    instructorName: "Rohit Verma",
    enrollmentCount: 1560,
    avgRating: 4.7,
  },
  {
    _id: "c4",
    title: "UI/UX Design for Developers",
    slug: "uiux-for-devs",
    description:
      "Learn Figma, design systems, user research, and ship beautiful interfaces that convert.",
    thumbnail: "/placeholder.svg",
    price: 9999,
    discountedPrice: 5999,
    level: "Beginner",
    category: "UI/UX",
    durationHours: 60,
    totalLessons: 42,
    instructorId: "m4",
    instructorName: "Sneha Patel",
    enrollmentCount: 1230,
    avgRating: 4.6,
  },
  {
    _id: "c5",
    title: "Data Science with Python",
    slug: "data-science-python",
    description:
      "From pandas to production ML models. Covers statistics, visualization, and real-world datasets.",
    thumbnail: "/placeholder.svg",
    price: 13999,
    discountedPrice: 7999,
    level: "Intermediate",
    category: "DataScience",
    durationHours: 100,
    totalLessons: 72,
    instructorId: "m5",
    instructorName: "Vikram Singh",
    enrollmentCount: 1780,
    avgRating: 4.8,
  },
  {
    _id: "c6",
    title: "DevOps & Cloud Engineering",
    slug: "devops-cloud",
    description:
      "Docker, Kubernetes, CI/CD pipelines, AWS/GCP. Ship and scale like a senior engineer.",
    thumbnail: "/placeholder.svg",
    price: 15999,
    discountedPrice: 9999,
    level: "Advanced",
    category: "DevOps",
    durationHours: 110,
    totalLessons: 78,
    instructorId: "m6",
    instructorName: "Karan Gupta",
    enrollmentCount: 980,
    avgRating: 4.7,
  },
  {
    _id: "c7",
    title: "JavaScript Zero to Hero",
    slug: "javascript-zero-to-hero",
    description:
      "The only JS course you need. Closures, async, DOM, ES6+, and 30+ hands-on projects.",
    thumbnail: "/placeholder.svg",
    price: 7999,
    discountedPrice: 4499,
    level: "Beginner",
    category: "MERN",
    durationHours: 70,
    totalLessons: 52,
    instructorId: "m7",
    instructorName: "Ananya Iyer",
    enrollmentCount: 3200,
    avgRating: 4.9,
  },
  {
    _id: "c8",
    title: "MongoDB & Database Design",
    slug: "mongodb-database-design",
    description:
      "Schema design, aggregation pipelines, indexing strategies, and scaling MongoDB in production.",
    thumbnail: "/placeholder.svg",
    price: 8999,
    discountedPrice: 4999,
    level: "Intermediate",
    category: "MERN",
    durationHours: 50,
    totalLessons: 38,
    instructorId: "m8",
    instructorName: "Deepak Joshi",
    enrollmentCount: 890,
    avgRating: 4.5,
  },
];
