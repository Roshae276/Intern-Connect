import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import { ShieldAlert, Lock, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

const AdminGatekeeper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // Check if we already entered the PIN in this session
  useEffect(() => {
    const adminSession = sessionStorage.getItem("admin_access");
    if (adminSession === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === "1234") { // <--- THE MAGIC PIN
      sessionStorage.setItem("admin_access", "true");
      setIsAuthenticated(true);
    } else {
      setError("⛔ Access Denied: Invalid Government Credentials");
      setPin("");
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Navbar /> {/* Keep Navbar so they can go back */}
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border-t-4 border-red-600">
          
          <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
          <p className="text-gray-500 mb-6 text-sm">
            This portal is for <strong>Government Officials (Ministry)</strong> only. 
            Unauthorized access is monitored.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                placeholder="Enter Security PIN" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
              />
            </div>

            {error && <p className="text-red-600 text-xs font-bold animate-pulse">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition flex items-center justify-center"
            >
              Verify Identity <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">Demo Access PIN: <strong>1234</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminGatekeeper;