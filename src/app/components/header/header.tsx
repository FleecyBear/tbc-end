'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/app/utils/themeToggle';
import { logoutUser } from '@/app/utils/logout';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/userContext';
import { SiCoinmarketcap } from "react-icons/si";
import { MdMenuOpen } from "react-icons/md";
import { RiCloseLargeFill } from "react-icons/ri";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser(router);
    setUser(null);
    router.push('/login');
  };

  const closeMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((e.target as Element).id === 'menu-overlay') {
      setMenuOpen(false);
    }
  };

  return (
    <header className="bg-gradient-to-r from-[#e98074] to-[#a4b3b6] 
      dark:from-[#2a1b3c] dark:to-[#44318d] text-black dark:text-white p-4 fixed top-0 left-0 right-0 z-50">
      
      <div className="hidden lg:flex justify-between  mx-40">
        <div className="flex gap-10">
          <Link href="/blog" className="hover:text-gray-300">Blog</Link>
          <Link href="/products" className="hover:text-gray-300">Products</Link>
        </div>

        <Link href="/home" className="text-3xl flex absolute left-1/2">
          <SiCoinmarketcap />
        </Link>

        <div className="flex gap-10" >
          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
          {user ? (
            <button
              className="bg-[#44318d] dark:bg-[#e98074] px-4 py-2 rounded hover:bg-[#e98074] dark:hover:bg-[#44318d]"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-[#44318d] dark:bg-[#e98074] px-4 py-2 rounded hover:bg-[#e98074] dark:hover:bg-[#44318d]">
                Login
              </button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Small Screen Navigation */}
      <div className="lg:hidden flex justify-between items-center w-full">
        <Link href="/home" className="text-3xl flex items-center ml-4">
          <SiCoinmarketcap />
        </Link>

        <button className="text-3xl mr-4" onClick={() => setMenuOpen(true)}>
          <MdMenuOpen />
        </button>
      </div>

      {/* Mobile Slide-in Menu  */}
      {menuOpen && (
        <div
          id="menu-overlay"
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
          onClick={closeMenu}
        >
          <div className="fixed top-0 right-0 w-[30%] h-full bg-[#E98074] dark:bg-[#44318d]  p-6 flex flex-col z-50 shadow-lg">
            <button
              className="absolute top-4 right-4 text-3xl"
              onClick={() => setMenuOpen(false)}
            >
              <RiCloseLargeFill />
            </button>

            <nav className="mt-10 flex flex-col space-y-6 text-lg items-end text-right">
              <Link href="/blog" className="block py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Link href="/products" className="block py-2" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link href="/cart" className="block py-2" onClick={() => setMenuOpen(false)}>Cart</Link>
              <Link href="/profile" className="block py-2" onClick={() => setMenuOpen(false)}>Profile</Link>

              {user ? (
                <button
                  className="bg-white text-[#44318d] px-4 py-2 rounded hover:bg-gray-200 mt-10"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login">
                  <button className="bg-white text-[#44318d] px-4 py-2 rounded hover:bg-gray-200">
                    Login
                  </button>
                </Link>
              )}

              <ThemeToggle />
          </nav>

          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
