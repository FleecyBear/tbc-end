import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d83F87] to-[#2a1b3c] dark:from-[#44318d] dark:to-[#2a1b3c] flex flex-col items-center justify-center text-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to MarketPlace</h1>
        <p className="text-lg mb-8">A place to buy and sell amazing products. Explore our store and read insightful blogs!</p>

        <div className="flex flex-wrap justify-center space-x-4 space-y-4">
          <Link href="/products">
            <button className="bg-[#e98074] hover:bg-[#a4b3b6] text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300">
              Explore Products
            </button>
          </Link>
          <Link href="/blog">
            <button className="bg-[#44318d] hover:bg-[#2a1b3c] text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300">
              Read Blogs
            </button>
          </Link>
        </div>
      </div>

      <footer className="mt-auto py-4 text-center text-gray-400">
        <p>&copy; 2025 MarketPlace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
