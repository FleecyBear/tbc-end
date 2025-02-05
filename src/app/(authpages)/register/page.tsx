"use client";
import { useState } from "react";
import Link from "next/link";
import { signup } from "../login/actions";
import { FcHighPriority } from "react-icons/fc";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setPasswordError(null);
    setPasswordMatchError(null);

    if (password !== confirmPassword) {
      setPasswordMatchError("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      await signup(formData);
      alert("Account created successfully!");
    } catch (error) {
      alert("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#a4b3b6] dark:bg-[#2a1b3c] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#44318D] p-6 rounded-lg shadow-lg relative">
        <h2 className="text-2xl font-bold text-[#2a1b3c] dark:text-[#E98074] text-center">Register</h2>

        <form onSubmit={handleSignup} className="mt-4">
          <div className="relative">
            <label className="block text-[#2a1b3c] dark:text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#d83F87] text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative mt-4">
            <label className="block text-[#2a1b3c] dark:text-white">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#d83F87] text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="relative mt-4">
            <label className="block text-[#2a1b3c] dark:text-white">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#d83F87] text-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 text-xl">
                  <span title="Passwords do not match">
                    <FcHighPriority />
                  </span>
                </div>
              )}
            </div>
            {passwordMatchError && <p className="text-red-600 text-sm mt-1">{passwordMatchError}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full mt-6 bg-[#D83F87] hover:bg-[#E98074] text-white py-2 rounded flex justify-center"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-[#2a1b3c] dark:text-white">
          Already have an account? <Link href="/login" className="text-[#D83F87]">Login</Link>
        </p>
      </div>
    </div>
  );
}
