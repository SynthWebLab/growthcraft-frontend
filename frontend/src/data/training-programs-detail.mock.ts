/**
 * Mock detailed data for Training Programs
 * Used for detail pages
 */

import type { TrainingProgramDetailResponse } from "@/types/training-program";

export const TRAINING_PROGRAMS_DETAIL_MOCK: Record<
  string,
  TrainingProgramDetailResponse
> = {
  "full-stack-web-development": {
    success: true,
    message: "Training program details fetched successfully",
    data: {
      program: {
        _id: "tp1",
        title: "Full-Stack Web Development Internship",
        slug: "full-stack-web-development",
        description:
          "Build production-ready web applications using MERN stack. Work on real client projects and deploy live applications.",
        domain: "Web Development",
        duration: 60,
        tools: ["React", "Node.js", "MongoDB", "Express"],
        price: 12999,
        originalPrice: 18999,
        status: "Active",
        enrollmentCount: 342,
        rating: 4.8,
        level: "Intermediate",
        cohorts: [
          {
            _id: "c1",
            cohortNumber: 12,
            startDate: "2026-07-01T00:00:00Z",
            endDate: "2026-08-30T00:00:00Z",
            maxSeats: 50,
            enrolledCount: 28,
            status: "Open",
          },
          {
            _id: "c2",
            cohortNumber: 13,
            startDate: "2026-08-15T00:00:00Z",
            endDate: "2026-10-14T00:00:00Z",
            maxSeats: 50,
            enrolledCount: 15,
            status: "Open",
          },
          {
            _id: "c3",
            cohortNumber: 14,
            startDate: "2026-09-01T00:00:00Z",
            endDate: "2026-10-31T00:00:00Z",
            maxSeats: 50,
            enrolledCount: 0,
            status: "Open",
          },
        ],
        mentorName: "Arjun Mehta",
        primaryCTA: "Enroll Now",
        secondaryCTA: "Request Callback",
        createdAt: "2026-04-01T00:00:00Z",
        updatedAt: "2026-05-20T00:00:00Z",
      },
      overview: {
        aboutProgram:
          "Our 60-day Full-Stack Web Development Internship is designed to transform you into a job-ready MERN stack developer. You'll work on 3+ real client projects, learn industry best practices, and deploy production applications. With daily mentorship, code reviews, and placement assistance, this program has helped 342+ students land developer roles at top companies.",
        whatYouWillLearn: [
          { text: "React fundamentals and advanced patterns", _id: "1" },
          { text: "Node.js and Express backend development", _id: "2" },
          { text: "MongoDB database design and optimization", _id: "3" },
          { text: "RESTful API development", _id: "4" },
          { text: "Authentication and authorization", _id: "5" },
          { text: "AWS deployment and DevOps basics", _id: "6" },
          { text: "Git workflows and team collaboration", _id: "7" },
          { text: "Testing and debugging strategies", _id: "8" },
        ],
        prerequisites: [
          { text: "Basic HTML, CSS, and JavaScript knowledge", _id: "1" },
          { text: "Familiarity with programming concepts", _id: "2" },
          { text: "Laptop with 8GB+ RAM", _id: "3" },
          {
            text: "15-20 hours per week commitment for 60 days",
            _id: "4",
          },
        ],
        whatsIncluded: [
          { text: "60 days of hands-on training", icon: "clock", _id: "1" },
          { text: "3+ real client projects", icon: "code", _id: "2" },
          { text: "Daily mentor sessions", icon: "users", _id: "3" },
          { text: "Internship certificate", icon: "certificate", _id: "4" },
          { text: "Placement assistance", icon: "briefcase", _id: "5" },
          { text: "Lifetime community access", icon: "community", _id: "6" },
        ],
      },
      syllabus: [
        {
          weekNumber: 1,
          title: "Frontend Fundamentals",
          topics: [
            { text: "React setup and JSX", _id: "1" },
            { text: "Components and Props", _id: "2" },
            { text: "State management with hooks", _id: "3" },
            { text: "Event handling and forms", _id: "4" },
          ],
          _id: "w1",
        },
        {
          weekNumber: 2,
          title: "Advanced React",
          topics: [
            { text: "React Router and navigation", _id: "1" },
            { text: "Context API and state management", _id: "2" },
            { text: "Custom hooks", _id: "3" },
            { text: "Performance optimization", _id: "4" },
          ],
          _id: "w2",
        },
        {
          weekNumber: 3,
          title: "Backend with Node.js",
          topics: [
            { text: "Node.js and Express setup", _id: "1" },
            { text: "RESTful API design", _id: "2" },
            { text: "Middleware and error handling", _id: "3" },
            { text: "File uploads and validation", _id: "4" },
          ],
          _id: "w3",
        },
        {
          weekNumber: 4,
          title: "Database & MongoDB",
          topics: [
            { text: "MongoDB fundamentals", _id: "1" },
            { text: "Mongoose ODM", _id: "2" },
            { text: "Database design patterns", _id: "3" },
            { text: "Aggregation pipelines", _id: "4" },
          ],
          _id: "w4",
        },
        {
          weekNumber: 5,
          title: "Authentication & Security",
          topics: [
            { text: "JWT authentication", _id: "1" },
            { text: "Password hashing with bcrypt", _id: "2" },
            { text: "Role-based access control", _id: "3" },
            { text: "Security best practices", _id: "4" },
          ],
          _id: "w5",
        },
        {
          weekNumber: 6,
          title: "Project 1 - E-commerce App",
          topics: [
            { text: "Requirements gathering", _id: "1" },
            { text: "Architecture planning", _id: "2" },
            { text: "Development sprints", _id: "3" },
            { text: "Code reviews", _id: "4" },
          ],
          _id: "w6",
        },
        {
          weekNumber: 7,
          title: "Testing & DevOps",
          topics: [
            { text: "Unit testing with Jest", _id: "1" },
            { text: "Integration testing", _id: "2" },
            { text: "CI/CD pipelines", _id: "3" },
            { text: "AWS deployment", _id: "4" },
          ],
          _id: "w7",
        },
        {
          weekNumber: 8,
          title: "Capstone Project",
          topics: [
            { text: "Client project assignment", _id: "1" },
            { text: "Full-stack implementation", _id: "2" },
            { text: "Production deployment", _id: "3" },
            { text: "Final presentation", _id: "4" },
          ],
          _id: "w8",
        },
      ],
      mentorDetails: {
        name: "Arjun Mehta",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
        bio: "Full-Stack Engineer at Amazon with 10+ years of experience. Mentored 500+ developers and helped them land jobs at FAANG companies. Passionate about teaching and building scalable applications.",
        rating: 4.9,
        studentsCount: 2340,
        expertise: [
          "MERN Stack",
          "System Design",
          "AWS",
          "Career Mentorship",
        ],
      },
      faqs: [
        {
          question: "Will I get an internship certificate?",
          answer:
            "Yes! You'll receive an official internship certificate upon successful completion of all projects and assessments.",
          _id: "1",
        },
        {
          question: "Do you provide placement assistance?",
          answer:
            "Absolutely! We offer resume building, interview preparation, and introduce you to our hiring partners. 85%+ of our graduates land jobs within 3 months.",
          _id: "2",
        },
        {
          question: "What if I miss some sessions?",
          answer:
            "All sessions are recorded. You can catch up at your own pace. However, we recommend attending live for the best learning experience.",
          _id: "3",
        },
        {
          question: "Can I work while doing this internship?",
          answer:
            "Yes! The program is designed for working professionals. You'll need to dedicate 15-20 hours per week, mostly evenings and weekends.",
          _id: "4",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-01T00:00:00Z",
    },
  },

  "data-science-analytics": {
    success: true,
    message: "Training program details fetched successfully",
    data: {
      program: {
        _id: "tp3",
        title: "Data Science & Analytics Internship",
        slug: "data-science-analytics",
        description:
          "Work with real datasets, build ML models, and create dashboards. Learn Python, pandas, and visualization tools.",
        domain: "Data Science",
        duration: 60,
        tools: ["Python", "Pandas", "NumPy", "Scikit-learn"],
        price: 14999,
        originalPrice: 21999,
        status: "Active",
        enrollmentCount: 189,
        rating: 4.9,
        level: "Intermediate",
        cohorts: [
          {
            _id: "c1",
            cohortNumber: 8,
            startDate: "2026-07-15T00:00:00Z",
            endDate: "2026-09-13T00:00:00Z",
            maxSeats: 35,
            enrolledCount: 18,
            status: "Open",
          },
          {
            _id: "c2",
            cohortNumber: 9,
            startDate: "2026-08-01T00:00:00Z",
            endDate: "2026-09-30T00:00:00Z",
            maxSeats: 35,
            enrolledCount: 8,
            status: "Open",
          },
        ],
        mentorName: "Dr. Vikram Singh",
        primaryCTA: "Enroll Now",
        secondaryCTA: "Request Callback",
        createdAt: "2026-04-15T00:00:00Z",
        updatedAt: "2026-05-25T00:00:00Z",
      },
      overview: {
        aboutProgram:
          "Transform raw data into actionable insights with our comprehensive 60-day Data Science & Analytics Internship. Master Python, statistical analysis, machine learning, and data visualization. Work on real-world datasets from healthcare, finance, and e-commerce domains. Build a strong portfolio with 4+ hands-on projects.",
        whatYouWillLearn: [
          { text: "Python for data analysis", _id: "1" },
          { text: "Pandas and NumPy mastery", _id: "2" },
          { text: "Statistical analysis and hypothesis testing", _id: "3" },
          { text: "Machine learning algorithms", _id: "4" },
          { text: "Data visualization with Matplotlib and Seaborn", _id: "5" },
          { text: "SQL for data manipulation", _id: "6" },
          { text: "Building and deploying ML models", _id: "7" },
          { text: "Creating interactive dashboards", _id: "8" },
        ],
        prerequisites: [
          { text: "Basic Python programming knowledge", _id: "1" },
          { text: "High school level mathematics", _id: "2" },
          { text: "Analytical thinking skills", _id: "3" },
          {
            text: "Laptop with 8GB+ RAM (16GB recommended)",
            _id: "4",
          },
        ],
        whatsIncluded: [
          { text: "60 days intensive training", icon: "clock", _id: "1" },
          { text: "4+ real-world projects", icon: "code", _id: "2" },
          { text: "Live mentor sessions", icon: "users", _id: "3" },
          { text: "Internship certificate", icon: "certificate", _id: "4" },
          { text: "Career guidance", icon: "briefcase", _id: "5" },
          { text: "Kaggle competition participation", icon: "trophy", _id: "6" },
        ],
      },
      syllabus: [
        {
          weekNumber: 1,
          title: "Python Foundations",
          topics: [
            { text: "Python basics and data structures", _id: "1" },
            { text: "NumPy arrays and operations", _id: "2" },
            { text: "Pandas DataFrames", _id: "3" },
            { text: "Data cleaning techniques", _id: "4" },
          ],
          _id: "w1",
        },
        {
          weekNumber: 2,
          title: "Exploratory Data Analysis",
          topics: [
            { text: "Descriptive statistics", _id: "1" },
            { text: "Data visualization basics", _id: "2" },
            { text: "Identifying patterns and outliers", _id: "3" },
            { text: "Feature engineering", _id: "4" },
          ],
          _id: "w2",
        },
        {
          weekNumber: 3,
          title: "Statistical Analysis",
          topics: [
            { text: "Probability distributions", _id: "1" },
            { text: "Hypothesis testing", _id: "2" },
            { text: "Correlation and regression", _id: "3" },
            { text: "A/B testing", _id: "4" },
          ],
          _id: "w3",
        },
        {
          weekNumber: 4,
          title: "Machine Learning - Supervised",
          topics: [
            { text: "Linear and logistic regression", _id: "1" },
            { text: "Decision trees and random forests", _id: "2" },
            { text: "Model evaluation metrics", _id: "3" },
            { text: "Hyperparameter tuning", _id: "4" },
          ],
          _id: "w4",
        },
        {
          weekNumber: 5,
          title: "Machine Learning - Unsupervised",
          topics: [
            { text: "Clustering algorithms", _id: "1" },
            { text: "Dimensionality reduction (PCA)", _id: "2" },
            { text: "Association rules", _id: "3" },
            { text: "Anomaly detection", _id: "4" },
          ],
          _id: "w5",
        },
        {
          weekNumber: 6,
          title: "Data Visualization & Dashboards",
          topics: [
            { text: "Advanced Matplotlib and Seaborn", _id: "1" },
            { text: "Plotly for interactive charts", _id: "2" },
            { text: "Tableau basics", _id: "3" },
            { text: "Building dashboards", _id: "4" },
          ],
          _id: "w6",
        },
        {
          weekNumber: 7,
          title: "SQL & Databases",
          topics: [
            { text: "SQL queries for data analysis", _id: "1" },
            { text: "Joins and subqueries", _id: "2" },
            { text: "Window functions", _id: "3" },
            { text: "Connecting to databases from Python", _id: "4" },
          ],
          _id: "w7",
        },
        {
          weekNumber: 8,
          title: "Capstone Project",
          topics: [
            { text: "End-to-end ML project", _id: "1" },
            { text: "Model deployment", _id: "2" },
            { text: "Portfolio building", _id: "3" },
            { text: "Final presentation", _id: "4" },
          ],
          _id: "w8",
        },
      ],
      mentorDetails: {
        name: "Dr. Vikram Singh",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
        bio: "PhD in Data Science with 12+ years of experience in analytics and machine learning. Former Data Scientist at Google. Published multiple research papers and mentored 300+ aspiring data scientists.",
        rating: 4.9,
        studentsCount: 1580,
        expertise: [
          "Machine Learning",
          "Statistics",
          "Python",
          "Research & Publications",
        ],
      },
      faqs: [
        {
          question: "Do I need a statistics background?",
          answer:
            "No! We'll teach you all the statistics you need from scratch. However, basic high school math will be helpful.",
          _id: "1",
        },
        {
          question: "Will we work on real datasets?",
          answer:
            "Absolutely! You'll work with real-world datasets from healthcare, finance, and e-commerce domains throughout the program.",
          _id: "2",
        },
        {
          question: "What kind of jobs can I get after this?",
          answer:
            "Our graduates work as Data Analysts, Business Analysts, Data Scientists, and ML Engineers at various companies. Average starting salary is ₹6-12 LPA.",
          _id: "3",
        },
        {
          question: "Is Kaggle participation mandatory?",
          answer:
            "No, but highly recommended! We'll guide you through participating in a Kaggle competition to strengthen your portfolio.",
          _id: "4",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-05T00:00:00Z",
    },
  },

  "uiux-design-internship": {
    success: true,
    message: "Training program details fetched successfully",
    data: {
      program: {
        _id: "tp2",
        title: "UI/UX Design Internship",
        slug: "uiux-design-internship",
        description:
          "Master Figma, design systems, and user research. Create portfolio-worthy designs for real startups.",
        domain: "Design",
        duration: 30,
        tools: ["Figma", "Adobe XD", "Sketch", "InVision"],
        price: 9999,
        originalPrice: 14999,
        status: "Active",
        enrollmentCount: 256,
        rating: 4.7,
        level: "Beginner",
        cohorts: [
          {
            _id: "c1",
            cohortNumber: 10,
            startDate: "2026-07-01T00:00:00Z",
            endDate: "2026-07-31T00:00:00Z",
            maxSeats: 40,
            enrolledCount: 22,
            status: "Open",
          },
          {
            _id: "c2",
            cohortNumber: 11,
            startDate: "2026-08-01T00:00:00Z",
            endDate: "2026-08-31T00:00:00Z",
            maxSeats: 40,
            enrolledCount: 10,
            status: "Open",
          },
        ],
        mentorName: "Priya Sharma",
        primaryCTA: "Enroll Now",
        secondaryCTA: "Request Callback",
        createdAt: "2026-04-05T00:00:00Z",
        updatedAt: "2026-05-22T00:00:00Z",
      },
      overview: {
        aboutProgram:
          "Our 30-day UI/UX Design Internship will transform you into a job-ready designer. Learn from industry experts, work on real startup projects, and build a portfolio that stands out. Master Figma, user research, wireframing, prototyping, and design systems.",
        whatYouWillLearn: [
          { text: "Figma mastery and design systems", _id: "1" },
          { text: "User research and personas", _id: "2" },
          { text: "Wireframing and prototyping", _id: "3" },
          { text: "Visual design principles", _id: "4" },
          { text: "Interaction design", _id: "5" },
          { text: "Usability testing", _id: "6" },
          { text: "Design handoff to developers", _id: "7" },
          { text: "Portfolio building", _id: "8" },
        ],
        prerequisites: [
          { text: "Basic computer skills", _id: "1" },
          { text: "Creative mindset", _id: "2" },
          { text: "No design experience required", _id: "3" },
          { text: "Laptop with 8GB+ RAM", _id: "4" },
        ],
        whatsIncluded: [
          { text: "30 days intensive training", icon: "clock", _id: "1" },
          { text: "3+ real startup projects", icon: "code", _id: "2" },
          { text: "Daily design critiques", icon: "users", _id: "3" },
          { text: "Internship certificate", icon: "certificate", _id: "4" },
          { text: "Portfolio website", icon: "briefcase", _id: "5" },
          { text: "Figma Pro account (1 year)", icon: "gift", _id: "6" },
        ],
      },
      syllabus: [
        {
          weekNumber: 1,
          title: "Design Fundamentals",
          topics: [
            { text: "Introduction to UI/UX", _id: "1" },
            { text: "Design thinking process", _id: "2" },
            { text: "Figma basics", _id: "3" },
            { text: "Color theory and typography", _id: "4" },
          ],
          _id: "w1",
        },
        {
          weekNumber: 2,
          title: "User Research & Wireframing",
          topics: [
            { text: "User research methods", _id: "1" },
            { text: "Creating user personas", _id: "2" },
            { text: "Information architecture", _id: "3" },
            { text: "Wireframing techniques", _id: "4" },
          ],
          _id: "w2",
        },
        {
          weekNumber: 3,
          title: "Visual Design & Prototyping",
          topics: [
            { text: "Advanced Figma features", _id: "1" },
            { text: "Design systems", _id: "2" },
            { text: "Interactive prototyping", _id: "3" },
            { text: "Micro-interactions", _id: "4" },
          ],
          _id: "w3",
        },
        {
          weekNumber: 4,
          title: "Project & Portfolio",
          topics: [
            { text: "Complete design project", _id: "1" },
            { text: "Usability testing", _id: "2" },
            { text: "Portfolio creation", _id: "3" },
            { text: "Case study writing", _id: "4" },
          ],
          _id: "w4",
        },
      ],
      mentorDetails: {
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        bio: "Lead Product Designer at Flipkart with 8+ years of experience. Specialized in mobile app design and design systems. Mentored 200+ designers who now work at top companies.",
        rating: 4.8,
        studentsCount: 1250,
        expertise: ["UI/UX Design", "Figma", "Mobile Design", "Design Systems"],
      },
      faqs: [
        {
          question: "Do I need design experience?",
          answer:
            "No! This program is perfect for beginners. We'll teach you everything from scratch.",
          _id: "1",
        },
        {
          question: "What software do I need?",
          answer:
            "You'll get a free Figma Pro account for 1 year. We'll also cover Adobe XD basics.",
          _id: "2",
        },
        {
          question: "Will I get a portfolio website?",
          answer:
            "Yes! We'll help you create and host a professional portfolio website to showcase your work.",
          _id: "3",
        },
        {
          question: "Can I get a job after this?",
          answer:
            "Absolutely! Our graduates work as UI/UX designers at startups and product companies. We provide job referrals and interview prep.",
          _id: "4",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-02T00:00:00Z",
    },
  },

  "mobile-app-development": {
    success: true,
    message: "Training program details fetched successfully",
    data: {
      program: {
        _id: "tp5",
        title: "Mobile App Development Internship",
        slug: "mobile-app-development",
        description:
          "Build cross-platform mobile apps with React Native. Ship apps to iOS and Android app stores.",
        domain: "Mobile Development",
        duration: 40,
        tools: ["React Native", "Expo", "Firebase", "Redux"],
        price: 13999,
        originalPrice: 19999,
        status: "Active",
        enrollmentCount: 178,
        rating: 4.6,
        level: "Intermediate",
        cohorts: [
          {
            _id: "c1",
            cohortNumber: 6,
            startDate: "2026-07-10T00:00:00Z",
            endDate: "2026-08-20T00:00:00Z",
            maxSeats: 40,
            enrolledCount: 25,
            status: "Open",
          },
        ],
        mentorName: "Rahul Verma",
        primaryCTA: "Enroll Now",
        secondaryCTA: "Request Callback",
        createdAt: "2026-04-10T00:00:00Z",
        updatedAt: "2026-05-28T00:00:00Z",
      },
      overview: {
        aboutProgram:
          "Build professional mobile applications with React Native. Learn to create cross-platform apps that work seamlessly on both iOS and Android. Ship your apps to real app stores and build a portfolio of 3+ mobile applications.",
        whatYouWillLearn: [
          { text: "React Native fundamentals", _id: "1" },
          { text: "Navigation and routing", _id: "2" },
          { text: "State management with Redux", _id: "3" },
          { text: "Firebase integration", _id: "4" },
          { text: "Push notifications", _id: "5" },
          { text: "App store deployment", _id: "6" },
          { text: "Native modules integration", _id: "7" },
          { text: "Performance optimization", _id: "8" },
        ],
        prerequisites: [
          { text: "JavaScript knowledge", _id: "1" },
          { text: "Basic React experience", _id: "2" },
          { text: "Laptop with 8GB+ RAM", _id: "3" },
          { text: "Mac required for iOS development", _id: "4" },
        ],
        whatsIncluded: [
          { text: "40 days hands-on training", icon: "clock", _id: "1" },
          { text: "3+ published apps", icon: "code", _id: "2" },
          { text: "Weekly code reviews", icon: "users", _id: "3" },
          { text: "Internship certificate", icon: "certificate", _id: "4" },
          { text: "App store accounts", icon: "gift", _id: "5" },
          { text: "Portfolio showcase", icon: "briefcase", _id: "6" },
        ],
      },
      syllabus: [
        {
          weekNumber: 1,
          title: "React Native Basics",
          topics: [
            { text: "Setup and configuration", _id: "1" },
            { text: "Core components", _id: "2" },
            { text: "Styling and Flexbox", _id: "3" },
            { text: "Lists and forms", _id: "4" },
          ],
          _id: "w1",
        },
        {
          weekNumber: 2,
          title: "Navigation & State",
          topics: [
            { text: "React Navigation", _id: "1" },
            { text: "Redux setup", _id: "2" },
            { text: "API integration", _id: "3" },
            { text: "AsyncStorage", _id: "4" },
          ],
          _id: "w2",
        },
        {
          weekNumber: 3,
          title: "Advanced Features",
          topics: [
            { text: "Firebase authentication", _id: "1" },
            { text: "Push notifications", _id: "2" },
            { text: "Camera and media", _id: "3" },
            { text: "Maps integration", _id: "4" },
          ],
          _id: "w3",
        },
        {
          weekNumber: 4,
          title: "Deployment & Polish",
          topics: [
            { text: "App icon and splash screen", _id: "1" },
            { text: "iOS deployment", _id: "2" },
            { text: "Android deployment", _id: "3" },
            { text: "App store optimization", _id: "4" },
          ],
          _id: "w4",
        },
      ],
      mentorDetails: {
        name: "Rahul Verma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        bio: "Senior Mobile Engineer at Swiggy with 9+ years of experience. Built 20+ mobile apps with millions of downloads. Expert in React Native and native iOS development.",
        rating: 4.7,
        studentsCount: 980,
        expertise: ["React Native", "iOS", "Android", "App Architecture"],
      },
      faqs: [
        {
          question: "Do I need a Mac?",
          answer:
            "Mac is required for iOS development. However, you can develop Android apps on Windows/Linux.",
          _id: "1",
        },
        {
          question: "Will my app be on the App Store?",
          answer:
            "Yes! We'll guide you through the entire process of publishing to both Apple App Store and Google Play Store.",
          _id: "2",
        },
        {
          question: "Can I build apps for my own business?",
          answer:
            "Absolutely! Many students use this program to build apps for their startups or freelance clients.",
          _id: "3",
        },
        {
          question: "What kind of apps will we build?",
          answer:
            "You'll build 3+ apps including a social media app, e-commerce app, and your own capstone project app.",
          _id: "4",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-07T00:00:00Z",
    },
  },

  "digital-marketing-growth": {
    success: true,
    message: "Training program details fetched successfully",
    data: {
      program: {
        _id: "tp6",
        title: "Digital Marketing & Growth Internship",
        slug: "digital-marketing-growth",
        description:
          "Learn SEO, social media marketing, content strategy, and analytics. Run real campaigns for brands.",
        domain: "Marketing",
        duration: 30,
        tools: ["Google Analytics", "SEMrush", "HubSpot", "Meta Ads"],
        price: 8999,
        originalPrice: 12999,
        status: "Active",
        enrollmentCount: 423,
        rating: 4.5,
        level: "Beginner",
        cohorts: [
          {
            _id: "c1",
            cohortNumber: 15,
            startDate: "2026-07-05T00:00:00Z",
            endDate: "2026-08-04T00:00:00Z",
            maxSeats: 60,
            enrolledCount: 45,
            status: "Open",
          },
        ],
        mentorName: "Sneha Kapoor",
        primaryCTA: "Enroll Now",
        secondaryCTA: "Request Callback",
        createdAt: "2026-04-12T00:00:00Z",
        updatedAt: "2026-05-30T00:00:00Z",
      },
      overview: {
        aboutProgram:
          "Master digital marketing and drive real business growth. Learn SEO, paid advertising, social media marketing, email campaigns, and analytics. Run live campaigns with actual budgets for real brands and build a portfolio of measurable results.",
        whatYouWillLearn: [
          { text: "SEO and keyword research", _id: "1" },
          { text: "Google Ads and Facebook Ads", _id: "2" },
          { text: "Social media marketing", _id: "3" },
          { text: "Content marketing strategy", _id: "4" },
          { text: "Email marketing automation", _id: "5" },
          { text: "Google Analytics and reporting", _id: "6" },
          { text: "Conversion rate optimization", _id: "7" },
          { text: "Growth hacking techniques", _id: "8" },
        ],
        prerequisites: [
          { text: "No experience required", _id: "1" },
          { text: "Good communication skills", _id: "2" },
          { text: "Basic internet knowledge", _id: "3" },
          { text: "Creative thinking", _id: "4" },
        ],
        whatsIncluded: [
          { text: "30 days intensive training", icon: "clock", _id: "1" },
          { text: "Live campaign experience", icon: "code", _id: "2" },
          { text: "₹5000 ad spend budget", icon: "gift", _id: "3" },
          { text: "Internship certificate", icon: "certificate", _id: "4" },
          { text: "Google Ads certification", icon: "trophy", _id: "5" },
          { text: "Portfolio of campaigns", icon: "briefcase", _id: "6" },
        ],
      },
      syllabus: [
        {
          weekNumber: 1,
          title: "Digital Marketing Fundamentals",
          topics: [
            { text: "Digital marketing landscape", _id: "1" },
            { text: "Marketing funnels", _id: "2" },
            { text: "SEO basics", _id: "3" },
            { text: "Keyword research", _id: "4" },
          ],
          _id: "w1",
        },
        {
          weekNumber: 2,
          title: "Paid Advertising",
          topics: [
            { text: "Google Ads mastery", _id: "1" },
            { text: "Facebook and Instagram ads", _id: "2" },
            { text: "Ad copywriting", _id: "3" },
            { text: "Budget optimization", _id: "4" },
          ],
          _id: "w2",
        },
        {
          weekNumber: 3,
          title: "Content & Social Media",
          topics: [
            { text: "Content strategy", _id: "1" },
            { text: "Social media management", _id: "2" },
            { text: "Email marketing", _id: "3" },
            { text: "Influencer marketing", _id: "4" },
          ],
          _id: "w3",
        },
        {
          weekNumber: 4,
          title: "Analytics & Growth",
          topics: [
            { text: "Google Analytics deep dive", _id: "1" },
            { text: "Conversion optimization", _id: "2" },
            { text: "Growth hacking", _id: "3" },
            { text: "Campaign reporting", _id: "4" },
          ],
          _id: "w4",
        },
      ],
      mentorDetails: {
        name: "Sneha Kapoor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        bio: "Growth Marketing Manager at Razorpay with 7+ years of experience. Scaled multiple startups from 0 to 1M users. Google Ads and HubSpot certified trainer.",
        rating: 4.6,
        studentsCount: 1650,
        expertise: ["SEO", "Paid Ads", "Growth Marketing", "Analytics"],
      },
      faqs: [
        {
          question: "Will we run real campaigns?",
          answer:
            "Yes! You'll manage live campaigns with real ad budgets for actual brands and see real results.",
          _id: "1",
        },
        {
          question: "Do I get certification?",
          answer:
            "You'll get our internship certificate plus we'll help you get Google Ads certification.",
          _id: "2",
        },
        {
          question: "Can I start my own agency?",
          answer:
            "Absolutely! Many graduates run successful freelance marketing businesses or agencies.",
          _id: "3",
        },
        {
          question: "What's the typical salary?",
          answer:
            "Entry-level digital marketers earn ₹3-6 LPA. With experience, senior roles pay ₹10-20 LPA.",
          _id: "4",
        },
      ],
    },
    meta: {
      timestamp: "2026-06-08T00:00:00Z",
    },
  },
};

// Helper to get training program detail by slug
export function getTrainingProgramDetailBySlug(
  slug: string
): TrainingProgramDetailResponse | null {
  return TRAINING_PROGRAMS_DETAIL_MOCK[slug] || null;
}
