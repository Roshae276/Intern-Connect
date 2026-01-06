import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import GoogleTranslate from "../components/GoogleTranslate";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

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
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        alert("Registration Successful! Please Login.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Is the backend running?");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors duration-300">
      
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

      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;