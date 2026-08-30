import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi.js';

/**
 * Floating WhatsApp chat button component.
 * Dynamically queries SiteSettings database collection for target phone number,
 * formatting inputs to point to the active WhatsApp business channel.
 */
export default function WhatsAppButton() {
  const { data: settingsData, request: fetchSettings } = useApi();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    fetchSettings('/settings').catch(() => {});
  }, [fetchSettings]);

  const phone = settingsData?.data?.companyPhone || '089561 17811';
  
  // Format phone number to clean digit sequence for wa.me URL
  // e.g. "089561 17811" -> "918956117811"
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone; // Prefix standard Indian country code if 10 digits
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '91' + cleanPhone.substring(1); // Standardized loopback formats
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20CWF%20Consulting%20Corporation,%20I%20would%20like%20to%20inquire%20about%20your%20services.`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Tooltip speech bubble */}
      <div
        style={{
          background: '#10202a',
          color: '#ffffff',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          fontSize: '0.82rem',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-body)',
          border: '1px solid rgba(138, 203, 193, 0.15)',
          opacity: showTooltip ? 1 : 0,
          transform: showTooltip ? 'translateX(0)' : 'translateX(10px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: 'none'
        }}
      >
        Chat on WhatsApp
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.4)';
        }}
        aria-label="Chat on WhatsApp"
      >
        {/* SVG WhatsApp path */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          style={{ width: '28px', height: '28px', fill: '#ffffff' }}
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </a>
    </div>
  );
}
