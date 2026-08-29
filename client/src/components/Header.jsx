import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Mobile-responsive Header component featuring:
 * 1. Minimal Mode (on root "/" route): Centered logo + corporate text, with animated swimming fish SVGs,
 *    and anchor links to '#company', '#services', and '#contact' sections.
 * 2. Full Mode (on all other routes): Logo linking back to "/", segment-scoped navigation links,
 *    and a segment switcher that preserves sub-page path context.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const segments = ['civil', 'web', 'finance'];
  const pathParts = pathname.split('/');
  
  // URL parameter takes complete precedence on segment-scoped routes
  let urlSegment = segments.includes(pathParts[1]) ? pathParts[1] : null;

  // Sync active segment to localStorage when we are in a segment scope
  useEffect(() => {
    if (urlSegment) {
      localStorage.setItem('cwf_current_segment', urlSegment);
    }
  }, [urlSegment]);

  // Fallback to localStorage or default to 'civil' for shared pages
  const activeSegment = urlSegment || localStorage.getItem('cwf_current_segment') || 'civil';

  const handleSegmentChange = (e) => {
    const nextSeg = e.target.value;
    if (urlSegment) {
      // Retain the current sub-page context (e.g. /web/services -> /civil/services)
      const remainingPath = pathParts.slice(2).join('/');
      navigate(`/${nextSeg}/${remainingPath}`);
    } else {
      // Redirect to target segment home from shared corporate pages
      navigate(`/${nextSeg}`);
    }
    closeMenu();
  };

  const isRoot = pathname === '/';

  // 1. ROOT HEADER VARIANT (Root gateway page only - hidden, managed by Flowstate Hero)
  if (isRoot) {
    return null;
  }

  // 2. FULL HEADER VARIANT (All segment pages and shared about/contact pages)
  return (
    <header className="app-header">
      {/* Dark frosted overlay for off-canvas mobile sidebar */}
      <div 
        className={`nav-overlay ${isOpen ? 'open' : ''}`} 
        onClick={closeMenu}
      ></div>

      <div className="container nav-container">
        {/* Clicking logo inside segment pages returns to the root picker gateway */}
        <NavLink to="/" className="logo" onClick={closeMenu} aria-label="CWF Consulting Corporation Picker Gateway" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <img src="/logo.jpg" alt="CWF Consulting Corporation Logo" style={{ height: '36px', objectFit: 'contain', borderRadius: '2px' }} />
        </NavLink>

        {/* Business Segment Switcher */}
        <div className="segment-switcher-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <select
            value={activeSegment}
            onChange={handleSegmentChange}
            aria-label="Select CWF Segment"
            style={{
              padding: '0.35rem 0.5rem',
              borderRadius: '4px',
              border: '2px solid var(--ink)',
              backgroundColor: 'var(--panel)',
              color: 'var(--ink)',
              fontWeight: 'bold',
              fontFamily: 'var(--font-data)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="civil">🛡️ Civil & Waterproofing</option>
            <option value="web">💻 Software & Web</option>
            <option value="finance">📈 Financial Advisory</option>
          </select>
        </div>

        <button
          className="mobile-nav-toggle"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav>
          <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
            {/* Mobile Sidebar Close and Branding Header */}
            <li className="mobile-menu-header">
              <span>Navigation</span>
              <button onClick={closeMenu} aria-label="Close navigation menu">
                <X size={24} />
              </button>
            </li>
            <li>
              <NavLink
                to={`/${activeSegment}`}
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${activeSegment}/services`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Services
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${activeSegment}/projects`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Projects
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`/${activeSegment}/blog`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
