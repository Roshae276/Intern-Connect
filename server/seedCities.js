import mongoose from "mongoose";
import dotenv from "dotenv";
import City from "./models/City.js";
import connectDB from "./config/db.js";

dotenv.config();

const cities = [
  { name: "Mumbai", tier: "Tier-1", avgRent: 18000, avgFood: 6000, transport: 3000 },
  { name: "Bangalore", tier: "Tier-1", avgRent: 14000, avgFood: 5500, transport: 2500 },
  { name: "Delhi", tier: "Tier-1", avgRent: 12000, avgFood: 5000, transport: 2000 },
  { name: "Pune", tier: "Tier-1", avgRent: 10000, avgFood: 5000, transport: 1500 },
  { name: "Kota", tier: "Tier-2", avgRent: 5000, avgFood: 3500, transport: 1000 },
  { name: "Jaipur", tier: "Tier-2", avgRent: 6500, avgFood: 4000, transport: 1500 },
  { name: "Indore", tier: "Tier-2", avgRent: 5500, avgFood: 3000, transport: 1000 },
  { name: "Remote", tier: "Tier-3", avgRent: 0, avgFood: 0, transport: 0 } // Special Case
];

const seedCities = async () => {
  await connectDB();
  await City.deleteMany();
  await City.insertMany(cities);
  console.log("🏙️ City Economic Data Injected!");
  process.exit();
};

seedCities();