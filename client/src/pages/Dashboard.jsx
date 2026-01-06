import { useEffect, useState } from "react";
import InternshipCard from "../components/InternshipCard";
import SkillGapChart from "../components/SkillGapChart"; 
import Navbar from "../components/Navbar"; 
import { Briefcase, TrendingUp, Search, X, RefreshCw, Zap, Rocket } from 'lucide-react';
import { useNavigate } from "react-router-dom";

// --- EMERGENCY BACKUP DATA (2G Mode) ---
const BACKUP_INTERNSHIPS = [
  { _id: "1", title: "Solar Trainee", company: "Adani Green", location: "Jaipur", stipend: "₹18,000", duration: "6 Months", skillsRequired: ["Solar", "Electrical"], matchScore: 85 },
  { _id: "2", title: "Unpaid React Intern", company: "ScamTech", location: "Mumbai", stipend: "Unpaid", duration: "6 Months", skillsRequired: ["React", "Node"], matchScore: 90 }, // This will trigger Exploitation Flag
  { _id: "3", title: "Data Analyst", company: "NITI Aayog", location: "Delhi", stipend: "₹12,000", duration: "3 Months", skillsRequired: ["Excel", "Python"], matchScore: 60 },
  { _id: "4", title: "Drone Pilot", company: "Garuda Aero", location: "Indore", stipend: "₹25,000", duration: "3 Months", skillsRequired: ["Drone", "IoT"], matchScore: 40 },
];

function Dashboard() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/internships");
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        
        const data = await response.json();
        
        if (data.length === 0) {
          setInternships(BACKUP_INTERNSHIPS);
        } else {
          setInternships(data);
        }
        setLoading(false);
      } catch (error) { 
        console.error("Fetch Failed:", error);
        setErrorMsg(error.message);
        setInternships(BACKUP_INTERNSHIPS);
        setLoading(false); 
      }
    };

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser && savedUser.profile) {
       setUserProfile(savedUser.profile);
    }

    fetchInternships();
  }, []);

  // MATCHING LOGIC (Student Perspective)
  const getScoredInternships = () => {
    if (!internships || !Array.isArray(internships)) return BACKUP_INTERNSHIPS;
    if (internships === BACKUP_INTERNSHIPS) return internships;
    if (!userProfile || !userProfile.skills) return internships;

    const userSkills = userProfile.skills.map(s => s.toLowerCase().trim());
    
    const scored = internships.map(job => {
      if (!job) return null;

      let score = 0;
      const jobSkills = job.skillsRequired ? job.skillsRequired.map(s => s.toLowerCase().trim()) : [];
      
      const matchingSkills = jobSkills.filter(jobSkill => 
        userSkills.some(userSkill => 
          userSkill.includes(jobSkill) || jobSkill.includes(userSkill)
        )
      );
      
      if (matchingSkills.length > 0) score += (matchingSkills.length * 20);
      
      return { ...job, matchScore: score };
    });

    // Sort by Match Score for the Student
    const validScored = scored.filter(job => job !== null);
    return validScored.sort((a, b) => b.matchScore - a.matchScore);
  };

  const scoredInternships = getScoredInternships();
  
  // Filter Logic
  const filterList = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(job => 
      job.title?.toLowerCase().includes(q) || 
      job.location?.toLowerCase().includes(q) || 
      job.company?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2G MODE ALERT */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center animate-pulse">
            <RefreshCw className="w-5 h-5 mr-2" />
            <span className="font-bold">2G / Backup Mode Active:</span> &nbsp; Backend unreachable. Showing locally cached opportunities.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: JOB FEED (3/4 width) */}
          <div className="lg:col-span-3 space-y-8">
            
             {/* WELCOME HERO */}
             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden mb-8">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
                <p className="opacity-90 mb-6 max-w-xl">
                  National Internship Portal: Connecting Talent to Government Priorities.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/internships')} className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-gray-100 transition flex items-center">
                    <Rocket className="w-4 h-4 mr-2" /> Browse Opportunities
                  </button>
                  <button onClick={() => navigate('/profile')} className="bg-indigo-500/30 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-white/10 transition">
                    My Profile
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* SEARCH BAR */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3">
              <Search className="text-gray-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search by Mission, Skill, or Location..."
                className="flex-1 outline-none text-gray-700 dark:text-gray-200 bg-transparent placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {loading ? (
               <div className="text-center py-20">
                 <RefreshCw className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4"/>
                 <p className="text-gray-500 dark:text-gray-400">Loading Internships...</p>
               </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
                  <Briefcase className="mr-2 h-5 w-5 text-indigo-600 dark:text-indigo-400"/>
                  {userProfile ? `Curated Matches for ${userProfile.name ? userProfile.name.split(" ")[0] : "You"}` : "Top Opportunities"}
                </h2>
                
                {/* THE CARDS */}
                <div className="grid gap-4">
                  {filterList(scoredInternships).map((job) => (
                    <InternshipCard key={job._id || job.title} internship={job} />
                  ))}
                </div>

                {filterList(scoredInternships).length === 0 && (
                  <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No matches found.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR */}
          <div className="lg:col-span-1 space-y-6 sticky top-24 self-start max-h-[85vh] overflow-y-auto pr-1 pb-4">
            
            {/* PROFILE STATUS */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Profile Status</h3>
                <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full">Intermediate</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                <div className="bg-indigo-600 h-2.5 rounded-full w-[60%]"></div>
              </div>
              <p className="text-xs text-gray-500 mb-4 text-right">60% Complete</p>
              <button onClick={() => navigate('/profile')} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition">
                Complete Profile
              </button>
            </div>

            {/* SKILL GAP CHART */}
            {userProfile && userProfile.skills && (
              <div className="w-full overflow-hidden">
                  <SkillGapChart userSkills={userProfile.skills} allInternships={internships} />
              </div>
            )}

            {/* MARKET INSIGHT */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow-lg text-white">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 mr-2 text-indigo-200"/>
                <h3 className="font-bold">Market Insight</h3>
              </div>
              <p className="text-sm text-indigo-100 mb-2">Highest paying skill:</p>
              <div className="text-2xl font-extrabold">React Native</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;