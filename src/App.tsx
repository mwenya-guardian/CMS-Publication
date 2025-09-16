import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedAdminRoutes } from './components/auth/ProtectedAdminRoutes';

// Public Pages
import { Home } from './pages/public/Home';
import { PublicationsView } from './pages/public/PublicationsView';
import { EventsView } from './pages/public/EventsView';
import { QuotesView } from './pages/public/QuotesView';
import { BulletinsView } from './pages/public/BulletinsView';
import { AboutView } from './pages/public/AboutView';

// Admin Pages
import { Dashboard } from './pages/admin/Dashboard';
import { PublicationsPage } from './pages/admin/PublicationsPage';
import { EventsPage } from './pages/admin/EventsPage';
import { QuotesPage } from './pages/admin/QuotesPage';
import { BulletinsPage } from './pages/admin/BulletinsPage';
import { MembersPage } from './pages/admin/MemberPage'; 
import {  GivingPage } from './pages/admin/GivingPage';
import { UsersPage } from './pages/admin/UserPage';
import { ChurchDetailsPage } from './pages/admin/ChurchDetailsPage';
import { NewsletterSchedulesPage } from './pages/admin/NewsletterSchedulesPage';
import { PostsPage as AdminPostsPage } from './pages/admin/PostsPage';

// User Pages
import { UserLayout } from './components/layout/UserLayout';
import { UserHome } from './pages/user/UserHomePage';
import { PostsPage } from './pages/user/PostsPage';
import { BulletinsPage as UserBulletinsPage } from './pages/user/BulletinsPage';
import { LikedPostsPage } from './pages/user/LikedPostsPage';
import { SettingsPage } from './pages/user/SettingsPage';

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
            <Route path="bulletins" element={<BulletinsView />} />
            <Route path="about" element={<AboutView />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />

          {/* User Routes (Protected) */}
          <Route path="/user" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={<UserHome />} />
            <Route path="posts" element={<PostsPage />} />
            <Route path="bulletins" element={<UserBulletinsPage />} />
            <Route path="liked" element={<LikedPostsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

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
            <Route path="posts" element={
              <ProtectedAdminRoutes>
                <AdminPostsPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="bulletins" element={
              <ProtectedAdminRoutes>
                <BulletinsPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="schedules" element={
              <ProtectedAdminRoutes>
                <NewsletterSchedulesPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="members" element={
              <ProtectedAdminRoutes>
                <MembersPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="giving" element={
              <ProtectedAdminRoutes>
                <GivingPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="users" element={
              <ProtectedAdminRoutes>
                <UsersPage />
              </ProtectedAdminRoutes>
            }/>
            <Route path="church-details" element={
              <ProtectedAdminRoutes>
                <ChurchDetailsPage />
              </ProtectedAdminRoutes>
            }/>
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;