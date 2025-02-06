"use client";
import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    await login(formData);
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center  p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#44318D] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#2a1b3c] dark:text-[#E98074] text-center">Login</h2>

        <form onSubmit={handleLogin} className="mt-4">
          <div>
            <label className="block text-[#2a1b3c] dark:text-black">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#d83F87] text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-[#2a1b3c] dark:text-black">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-[#d83F87] text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full mt-6 bg-[#D83F87] hover:bg-[#E98074] text-white py-2 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-[#2a1b3c] dark:text-white">
          Don't have an account? <Link href="/register" className="text-[#D83F87]">Register</Link>
        </p>
      </div>
    </div>
  );
};
