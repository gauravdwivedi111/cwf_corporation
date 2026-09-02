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

  // 1. ROOT HEADER VARIANT (Root gateway page only - with corporate name, logo, swimming fish, and landing anchors)
  if (isRoot) {
    return (
      <header className="app-header minimal-header" style={{ 
        position: 'sticky', 
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(16, 32, 42, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(138, 203, 193, 0.15)'
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

        {/* Animated SVGs of swimming fish scoped to its own overflow-hidden layer */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
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
        </div>

        {/* Mobile menu overlay */}
        <div 
          className={`nav-overlay ${isOpen ? 'open' : ''}`} 
          onClick={closeMenu}
        ></div>

        <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 5, width: '100%' }}>
          <NavLink to="/" aria-label="CWF Consulting Corporation Home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', maxWidth: 'calc(100% - 44px)' }}>
            <img 
              src="/logo.jpg" 
              alt="CWF Consulting Corporation Logo" 
              style={{ height: '34px', width: 'auto', objectFit: 'contain', borderRadius: '2px', flexShrink: 0 }} 
            />
            <span style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: 'clamp(0.85rem, 3.8vw, 1.35rem)', 
              fontWeight: '700', 
              color: 'var(--white)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1.15
            }}>
              CWF <span style={{ color: 'var(--volt)' }}>Consulting Corporation</span>
            </span>
          </NavLink>

          <button
            className="mobile-nav-toggle"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            style={{ color: 'var(--white)', border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0, padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav>
            <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
              <li className="mobile-menu-header">
                <span>Navigation</span>
                <button onClick={closeMenu} aria-label="Close navigation menu">
                  <X size={24} />
                </button>
              </li>
              <li>
                <a href="#about" className="nav-link" onClick={closeMenu}>
                  🏢 About Company
                </a>
              </li>
              <li>
                <a href="#services" className="nav-link" onClick={closeMenu}>
                  ⚡ Corporate Divisions
                </a>
              </li>
              <li>
                <a href="#contact" className="nav-link" onClick={closeMenu}>
                  📩 Contact Us
                </a>
              </li>
              <li style={{ borderTop: '1px solid rgba(138, 203, 193, 0.15)', margin: '0.4rem 0', paddingTop: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--volt)', letterSpacing: '1px', padding: '0 0.75rem', fontWeight: 700 }}>
                  Jump to Segment
                </span>
              </li>
              <li>
                <NavLink to="/civil" className="nav-link" onClick={closeMenu}>
                  🛡️ Civil & Waterproofing
                </NavLink>
              </li>
              <li>
                <NavLink to="/web" className="nav-link" onClick={closeMenu}>
                  💻 Software & Digital
                </NavLink>
              </li>
              <li>
                <NavLink to="/finance" className="nav-link" onClick={closeMenu}>
                  📈 Financial Advisory
                </NavLink>
              </li>
            </ul>
          </nav>
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

      <div className="container nav-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
        {/* Clicking logo inside segment pages returns to the root picker gateway */}
        <NavLink to="/" className="logo" onClick={closeMenu} aria-label="CWF Consulting Corporation Picker Gateway" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          <img src="/logo.jpg" alt="CWF Consulting Corporation Logo" style={{ height: '34px', width: 'auto', objectFit: 'contain', borderRadius: '2px' }} />
        </NavLink>

        {/* Business Segment Switcher */}
        <div className="segment-switcher-wrapper" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 1, minWidth: 0 }}>
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
              fontSize: 'clamp(0.68rem, 2.7vw, 0.78rem)',
              textTransform: 'uppercase',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: 'clamp(115px, 38vw, 220px)',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
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
          style={{ color: 'var(--white)', border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0, padding: '0.5rem', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
