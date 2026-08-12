import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';

/**
 * Footer component that automatically loads active site settings from the database.
 * Includes fallback links, dynamic copyright parameters, and social links.
 */
export default function Footer() {
  const { data: settingsData, request: fetchSettings } = useApi();

  useEffect(() => {
    fetchSettings('/settings').catch((err) => {
      console.warn('Could not fetch footer settings, using local fallbacks.', err.message);
    });
  }, [fetchSettings]);

  // Fallback defaults if database Settings collection is empty or unreachable
  const settings = settingsData?.data || {
    companyPhone: '089561 17811',
    companyEmail: 'info@hbpolytech.com',
    address: {
      street: 'Office No. - 808, Sai Millenium, Mumbai Hwy, Kate Wasti, Punawale',
      city: 'Pune',
      pincode: '411033',
      country: 'India',
    },
    businessHours: 'Tuesday - Sunday: 9:00 AM - 6:00 PM (Monday Closed)',
    socialLinks: {
      instagram: 'https://www.instagram.com/hbpolytech?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      linkedin: 'https://www.linkedin.com/in/hbpolytechind/',
    },
  };

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="grid-4">
          <div>
            <div className="logo" style={{ color: 'var(--panel)', marginBottom: '1rem' }}>
              <ShieldAlert size={24} style={{ marginRight: '0.5rem', color: 'var(--treated)' }} />
              CWF<span>Corporation</span>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.88rem' }}>
              Pune&apos;s leading scientific waterproofing inspection and consultation agency. We diagnose root causes and supervise repair executions.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem' }}>
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Link"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Link"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Link"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services"> waterproofing Services</Link></li>
              <li><Link to="/projects">Our Projects</Link></li>
              <li><Link to="/about">About CWF</Link></li>
              <li><Link to="/blog">Blog & Articles</Link></li>
              <li><Link to="/contact">Contact Page</Link></li>
            </ul>
          </div>

          <div>
            <h4>Services</h4>
            <ul className="footer-nav">
              <li><Link to="/services/terrace-waterproofing">Terrace Waterproofing</Link></li>
              <li><Link to="/services/basement-waterproofing">Basement Grouting</Link></li>
              <li><Link to="/services/bathroom-waterproofing">Bathroom Wet Area Sealing</Link></li>
              <li><Link to="/services/water-tank-sealing">Water Tank Grouting</Link></li>
            </ul>
          </div>

          <div>
            <h4>CWF Pune Office</h4>
            <ul className="footer-nav" style={{ fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <MapPin size={18} style={{ color: 'var(--treated)', flexShrink: 0, marginTop: '0.2rem' }} />
                <span>
                  {settings.address?.street},<br />
                  {settings.address?.city} - {settings.address?.pincode}, {settings.address?.country}
                </span>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Phone size={18} style={{ color: 'var(--treated)' }} />
                <a href={`tel:${settings.companyPhone}`}>{settings.companyPhone}</a>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <Mail size={18} style={{ color: 'var(--treated)' }} />
                <a href={`mailto:${settings.companyEmail}`}>{settings.companyEmail}</a>
              </li>
              <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Clock size={18} style={{ color: 'var(--treated)' }} />
                <span>{settings.businessHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; <span className="data-num">{new Date().getFullYear()}</span> CWF Corporation. All rights reserved.</p>
          <p>Scientific Waterproofing & Structural Inspection Specialists, Pune</p>
        </div>
      </div>
    </footer>
  );
}
