import mongoose from "mongoose";
import dotenv from "dotenv";
import Internship from "./models/Internship.js";
import City from "./models/City.js"; // Ensure City model exists for economics
import connectDB from "./config/db.js";

dotenv.config();

const companies = ["Google", "Microsoft", "TATA TCS", "Infosys", "Wipro", "Swiggy", "Zomato", "Razorpay", "Cred", "UrbanCompany", "TechMahindra", "HCL", "Accenture", "Jio Platforms", "Polygon"];

const locations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida", "Remote", "Jaipur", "Ahmedabad"];

// Distinct Categories with specific skills
const jobTypes = [
  {
    titles: ["Frontend Developer", "React Developer", "UI/UX Engineer", "Web Developer"],
    skills: ["React", "JavaScript", "Tailwind CSS", "HTML/CSS", "Figma", "Redux", "TypeScript"],
    category: "Tech"
  },
  {
    titles: ["Backend Developer", "Node.js Intern", "Java Developer", "API Engineer"],
    skills: ["Node.js", "Express", "MongoDB", "Java", "Spring Boot", "SQL", "Python"],
    category: "Tech"
  },
  {
    titles: ["Full Stack Developer", "MERN Stack Intern", "Software Engineer"],
    skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "Git", "REST APIs"],
    category: "Tech"
  },
  {
    titles: ["Blockchain Developer", "Smart Contract Intern", "Web3 Engineer"],
    skills: ["Solidity", "Blockchain", "Ethereum", "Web3.js", "Smart Contracts", "Cryptography"],
    category: "Tech"
  },
  {
    titles: ["Data Scientist", "AI/ML Intern", "Python Developer"],
    skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "Data Analysis", "SQL"],
    category: "Tech"
  },
  {
    titles: ["HR Intern", "Talent Acquisition", "Recruiter"],
    skills: ["Communication", "Excel", "Management", "Hiring", "LinkedIn"],
    category: "Non-Tech"
  }
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, size) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
};

const generateInternships = async () => {
  await connectDB();
  await Internship.deleteMany(); // Clear old data

  const internships = [];
  
  for (let i = 0; i < 200; i++) { // Generating 200 Jobs
    const jobType = getRandom(jobTypes);
    const title = getRandom(jobType.titles);
    const city = getRandom(locations);
    
    // Realistic Stipend Logic
    let baseStipend = 0;
    if (["Bangalore", "Mumbai", "Gurgaon"].includes(city)) baseStipend = 15000;
    else if (city === "Remote") baseStipend = 8000;
    else baseStipend = 5000;

    // Tech jobs pay more
    if (jobType.category === "Tech") baseStipend += 5000;

    const finalStipend = baseStipend + Math.floor(Math.random() * 5000);

    internships.push({
      title: title,
      company: getRandom(companies),
      location: city,
      stipend: `₹${finalStipend}/month`,
      duration: `${Math.floor(Math.random() * 4) + 2} Months`,
      skillsRequired: getRandomSubset(jobType.skills, 4), // Pick 4 random skills from the valid list
      category: jobType.category
    });
  }

  await Internship.insertMany(internships);
  console.log("🚀 Generated 200 Diverse Internships!");
  process.exit();
};

generateInternships();