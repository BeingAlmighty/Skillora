import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const SignUp1 = () => {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreeToTerms, setAgreeToTerms] = React.useState(true);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
 
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
 
  const handleSignUp = async (e) => {
    if (e) e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`;
      await register(email, password, fullName);
      navigate("/vector", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full">
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-18 h-18 rounded-full bg-white/20 mb-6 shadow-lg">
          <img className="object-cover w-15 h-15 rounded-full" src="https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg" alt="Logo" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create Your Account
        </h2>
        <form onSubmit={handleSignUp} className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <div className="flex gap-3">
              <input
                placeholder="First Name"
                type="text"
                value={firstName}
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                placeholder="Last Name"
                type="text"
                value={lastName}
                className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <input
              placeholder="Email Address"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password (min 6 characters)"
              type="password"
              value={password}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-white/80"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="underline text-white/80 hover:text-white">
                  Terms & Conditions
                </a>
              </span>
            </label>

            {error && (
              <div className="text-sm text-red-400 text-left bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">{error}</div>
            )}
          </div>
          <hr className="opacity-10" />
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/10 text-white font-medium px-5 py-3 rounded-full shadow hover:bg-white/20 transition mb-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                Already have an account?{" "}
                <Link to="/signin" className="underline text-white/80 hover:text-white">
                  Sign in here
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { SignUp1 };