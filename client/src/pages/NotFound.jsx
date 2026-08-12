import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * Fallback NotFound (404) page component redirecting users back to home path.
 */
export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | CWF Corporation Pune</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="section blueprint-grid" style={{ display: 'flex', alignItems: 'center', minHeight: '65vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px', backgroundColor: 'var(--panel)', padding: '3rem', border: '1.5px solid var(--ink)', borderRadius: '2px' }}>
          <ShieldAlert size={64} style={{ color: 'var(--damage)', marginBottom: '1.5rem', display: 'inline-block' }} />
          <h1 className="data-num" style={{ fontSize: '4.5rem', marginBottom: '0.5rem', lineHeight: 1, color: 'var(--damage)' }}>404</h1>
          <h2 style={{ borderBottom: 'none', margin: '0.5rem 0', fontSize: '1.75rem', display: 'block' }}>PAGE NOT FOUND</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem', fontSize: '0.95rem' }}>
            The requested technical route does not exist. However, we can help protect your property from concrete leaks!
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <ArrowLeft size={18} /> Back to Home Page
          </Link>
        </div>
      </section>
    </>
  );
}
