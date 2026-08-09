import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import BeforeAfterSlider from '../components/BeforeAfterSlider.jsx';
import LeadForm from '../components/LeadForm.jsx';

/**
 * Public Home Page.
 * Displays hero segment, dynamically pulls services and testimonials,
 * lists trust milestones, and hooks up the lead contact form.
 */
export default function Home() {
  const { data: servicesData, loading: servicesLoading, error: servicesError, request: fetchServices } = useApi();
  const { data: testimonialsData, request: fetchTestimonials } = useApi();
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    fetchServices('/services').catch(() => {});
    fetchTestimonials('/testimonials').catch(() => {});
  }, [fetchServices, fetchTestimonials]);

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
      before: 'https://res.cloudinary.com/demo/image/upload/v1312419830/sample.jpg', // Placeholder Cloudinary images
      after: 'https://res.cloudinary.com/demo/image/upload/v1312419830/sample.jpg',
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
      </Helmet>

      {/* Hero Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '6.5rem 0' }}>
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'var(--color-white)', fontSize: '3rem', marginBottom: '1.25rem' }}>
              Scientific Waterproofing Diagnostics for Pune Properties
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              We don&apos;t guess. We inspect, analyze, and prescribe engineered solutions to protect your structural concrete from dampness, slab cracks, and basement leakage.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">
                Book Structural Inspection
              </Link>
              <Link to="/services" className="btn btn-secondary" style={{ color: 'var(--color-white)', borderColor: 'var(--color-white)' }}>
                View Diagnostics Catalog
              </Link>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ border: '8px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
              <BeforeAfterSlider
                beforeImage="https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg"
                afterImage="https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg"
                beforeAlt="Roof slab leaking cracks dampness"
                afterAlt="Protected sealed roof slab after CWF polyurethane coating"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signal Milestones */}
      <section className="section section-bg" style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container grid-4">
          <div className="stat-item card">
            <div className="stat-number">15+</div>
            <div className="stat-title">Years in Pune</div>
            <p className="stat-description" style={{ margin: 0 }}>Serving apartments and industrial structures since 2011.</p>
          </div>
          <div className="stat-item card">
            <div className="stat-number">1,200+</div>
            <div className="stat-title">Projects Diagnosed</div>
            <p className="stat-description" style={{ margin: 0 }}>Rigorous slab audits, facades, and wet area surveys.</p>
          </div>
          <div className="stat-item card">
            <div className="stat-number">100%</div>
            <div className="stat-title">Scientific Reports</div>
            <p className="stat-description" style={{ margin: 0 }}>Clear diagnostic readings before proposing repair methods.</p>
          </div>
          <div className="stat-item card">
            <div className="stat-number">ISO</div>
            <div className="stat-title">9001 Certified</div>
            <p className="stat-description" style={{ margin: 0 }}>Recognized waterproofing consultancy and inspection standards.</p>
          </div>
        </div>
      </section>

      {/* Waterproofing Services Overview */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2>Waterproofing Inspection & Consultation Categories</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto' }}>
              We specialize in detecting water ingress pathways and directing remediation crews on Pune residential and commercial properties.
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
            <div className="grid-3">
              {services.slice(0, 3).map((service) => (
                <div key={service._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="card-image-wrapper">
                    <img
                      src={getOptimizedCloudinaryUrl(service.coverImage, 400)}
                      alt={service.title}
                      className="card-img"
                      loading="lazy"
                    />
                  </div>
                  <div style={{ marginTop: '1.25rem', flexGrow: 1 }}>
                    <h3>{service.title}</h3>
                    <p style={{ fontSize: '0.92rem' }}>{service.shortDescription}</p>
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link to={`/services/${service.slug}`} className="btn btn-outline" style={{ width: '100%' }}>
                      View Diagnostics
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/services" className="btn btn-secondary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project Showcase */}
      <section className="section section-bg">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2>Featured Waterproofing Portfolios</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto' }}>
              Drag the sliders below to sweep between the damaged state and the finalized polyurethane seals.
            </p>
          </div>

          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <BeforeAfterSlider
                beforeImage="https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg"
                afterImage="https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg"
                beforeAlt="Damaged wet slab before treatment"
                afterAlt="Waterproofed concrete slab after treatment"
              />
            </div>
            <div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{demoProjects[0].title}</h3>
              <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontWeight: '600', color: 'var(--color-primary-mid)' }}>
                <Activity size={18} /> Location: {demoProjects[0].location}
              </p>
              <p>{demoProjects[0].description}</p>
              <p>Our consultation included core drilling tests, crack surveys, and thermal imaging to seal leak origins. The repair crew applied double polyurethane lining under our technical supervision.</p>
              <Link to="/projects" className="btn btn-outline" style={{ marginTop: '1rem' }}>
                Browse Portfolio Grid
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Slider */}
      {testimonials.length > 0 && (
        <section className="section" style={{ borderBottom: '1px solid var(--color-gray-border)' }}>
          <div className="container">
            <div className="testimonial-carousel card">
              <div className="testimonial-slide">
                <p className="testimonial-text">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                <div className="testimonial-author">
                  {testimonials[activeTestimonial].clientName}
                </div>
                <div className="testimonial-meta">
                  Client Type: {testimonials[activeTestimonial].clientType}
                </div>
              </div>
              
              {testimonials.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                  <button onClick={handlePrevTestimonial} className="btn btn-outline" style={{ padding: '0.5rem' }} aria-label="Previous review">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={handleNextTestimonial} className="btn btn-outline" style={{ padding: '0.5rem' }} aria-label="Next review">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Lead Capture CTA Form */}
      <section className="section" id="inquiry-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Get a Scientific Inspection Quote</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto' }}>
              Fill in your building details below. Our technical supervisor will reach out to schedule an onsite inspection in Pune.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>
    </>
  );
}
