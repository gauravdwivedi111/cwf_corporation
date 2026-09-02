import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import CategoryIcon from '../components/CategoryIcon.jsx';

/**
 * Public Services Listing page.
 * Loads and displays services matching the active URL segment parameter.
 */
export default function ServicesList() {
  const { segment } = useParams();
  const { data: servicesData, loading, error, request: fetchServices } = useApi();
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    fetchServices(`/services?segment=${segment}`).catch(() => {});
  }, [segment, fetchServices]);

  const services = servicesData?.data || [];

  // Segment-specific copywriting configurations
  const segmentMeta = {
    civil: {
      title: 'Waterproofing & Structural Services',
      subtitle: 'Scientific Diagnostic Solutions and Supervised Repair Execution',
      bannerLabel: '[CATALOG: COATINGS & GROUTING]',
      description: 'Browse CWF Consulting Corporation\'s core waterproofing services, including Terrace sealing, Basement grouting, external facades, and Water Tank linings in Pune.'
    },
    web: {
      title: 'Software & Web Development',
      subtitle: 'High-Performance Platforms and Cloud-Native Applications',
      bannerLabel: '[ENGINEERING: FULL STACK DEPLOYMENTS]',
      description: 'Explore CWF Software & Web services. We design B2B e-commerce platforms, Next.js corporate hubs, SaaS applications, and custom software integrations.'
    },
    finance: {
      title: 'Financial Advisory & Corporate Planning',
      subtitle: 'PLAN • PROTECT • PROSPER — Strategic Capital Overviews and Tax Compliance Representation',
      bannerLabel: '[ADVISORY: CORPORATE DEBT & TAXES]',
      description: 'Consult CWF Financial Advisory. We structure SME business growth loans, working capital overdraft limits, corporate tax planning, and wealth solutions.'
    }
  };

  const currentMeta = segmentMeta[segment] || segmentMeta.civil;

  return (
    <>
      <Helmet>
        <title>{`${currentMeta.title} | CWF Consulting Corporation`}</title>
        <meta name="description" content={currentMeta.description} />
      </Helmet>

      {/* Header Banner */}
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            {currentMeta.bannerLabel}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '2.5rem', lineHeight: 1.1 }}>
            {currentMeta.title}
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
            {currentMeta.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label={`Loading ${segment} services`}></div>
            </div>
          ) : error ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load services</h3>
              <p>{error.message}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No services are listed under the {segment} division currently.</p>
            </div>
          ) : (
            <div className="bento-grid">
              {services.map((service, index) => {
                return (
                  <div 
                    key={service._id} 
                    className="bento-cell solid-ink"
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      padding: '2rem',
                      opacity: 1,
                      transform: 'scale(1)',
                      transition: prefersReduced ? 'none' : `opacity 0.4s ease-out ${index * 80}ms, transform 0.4s ease-out ${index * 80}ms`
                    }}
                  >
                    <div style={{ width: '100%', height: '200px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(service.coverImage || (segment === 'web' ? '/unsplash_13.jpg' : segment === 'finance' ? '/unsplash_10.jpg' : '/unsplash_9.jpg'), 500)}
                        alt={service.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: 'var(--volt)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontFamily: 'var(--font-data)'
                          }}
                        >
                          {service.category.replace('-', ' ')}
                        </span>
                        {segment === 'civil' && <CategoryIcon category={service.category} size={24} />}
                      </div>

                      <h3 style={{ fontSize: '1.3rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {service.title}
                      </h3>
                      
                      <p style={{ fontSize: '0.9rem', color: 'var(--white)', opacity: 0.85, fontFamily: 'var(--font-body)', lineHeight: '1.5', marginBottom: '1rem', flexGrow: 1 }}>
                        {service.shortDescription}
                      </p>

                      {/* CONDITIONAL SEGMENT FIELDS RENDERING ON CARD */}
                      {segment === 'civil' && service.warrantyYears && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--volt)', fontFamily: 'var(--font-data)', fontWeight: 'bold', border: '1.5px solid var(--volt)', display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: '2px', alignSelf: 'flex-start' }}>
                          {service.warrantyYears} YEARS WARRANTY
                        </div>
                      )}

                      {segment === 'web' && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'var(--font-data)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div>⏱️ Timeline: <strong>{service.projectTimeline}</strong></div>
                          <div>💰 Model: <strong style={{ textTransform: 'capitalize' }}>{service.pricingModel}</strong></div>
                          {service.techStack && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.25rem' }}>
                              {service.techStack.slice(0, 3).map((tech, i) => (
                                <span key={i} style={{ fontSize: '0.65rem', backgroundColor: 'var(--panel)', color: 'var(--ink)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>
                                  {tech}
                                </span>
                              ))}
                              {service.techStack.length > 3 && <span style={{ fontSize: '0.65rem', color: 'var(--white)' }}>+{service.techStack.length - 3} more</span>}
                            </div>
                          )}
                        </div>
                      )}

                      {segment === 'finance' && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', fontFamily: 'var(--font-data)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {service.loanRangeMin && (
                            <div>💰 Range: <strong style={{ color: 'var(--volt)' }}>₹ {(service.loanRangeMin/100000).toFixed(0)}L - {(service.loanRangeMax/10000000).toFixed(1)}Cr</strong></div>
                          )}
                          {service.interestRateInfo && (
                            <div>📈 Rates: <strong>{service.interestRateInfo}</strong></div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '1.5rem', zIndex: 10 }}>
                      <Link to={`/${segment}/services/${service.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
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
