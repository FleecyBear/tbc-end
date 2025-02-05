import React from 'react';
import Header from '@/app/components/header/header';
import Footer from '@/app/components/footer/footer';
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow p-8">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
