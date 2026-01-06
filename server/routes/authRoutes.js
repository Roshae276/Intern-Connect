import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 1. REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profile: {
        skills: [], // Initialize empty skills
        role: "Student"
      }
    });

    const savedUser = await newUser.save();
    
    // Create Token immediately so they are logged in
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    res.status(201).json({ token, user: { id: savedUser._id, name: savedUser.name, email: savedUser.email, profile: savedUser.profile } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN (THE FIX)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found. Please Sign Up." });

    // B. Compare Password (Bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials. Wrong password." });

    // C. Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    // D. Send Success
    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        profile: user.profile || {} // Ensure profile exists
      } 
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error during Login." });
  }
});

// 3. UPDATE USER PROFILE (The Missing Link)
router.put("/profile", async (req, res) => {
  try {
    const { userId, profile } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Find user and update their profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          "name": profile.name, // Update name at root level
          "profile": profile    // Update the profile object
        } 
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile
      }
    });

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;