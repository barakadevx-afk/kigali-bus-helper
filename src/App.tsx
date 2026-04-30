/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TransportProvider } from './context/TransportContext';
import { Home } from './pages/Home';

export default function App() {
  return (
    <TransportProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </TransportProvider>
  );
}
