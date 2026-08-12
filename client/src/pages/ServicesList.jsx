import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import CategoryIcon from '../components/CategoryIcon.jsx';

/**
 * Public Services Listing page.
 * Loads and displays all published service categories in Bento cards.
 */
export default function ServicesList() {
  const { data: servicesData, loading, error, request: fetchServices } = useApi();
  const revealRef = null;
  const isVisible = true;
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

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
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            [CATALOG: COATINGS & GROUTING]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '2.5rem', lineHeight: 1.1 }}>
            Waterproofing Services
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Scientific Diagnostic Solutions and Supervised Repair Execution
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={revealRef} className="section">
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
            <div className="bento-grid">
              {services.map((service, index) => {
                // Uniform premium dark bento cell styling and gold buttons
                const cellClass = 'bento-cell solid-ink';
                const textStyle = { color: 'var(--white)' };
                const categoryColor = 'var(--volt)';
                const btnClass = 'btn btn-primary';

                return (
                  <div 
                    key={service._id} 
                    className={cellClass}
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1)' : 'scale(0.96)',
                      transition: prefersReduced ? 'none' : `opacity 0.4s ease-out ${index * 80}ms, transform 0.4s ease-out ${index * 80}ms`,
                      padding: '2rem'
                    }}
                  >
                    <div style={{ width: '100%', height: '200px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(service.coverImage, 500)}
                        alt={service.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: categoryColor,
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontFamily: 'var(--font-data)'
                          }}
                        >
                          {service.category.replace('-', ' ')}
                        </span>
                        <CategoryIcon category={service.category} size={24} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', ...textStyle, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {service.title}
                      </h3>
                      <p style={{ fontSize: '0.92rem', opacity: index % 3 === 0 ? 0.8 : 0.9, ...textStyle, fontFamily: 'var(--font-body)', lineHeight: '1.5' }}>
                        {service.shortDescription}
                      </p>
                    </div>
                    <div style={{ marginTop: '1.5rem', zIndex: 10 }}>
                      <Link to={`/services/${service.slug}`} className={btnClass} style={{ width: '100%', textAlign: 'center', border: index % 3 === 1 ? 'none' : undefined }}>
                        View Diagnostics Guide
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
