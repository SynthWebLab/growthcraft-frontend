export interface MockTestimonial {
  _id: string;
  name: string;
  photo: string;
  hiredAt: string;
  courseTaken: string;
  quote: string;
}

export const testimonialsMock: MockTestimonial[] = [
  {
    _id: "t1",
    name: "Rahul Nair",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahul",
    hiredAt: "Razorpay",
    courseTaken: "Full-Stack MERN Development",
    quote:
      "Went from building todo apps to shipping payment integrations at Razorpay in 6 months.",
  },
  {
    _id: "t2",
    name: "Meera Krishnan",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    hiredAt: "Swiggy",
    courseTaken: "React & Next.js Mastery",
    quote:
      "The project-based approach made my portfolio stand out. Got 3 offers in 2 weeks.",
  },
  {
    _id: "t3",
    name: "Aditya Bhatt",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=aditya",
    hiredAt: "Flipkart",
    courseTaken: "Node.js Backend Engineering",
    quote:
      "The mentorship was the game-changer. My mentor literally reviewed my code like a tech lead.",
  },
  {
    _id: "t4",
    name: "Divya Reddy",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=divya",
    hiredAt: "Zomato",
    courseTaken: "UI/UX Design for Developers",
    quote:
      "I was a backend dev who couldn't design. Now I build end-to-end products my team actually uses.",
  },
  {
    _id: "t5",
    name: "Saurabh Tiwari",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=saurabh",
    hiredAt: "CRED",
    courseTaken: "JavaScript Zero to Hero",
    quote:
      "Started with zero coding knowledge. 8 months later, I'm writing production JavaScript at CRED.",
  },
  {
    _id: "t6",
    name: "Nisha Agarwal",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=nisha",
    hiredAt: "PhonePe",
    courseTaken: "Data Science with Python",
    quote:
      "The real-world datasets and capstone project gave me exactly what interviewers were looking for.",
  },
  {
    _id: "t7",
    name: "Kunal Das",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=kunal",
    hiredAt: "Groww",
    courseTaken: "Full-Stack MERN Development",
    quote:
      "GrowthCraft didn't just teach me to code — they taught me to think like a senior engineer.",
  },
  {
    _id: "t8",
    name: "Pooja Menon",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=pooja",
    hiredAt: "Meesho",
    courseTaken: "DevOps & Cloud Engineering",
    quote:
      "Deployed my first K8s cluster in week 3. By month 2, I was ready for DevOps interviews.",
  },
];
