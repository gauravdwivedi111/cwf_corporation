import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

// Layout Elements (Loaded statically since they wrap routes)
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Loader from './components/Loader.jsx';

// Public Pages (Lazy Loaded)
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const ServicesList = lazy(() => import('./pages/ServicesList.jsx'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'));
const ProjectsList = lazy(() => import('./pages/ProjectsList.jsx'));
const BlogList = lazy(() => import('./pages/BlogList.jsx'));
const BlogPostDetail = lazy(() => import('./pages/BlogPostDetail.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Admin Pages (Lazy Loaded)
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const LeadsManager = lazy(() => import('./pages/admin/LeadsManager.jsx'));
const ServicesManager = lazy(() => import('./pages/admin/ServicesManager.jsx'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager.jsx'));
const TestimonialsManager = lazy(() => import('./pages/admin/TestimonialsManager.jsx'));
const BlogManager = lazy(() => import('./pages/admin/BlogManager.jsx'));
const TeamManager = lazy(() => import('./pages/admin/TeamManager.jsx'));
const SettingsManager = lazy(() => import('./pages/admin/SettingsManager.jsx'));
const UserManager = lazy(() => import('./pages/admin/UserManager.jsx'));

/**
 * Route Guard enforcing dynamic session context checks.
 * Locks navigation to target access scopes and shifts unauthenticated users to Login.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p>Verifying authorization credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

/**
 * Public Layout Wrapper mapping global header and settings-aware footer configurations.
 */
const Layout = ({ children }) => (
  <div className="app-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main className="app-main" style={{ flexGrow: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

/**
 * Clean loader indicator rendered when route-level chunk files are fetched.
 */
const SuspenseLoader = () => (
  <div className="spinner-wrapper" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner" aria-label="Loading page components"></div>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Loader />
        <Router>
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
              {/* 1. Public Pages Group (Wrapped in Header/Footer Layout) */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/services" element={<Layout><ServicesList /></Layout>} />
              <Route path="/services/:slug" element={<Layout><ServiceDetail /></Layout>} />
              <Route path="/projects" element={<Layout><ProjectsList /></Layout>} />
              <Route path="/blog" element={<Layout><BlogList /></Layout>} />
              <Route path="/blog/:slug" element={<Layout><BlogPostDetail /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              
              {/* 2. Admin Authentication (No Header/Footer Layout) */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<Navigate to="/admin/login" replace />} />

              {/* 3. Protected Admin Sub-Workspace Group (Uses AdminLayout Sidebar Nav) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['superadmin', 'editor']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="leads" element={<LeadsManager />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="blog" element={<BlogManager />} />
                <Route path="team" element={<TeamManager />} />
                <Route path="settings" element={<SettingsManager />} />
                
                {/* User management restricted strictly to superadmins */}
                <Route
                  path="users"
                  element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                      <UserManager />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* 4. Fallback Catch-All Route */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </Suspense>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
