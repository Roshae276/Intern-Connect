import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true }, // e.g., "Mumbai" or "Remote"
  stipend: { type: String, required: true },  // e.g., "₹10,000/month"
  duration: { type: String, required: true }, // e.g., "3 Months"
  
  // This is crucial for AI Matching
  skillsRequired: [{ type: String }], // e.g., ["React", "Node", "Figma"]
  
  // To categorize quickly
  category: { 
    type: String, 
    enum: ['Tech', 'Non-Tech', 'Marketing', 'Finance'], 
    default: 'Tech' 
  },

  createdAt: { type: Date, default: Date.now },
});

const Internship = mongoose.model("Internship", internshipSchema);
export default Internship;