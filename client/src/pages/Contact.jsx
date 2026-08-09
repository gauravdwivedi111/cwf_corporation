import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import LeadForm from '../components/LeadForm.jsx';

/**
 * Public Contact Page.
 * Embeds a static Google Maps iframe pointing to Pune, India.
 * Maps settings dynamically and mounts the LeadForm.
 */
export default function Contact() {
  const { data: settingsData, request: fetchSettings } = useApi();

  useEffect(() => {
    fetchSettings('/settings').catch(() => {});
  }, [fetchSettings]);

  const settings = settingsData?.data || {
    companyPhone: '+91 20 1234 5678',
    companyEmail: 'info@cwfcorporation.com',
    address: {
      street: '101, Apex Commercial Hub, MG Road',
      city: 'Pune',
      pincode: '411001',
      country: 'India',
    },
    businessHours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
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
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>Contact CWF Corporation</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Schedule a diagnostic inspection or consult our structural engineers</p>
        </div>
      </section>

      {/* Contact Grid layout */}
      <section className="section">
        <div className="container grid-2" style={{ gap: '4rem' }}>
          {/* Left Column - Details & Map */}
          <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Get in Touch with our Pune HQ</h2>
            <p style={{ marginBottom: '2.5rem' }}>
              Have active moisture seepage or wet wall patches? Submit an audit request or contact our head consultancy office directly to arrange a certified inspection.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.50rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Office Address</h4>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>
                    {settings.address?.street},<br />
                    {settings.address?.city} - {settings.address?.pincode}, {settings.address?.country}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.50rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                  <Phone size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Phone Connection</h4>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>
                    <a href={`tel:${settings.companyPhone}`} style={{ color: 'inherit' }}>{settings.companyPhone}</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.50rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Email Enquiries</h4>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>
                    <a href={`mailto:${settings.companyEmail}`} style={{ color: 'inherit' }}>{settings.companyEmail}</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ padding: '0.50rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Business Hours</h4>
                  <p style={{ fontSize: '0.95rem', margin: 0 }}>{settings.businessHours}</p>
                </div>
              </div>
            </div>

            {/* Google Map plain iframe embed (no API key required) */}
            <div style={{ width: '100%', height: '350px', border: '1px solid var(--color-gray-border)', borderRadius: '6px', overflow: 'hidden' }}>
              <iframe
                title="Google Map location of CWF office in Pune, Maharashtra, India"
                src="https://maps.google.com/maps?q=Pune,Maharashtra,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
