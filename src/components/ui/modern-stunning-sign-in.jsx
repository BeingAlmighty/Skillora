import * as React from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const SignIn1 = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
 
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
 
  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const destination = location.state?.from?.pathname || "/vector";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] relative overflow-hidden w-full">
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-sm shadow-2xl p-8 flex flex-col items-center">
        <div className="flex items-center justify-center w-18 h-18 rounded-full bg-white/20 mb-6 shadow-lg">
          <img className="object-cover w-15 h-15 rounded-full" src="https://marketplace.canva.com/8-1Kc/MAGoQJ8-1Kc/1/tl/canva-ginger-cat-with-paws-raised-in-air-MAGoQJ8-1Kc.jpg" alt="Logo" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Skillora Career Navigator
        </h2>
        <form onSubmit={handleSignIn} className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full px-5 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <div className="w-full text-center mt-2">
              <span className="text-xs text-gray-400">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline text-white/80 hover:text-white">
                  Sign up, it&apos;s free!
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { SignIn1 };