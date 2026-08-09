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

      <section className="section" style={{ display: 'flex', alignItems: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <ShieldAlert size={64} style={{ color: 'var(--color-error)', marginBottom: '1.5rem', display: 'inline-block' }} />
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
          <h2>Page Not Found</h2>
          <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
            The page you are looking for does not exist. However, we can help protect your property from leakages!
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
            <ArrowLeft size={18} /> Back to Home Page
          </Link>
        </div>
      </section>
    </>
  );
}
