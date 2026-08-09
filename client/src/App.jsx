import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ServicesList from './pages/ServicesList.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import ProjectsList from './pages/ProjectsList.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogPostDetail from './pages/BlogPostDetail.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// Simple Route Guard Placeholder for Admin Group (Keep for Phase 4 integration)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = false; // Mocked as false to show redirects
  const userRole = 'editor';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Mock Pages (Wired for admin login routing checks)
const Login = () => (
  <div className="container section" style={{ maxWidth: '400px' }}>
    <h2>Staff Login</h2>
    <p style={{ margin: '1rem 0' }}>Admin portal logins will be enabled in Phase 4.</p>
    <Link to="/" className="btn btn-outline">Back to Home</Link>
  </div>
);
const AdminDashboard = () => <h2>Admin Dashboard Placeholder</h2>;
const AdminLeads = () => <h2>Lead Management Placeholder</h2>;
const AdminServices = () => <h2>Service Catalog Placeholder</h2>;

// Global layout wrapping header, main page content, and footer
const Layout = ({ children }) => (
  <div className="app-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main className="app-main" style={{ flexGrow: 1 }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Page Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<ServicesList />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes (Gated placeholders for Phase 4) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'editor']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'editor']}>
                <AdminLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AdminServices />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
