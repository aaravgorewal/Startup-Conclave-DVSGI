/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SinglePage } from './components/single-page/SinglePage.tsx';

// Hidden /admin route placeholder reserved for administrative management
const AdminPlaceholder: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] p-6 sm:p-12 font-sans flex items-center justify-center">
      <div className="max-w-lg w-full p-8 bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] text-left space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-black uppercase tracking-wider bg-[#FFD400] text-[#111111] px-2 py-0.5 border border-[#111111]">
            ADMIN PORTAL
          </span>
          <span className="font-mono text-xs text-[#FF6B1A] font-bold">
            /admin
          </span>
        </div>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111111]">
          Secretariat Administration
        </h1>

        <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
          The administrative console for viewing registrant expressions of interest, reviewing Pitch Arena deck submissions, and managing partner inquiries.
        </p>

        <div className="p-3 bg-[#FFF8EC] border-2 border-[#111111] font-mono text-xs space-y-1">
          <div><strong>Status:</strong> Active Secretarial Holding</div>
          <div><strong>Event:</strong> Startup Conclave 1.0 (DVSIET Meerut)</div>
        </div>

        <div className="pt-2">
          <a
            href="/"
            className="inline-block px-4 py-2 bg-[#111111] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FF6B1A] transition-colors"
          >
            ← Return to Conclave Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Hidden /admin route check
  if (currentPath.startsWith('/admin')) {
    return <AdminPlaceholder />;
  }

  // Single-Page Scrolling Website with section anchors
  return <SinglePage />;
}
