import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminGatekeeper from "./pages/AdminGatekeeper";

// --- THE GATEKEEPER COMPONENT ---
// This checks for the token EVERY TIME a user tries to access a page
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    // If no token, kick them to login
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, let them pass
  return children;
};

// --- PUBLIC ROUTE WRAPPER ---
// If I am already logged in, don't let me see the Login page again
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (Login/Signup) */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/signup" element={
        <PublicRoute>
          <Signup />
        </PublicRoute>
      } />
      
      {/* PROTECTED ROUTES (Dashboard/Profile) */}
      {/* We wrap these in <ProtectedRoute> so the check happens LIVE */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* ADMIN ROUTE */}
      <Route path="/admin" element={<AdminGatekeeper />} />

      {/* CATCH ALL - Redirect to Dashboard if logged in, else Login */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;