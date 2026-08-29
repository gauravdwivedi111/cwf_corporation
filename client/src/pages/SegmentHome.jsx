import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Activity, MapPin, ExternalLink, Calendar, User } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import LeadForm from '../components/LeadForm.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';

/**
 * Segment Landing Page (/:segment).
 * Displays segment-specific Hero, Services catalog overview, Projects case studies,
 * client Testimonials, Team highlights, and Contact LeadForm.
 */
export default function SegmentHome() {
  const { segment } = useParams();
  const { data: segmentData, loading: segmentLoading, error: segmentError, request: fetchSegment } = useApi();
  const { data: servicesData, loading: servicesLoading, request: fetchServices } = useApi();
  const { data: projectsData, loading: projectsLoading, request: fetchProjects } = useApi();
  const { data: testimonialsData, request: fetchTestimonials } = useApi();
  const { data: teamData, request: fetchTeam } = useApi();

  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Reset state on segment change
    setActiveTestimonial(0);

    // Fetch all resources scoped to the active segment
    fetchSegment(`/segments/${segment}`).catch(() => {});
    fetchServices(`/services?segment=${segment}`).catch(() => {});
    fetchProjects(`/projects?segment=${segment}`).catch(() => {});
    fetchTestimonials(`/testimonials?segment=${segment}`).catch(() => {});
    fetchTeam(`/team?segment=${segment}`).catch(() => {});
  }, [segment, fetchSegment, fetchServices, fetchProjects, fetchTestimonials, fetchTeam]);

  const info = segmentData?.data;
  const services = servicesData?.data || [];
  const projects = projectsData?.data || [];
  const testimonials = testimonialsData?.data || [];
  const team = teamData?.data || [];

  const handleNextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (segmentLoading) {
    return (
      <div className="spinner-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" aria-label="Loading segment landing page"></div>
      </div>
    );
  }

  if (segmentError || !info) {
    return (
      <section className="section">
        <div className="container text-center" style={{ padding: '4rem 2rem' }}>
          <div className="error-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 className="error-title">Segment Not Found</h3>
            <p>The segment '{segment}' is not recognized or is offline.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Return to Segment Hub
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${info.displayName} | CWF Consulting Corporation`}</title>
        <meta name="description" content={info.tagline + ' — ' + info.heroDescription} />
      </Helmet>

      {/* HERO SECTION */}
      <section 
        style={segment === 'finance' ? {
          position: 'relative',
          padding: isMobile ? '6rem 0' : '10rem 0 8rem',
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: isMobile ? 'center' : 'right center',
          borderBottom: '3px solid var(--ink)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        } : {
          position: 'relative',
          padding: '8rem 0 6rem',
          backgroundColor: '#050716',
          borderBottom: '3px solid var(--ink)',
          overflow: 'hidden'
        }}
      >
        {/* Subtle grid lines background (only for non-finance segments) */}
        {segment !== 'finance' ? (
          <div className="bento-canvas" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15 }}></div>
        ) : (
          /* Split-visibility gradient overlay for finance hero */
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: isMobile 
                ? 'linear-gradient(to bottom, rgba(5, 7, 22, 0.8) 0%, rgba(5, 7, 22, 0.96) 100%)'
                : 'linear-gradient(to right, rgba(5, 7, 22, 1) 0%, rgba(5, 7, 22, 0.9) 35%, rgba(5, 7, 22, 0.45) 60%, transparent 85%)',
              zIndex: 1 
            }} 
          />
        )}
        
        <div 
          className="container" 
          style={segment === 'finance' ? {
            position: 'relative', 
            zIndex: 5,
            textAlign: 'left',
            marginLeft: 0,
            marginRight: 'auto',
            maxWidth: isMobile ? '100%' : '58%'
          } : {
            position: 'relative', 
            zIndex: 5 
          }}
        >
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.75rem', animation: 'fadeSlideUp 0.8s ease 0.2s both' }}>
            [DIVISION: {info.displayName.toUpperCase()}]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--white)', textTransform: 'uppercase', fontSize: 'clamp(2rem, 5vw, 3.75rem)', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: segment === 'finance' ? 'none' : '800px', animation: 'fadeSlideUp 0.8s ease 0.4s both' }}>
            {info.tagline}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.15rem)', lineHeight: '1.6', maxWidth: segment === 'finance' ? 'none' : '650px', margin: '0 0 2rem', animation: 'fadeSlideUp 0.8s ease 0.7s both' }}>
            {info.heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeSlideUp 0.8s ease 0.9s both' }}>
            <a href="#services" className="btn btn-primary">Our Services</a>
            <a href="#contact" className="btn btn-secondary">Get a Proposal</a>
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section id="services" className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Services Catalog
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              We provide structured scientific scopes for {info.displayName.toLowerCase()} projects:
            </p>
          </div>

          {servicesLoading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading Services"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No services listed under this segment currently.</p>
            </div>
          ) : (
            <div className="bento-grid">
              {services.slice(0, 3).map((service, index) => {
                return (
                  <div 
                    key={service._id} 
                    className="bento-cell solid-ink"
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      padding: '2rem'
                    }}
                  >
                    <div style={{ width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(service.coverImage, 400)}
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
                      <h3 style={{ fontSize: '1.25rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {service.title}
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--white)', opacity: 0.85, fontFamily: 'var(--font-body)', lineHeight: '1.5', marginBottom: '1rem' }}>
                        {service.shortDescription}
                      </p>

                      {/* Dynamic fields inside list cards */}
                      {segment === 'civil' && service.warrantyYears && (
                        <div style={{ display: 'inline-block', fontSize: '0.78rem', color: 'var(--volt)', fontFamily: 'var(--font-data)', fontWeight: 'bold', border: '1.5px solid var(--volt)', padding: '0.15rem 0.5rem', borderRadius: '2px' }}>
                          {service.warrantyYears} YEARS WARRANTY
                        </div>
                      )}
                      {segment === 'web' && service.projectTimeline && (
                        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-data)' }}>
                          🛠️ {service.projectTimeline} | <span style={{ textTransform: 'capitalize' }}>{service.pricingModel}</span> billing
                        </div>
                      )}
                      {segment === 'finance' && service.loanRangeMin && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--volt)', fontFamily: 'var(--font-data)', fontWeight: 'bold' }}>
                          ₹ {(service.loanRangeMin/100000).toFixed(0)}L - {(service.loanRangeMax/10000000).toFixed(1)}Cr limit range
                        </div>
                      )}
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                      <Link to={`/${segment}/services/${service.slug}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to={`/${segment}/services`} className="btn btn-secondary">
              Browse All Services
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section id="projects" className="section" style={{ backgroundColor: 'var(--panel)', borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Featured Case Studies
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              Explore how we delivered success for {info.displayName.toLowerCase()} clients:
            </p>
          </div>

          {projectsLoading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading Projects"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No featured projects listed currently.</p>
            </div>
          ) : segment === 'civil' ? (
            // Special slider for Civil segment
            <div className="bento-grid" style={{ gap: '2.5rem', alignItems: 'center' }}>
              <div style={{ gridColumn: 'span 7' }}>
                <BeforeAfterSlider
                  beforeImage={projects[0]?.beforeImages?.[0] || '/terrace_before.webp'}
                  afterImage={projects[0]?.afterImages?.[0] || '/terrace_waterproofing.webp'}
                  beforeAlt="Before Treatment"
                  afterAlt="After Waterproofing"
                />
              </div>
              <div className="bento-cell" style={{ gridColumn: 'span 5', margin: 0, padding: '2rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--volt)', fontWeight: 'bold', fontFamily: 'var(--font-data)' }}>CASE STUDY HIGHLIGHT</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.4rem', margin: '0.5rem 0 1rem' }}>
                  {projects[0]?.title}
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--graphite)', marginBottom: '1.5rem' }}>
                  {projects[0]?.description}
                </p>
                <div style={{ borderTop: '2px solid var(--ink)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-data)' }}>LOCATION:</span>
                    <strong style={{ fontFamily: 'var(--font-data)' }}>{projects[0]?.location}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ fontFamily: 'var(--font-data)' }}>AREA TREATED:</span>
                    <strong style={{ fontFamily: 'var(--font-data)' }} className="data-num">{projects[0]?.sqftTreated?.toLocaleString()} SQFT</strong>
                  </div>
                </div>
                <Link to={`/${segment}/projects`} className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'block', textAlign: 'center' }}>
                  View All Civil Projects
                </Link>
              </div>
            </div>
          ) : (
            // Grid for Web and Finance segments
            <>
              <div className="bento-grid">
                {projects.slice(0, 3).map((project) => (
                  <div 
                    key={project._id} 
                    className="bento-cell solid-ink"
                    style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', padding: '1.5rem', margin: 0 }}
                  >
                    <div style={{ height: '180px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(project.coverImage || '/web_proj_agri.webp', 400)}
                        alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {project.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)', lineHeight: '1.4', marginBottom: '1rem' }}>
                        {project.description}
                      </p>

                      {/* Web Project rendering */}
                      {segment === 'web' && (
                        <div>
                          {project.techStack && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                              {project.techStack.map((tech, i) => (
                                <span key={i} style={{ fontSize: '0.68rem', backgroundColor: 'var(--panel)', color: 'var(--ink)', padding: '0.15rem 0.4rem', borderRadius: '2px', fontFamily: 'var(--font-data)' }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--volt)', fontSize: '0.82rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'var(--font-data)' }}>
                              VIEW LIVE SITE <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Finance Project rendering */}
                      {segment === 'finance' && (
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                          {project.outcomeMetric && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--volt)', fontWeight: 'bold', margin: '0 0 0.25rem' }}>
                              🎯 {project.outcomeMetric}
                            </p>
                          )}
                          {project.clientIndustry && (
                            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', margin: 0, fontFamily: 'var(--font-data)' }}>
                              Industry: {project.clientIndustry}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <Link to={`/${segment}/projects`} className="btn btn-secondary">
                  Browse All Case Studies
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TEAM SECTION */}
      {team.length > 0 && (
        <section className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
                Lead Division Team
              </h2>
              <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
                Consult with our experienced Pune advisors and structural engineers:
              </p>
            </div>

            <div className="bento-grid" style={{ justifyContent: 'center' }}>
              {team.map((member) => (
                <div 
                  key={member._id}
                  className="bento-cell"
                  style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem', margin: 0 }}
                >
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--ink)', marginBottom: '1.25rem' }}>
                    <img
                      src={member.photo || 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/sample.jpg'}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                    {member.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--volt)', fontWeight: 'bold', fontFamily: 'var(--font-data)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    {member.designation}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--graphite)', margin: 0, lineHeight: '1.4' }}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section" style={{ backgroundColor: 'var(--panel)', borderBottom: '3px solid var(--ink)', padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '800px', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Client Success Reviews</h2>
            </div>

            <div className="bento-cell" style={{ padding: '3rem', margin: 0, textAlign: 'center', position: 'relative', border: '3px solid var(--ink)' }}>
              <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--ink)', lineHeight: '1.6', marginBottom: '2rem', fontFamily: 'var(--font-body)' }}>
                &ldquo;{testimonials[activeTestimonial].text}&rdquo;
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ margin: '0 0 0.25rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                  {testimonials[activeTestimonial].clientName}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--volt)', fontWeight: 'bold', fontFamily: 'var(--font-data)', textTransform: 'uppercase' }}>
                  {testimonials[activeTestimonial].clientType} Client
                </span>
              </div>

              {testimonials.length > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2rem' }}>
                  <button onClick={handlePrevTestimonial} className="btn btn-outline" style={{ padding: '0.5rem', minWidth: 'auto', borderRadius: '50%' }} aria-label="Previous review">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={handleNextTestimonial} className="btn btn-outline" style={{ padding: '0.5rem', minWidth: 'auto', borderRadius: '50%' }} aria-label="Next review">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* LEAD CAPTURE FORM */}
      <section id="contact" className="section">
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="bento-cell" style={{ padding: '2.5rem', border: '3px solid var(--ink)', backgroundColor: 'var(--panel)', margin: 0 }}>
            <LeadForm defaultSegment={segment} />
          </div>
        </div>
      </section>
    </>
  );
}
