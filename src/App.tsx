/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SinglePage } from './components/single-page/SinglePage.tsx';

const AdminPage = lazy(() => import('./pages/AdminPage.tsx'));
const ScanPage = lazy(() => import('./pages/ScanPage.tsx'));

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Hidden /admin route check (not linked anywhere on the public site, with noindex)
  if (currentPath.startsWith('/admin')) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4">
            <div className="p-4 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] font-mono text-xs font-bold text-[#111111]">
              Loading Admin Console...
            </div>
          </div>
        }
      >
        <AdminPage />
      </Suspense>
    );
  }

  // Volunteer scanner route (/scan)
  if (currentPath.startsWith('/scan')) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4">
            <div className="p-4 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] font-mono text-xs font-bold text-[#111111]">
              Loading Scanner Terminal...
            </div>
          </div>
        }
      >
        <ScanPage />
      </Suspense>
    );
  }

  // Single-Page Scrolling Website with section anchors
  return <SinglePage />;
}
