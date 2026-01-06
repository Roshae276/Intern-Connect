import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, UserCircle, LogOut, Signal, Zap, Moon, Sun, User, ChevronDown, Landmark, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import GoogleTranslate from './GoogleTranslate'; 

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // CHECK IF WE ARE IN ADMIN MODE
  const isAdminMode = location.pathname.startsWith('/admin');

  const [liteMode, setLiteMode] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dark Mode Logic
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    if (isAdminMode) {
        // If Admin logs out
        sessionStorage.removeItem("admin_access");
        navigate("/dashboard"); 
        alert("Logged out of Ministry Portal.");
    } else {
        // If Student logs out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
  };

  const toggleLiteMode = () => {
    setLiteMode(!liteMode);
    alert(liteMode ? "📶 Standard Mode Restored." : "⚡ Bharat Lite Mode Activated: Optimized for 2G Networks.");
  };

  // DYNAMIC USER DATA
  const studentUser = JSON.parse(localStorage.getItem("user"));
  
  // Decide what to show based on the Page URL
  const displayName = isAdminMode ? "Nodal Officer" : (studentUser?.name || "Student");
  const displayRole = isAdminMode ? "Ministry of Labour" : "Signed in as";
  const AvatarIcon = isAdminMode ? Landmark : UserCircle;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* --- BRANDING SECTION (UPDATED) --- */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate(isAdminMode ? '/admin' : '/dashboard')}
          >
            {/* Shield Logo */}
            <div className={`p-2 rounded-lg shadow-sm transition ${isAdminMode ? 'bg-indigo-900' : 'bg-indigo-700 group-hover:bg-indigo-800'} text-white`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            
            {/* Text Logo */}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                InternConnect
              </span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:block">
                Ministry of Skill Dev | Govt of India
              </span>
            </div>

            {/* Admin Badge */}
            {isAdminMode && (
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
                    OFFICIAL
                </span>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-3 md:space-x-5">
            
            {/* Dark Mode */}
            <button onClick={toggleDark} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 transition">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Lite Mode (2G) */}
            <button onClick={toggleLiteMode} className={`hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-bold border ${liteMode ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
              {liteMode ? <Signal className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
              {liteMode ? "2G Lite" : "Standard"}
            </button>

            {/* Google Translate */}
            <div className="hidden sm:flex items-center"> 
               <GoogleTranslate />
            </div>

            {/* DYNAMIC PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
               <button 
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition focus:outline-none"
               >
                 <AvatarIcon className={`h-8 w-8 ${isAdminMode ? 'text-indigo-700 dark:text-indigo-400' : ''}`} />
                 <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
               </button>
               
               {isDropdownOpen && (
                 <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                   
                   {/* Header: Changes based on Role */}
                   <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">{displayRole}</p>
                      <p className={`text-sm font-bold truncate ${isAdminMode ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                        {displayName}
                      </p>
                   </div>
                   
                   {/* Student Only Links */}
                   {!isAdminMode && (
                       <button 
                          onClick={() => { setIsDropdownOpen(false); navigate('/profile'); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
                       >
                         <User className="h-4 w-4 mr-2" /> My Profile
                       </button>
                   )}

                   {/* Logout Logic */}
                   <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center"
                   >
                     <LogOut className="h-4 w-4 mr-2" /> {isAdminMode ? "Exit Portal" : "Sign Out"}
                   </button>
                 </div>
               )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;