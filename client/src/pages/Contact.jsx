import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import LeadForm from '../components/LeadForm.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * Public Contact Page.
 * Embeds a static Google Maps iframe pointing to Pune, India.
 * Redesigned for Bento / Structural Bold concept.
 */
export default function Contact() {
  const { data: settingsData, request: fetchSettings } = useApi();
  const [revealRef, isVisible] = useScrollReveal();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    fetchSettings('/settings').catch(() => {});
  }, [fetchSettings]);

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
  };

  return (
    <>
      <Helmet>
        <title>Contact Waterproofing Experts | CWF Corporation Pune</title>
        <meta
          name="description"
          content="Contact CWF Corporation in Pune for waterproofing audits, moisture scans, and injection grouting quotes. View office map and business hours."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            [HQ: DIRECT CHANNEL]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            Contact CWF Corporation
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Schedule a diagnostic inspection or consult our structural engineers
          </p>
        </div>
      </section>

      {/* Contact Grid layout */}
      <section ref={revealRef} className="section">
        <div className="container bento-grid" style={{ gap: '3rem' }}>
          
          {/* Left Column - Details & Map Bento */}
          <div
            className="bento-cell"
            style={{
              gridColumn: 'span 6',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.97)',
              transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out, transform 0.4s ease-out',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
          >
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1rem' }}>
                Pune Headquarters
              </h2>
              <p style={{ fontSize: '0.98rem', lineHeight: '1.6', margin: 0 }}>
                Have active moisture seepage or wet wall patches? Submit an audit request or contact our head consultancy office directly to arrange a certified inspection.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Office Address</h4>
                  <p style={{ fontSize: '0.92rem', margin: 0, lineHeight: '1.4' }}>
                    {settings.address?.street},<br />
                    {settings.address?.city} - <span className="data-num">{settings.address?.pincode}</span>, {settings.address?.country}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Phone Connection</h4>
                  <p style={{ fontSize: '0.92rem', margin: 0 }}>
                    <a href={`tel:${settings.companyPhone}`} style={{ color: 'inherit', textDecoration: 'none' }} className="data-num">{settings.companyPhone}</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Email Enquiries</h4>
                  <p style={{ fontSize: '0.92rem', margin: 0 }}>
                    <a href={`mailto:${settings.companyEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.companyEmail}</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 0.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Business Hours</h4>
                  <p style={{ fontSize: '0.92rem', margin: 0 }}>{settings.businessHours}</p>
                </div>
              </div>

            </div>

            {/* Google Map plain iframe embed */}
            <div style={{ width: '100%', height: '300px', border: '3px solid var(--ink)', borderRadius: '6px', overflow: 'hidden' }}>
              <iframe
                title="Google Map location of CWF office in Punawale, Pune, Maharashtra, India"
                src="https://maps.google.com/maps?q=Sai%20Millenium,%20Punawale,%20Pune,%20Maharashtra,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column - Booking Form Bento */}
          <div
            className="bento-cell"
            style={{
              gridColumn: 'span 6',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.97)',
              transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out 150ms, transform 0.4s ease-out 150ms',
              border: '3px solid var(--ink)',
              margin: 0,
              backgroundColor: 'var(--panel)',
              padding: '2.5rem'
            }}
          >
            <LeadForm />
          </div>

        </div>
      </section>
    </>
  );
}
