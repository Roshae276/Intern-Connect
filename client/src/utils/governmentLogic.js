// client/src/utils/governmentLogic.js

// 1. MOCK POLICY DATABASE (The "Law")
// In a real app, this comes from the Admin Policy Engine
export const CURRENT_POLICIES = {
  minStipend: {
    "Tier-1": 12000, // Delhi, Mumbai, etc.
    "Tier-2": 8000,  // Jaipur, Pune
    "Tier-3": 5000   // Remote, others
  },
  maxUnpaidDuration: 2 // Months
};

// 2. EXPLOITATION & LEGAL REASON ENGINE (The "Judge")
export const checkExploitation = (stipend, duration, location) => {
  const cleanStipend = parseInt(String(stipend).replace(/[^0-9]/g, "")) || 0;
  const cleanDuration = parseInt(String(duration)) || 0;
  
  // Determine Tier
  const tier1Cities = ["Mumbai", "Bangalore", "Delhi", "Gurgaon"];
  const tier2Cities = ["Pune", "Hyderabad", "Chennai", "Jaipur"];
  let tier = "Tier-3";
  if (tier1Cities.includes(location)) tier = "Tier-1";
  else if (tier2Cities.includes(location)) tier = "Tier-2";

  const requiredStipend = CURRENT_POLICIES.minStipend[tier];

  // RULE 1: UNPAID LABOR
  if (cleanStipend === 0 && cleanDuration > CURRENT_POLICIES.maxUnpaidDuration) {
    return { 
      isExploitative: true, 
      type: "Labor Violation",
      ruleCode: "#LAB-02",
      explanation: `Unpaid internships cannot exceed ${CURRENT_POLICIES.maxUnpaidDuration} months.`,
      comparison: `Allowed: ${CURRENT_POLICIES.maxUnpaidDuration} Months | Offered: ${cleanDuration} Months`
    };
  }

  // RULE 2: MINIMUM WAGE VIOLATION
  if (cleanStipend > 0 && cleanStipend < requiredStipend) {
    return { 
      isExploitative: true, 
      type: "Minimum Wage Violation",
      ruleCode: `#STIP-03 (${tier})`,
      explanation: `Stipend is below the ${tier} city minimum standard.`,
      comparison: `Required: ₹${requiredStipend} | Offered: ₹${cleanStipend}`
    };
  }

  return { isExploitative: false };
};

// 3. COMPANY CREDIBILITY SCORE (The "Credit Score" for Companies)
export const getCompanyCredibility = (companyName) => {
  // Mock Logic based on name length/random for demo
  if (companyName.includes("Scam") || companyName.includes("Fake")) return { score: 20, grade: "D- (Blacklisted)" };
  if (companyName.includes("Adani") || companyName.includes("NITI")) return { score: 98, grade: "A+ (Govt Verified)" };
  return { score: 75, grade: "B (Standard)" };
};

// 4. MISSION MAPPING (Unchanged)
export const getGovMission = (title, skills) => {
  const text = (title + " " + (skills || []).join(" ")).toLowerCase();
  if (text.includes("solar") || text.includes("green")) return { name: "Green Hydrogen Mission", color: "bg-green-100 text-green-700 border-green-200" };
  if (text.includes("react") || text.includes("node") || text.includes("data") || text.includes("ai")) return { name: "Digital India", color: "bg-blue-100 text-blue-700 border-blue-200" };
  if (text.includes("drone") || text.includes("iot")) return { name: "Make in India", color: "bg-orange-100 text-orange-700 border-orange-200" };
  return { name: "Skill India", color: "bg-gray-100 text-gray-700 border-gray-200" };
};

// 5. IVI SCORE (Unchanged)
export const calculateIVI = (stipend, duration, location) => {
  let score = 0;
  const cleanStipend = parseInt(String(stipend).replace(/[^0-9]/g, "")) || 0;
  if (cleanStipend > 15000) score += 40;
  else if (cleanStipend > 5000) score += 20;
  else if (cleanStipend > 0) score += 10;
  if (["Jaipur", "Kota", "Indore"].some(l => location.includes(l))) score += 30;
  score += 30; // Base skill score
  return Math.min(score, 100);
};