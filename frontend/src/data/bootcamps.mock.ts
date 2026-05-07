export interface MockBootcamp {
  _id: string;
  title: string;
  slug: string;
  banner: string;
  price: number;
  startDate: string;
  endDate: string;
  maxSeats: number;
  enrolledCount: number;
  mode: "Online" | "Offline" | "Hybrid";
  status: "Draft" | "Open" | "Closed" | "Completed";
  skillsCovered: string[];
  mentorNames: string[];
}

export const bootcampsMock: MockBootcamp[] = [
  {
    _id: "b1",
    title: "Full-Stack MERN Bootcamp — Batch 7",
    slug: "mern-bootcamp-batch-7",
    banner: "/placeholder.svg",
    price: 24999,
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    maxSeats: 40,
    enrolledCount: 31,
    mode: "Hybrid",
    status: "Open",
    skillsCovered: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "TypeScript",
      "AWS",
    ],
    mentorNames: ["Arjun Mehta", "Priya Sharma", "Rohit Verma"],
  },
  {
    _id: "b2",
    title: "Data Science Immersive — Batch 3",
    slug: "data-science-batch-3",
    banner: "/placeholder.svg",
    price: 29999,
    startDate: "2026-06-01",
    endDate: "2026-09-01",
    maxSeats: 30,
    enrolledCount: 22,
    mode: "Online",
    status: "Open",
    skillsCovered: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "TensorFlow",
      "SQL",
      "Tableau",
    ],
    mentorNames: ["Vikram Singh", "Sneha Patel"],
  },
  {
    _id: "b3",
    title: "DevOps Engineering Bootcamp",
    slug: "devops-bootcamp",
    banner: "/placeholder.svg",
    price: 19999,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    maxSeats: 25,
    enrolledCount: 25,
    mode: "Online",
    status: "Closed",
    skillsCovered: ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
    mentorNames: ["Karan Gupta"],
  },
  {
    _id: "b4",
    title: "UI/UX Design Sprint",
    slug: "uiux-design-sprint",
    banner: "/placeholder.svg",
    price: 14999,
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    maxSeats: 35,
    enrolledCount: 35,
    mode: "Offline",
    status: "Completed",
    skillsCovered: ["Figma", "User Research", "Prototyping", "Design Systems"],
    mentorNames: ["Sneha Patel", "Ananya Iyer"],
  },
];
