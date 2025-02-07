import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center text-white">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to MarketPlace</h1>
        <p className="text-lg mb-8">A place to buy and sell amazing products. Explore our store and read insightful blogs!</p>

        <div className="flex flex-wrap justify-center space-x-4 space-y-4">
          <Link href="/products">
            <button className="bg-warmCoral hover:bg-mutedGrayBlue text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300">
              Explore Products
            </button>
          </Link>
          <Link href="/blog">
            <button className="bg-deepBlue hover:bg-darkPurple text-white px-6 py-3 rounded-lg shadow-lg transition-colors duration-300">
              Read Blogs
            </button>
          </Link>
        </div>
      </div>

      <footer className="mt-auto py-4 text-center text-gray-400">
      </footer>
    </div>
  );
};

export default HomePage;
