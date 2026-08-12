import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Inbox,
  Droplet,
  Briefcase,
  MessageSquare,
  FileText,
  Users,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X
} from 'lucide-react';

/**
 * AdminLayout component frames the workspace viewport for administrators.
 * Evaluates in-memory session load keys, displays responsive side drawers on tablets,
 * and handles role-restricted view toggles dynamically.
 */
export default function AdminLayout() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p>Restoring active session context...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Leads & Inquiries', path: '/admin/leads', icon: Inbox },
    { name: 'Services', path: '/admin/services', icon: Droplet },
    { name: 'Portfolio Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Blog Manager', path: '/admin/blog', icon: FileText },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  if (user && user.role === 'superadmin') {
    navItems.push({ name: 'User Management', path: '/admin/users', icon: ShieldAlert });
  }

  const getPageTitle = () => {
    const activeItem = navItems.find((item) => item.path === location.pathname);
    return activeItem ? activeItem.name : 'Console';
  };

  return (
    <div className="admin-viewport">
      {/* Drawer Overlay for Mobile / Tablets */}
      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Control Panel Drawer */}
      <aside className={`admin-sidebar-panel ${sidebarOpen ? 'sidebar-visible' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            CWF ADMIN
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-link ${isActive ? 'nav-link-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="admin-nav-icon" size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <span className="profile-email">{user?.email}</span>
            <span className="profile-role">{user?.role?.toUpperCase()}</span>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <div className="admin-workspace">
        <header className="admin-workspace-header">
          <button
            className="admin-hamburger-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
          <h2>{getPageTitle()}</h2>
          <div className="admin-header-actions">
            <Link to="/" className="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">
              View Public Website
            </Link>
          </div>
        </header>

        <main className="admin-workspace-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
