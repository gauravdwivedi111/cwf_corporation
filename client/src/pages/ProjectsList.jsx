import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { X, MapPin, ExternalLink, Calendar, Award, Cpu } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';

/**
 * Public Projects Listing page (Portfolio).
 * Loads, filters, and renders case studies matching the active URL segment parameter.
 */
export default function ProjectsList() {
  const { segment } = useParams();
  const { data: projectsData, loading, error, request: fetchProjects } = useApi();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    // Reset active filters on segment change
    setActiveFilter('all');
    fetchProjects(`/projects?segment=${segment}`).catch(() => {});
  }, [segment, fetchProjects]);

  const projects = projectsData?.data || [];

  // Segment-specific filters configurations
  const segmentFilters = {
    civil: [
      { value: 'all', label: 'All Projects' },
      { value: 'terrace', label: 'Terraces' },
      { value: 'basement', label: 'Basements' },
      { value: 'bathroom', label: 'Bathrooms' },
      { value: 'tank', label: 'Water Tanks' },
      { value: 'facade', label: 'External Facades' },
      { value: 'injection-grouting', label: 'Injection' },
    ],
    web: [
      { value: 'all', label: 'All Platforms' },
      { value: 'e-commerce', label: 'E-Commerce' },
      { value: 'corporate-site', label: 'Corporate Sites' },
      { value: 'web-app', label: 'Web Applications' },
      { value: 'seo-maintenance', label: 'SEO & Maintenance' },
      { value: 'custom-development', label: 'Custom Tools' },
    ],
    finance: [
      { value: 'all', label: 'All Operations' },
      { value: 'business-loan', label: 'Business Loans' },
      { value: 'working-capital', label: 'Working Capital' },
      { value: 'investment-advisory', label: 'Wealth Advisory' },
      { value: 'tax-consultancy', label: 'Tax Planning' },
      { value: 'personal-loan', label: 'Personal Loans' },
    ]
  };

  const categories = segmentFilters[segment] || segmentFilters.civil;

  // Filter project records locally
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter((p) => p.serviceCategory === activeFilter);

  const openModal = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // Lock body scroll
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = ''; // Restore body scroll
  };

  // Segment-specific copywriting configurations
  const segmentMeta = {
    civil: {
      title: 'Waterproofing Project Case Studies',
      subtitle: 'Scientific Sealing Case Studies across Pune City',
      bannerLabel: '[PORTFOLIO: COMPLETED WATERPROOFING AUDITS]',
      description: 'Explore CWF Consulting Corporation Pune\'s completed waterproofing project portfolio. Compare before/after results for terraces, basements, and commercial facades.'
    },
    web: {
      title: 'Software & Web Portfolio',
      subtitle: 'Modern Web Applications and Scalable Digital Platforms',
      bannerLabel: '[PORTFOLIO: ENTERPRISE SOFTWARE RELEASES]',
      description: 'Browse CWF Software & Web case studies. Review active B2B platforms, custom client portals, and Next.js applications engineered for high performance.'
    },
    finance: {
      title: 'Financial Consulting Case Studies',
      subtitle: 'Strategic Corporate Debt Advisory & Restructuring Outcomes',
      bannerLabel: '[PORTFOLIO: COMPLETED FINANCIAL OVERHAULS]',
      description: 'Review CWF Financial Advisory case studies. Examine client interest savings metrics, working capital credit limits, and tax compliance overhauls in India.'
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

      {/* Projects Grid Section */}
      <section className="section">
        <div className="container">
          {/* Category Filters */}
          <ul className="portfolio-filters" style={{ display: 'flex', gap: '0.75rem', listStyle: 'none', padding: 0, marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <li key={cat.value}>
                <button
                  onClick={() => setActiveFilter(cat.value)}
                  className="btn"
                  style={{ 
                    padding: '0.4rem 1.1rem', 
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-data)',
                    textTransform: 'uppercase',
                    backgroundColor: activeFilter === cat.value ? 'var(--volt)' : 'var(--panel)',
                    color: activeFilter === cat.value ? 'var(--white)' : 'var(--ink)',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>

          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading projects"></div>
            </div>
          ) : error ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load projects</h3>
              <p>{error.message}</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No project case studies match the selected category filter.</p>
            </div>
          ) : (
            <div className="bento-grid">
              {filteredProjects.map((project, index) => {
                return (
                  <div
                    key={project._id}
                    className="bento-cell solid-ink"
                    onClick={() => openModal(project)}
                    style={{
                      gridColumn: 'span 4',
                      cursor: 'pointer',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      opacity: 1,
                      transform: 'scale(1)',
                      transition: prefersReduced ? 'none' : `opacity 0.4s ease-out ${index * 80}ms, transform 0.4s ease-out ${index * 80}ms`
                    }}
                  >
                    <div style={{ width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', position: 'relative', marginBottom: '1rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(project.coverImage || project.afterImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_500,h_350,c_fill/canyon.jpg', 500)}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      {project.isFeatured && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            left: '0.75rem',
                            backgroundColor: 'var(--volt)',
                            color: 'var(--white)',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            borderRadius: '2px',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-data)'
                          }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          color: 'var(--volt)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          display: 'block',
                          marginBottom: '0.5rem',
                          fontFamily: 'var(--font-data)'
                        }}
                      >
                        {project.serviceCategory.replace('-', ' ')}
                      </span>
                      
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.75rem', flexGrow: 1 }}>
                        {project.title}
                      </h3>
                      
                      {/* CONDITIONAL CARD FOOTER RENDERING BY SEGMENT */}
                      {segment === 'civil' && (
                        <p style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--white)', margin: 0, opacity: 0.8 }}>
                          <MapPin size={16} /> {project.location}
                        </p>
                      )}

                      {segment === 'web' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {project.techStack && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {project.techStack.slice(0, 3).map((tech, idx) => (
                                <span key={idx} style={{ fontSize: '0.65rem', backgroundColor: 'var(--panel)', color: 'var(--ink)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>{tech}</span>
                              ))}
                            </div>
                          )}
                          {project.liveUrl && (
                            <span style={{ fontSize: '0.82rem', color: 'var(--volt)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                              VIEW LIVE SITE <ExternalLink size={14} />
                            </span>
                          )}
                        </div>
                      )}

                      {segment === 'finance' && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                          {project.outcomeMetric && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', margin: 0 }}>
                              🎯 {project.outcomeMetric}
                            </p>
                          )}
                          {project.clientIndustry && (
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>
                              {project.clientIndustry}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Details Modal overlay */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeModal} style={{ backgroundColor: 'rgba(10, 14, 39, 0.85)', zIndex: 9999 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title" style={{ padding: '2.5rem', border: '4px solid var(--ink)', borderRadius: '6px', maxWidth: '850px' }}>
            <button className="modal-close" onClick={closeModal} aria-label="Close modal" style={{ top: '1.5rem', right: '1.5rem', color: 'var(--ink)' }}>
              <X size={24} />
            </button>

            <h2 id="modal-title" style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.75rem', marginBottom: '1.5rem', paddingRight: '2rem' }}>
              {selectedProject.title}
            </h2>

            {/* Slider / Image Container */}
            <div style={{ marginBottom: '2rem', width: '100%' }}>
              {segment === 'civil' ? (
                <BeforeAfterSlider
                  beforeImage={selectedProject.beforeImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'}
                  afterImage={selectedProject.afterImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg'}
                  beforeAlt={`Leakage state of ${selectedProject.title}`}
                  afterAlt={`Waterproofed state of ${selectedProject.title}`}
                />
              ) : (
                <div style={{ width: '100%', height: '350px', borderRadius: '4px', overflow: 'hidden', border: '3px solid var(--ink)' }}>
                  <img
                    src={getOptimizedCloudinaryUrl(selectedProject.coverImage || selectedProject.afterImages?.[0] || 'https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg', 800)}
                    alt={selectedProject.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div className="bento-grid" style={{ gap: '2rem' }}>
              <div style={{ gridColumn: 'span 7' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                  Project Case Study
                </h3>
                <p style={{ whiteSpace: 'pre-line', fontSize: '0.98rem', lineHeight: '1.5', color: 'var(--graphite)' }}>
                  {selectedProject.description}
                </p>
              </div>

              <div className="bento-cell" style={{ gridColumn: 'span 5', padding: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  Specifications
                </h3>
                <ul className="footer-nav" style={{ listStyle: 'none', padding: 0 }}>
                  {/* Civil Specific Specs */}
                  {segment === 'civil' && (
                    <>
                      <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Location</span>
                        <strong style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem' }}>{selectedProject.location}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Client Type</span>
                        <strong style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{selectedProject.clientType}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Area Treated</span>
                        <strong style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem' }} className="data-num">{selectedProject.sqftTreated?.toLocaleString()} SQFT</strong>
                      </li>
                    </>
                  )}

                  {/* Web Specific Specs */}
                  {segment === 'web' && (
                    <>
                      <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Deployment Link</span>
                        {selectedProject.liveUrl ? (
                          <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--volt)', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'none' }}>
                            LIVE LINK <ExternalLink size={12} />
                          </a>
                        ) : (
                          <strong style={{ fontSize: '0.85rem' }}>INTERNAL HUB</strong>
                        )}
                      </li>
                      <li style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Technologies Used</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                          {selectedProject.techStack?.map((tech, i) => (
                            <span key={i} style={{ fontSize: '0.65rem', backgroundColor: 'var(--ink)', color: 'var(--white)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>{tech}</span>
                          ))}
                        </div>
                      </li>
                    </>
                  )}

                  {/* Finance Specific Specs */}
                  {segment === 'finance' && (
                    <>
                      <li style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Restructuring Outcome</span>
                        <strong style={{ color: 'var(--volt)', fontSize: '0.9rem' }}>{selectedProject.outcomeMetric}</strong>
                      </li>
                      <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                        <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Client Industry</span>
                        <strong style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem' }}>{selectedProject.clientIndustry}</strong>
                      </li>
                    </>
                  )}

                  {/* Common Specs */}
                  <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '2px solid var(--ink)' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Completion Date</span>
                    <strong style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem' }} className="data-num">{new Date(selectedProject.completionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }).toUpperCase()}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
