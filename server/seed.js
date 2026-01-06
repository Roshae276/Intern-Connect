import mongoose from "mongoose";
import dotenv from "dotenv";
import Internship from "./models/Internship.js";
import connectDB from "./config/db.js";

dotenv.config();

// MOCK DATA: Designed to test different scenarios
const internships = [
  {
    title: "Full Stack Developer",
    company: "TechNova Solutions",
    location: "Bangalore",
    stipend: "₹15,000/month",
    duration: "6 Months",
    skillsRequired: ["React", "Node.js", "MongoDB", "Express"],
    category: "Tech",
  },
  {
    title: "Social Media Intern",
    company: "Creative Hive",
    location: "Remote",
    stipend: "₹5,000/month",
    duration: "3 Months",
    skillsRequired: ["Canva", "Instagram", "Copywriting"],
    category: "Marketing",
  },
  {
    title: "React Frontend Developer",
    company: "StartUp Inc",
    location: "Remote",
    stipend: "₹8,000/month",
    duration: "3 Months",
    skillsRequired: ["React", "Tailwind CSS", "JavaScript"],
    category: "Tech",
  },
  {
    title: "Data Analyst Intern",
    company: "FinCorp",
    location: "Mumbai",
    stipend: "₹20,000/month",
    duration: "6 Months",
    skillsRequired: ["Python", "Excel", "SQL"],
    category: "Finance",
  },
];

const seedData = async () => {
  try {
    await connectDB();
    
    // 1. Clear existing data
    await Internship.deleteMany();
    console.log("Existing data cleared... 🗑️");

    // 2. Insert new data
    await Internship.insertMany(internships);
    console.log("Mock data imported successfully! 🌱");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();