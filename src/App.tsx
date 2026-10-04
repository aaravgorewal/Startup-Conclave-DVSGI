/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout.tsx';

// All 12 Route Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { SchedulePage } from './pages/SchedulePage.tsx';
import { SpeakersPage } from './pages/SpeakersPage.tsx';
import { InvestorsPage } from './pages/InvestorsPage.tsx';
import { StartupsPage } from './pages/StartupsPage.tsx';
import { PitchArenaPage } from './pages/PitchArenaPage.tsx';
import { SponsorsPage } from './pages/SponsorsPage.tsx';
import { VenuePage } from './pages/VenuePage.tsx';
import { FaqPage } from './pages/FaqPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { DesignLabPage } from './pages/DesignLabPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="speakers" element={<SpeakersPage />} />
          <Route path="investors" element={<InvestorsPage />} />
          <Route path="startups" element={<StartupsPage />} />
          <Route path="pitch" element={<PitchArenaPage />} />
          <Route path="sponsors" element={<SponsorsPage />} />
          <Route path="venue" element={<VenuePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="contact" element={<ContactPage />} />
          {/* Temporary Design Lab route */}
          <Route path="design-lab" element={<DesignLabPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
