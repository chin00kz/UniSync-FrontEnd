export const mockNotifications = [
  {
    id: 1,
    title: "New Material Uploaded",
    content: "Prof. Smith added a new resource to 'Introduction to Computer Science': Data Structures 101.",
    time: "2 hours ago",
    type: "material",
    isNew: true
  },
  {
    id: 2,
    title: "Session Rescheduled",
    content: "Your peer tutoring session with Alice has been moved to 3 PM tomorrow.",
    time: "5 hours ago",
    type: "session",
    isNew: true
  },
  {
    id: 3,
    title: "New Quiz Available",
    content: "Test your knowledge with the new 'Discrete Math' practice quiz.",
    time: "Yesterday",
    type: "quiz",
    isNew: false
  }
];

export const mockOrganizedContent = [
  {
    id: 1,
    subject: "Computer Science",
    title: "Data Structures & Algorithms",
    type: "Lecture Notes",
    date: "March 20, 2026",
    size: "2.4 MB",
    downloads: 145
  },
  {
    id: 2,
    subject: "Mathematics",
    title: "Linear Algebra Fundamentals",
    type: "PDF Guide",
    date: "March 18, 2026",
    size: "1.8 MB",
    downloads: 98
  },
  {
    id: 3,
    subject: "Physics",
    title: "Electromagnetism Summary",
    type: "Cheat Sheet",
    date: "March 15, 2026",
    size: "850 KB",
    downloads: 212
  }
];

export const mockPeerTutoring = [
  {
    id: 1,
    name: "Emma Watson",
    subject: "Calculus Expert",
    rating: 4.9,
    price: "$15/hr",
    availability: "Available Now",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=emma"
  },
  {
    id: 2,
    name: "James Miller",
    subject: "Python Specialist",
    rating: 4.8,
    price: "$20/hr",
    availability: "Tomorrow",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=james"
  },
  {
    id: 3,
    name: "Sarah Chen",
    subject: "Physics Enthusiast",
    rating: 5.0,
    price: "$18/hr",
    availability: "Next Week",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=sarah"
  }
];
