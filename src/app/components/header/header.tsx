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
import LanguageSwitcher from '../LanguageSwitcher';
import {useTranslations} from 'next-intl';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const t = useTranslations();

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
    <header className="bg-gradient-to-r from-warmCoral to-mutedGrayBlue 
      dark:from-darkPurple dark:to-deepBlue text-black dark:text-white p-4 fixed top-0 left-0 right-0 z-50">
      
      <div className="hidden lg:flex justify-between  mx-40">
        <div className="flex gap-10">
          <Link href="/blogs" className="hover:text-gray-300">{t('blogs')}</Link>
          <Link href="/products" className="hover:text-gray-300">{t('products')}</Link>
        </div>

        <Link href="/home" className="text-3xl flex absolute left-1/2">
          <SiCoinmarketcap />
        </Link>

        <div className="flex gap-10" >
          <Link href="/cart" className="hover:text-gray-300">Cart</Link>
          <Link href="/profile" className="hover:text-gray-300">Profile</Link>
          {user ? (
            <button
              className="bg-deepBlue dark:bg-warmCoral px-4 py-2 rounded hover:bg-warmCoral dark:hover:bg-deepBlue"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-deepBlue dark:bg-warmCoral px-4 py-2 rounded hover:bg-warmCoral dark:hover:bg-deepBlue">
                Login
              </button>
            </Link>
          )}
          <ThemeToggle />
          <LanguageSwitcher />
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
          <div className="fixed top-0 right-0 w-auto h-full bg-warmCoral dark:bg-deepBlue  p-6 flex flex-col z-50 shadow-lg">
            <button
              className="absolute top-4 right-4 text-3xl"
              onClick={() => setMenuOpen(false)}
            >
              <RiCloseLargeFill />
            </button>

            <nav className="mt-10 flex flex-col space-y-6 text-lg items-end text-right">
              <Link href="/blogs" className="block py-2" onClick={() => setMenuOpen(false)}>{t('blogs')}</Link>
              <Link href="/products" className="block py-2" onClick={() => setMenuOpen(false)}>{t('products')}</Link>
              <Link href="/cart" className="block py-2" onClick={() => setMenuOpen(false)}>Cart</Link>
              <Link href="/profile" className="block py-2" onClick={() => setMenuOpen(false)}>Profile</Link>

              {user ? (
                <button
                  className="bg-white text-deepBlue px-4 py-2 rounded hover:bg-gray-200 mt-10"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login">
                  <button className="bg-white text-deepBlue px-4 py-2 rounded hover:bg-gray-200">
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
