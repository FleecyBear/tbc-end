"use client";
import { useState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/contexts/userContext";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useUser(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    await login(formData);

    setUser({ email });

    router.push('/home');
    router.refresh(); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-deepBlue p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-darkPurple dark:text-warmCoral text-center">Login</h2>

        <form onSubmit={handleLogin} className="mt-4" autoComplete="on">
          <div>
            <label className="block text-darkPurple dark:text-white">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-darkPurple dark:text-white">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full mt-6 bg-vibrantPink hover:bg-warmCoral text-white py-2 rounded">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-darkPurple dark:text-white">
          Don't have an account? <Link href="/register" className="text-vibrantPink">Register</Link>
        </p>
      </div>
    </div>
  );
}
