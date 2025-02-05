'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/app/utils/themeToggle';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <button className="lg:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✖️' : '☰'}
        </button>

        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold">
            <Link href="/">MarketPlace</Link>
          </div>

          <nav className="hidden lg:flex space-x-8">
            <Link href="/products" className="hover:text-gray-300">Products</Link>
            <Link href="/blog" className="hover:text-gray-300">Blog</Link>
            <ThemeToggle/>
          </nav>
        </div>

        <div className="flex space-x-4">
          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
          <button className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
            <Link href="/login">Login</Link>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden mt-4 space-y-4 text-center">
          <Link href="/products" className="block py-2 text-lg">Products</Link>
          <Link href="/blog" className="block py-2 text-lg">Blog</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
