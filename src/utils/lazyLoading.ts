import { lazy } from 'react';

// Lazy load admin pages
export const LazyDashboard = lazy(() => import('../pages/admin/Dashboard').then(module => ({ default: module.Dashboard })));
export const LazyPublicationsPage = lazy(() => import('../pages/admin/PublicationsPage').then(module => ({ default: module.PublicationsPage })));
export const LazyEventsPage = lazy(() => import('../pages/admin/EventsPage').then(module => ({ default: module.EventsPage })));
export const LazyQuotesPage = lazy(() => import('../pages/admin/QuotesPage').then(module => ({ default: module.QuotesPage })));
export const LazyBulletinsPage = lazy(() => import('../pages/admin/BulletinsPage').then(module => ({ default: module.BulletinsPage })));
export const LazyMembersPage = lazy(() => import('../pages/admin/MemberPage').then(module => ({ default: module.MembersPage })));
export const LazyGivingPage = lazy(() => import('../pages/admin/GivingPage').then(module => ({ default: module.GivingPage })));
export const LazyUsersPage = lazy(() => import('../pages/admin/UserPage').then(module => ({ default: module.UsersPage })));
export const LazyChurchDetailsPage = lazy(() => import('../pages/admin/ChurchDetailsPage').then(module => ({ default: module.ChurchDetailsPage })));
export const LazySchedulesPage = lazy(() => import('../pages/admin/SchedulesPage').then(module => ({ default: module.SchedulesPage })));
export const LazyAdminPostsPage = lazy(() => import('../pages/admin/PostsPage').then(module => ({ default: module.PostsPage })));
export const LazyAnalysisPage = lazy(() => import('../pages/admin/AnalysisPage').then(module => ({ default: module.AnalysisPage })));

// Lazy load user pages
export const LazyUserHome = lazy(() => import('../pages/user/UserHomePage').then(module => ({ default: module.UserHome })));
export const LazyPostsPage = lazy(() => import('../pages/user/PostsPage').then(module => ({ default: module.PostsPage })));
export const LazyUserBulletinsPage = lazy(() => import('../pages/user/BulletinsPage').then(module => ({ default: module.BulletinsPage })));
export const LazyLikedPostsPage = lazy(() => import('../pages/user/LikedPostsPage').then(module => ({ default: module.LikedPostsPage })));
export const LazySettingsPage = lazy(() => import('../pages/user/SettingsPage').then(module => ({ default: module.SettingsPage })));

// Lazy load public pages
export const LazyHome = lazy(() => import('../pages/public/Home').then(module => ({ default: module.Home })));
export const LazyPublicationsView = lazy(() => import('../pages/public/PublicationsView').then(module => ({ default: module.PublicationsView })));
export const LazyEventsView = lazy(() => import('../pages/public/EventsView').then(module => ({ default: module.EventsView })));
export const LazyQuotesView = lazy(() => import('../pages/public/QuotesView').then(module => ({ default: module.QuotesView })));
export const LazyBulletinsView = lazy(() => import('../pages/public/BulletinsView').then(module => ({ default: module.BulletinsView })));
export const LazyAboutView = lazy(() => import('../pages/public/AboutView').then(module => ({ default: module.AboutView })));

// Lazy load auth pages
export const LazyLogin = lazy(() => import('../pages/auth/Login').then(module => ({ default: module.Login })));
export const LazyRegister = lazy(() => import('../pages/auth/Register').then(module => ({ default: module.Register })));
