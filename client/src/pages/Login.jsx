import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Landmark, User, ArrowRight, AlertCircle, Sun, Moon, ShieldCheck, Loader2 } from "lucide-react"; 
import GoogleTranslate from "../components/GoogleTranslate";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student"); 
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // --- NEW STATE FOR SSO SIMULATION ---
  const [govLoading, setGovLoading] = useState(false);

  // --- DARK MODE STATE ---
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard", { replace: true });
      
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PROFESSIONAL SSO SIMULATION ---
  const handleGovLogin = () => {
    // 1. Trigger Loading State (Simulating Redirect)
    setGovLoading(true);
    
    // 2. Simulate NIC Handshake Delay (1.5 Seconds)
    setTimeout(() => {
      // 3. Authenticate & Redirect
      sessionStorage.setItem("admin_access", "true"); 
      navigate("/admin");
    }, 1500);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 font-sans px-4 transition-colors duration-300">
      
      {/* --- HEADER CONTROLS --- */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
        <div className="scale-90 origin-right">
             <GoogleTranslate />
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-md hover:scale-105 transition border border-gray-200 dark:border-gray-700"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300 relative overflow-hidden">
        
        {/* --- SSO SIMULATION OVERLAY --- */}
        {govLoading && (
           <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
              <ShieldCheck className="w-16 h-16 text-indigo-600 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verifying Credentials...</h3>
              <p className="text-sm text-gray-500 mb-6">Connecting to National Informatics Centre (NIC) Secure Gateway</p>
              
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs text-gray-400 mt-8 font-mono">ENCRYPTED CONNECTION ESTABLISHED</p>
           </div>
        )}

        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Access the National Internship Oversight Portal</p>

        {/* ROLE TOGGLE */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <button 
            onClick={() => { setRole("student"); setError(""); }}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-md transition-all ${role === "student" ? "bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            <User className="w-4 h-4 mr-2" /> Student
          </button>
          <button 
            onClick={() => { setRole("gov"); setError(""); }}
            className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-md transition-all ${role === "gov" ? "bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
          >
            <Landmark className="w-4 h-4 mr-2" /> Government
          </button>
        </div>

        {/* ERROR BOX */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center animate-pulse">
            <AlertCircle className="w-4 h-4 mr-2" /> {error}
          </div>
        )}

        {/* LOGIC SPLIT */}
        {role === "student" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                placeholder="student@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-bold transition flex justify-center items-center shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : "Login to Dashboard"}
            </button>
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
              New here? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Create Account</Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 p-4 rounded-lg text-sm mb-4 border border-indigo-100 dark:border-indigo-800 text-left">
              <strong>🔐 Secure Access Only</strong>
              <p className="mt-1 text-xs opacity-80">This portal uses <strong>National Single Sign-On (SSO)</strong>. Please proceed to authenticate via your official NIC credentials.</p>
            </div>
            <button 
              onClick={handleGovLogin}
              className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-3 rounded-lg font-bold transition flex justify-center items-center shadow-md hover:shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Authenticate with NIC SSO
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;