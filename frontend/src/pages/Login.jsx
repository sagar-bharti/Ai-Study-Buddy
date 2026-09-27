import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-soft px-4 overflow-hidden">
      <div className="blob w-72 h-72 bg-primary-300 top-[-4rem] left-[-4rem]" />
      <div className="blob w-72 h-72 bg-accent-pink top-1/3 right-[-5rem]" style={{ animationDelay: "2s" }} />
      <div className="blob w-72 h-72 bg-accent-purple bottom-[-4rem] left-1/3" style={{ animationDelay: "4s" }} />

      <div className="relative w-full max-w-md card shadow-xl shadow-primary-500/10 animate-fade-up">
        <div className="flex items-center gap-2 mb-1 animate-float">
          <span className="text-3xl">📚</span>
          <h1 className="text-2xl font-extrabold text-gradient">AI Study Buddy</h1>
        </div>
        <p className="text-gray-500 mb-6">Log in to continue learning</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;