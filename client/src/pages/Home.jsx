import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import LeadForm from '../components/LeadForm.jsx';
import CategoryIcon from '../components/CategoryIcon.jsx';
import { useScrollReveal } from '../hooks/useScrollReveal.js';
import CountUp from '../components/CountUp.jsx';

/**
 * Public Home Page.
 * Displays bento hero segment, dynamically pulls services and testimonials,
 * lists trust milestones, and hooks up the lead contact form.
 */
export default function Home() {
  const { data: servicesData, loading: servicesLoading, error: servicesError, request: fetchServices } = useApi();
  const { data: testimonialsData, request: fetchTestimonials } = useApi();
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [touchStart, setTouchStart] = useState(null);

  // Scroll triggers for page sections
  const [servicesRef, servicesVisible] = useScrollReveal();
  const [comparisonRef, comparisonVisible] = useScrollReveal();
  const [testimonialsRef, testimonialsVisible] = useScrollReveal();
  const [leadRef, leadVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On mobile viewports, all content is fully visible immediately to prevent blank pages or delayed observer triggers.
  const showStats = isMobile || statsVisible;
  const showServices = isMobile || servicesVisible;
  const showComparison = isMobile || comparisonVisible;
  const showTestimonials = isMobile || testimonialsVisible;
  const showLead = isMobile || leadVisible;

  const handleTouchStartTestimonial = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEndTestimonial = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Swipe left (next)
    if (diff > 50) {
      handleNextTestimonial();
    }
    // Swipe right (prev)
    if (diff < -50) {
      handlePrevTestimonial();
    }
    setTouchStart(null);
  };

  useEffect(() => {
    fetchServices('/services').catch(() => {});
    fetchTestimonials('/testimonials').catch(() => {});
  }, [fetchServices, fetchTestimonials]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const services = servicesData?.data || [];
  const testimonials = testimonialsData?.data || [];

  const handleNextTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    if (testimonials.length === 0) return;
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Static fallback sample projects to demonstrate the before/after sweeps instantly
  const demoProjects = [
    {
      title: 'Terrace Slab Waterproofing & Leakage Repair',
      location: 'Kothrud, Pune',
      description: 'Active slab seepage resolved using scientific polyurethane injection and concrete coatings.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Scientific Waterproofing & Inspection | CWF Corporation Pune</title>
        <meta
          name="description"
          content="CWF Corporation Pune provides structural inspections, terrace waterproofing, basement grouting, and water tank sealant services. Book a certified technical site visit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Scientific Waterproofing & Inspection | CWF Corporation Pune" />
        <meta property="og:description" content="CWF Corporation Pune provides structural inspections, terrace waterproofing, basement grouting, and water tank sealant services. Book a certified technical site visit." />
        <meta property="og:image" content="https://res.cloudinary.com/demo/image/upload/w_1200,h_630,c_fill/canyon.jpg" />
        <meta property="og:url" content="https://cwfcorporation.com" />
      </Helmet>

      {/* SECTION 1: HERO */}
      <section 
        style={{
          position: 'relative',
          minHeight: isMobile ? 'calc(100vh - 4.5rem)' : '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#000',
          fontFamily: 'var(--font-heading)'
        }}
      >
        {/* Background video loop - Enabled on mobile for animated visual experience */}
        <video
          src="/hero-bg.mp4"
          poster="/hero-poster.jpg"
          preload="metadata"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: '70% center',
            opacity: 0.55 // Adds contrast overlay for readability
          }}
        />

        {/* Hero content filling height */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isMobile ? 'center' : 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
            height: isMobile ? 'auto' : 'calc(100vh - 4.5rem)',
            padding: isMobile ? '3rem 1.5rem' : '4rem 1.5rem 3.5rem',
            width: '100%'
          }}
          className="container"
        >
          {/* Top Section */}
          <div style={{ maxWidth: '48rem', width: '100%' }}>
            {/* Badge pill */}
            <div 
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1rem',
                animation: 'fadeSlideUp 0.8s ease 0.2s both',
                letterSpacing: '0.5px'
              }}
            >
              Brand & Waterproofing Diagnostics
            </div>

            {/* Heading */}
            <h1 
              style={{
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: 500,
                lineHeight: '1.1',
                letterSpacing: '-0.02em',
                color: '#fff',
                animation: 'fadeSlideUp 0.8s ease 0.4s both',
                margin: 0
              }}
            >
              We don&apos;t chase leaks.<br />We prevent them.
            </h1>
          </div>

          {/* Bottom Section */}
          <div style={{ width: '100%', marginTop: isMobile ? '2rem' : '0' }}>
            {/* Paragraph */}
            <p
              style={{
                fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                lineHeight: '1.6',
                color: 'rgba(255,255,255,0.7)',
                maxWidth: isMobile ? '100%' : '32rem',
                margin: isMobile ? '0 auto 1.5rem' : '0 0 1.5rem',
                animation: 'fadeSlideUp 0.8s ease 0.7s both',
                fontWeight: 300
              }}
            >
              From new construction to existing structures, we provide expert waterproofing consultancy to help you select the right systems, materials, and application strategies.
            </p>

            {/* CTA Button */}
            <div style={{ animation: 'fadeSlideUp 0.8s ease 0.9s both' }}>
              <a
                href="#comparison-section"
                style={{
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Explore Work 
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signal Milestones - Asymmetric Bento Cells */}
      <section ref={statsRef} className="section" style={{ padding: '5rem 0', borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Why Engineers Choose <span style={{ color: 'var(--volt)' }}>CWF</span>
            </h2>
            <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
              Our diagnostic checklists, core drill scans, and supervisor logs guarantee absolute waterproofing success.
            </p>
          </div>

          <div className="bento-grid">
            
            {/* Stat 1: Years (Neutral Panel) */}
            <div 
              className="bento-cell"
              style={{
                gridColumn: 'span 3',
                opacity: showStats ? 1 : 0,
                transform: showStats ? 'translateY(0)' : 'translateY(20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out 50ms, transform 0.4s ease-out 50ms'
              }}
            >
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                <CountUp end={15} isStart={true} />+
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Years in Pune
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Serving housing societies and industrial plants in Pune since 2011.
              </p>
            </div>

            {/* Stat 2: Projects (Solid Ink Fill) */}
            <div 
              className="bento-cell solid-ink"
              style={{
                gridColumn: 'span 3',
                opacity: showStats ? 1 : 0,
                transform: showStats ? 'translateY(0)' : 'translateY(20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out 100ms, transform 0.4s ease-out 100ms'
              }}
            >
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--white)', marginBottom: '0.5rem' }}>
                <CountUp end={1200} isStart={true} />+
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Slab Audits Completed
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, opacity: 0.8 }}>
                Core scanning, moisture mappings, and injection oversight.
              </p>
            </div>

            {/* Stat 3: Report Accuracy (Neutral Panel) */}
            <div 
              className="bento-cell"
              style={{
                gridColumn: 'span 3',
                opacity: showStats ? 1 : 0,
                transform: showStats ? 'translateY(0)' : 'translateY(20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out 150ms, transform 0.4s ease-out 150ms'
              }}
            >
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                <CountUp end={100} isStart={true} />%
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Scientific Reports
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Visual pathways, concrete condition data, and execution blueprints.
              </p>
            </div>

            {/* Stat 4: Certification (Solid Volt Fill) */}
            <div 
              className="bento-cell solid-volt"
              style={{
                gridColumn: 'span 3',
                opacity: showStats ? 1 : 0,
                transform: showStats ? 'translateY(0)' : 'translateY(20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.4s ease-out 200ms, transform 0.4s ease-out 200ms'
              }}
            >
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3.2rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--white)', marginBottom: '0.5rem' }}>
                ISO 9001
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem' }}>
                Certified Consultancy
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, opacity: 0.8 }}>
                Formally audited processes for moisture diagnostic engineering.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Waterproofing Services Overview - Alternating Bento Cards */}
      <section ref={servicesRef} className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Services Overview
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              We inspect water pathways and supervise execution. Our categories represent specialized structural treatments:
            </p>
          </div>

          {servicesLoading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading Services"></div>
            </div>
          ) : servicesError ? (
            <div className="error-panel">
              <h3 className="error-title">Unable to load services</h3>
              <p>{servicesError.message}</p>
            </div>
          ) : (
            <div className="bento-grid">
              {services.slice(0, 3).map((service, index) => {
                // Determine alternating cell class types
                // Card 1: Neutral panel, Card 2: Solid Ink (dark), Card 3: Solid Volt (cobalt blue)
                let cellClass = 'bento-cell';
                let textStyle = { color: 'var(--ink)' };
                let categoryColor = 'var(--volt)';
                let btnClass = 'btn btn-outline';
                
                if (index === 1) {
                  cellClass = 'bento-cell solid-ink';
                  textStyle = { color: 'var(--white)' };
                  categoryColor = 'var(--volt)';
                  btnClass = 'btn btn-primary';
                } else if (index === 2) {
                  cellClass = 'bento-cell solid-volt';
                  textStyle = { color: 'var(--white)' };
                  categoryColor = 'var(--white)';
                  btnClass = 'btn btn-outline';
                }

                return (
                  <div 
                    key={service._id} 
                    className={cellClass}
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      opacity: showServices ? 1 : 0,
                      transform: showServices ? 'translateY(0)' : 'translateY(25px)',
                      transition: prefersReduced ? 'none' : `opacity 0.5s ease-out ${index * 80}ms, transform 0.5s ease-out ${index * 80}ms`,
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
                      <p style={{ fontSize: '0.92rem', opacity: index === 0 ? 0.8 : 0.9, ...textStyle, fontFamily: 'var(--font-body)', lineHeight: '1.5' }}>
                        {service.shortDescription}
                      </p>
                    </div>
                    <div style={{ marginTop: '1.5rem', zIndex: 10 }}>
                      <Link to={`/services/${service.slug}`} className={btnClass} style={{ width: '100%', textAlign: 'center', border: index === 1 ? 'none' : undefined }}>
                        View Diagnostics
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-secondary">
              Browse Diagnostics Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Services scrolling marquee block */}
      <div className="marquee" style={{ margin: '2rem 0 4rem' }}>
        <div className="marquee__row">
          <div className="marquee__track">
            <span className="mq">Concrete Scanning<span className="mq__plus">+</span></span>
            <span className="mq">Moisture Mapping<span className="mq__plus">+</span></span>
            <span className="mq">Thermal Imaging<span className="mq__plus">+</span></span>
            <span className="mq">Polyurethane Injection<span className="mq__plus">+</span></span>
            <span className="mq">Terrace Waterproofing<span className="mq__plus">+</span></span>
            <span className="mq">Basement Grouting<span className="mq__plus">+</span></span>
            <span className="mq">Structural Audits<span className="mq__plus">+</span></span>
            {/* Repeat for seamless scrolling */}
            <span className="mq">Concrete Scanning<span className="mq__plus">+</span></span>
            <span className="mq">Moisture Mapping<span className="mq__plus">+</span></span>
            <span className="mq">Thermal Imaging<span className="mq__plus">+</span></span>
            <span className="mq">Polyurethane Injection<span className="mq__plus">+</span></span>
            <span className="mq">Terrace Waterproofing<span className="mq__plus">+</span></span>
            <span className="mq">Basement Grouting<span className="mq__plus">+</span></span>
            <span className="mq">Structural Audits<span className="mq__plus">+</span></span>
          </div>
        </div>
        <div className="marquee__row" style={{ marginTop: '8px' }}>
          <div className="marquee__track reverse">
            <span className="mq mq--outline">Water Tank Sealant<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Epoxy Grouting<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Crystalline System<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Wet Slab Audits<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Membrane Coatings<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Dampness Diagnostics<span className="mq__plus mq__plus--teal">+</span></span>
            {/* Repeat */}
            <span className="mq mq--outline">Water Tank Sealant<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Epoxy Grouting<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Crystalline System<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Wet Slab Audits<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Membrane Coatings<span className="mq__plus mq__plus--teal">+</span></span>
            <span className="mq mq--outline">Dampness Diagnostics<span className="mq__plus mq__plus--teal">+</span></span>
          </div>
        </div>
      </div>

      {/* Featured Project Showcase - Modern Border & Volt Slider */}
      <section ref={comparisonRef} id="comparison-section" className="section" style={{ borderTop: '1px solid rgba(138, 203, 193, 0.12)', borderBottom: '1px solid rgba(138, 203, 193, 0.12)', background: 'var(--panel)', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Featured Case Study
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              Compare active slab water leakage before remediation against finalized polyurethane membranes.
            </p>
          </div>

          <div className="bento-grid" style={{ alignItems: 'center' }}>
            <div
              style={{
                gridColumn: 'span 7',
                opacity: showComparison ? 1 : 0,
                transform: showComparison ? 'translateX(0)' : 'translateX(-20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              <BeforeAfterSlider
                beforeImage="/terrace_before.webp"
                afterImage="/terrace_waterproofing.webp"
                beforeAlt="Damaged wet slab before treatment"
                afterAlt="Waterproofed concrete slab after treatment"
              />
            </div>
            
            <div
              className="bento-cell solid-ink"
              style={{
                gridColumn: 'span 5',
                opacity: showComparison ? 1 : 0,
                transform: showComparison ? 'translateX(0)' : 'translateX(20px)',
                transition: prefersReduced ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
                padding: '2.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {demoProjects[0].title}
              </h3>
              <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: 'bold', color: 'var(--volt)', fontFamily: 'var(--font-data)', fontSize: '0.85rem', textTransform: 'uppercase', margin: '0 0 1rem' }}>
                <Activity size={18} /> Location: {demoProjects[0].location}
              </p>
              <p style={{ color: 'var(--white)', opacity: 0.9, lineHeight: '1.6', fontSize: '0.95rem' }}>
                {demoProjects[0].description} We conducted core scan mapping and thermal surveys. Execution was fully supervised with certified polyurethane coatings.
              </p>
              <Link to="/projects" className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', textAlign: 'center', border: 'none' }}>
                Browse Case Studies
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Bento Block */}
      {testimonials.length > 0 && (
        <section ref={testimonialsRef} className="section" style={{ padding: '2rem 0', borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
          <div className="container">
            <div 
              className="bento-cell"
              onTouchStart={handleTouchStartTestimonial}
              onTouchEnd={handleTouchEndTestimonial}
              style={{
                background: '#10202A',
                border: '2px solid var(--volt)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(138, 203, 193, 0.1)',
                opacity: showTestimonials ? 1 : 0,
                transform: showTestimonials ? 'translateY(0)' : 'translateY(25px)',
                transition: prefersReduced ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
                maxWidth: '850px',
                margin: '0 auto',
                padding: '3rem',
                position: 'relative',
                touchAction: 'pan-y'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.4rem', fontStyle: 'italic', lineHeight: '1.6', color: '#ffffff', margin: '0 0 2rem' }}>
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--volt)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                  {testimonials[activeTestimonial].clientName}
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Client Type: {testimonials[activeTestimonial].clientType}
                </div>
              </div>
              
              {testimonials.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2.5rem' }}>
                  <button onClick={handlePrevTestimonial} className="btn btn-outline" style={{ padding: '0.50rem', borderColor: 'rgba(255, 255, 255, 0.3)', color: 'var(--white)' }} aria-label="Previous review">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNextTestimonial} className="btn btn-outline" style={{ padding: '0.50rem', borderColor: 'rgba(255, 255, 255, 0.3)', color: 'var(--white)' }} aria-label="Next review">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture CTA Form */}
      <section ref={leadRef} className="section" id="inquiry-section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Schedule Onsite Survey
            </h2>
            <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
              Fill in your building coordinates. Our diagnostic team will coordinate for core drilling or scanning in Pune.
            </p>
          </div>
          <div
            className="bento-cell"
            style={{
              opacity: showLead ? 1 : 0,
              transform: showLead ? 'translateY(0)' : 'translateY(25px)',
              transition: prefersReduced ? 'none' : 'opacity 0.6s ease-out, transform 0.6s ease-out',
              maxWidth: '700px',
              margin: '0 auto',
              padding: '2.5rem',
              backgroundColor: 'var(--panel)'
            }}
          >
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
