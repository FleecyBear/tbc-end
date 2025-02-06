'use client'
import React, { useState } from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer className="bg-transparent text-white py-8 mt-12">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm">
          <p>&copy; 2025 MarketPlace. All rights reserved.</p>
        </div>

        <div className="hidden lg:flex space-x-6">
          <Link href="/terms-of-service" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy Policy</Link>
        </div>

        <div className="hidden lg:flex space-x-4">
          <Link href="https://twitter.com" target="_blank" className="hover:text-gray-300">Twitter</Link>
          <Link href="https://facebook.com" target="_blank" className="hover:text-gray-300">Facebook</Link>
        </div>

        <button
          className="lg:hidden text-xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✖️' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden mt-4 text-center space-y-4">
          <Link href="/terms-of-service" className="block py-2 text-lg">Terms of Service</Link>
          <Link href="/contact" className="block py-2 text-lg">Contact</Link>
          <Link href="/privacy-policy" className="block py-2 text-lg">Privacy Policy</Link>
          <Link href="https://twitter.com" target="_blank" className="block py-2 text-lg">Twitter</Link>
          <Link href="https://facebook.com" target="_blank" className="block py-2 text-lg">Facebook</Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
