export const products = [
  {
    id: 1,
    name: "Smart Queue System",
    price: 150.0,
    description: "Advanced queue management for seamless customer flow.",
    image_url: "/images/q1.png",
    category_id: 1,
  },
  {
    id: 2,
    name: "RFID Asset Tracker",
    price: 200.0,
    description: "Real-time asset tracking with precision RFID technology.",
    image_url: "/images/placeholder.jpg",
    category_id: 2,
  },
  {
    id: 3,
    name: "Digital Signage Pro",
    price: 300.0,
    description: "High-impact digital displays for engaging audiences.",
    image_url: "/images/placeholder.jpg",
    category_id: 3,
  },
  {
    id: 4,
    name: "Queue Analytics Dashboard",
    price: 250.0,
    description: "Data-driven insights to optimize queue performance.",
    image_url: "/images/placeholder.jpg",
    category_id: 1,
  },
  {
    id: 5,
    name: "RFID Inventory Manager",
    price: 180.0,
    description: "Streamlined inventory tracking with RFID integration.",
    image_url: "/images/placeholder.jpg",
    category_id: 2,
  },
  {
    id: 6,
    name: "Interactive Signage Touch",
    price: 350.0,
    description: "Touch-enabled digital signage for interactive experiences.",
    image_url: "/images/placeholder.jpg",
    category_id: 3,
  },
  {
    id: 7,
    name: "Biometric Access Control",
    price: 400.0,
    description: "Secure access management with biometric technology.",
    image_url: "/images/placeholder.jpg",
    category_id: 4,
  },
  {
    id: 8,
    name: "Queue Mobile App",
    price: 120.0,
    description: "Mobile solution for customers to join queues remotely.",
    image_url: "/images/placeholder.jpg",
    category_id: 1,
  },
];

export const categories = [
  { id: 1, name: "Queue Management" },
  { id: 2, name: "RFID Tracking" },
  { id: 3, name: "Digital Signage" },
  { id: 4, name: "Access Control" },
];

export const productDetails = {
  1: {
    technicalDetails: [
      { label: "Platform", value: "Cloud-based" },
      { label: "Max Users", value: "500 concurrent" },
      { label: "Integration", value: "API, Webhooks" },
      { label: "Deployment", value: "On-premise or SaaS" },
    ],
    features: [
      "Real-time queue monitoring",
      "Automated ticket dispensing",
      "Multi-language support",
      "Customizable interface",
    ],
    useCases: [
      "Retail stores for customer service queues",
      "Hospitals for patient management",
      "Banks for teller line optimization",
    ],
  },
  2: {
    technicalDetails: [
      { label: "Frequency", value: "860-960 MHz" },
      { label: "Range", value: "Up to 10 meters" },
      { label: "Compatibility", value: "UHF RFID tags" },
      { label: "Software", value: "Web dashboard" },
    ],
    features: [
      "Real-time asset location",
      "Anti-theft alerts",
      "Battery-efficient tags",
      "Scalable architecture",
    ],
    useCases: [
      "Warehouses for equipment tracking",
      "Hospitals for medical device management",
      "Retail for high-value item security",
    ],
  },
  3: {
    technicalDetails: [
      { label: "Resolution", value: "4K UHD" },
      { label: "Screen Size", value: "55-85 inches" },
      { label: "Connectivity", value: "HDMI, Wi-Fi" },
      { label: "OS", value: "Android-based" },
    ],
    features: [
      "Vivid color display",
      "Remote content management",
      "Scheduling software",
      "Weather-resistant design",
    ],
    useCases: [
      "Retail for promotional displays",
      "Airports for flight information",
      "Restaurants for digital menus",
    ],
  },
  4: {
    technicalDetails: [
      { label: "Data Storage", value: "Cloud or local" },
      { label: "Analytics", value: "Real-time" },
      { label: "Export Formats", value: "CSV, PDF" },
      { label: "Access", value: "Web, Mobile" },
    ],
    features: [
      "Queue length tracking",
      "Wait time analysis",
      "Peak hour identification",
      "Custom reports",
    ],
    useCases: [
      "Retail for staffing optimization",
      "Amusement parks for ride queue management",
      "Government offices for service efficiency",
    ],
  },
  5: {
    technicalDetails: [
      { label: "Tag Type", value: "Passive RFID" },
      { label: "Read Speed", value: "100 tags/sec" },
      { label: "Integration", value: "ERP systems" },
      { label: "Range", value: "Up to 8 meters" },
    ],
    features: [
      "Bulk inventory scanning",
      "Low maintenance",
      "Real-time stock updates",
      "Error reduction",
    ],
    useCases: [
      "Retail for stock management",
      "Logistics for supply chain tracking",
      "Manufacturing for parts inventory",
    ],
  },
  6: {
    technicalDetails: [
      { label: "Touch Type", value: "Capacitive" },
      { label: "Resolution", value: "4K UHD" },
      { label: "Response Time", value: "10ms" },
      { label: "Connectivity", value: "USB, Wi-Fi" },
    ],
    features: [
      "Multi-touch support",
      "Interactive content",
      "Durable screen",
      "Easy setup",
    ],
    useCases: [
      "Museums for interactive exhibits",
      "Retail for product exploration",
      "Education for classroom engagement",
    ],
  },
  7: {
    technicalDetails: [
      { label: "Sensor", value: "Fingerprint, Facial" },
      { label: "Capacity", value: "10,000 users" },
      { label: "Speed", value: "<1 second" },
      { label: "Security", value: "AES-256 encryption" },
    ],
    features: [
      "Multi-factor authentication",
      "Cloud sync",
      "Tamper-proof design",
      "User management portal",
    ],
    useCases: [
      "Corporate offices for secure entry",
      "Data centers for restricted access",
      "Gyms for member check-in",
    ],
  },
  8: {
    technicalDetails: [
      { label: "Platform", value: "iOS, Android" },
      { label: "Notifications", value: "Push, SMS" },
      { label: "Integration", value: "Queue System API" },
      { label: "Language", value: "Multi-language" },
    ],
    features: [
      "Virtual queue joining",
      "Estimated wait time",
      "Appointment booking",
      "User-friendly UI",
    ],
    useCases: [
      "Restaurants for waitlist management",
      "Clinics for patient check-in",
      "DMVs for appointment scheduling",
    ],
  },
};