/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SinglePage } from './components/single-page/SinglePage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

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
    return <AdminPage />;
  }

  // Single-Page Scrolling Website with section anchors
  return <SinglePage />;
}
