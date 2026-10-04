import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';

/**
 * ScrollToTop Handler
 * Ensures that the viewport instantly resets to top (0, 0) upon any client-side route navigation.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#18181B] selection:bg-[#E8590C] selection:text-white font-sans">
      {/* Accessible Skip-to-Content link for keyboard / screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#18181B] focus:text-[#FBF9F5] focus:rounded-[3px] focus:ring-2 focus:ring-[#E8590C] focus:shadow-paper font-semibold text-xs font-sans transition-all"
      >
        Skip to main content
      </a>

      {/* Global Scroll-to-Top trigger */}
      <ScrollToTop />

      {/* Finished Global Header */}
      <Header />

      {/* Main Landmark Focus Target */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>

      {/* Finished Global Footer */}
      <Footer />
    </div>
  );
};
