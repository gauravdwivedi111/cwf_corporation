import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Public Services Listing page.
 * Loads and displays all published service categories.
 */
export default function ServicesList() {
  const { data: servicesData, loading, error, request: fetchServices } = useApi();

  useEffect(() => {
    fetchServices('/services').catch(() => {});
  }, [fetchServices]);

  const services = servicesData?.data || [];

  return (
    <>
      <Helmet>
        <title>Waterproofing & Structural Services | CWF Corporation Pune</title>
        <meta
          name="description"
          content="Browse CWF Corporation's core diagnostic waterproofing services in Pune, including Terrace sealing, Basement grouting, Facades, and Water Tank linings."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>Structural Sealing & Waterproofing Services</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Scientific Diagnostic Solutions and Supervised Repair Execution</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading waterproofing services"></div>
            </div>
          ) : error ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load services</h3>
              <p>{error.message}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No waterproofing services are listed currently.</p>
            </div>
          ) : (
            <div className="grid-3">
              {services.map((service) => (
                <div key={service._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="card-image-wrapper">
                    <img
                      src={getOptimizedCloudinaryUrl(service.coverImage, 500)}
                      alt={service.title}
                      className="card-img"
                      loading="lazy"
                    />
                  </div>
                  <div style={{ marginTop: '1.25rem', flexGrow: 1 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: 'var(--color-accent)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        display: 'block',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {service.category.replace('-', ' ')}
                    </span>
                    <h3 style={{ fontSize: '1.4rem' }}>{service.title}</h3>
                    <p style={{ fontSize: '0.92rem' }}>{service.shortDescription}</p>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link to={`/services/${service.slug}`} className="btn btn-primary" style={{ width: '100%' }}>
                      View Diagnostics Guide
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
