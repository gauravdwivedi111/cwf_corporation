import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/**
 * Placeholder protected route guard for Phase 2 authentication integration.
 * Restricts access to admin routes based on authentication status and roles.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Mock authentication states (will be populated by Auth Context in Phase 2)
  const isAuthenticated = false; // Mocked as false to show redirect to /login
  const userRole = 'editor';      // Allowed options: 'superadmin' | 'editor'

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout wrappers
const Layout = ({ children }) => (
  <div className="app-container">
    <header className="app-header">
      <nav>
        <strong>CWF Corporation</strong>
      </nav>
    </header>
    <main className="app-main">{children}</main>
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} CWF Corporation. All Rights Reserved.</p>
    </footer>
  </div>
);

// Public Component Placeholders
const Home = () => <h2>Home Page</h2>;
const Services = () => <h2>Waterproofing Services</h2>;
const ServiceDetail = () => <h2>Service Detail Page</h2>;
const Projects = () => <h2>Project Portfolio</h2>;
const Blog = () => <h2>Blog & Updates</h2>;
const BlogDetail = () => <h2>Blog Post Details</h2>;
const Contact = () => <h2>Contact & Lead Form</h2>;
const Login = () => <h2>Staff Login</h2>;

// Admin Panel Placeholders (Route Group)
const AdminDashboard = () => <h2>Admin Dashboard (Superadmin & Editor)</h2>;
const AdminLeads = () => <h2>Lead / Inquiry Management (Superadmin & Editor)</h2>;
const AdminServices = () => <h2>Service Catalog Configuration (Superadmin Only)</h2>;

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Protected Routes */}
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

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
