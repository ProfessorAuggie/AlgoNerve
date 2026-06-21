import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { VisualizerPage } from './pages/VisualizerPage';
import { DocumentationPage } from './pages/DocumentationPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/visualize/:id" element={<VisualizerPage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        {/* Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
