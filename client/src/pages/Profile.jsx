import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { 
  User, MessageCircle, MapPin, UploadCloud, Save, Linkedin, 
  Github, FileText, Camera, ArrowLeft, Trash2, X, CheckCircle
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  
  // 1. INITIAL STATE
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp: "",
    location: "",
    linkedin: "",
    github: "",
    skills: [], 
    bio: "",
    resumeName: "", 
    resumeFile: "", 
    avatar: ""      
  });
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const photoInputRef = useRef(null);

  // 2. LOAD DATA
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("user");
      if (savedData) {
        const parsedUser = JSON.parse(savedData);
        const profileData = parsedUser.profile || {};
        
        setUser({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          mobile: profileData.mobile || "",
          whatsapp: profileData.whatsapp || "",
          location: profileData.location || "",
          linkedin: profileData.linkedin || "",
          github: profileData.github || "",
          skills: Array.isArray(profileData.skills) ? profileData.skills : [],
          bio: profileData.bio || "",
          resumeName: profileData.resumeName || "",
          resumeFile: profileData.resumeFile || "",
          avatar: profileData.avatar || ""
        });
      }
    } catch (e) {
      console.error("Data Corruption Detected:", e);
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // --- SAVE TO DB ---
  const saveToDatabase = async (updatedState) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      
      const currentUser = JSON.parse(storedUser);
      if (!currentUser.id) return;

      const payload = {
        userId: currentUser.id,
        profile: {
          ...updatedState,
          skills: Array.isArray(updatedState.skills) ? updatedState.skills : [] 
        }
      };

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Save Failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("✅ Auto-Saved to DB");
      return true;

    } catch (e) {
      console.error("Auto-Save Error:", e);
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await saveToDatabase(user);
    setLoading(false);
    alert("✅ Profile Details Saved!");
  };

  // --- PHOTO UPLOAD ---
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      const newUserState = { ...user, avatar: data.url };
      setUser(newUserState);
      await saveToDatabase(newUserState);
      
      alert("✅ Photo Updated!");
    } catch (err) {
      alert("❌ Photo upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // --- RESUME UPLOAD (Only for Analysis now) ---
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    
    try {
      // 1. Upload to store file (Still needed for internal reference)
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadRes = await fetch("http://localhost:5000/api/upload", { method: "POST", body: uploadFormData });
      const uploadData = await uploadRes.json();
      const cloudUrl = uploadData.url;

      // 2. Analyze for Skills
      let extractedSkills = [];
      try {
          const analyzeFormData = new FormData();
          analyzeFormData.append("resume", file);
          const analyzeRes = await fetch("http://localhost:5000/api/resume/analyze", { method: "POST", body: analyzeFormData });
          if (analyzeRes.ok) {
              const analyzeData = await analyzeRes.json();
              if (Array.isArray(analyzeData.skills)) {
                  extractedSkills = analyzeData.skills;
              }
          }
      } catch (aiError) {
          console.warn("AI Analysis skipped:", aiError);
      }
      
      // 3. Update State
      const currentSkills = Array.isArray(user.skills) ? user.skills : [];
      const newSkills = Array.from(new Set([...currentSkills, ...extractedSkills]));
      
      const newUserState = { 
        ...user, 
        skills: newSkills,
        resumeName: file.name,
        resumeFile: cloudUrl 
      };
      
      setUser(newUserState);
      await saveToDatabase(newUserState);

      alert(`✅ Resume Processed! ${extractedSkills.length > 0 ? `Extracted ${extractedSkills.length} skills.` : "Saved successfully."}`);

    } catch (error) {
      console.error(error);
      alert("❌ Upload Error: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // --- REMOVE RESUME ---
  const handleRemoveResume = async () => {
    if(!window.confirm("Remove this resume? Skills will remain.")) return;

    const newUserState = { 
        ...user, 
        resumeName: "", 
        resumeFile: "" 
    };

    setUser(newUserState);
    await saveToDatabase(newUserState);
  };

  const removeSkill = (skillToRemove) => {
    const currentSkills = Array.isArray(user.skills) ? user.skills : [];
    setUser({ ...user, skills: currentSkills.filter(s => s !== skillToRemove) });
  };

  const addSkill = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const newSkill = e.target.value.trim();
      const currentSkills = Array.isArray(user.skills) ? user.skills : [];
      if (newSkill && !currentSkills.includes(newSkill)) {
        setUser({ ...user, skills: [...currentSkills, newSkill] });
      }
      e.target.value = "";
    }
  };

  const handleFactoryReset = () => {
      if(window.confirm("This will clear local storage glitches. You might need to login again. Proceed?")) {
          localStorage.clear();
          window.location.href = "/login";
      }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300 relative">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm group"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Professional Profile</h1>
              <p className="text-gray-500 dark:text-gray-400">Manage your identity and career documents</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleFactoryReset} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Reset Glitches">
                <Trash2 className="w-5 h-5" />
            </button>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
            >
                <Save className="w-4 h-4 mr-2" /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: AVATAR & INFO */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800 text-center relative group">
              <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
              <div onClick={() => photoInputRef.current.click()} className="relative h-28 w-28 mx-auto mb-4 rounded-full cursor-pointer overflow-hidden border-4 border-white dark:border-gray-800 shadow-sm bg-gray-100">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl font-bold">
                    {(user.name && user.name[0]) ? user.name[0] : "U"}
                  </div>
                )}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  {uploading ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div> : <Camera className="text-white w-8 h-8" />}
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name || "User Name"}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
              
              <div className="flex justify-center gap-3">
                 <div className="relative group/icon">
                   <button className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 hover:bg-blue-100 transition"><Linkedin className="w-5 h-5"/></button>
                 </div>
                 <div className="relative group/icon">
                   <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-white hover:bg-gray-200 transition"><Github className="w-5 h-5"/></button>
                 </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-2">Contact Details</h3>
              <div><label className="text-xs font-bold text-gray-500 uppercase">Full Name</label><div className="flex items-center mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3"><User className="w-4 h-4 text-gray-400" /><input name="name" value={user.name} onChange={handleChange} className="w-full bg-transparent p-2 outline-none text-sm dark:text-white" /></div></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label><div className="flex items-center mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3"><MessageCircle className="w-4 h-4 text-green-500" /><input name="whatsapp" value={user.whatsapp} onChange={handleChange} className="w-full bg-transparent p-2 outline-none text-sm dark:text-white" /></div></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase">Location</label><div className="flex items-center mt-1 bg-gray-50 dark:bg-gray-800 rounded-lg px-3"><MapPin className="w-4 h-4 text-gray-400" /><input name="location" value={user.location} onChange={handleChange} className="w-full bg-transparent p-2 outline-none text-sm dark:text-white" /></div></div>
            </div>
          </div>

          {/* RIGHT: RESUME & SKILLS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* RESUME SECTION (VIEW REMOVED) */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-800">
               <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                 <FileText className="w-5 h-5 mr-2 text-indigo-600"/> Resume & AI Analysis
               </h3>

               {user.resumeFile ? (
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-lg">
                      <div className="flex items-center overflow-hidden">
                        <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-sm text-green-600 mr-3 flex-shrink-0"><CheckCircle className="w-6 h-6" /></div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[150px] sm:max-w-xs">{user.resumeName || "Resume.pdf"}</p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-0.5">Uploaded & Analyzed</p>
                        </div>
                      </div>
                      
                      {/* ONLY DELETE BUTTON REMAINS */}
                      <button 
                          onClick={handleRemoveResume}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Remove Resume"
                      >
                          <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="text-center">
                       <label className="text-xs text-indigo-500 font-bold cursor-pointer hover:underline">
                         <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                         Replace Resume
                       </label>
                    </div>
                 </div>
               ) : (
                 <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition relative">
                   <input type="file" accept=".pdf" onChange={handleResumeUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                   <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                     {analyzing ? "Scanning Document..." : "Drop Resume to Extract Skills"}
                   </p>
                   <p className="text-xs text-gray-500 mt-1">AI will extract skills automatically</p>
                 </div>
               )}
            </div>

            {/* SKILLS */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800">
               <h3 className="font-bold text-gray-800 dark:text-white mb-4">Professional Skills</h3>
               <div className="flex flex-wrap gap-2 mb-4">
                 {(Array.isArray(user.skills) ? user.skills : []).map((skill, index) => (
                   <span key={index} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium flex items-center border border-gray-200 dark:border-gray-700">
                     {skill}
                     <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500"><X className="w-3 h-3"/></button>
                   </span>
                 ))}
               </div>
               <input type="text" placeholder="Type a skill and press Enter..." onKeyDown={addSkill} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"/>
            </div>

            {/* BIO */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800">
               <h3 className="font-bold text-gray-800 dark:text-white mb-2">About Me</h3>
               <textarea name="bio" value={user.bio} onChange={handleChange} rows="4" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" placeholder="Write a short professional summary..."></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;