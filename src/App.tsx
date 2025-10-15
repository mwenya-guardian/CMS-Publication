import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PWAProvider } from './contexts/PWAContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProtectedAdminRoutes } from './components/auth/ProtectedAdminRoutes';
import { LazyLoadingWrapper } from './components/common/LazyLoadingWrapper';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ApiInterceptorSetup } from './components/common/ApiInterceptorSetup';

// Lazy loaded components
import {
  LazyHome,
  LazyPublicationsView,
  LazyEventsView,
  LazyQuotesView,
  LazyBulletinsView,
  LazyAboutView,
  LazyDashboard,
  LazyPublicationsPage,
  LazyEventsPage,
  LazyQuotesPage,
  LazyBulletinsPage,
  LazyMembersPage,
  LazyGivingPage,
  LazyUsersPage,
  LazyChurchDetailsPage,
  LazySchedulesPage,
  LazyAdminPostsPage,
  LazyAnalysisPage,
  LazyUserHome,
  LazyPostsPage,
  LazyUserBulletinsPage,
  LazyLikedPostsPage,
  LazySettingsPage,
  LazyLogin,
  LazyRegister
} from './utils/lazyLoading';

function App() {
  return (
    <ErrorBoundary>
      <PWAProvider>
        <AuthProvider>
          <ApiInterceptorSetup />
          <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={
              <LazyLoadingWrapper>
                <LazyHome />
              </LazyLoadingWrapper>
            } />
            <Route path="publications" element={
              <LazyLoadingWrapper>
                <LazyPublicationsView />
              </LazyLoadingWrapper>
            } />
            <Route path="events" element={
              <LazyLoadingWrapper>
                <LazyEventsView />
              </LazyLoadingWrapper>
            } />
            <Route path="quotes" element={
              <LazyLoadingWrapper>
                <LazyQuotesView />
              </LazyLoadingWrapper>
            } />
            <Route path="bulletins" element={
              <LazyLoadingWrapper>
                <LazyBulletinsView />
              </LazyLoadingWrapper>
            } />
            <Route path="about" element={
              <LazyLoadingWrapper>
                <LazyAboutView />
              </LazyLoadingWrapper>
            } />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={
            <LazyLoadingWrapper>
              <LazyLogin />
            </LazyLoadingWrapper>
          } />
          <Route path="/auth/register" element={
            <LazyLoadingWrapper>
              <LazyRegister />
            </LazyLoadingWrapper>
          } />

          {/* User Routes (Protected) */}
          <Route path="/user" element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <LazyLoadingWrapper>
                <LazyUserHome />
              </LazyLoadingWrapper>
            } />
            <Route path="posts" element={
              <LazyLoadingWrapper>
                <LazyPostsPage />
              </LazyLoadingWrapper>
            } />
            <Route path="bulletins" element={
              <LazyLoadingWrapper>
                <LazyUserBulletinsPage />
              </LazyLoadingWrapper>
            } />
            <Route path="liked" element={
              <LazyLoadingWrapper>
                <LazyLikedPostsPage />
              </LazyLoadingWrapper>
            } />
            <Route path="settings" element={
              <LazyLoadingWrapper>
                <LazySettingsPage />
              </LazyLoadingWrapper>
            } />
          </Route>

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={
              <LazyLoadingWrapper>
                <LazyDashboard />
              </LazyLoadingWrapper>
            } />
            <Route path="publications" element={
              <LazyLoadingWrapper>
                <LazyPublicationsPage />
              </LazyLoadingWrapper>
            } />
            <Route path="events" element={
              <LazyLoadingWrapper>
                <LazyEventsPage />
              </LazyLoadingWrapper>
            } />
            <Route path="quotes" element={
              <LazyLoadingWrapper>
                <LazyQuotesPage />
              </LazyLoadingWrapper>
            } />
            <Route path="posts" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyAdminPostsPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="bulletins" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyBulletinsPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="schedules" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazySchedulesPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="members" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyMembersPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="giving" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyGivingPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="users" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyUsersPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="church-details" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyChurchDetailsPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
            <Route path="analysis" element={
              <ProtectedAdminRoutes>
                <LazyLoadingWrapper>
                  <LazyAnalysisPage />
                </LazyLoadingWrapper>
              </ProtectedAdminRoutes>
            }/>
          </Route>

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </Router>
        </AuthProvider>
      </PWAProvider>
    </ErrorBoundary>
  );
}

export default App;