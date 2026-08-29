import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Mobile-responsive Header component featuring:
 * 1. Minimal Mode (on root "/" route): Centered logo + corporate text, with animated swimming fish SVGs.
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

  // 1. MINIMAL HEADER VARIANT (Root gateway page only - with corporate name, logo, and swimming fish animation)
  if (isRoot) {
    return (
      <header className="app-header minimal-header" style={{ 
        borderBottom: '3px solid var(--ink)', 
        padding: '1.25rem 0', 
        position: 'relative', 
        overflow: 'hidden',
        backgroundColor: '#050716'
      }}>
        {/* CSS Keyframes and styling scoped to first page header only */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes swim-right {
            0% { left: -100px; top: 12px; transform: scale(0.65) translateY(0px) rotate(0deg); }
            50% { transform: scale(0.65) translateY(-8px) rotate(6deg); }
            100% { left: 100%; top: 12px; transform: scale(0.65) translateY(0px) rotate(0deg); }
          }
          @keyframes swim-left {
            0% { right: -100px; top: 28px; transform: scale(0.45) scaleX(-1) translateY(0px) rotate(0deg); }
            50% { transform: scale(0.45) scaleX(-1) translateY(6px) rotate(-4deg); }
            100% { right: 100%; top: 28px; transform: scale(0.45) scaleX(-1) translateY(0px) rotate(0deg); }
          }
          .swimming-fish-right {
            position: absolute;
            animation: swim-right 16s linear infinite;
            pointer-events: none;
            z-index: 1;
            opacity: 0.22;
          }
          .swimming-fish-left {
            position: absolute;
            animation: swim-left 22s linear infinite;
            pointer-events: none;
            z-index: 1;
            opacity: 0.16;
          }
        `}} />

        {/* Animated SVGs of swimming fish */}
        <div className="swimming-fish-right">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="80" height="40">
            <path d="M10,25 Q30,10 60,25 Q75,15 85,10 Q80,25 85,40 Q75,35 60,25 Q30,40 10,25 Z" fill="var(--volt)" />
            <circle cx="22" cy="22" r="1.5" fill="#050716" />
          </svg>
        </div>
        <div className="swimming-fish-left">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50" width="80" height="40">
            <path d="M10,25 Q30,10 60,25 Q75,15 85,10 Q80,25 85,40 Q75,35 60,25 Q30,40 10,25 Z" fill="var(--treated)" />
            <circle cx="22" cy="22" r="1.5" fill="#050716" />
          </svg>
        </div>

        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 5 }}>
          <NavLink to="/" aria-label="CWF Consulting Corporation Home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none' }}>
            <img 
              src="/logo.jpg" 
              alt="CWF Consulting Corporation Logo" 
              style={{ height: '42px', objectFit: 'contain', borderRadius: '4px', border: '1.5px solid var(--ink)', backgroundColor: '#fff', padding: '2px' }} 
            />
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.35rem', 
              fontWeight: '700', 
              color: 'var(--white)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              CWF <span style={{ color: 'var(--volt)' }}>Consulting Corporation</span>
            </span>
          </NavLink>
        </div>
      </header>
    );
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
                to="/about"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About
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
