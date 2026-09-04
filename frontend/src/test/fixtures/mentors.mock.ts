export interface MockMentor {
  _id: string;
  name: string;
  photo: string;
  company: string;
  expertiseTags: string[];
  sessionsDelivered: number;
  rating: number;
}

export const mentorsMock: MockMentor[] = [
  {
    _id: "m1",
    name: "Arjun Mehta",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=arjun",
    company: "Razorpay",
    expertiseTags: ["React", "Node.js", "System Design"],
    sessionsDelivered: 340,
    rating: 4.9,
  },
  {
    _id: "m2",
    name: "Priya Sharma",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    company: "Swiggy",
    expertiseTags: ["Next.js", "TypeScript", "GraphQL"],
    sessionsDelivered: 280,
    rating: 4.8,
  },
  {
    _id: "m3",
    name: "Rohit Verma",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit",
    company: "Flipkart",
    expertiseTags: ["Node.js", "Microservices", "AWS"],
    sessionsDelivered: 420,
    rating: 4.9,
  },
  {
    _id: "m4",
    name: "Sneha Patel",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=sneha",
    company: "Zomato",
    expertiseTags: ["UI/UX", "Figma", "Design Systems"],
    sessionsDelivered: 190,
    rating: 4.7,
  },
  {
    _id: "m5",
    name: "Vikram Singh",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    company: "Razorpay",
    expertiseTags: ["Python", "Machine Learning", "Data Engineering"],
    sessionsDelivered: 310,
    rating: 4.8,
  },
  {
    _id: "m6",
    name: "Karan Gupta",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=karan",
    company: "Flipkart",
    expertiseTags: ["DevOps", "Kubernetes", "CI/CD"],
    sessionsDelivered: 250,
    rating: 4.7,
  },
  {
    _id: "m7",
    name: "Ananya Iyer",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    company: "Swiggy",
    expertiseTags: ["JavaScript", "React", "Testing"],
    sessionsDelivered: 360,
    rating: 4.9,
  },
  {
    _id: "m8",
    name: "Deepak Joshi",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=deepak",
    company: "Zomato",
    expertiseTags: ["MongoDB", "PostgreSQL", "Redis"],
    sessionsDelivered: 200,
    rating: 4.6,
  },
];
