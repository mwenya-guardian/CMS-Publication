import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { PublicationsView } from './pages/public/PublicationsView';
import { EventsView } from './pages/public/EventsView';
import { QuotesView } from './pages/public/QuotesView';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { PublicationsPage } from './pages/admin/PublicationsPage';
import { EventsPage } from './pages/admin/EventsPage';
import { QuotesPage } from './pages/admin/QuotesPage';

// Auth Pages
import { Login } from './pages/auth/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="publications" element={<PublicationsView />} />
            <Route path="events" element={<EventsView />} />
            <Route path="quotes" element={<QuotesView />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="publications" element={<PublicationsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;