import Landing from "./components/pages/Landing"
import Zenith from "./components/pages/Zenith"
import Profile from "./components/pages/Profile"
import JobWishlist from "./components/pages/JobWishlist"
import Skills from "./components/pages/Skills"
import Vector from "./components/pages/Vector"
import ResumeAnalysis from "./components/pages/ResumeAnalysis"
import { Route, Routes, Navigate } from "react-router-dom"
import { SignIn1 } from "./components/ui/modern-stunning-sign-in"
import { SignUp1 } from "./components/ui/modern-stunning-sign-up"
import ProtectedRoute from "./components/common/ProtectedRoute"

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<SignIn1 />} />
      <Route path="/signin" element={<SignIn1 />} />
      <Route path="/signup" element={<SignUp1 />} />

      {/* Protected Routes */}
      <Route path="/vector" element={<ProtectedRoute><Vector /></ProtectedRoute>} />
      <Route path="/zenith" element={<ProtectedRoute><Zenith /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/wishlist" element={<ProtectedRoute><JobWishlist /></ProtectedRoute>} />
      <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><ResumeAnalysis /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
