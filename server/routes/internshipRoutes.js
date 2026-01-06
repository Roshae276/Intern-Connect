import express from 'express';
import Internship from '../models/Internship.js';
import City from '../models/City.js'; 

const router = express.Router();

// GET ALL INTERNSHIPS (With Crash Protection)
router.get('/', async (req, res) => {
  try {
    // 1. Fetch Internships (Newest First)
    const internships = await Internship.find().sort({ createdAt: -1 });

    // 2. Fetch City Data (Wrap in try-catch so it doesn't block internships)
    let cityMap = {};
    try {
      const cities = await City.find();
      cities.forEach(c => cityMap[c.name.toLowerCase()] = c);
    } catch (err) {
      console.warn("⚠️ Warning: Could not fetch cities. Using defaults.");
    }

    // 3. SAFETY FALLBACK (If City DB is empty, use these Kota-based defaults)
    const defaultCost = { avgRent: 5000, avgFood: 3000, transport: 1000 };

    // 4. INTELLIGENT TRANSFORMATION
    const enrichedInternships = internships.map(job => {
      // Safety Check: Ensure location exists
      const loc = job.location ? job.location.toLowerCase() : "remote";
      
      // Resolve City Data (Specific -> Kota -> Hardcoded Default)
      let jobCity = cityMap[loc] || cityMap['kota'] || defaultCost;

      // Special Case: Remote Jobs (Assume 0 Rent if working from home)
      if (loc.includes('remote')) {
        jobCity = { avgRent: 0, avgFood: 3000, transport: 0 };
      }
      
      // Clean Stipend (Handle "₹15,000" or number 15000)
      let stipendVal = 0;
      if (job.stipend) {
        stipendVal = parseInt(job.stipend.toString().replace(/[^\d]/g, '')) || 0;
      }
      
      // Calculate Expenses
      const totalCost = (jobCity.avgRent || 0) + (jobCity.avgFood || 0) + (jobCity.transport || 0);
      const savings = stipendVal - totalCost;
      
      // Determine Financial Health Badge
      let financialBadge = "Stable";
      if (loc.includes('remote')) financialBadge = "Excellent Savings 🤑";
      else if (savings < -2000) financialBadge = "Critical Risk 🚨"; 
      else if (savings < 0) financialBadge = "Deficit ⚠️"; 
      else if (savings < 3000) financialBadge = "Survival Mode 😐"; 
      else financialBadge = "Comfortable ✅";

      return {
        ...job.toObject(),
        economics: {
          estRent: jobCity.avgRent || 0,
          estTotalCost: totalCost,
          savings: savings,
          status: financialBadge
        }
      };
    });

    res.json(enrichedInternships);

  } catch (error) {
    console.error("❌ SERVER ERROR:", error.message);
    // CRITICAL FIX: Don't send 500. Send empty array so Frontend loads Backup Data.
    res.status(200).json([]); 
  }
});

// POST: Government adds a new internship
router.post('/add', async (req, res) => {
  try {
    const { title, company, location, stipend, duration, skillsRequired, category } = req.body;

    // Basic Validation
    if (!title || !company || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newInternship = new Internship({
      title,
      company,
      location,
      stipend, 
      duration,
      skillsRequired, 
      category: category || "General"
    });

    const savedInternship = await newInternship.save();
    res.status(201).json(savedInternship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;