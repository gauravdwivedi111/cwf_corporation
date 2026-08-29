import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, ArrowLeft, ClipboardList, HelpCircle, Code, DollarSign, Calendar, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import LeadForm from '../components/LeadForm.jsx';

/**
 * Dynamic Service Details Page.
 * Fetches a single service detail and displays segment-specific properties.
 */
export default function ServiceDetail() {
  const { segment, slug } = useParams();
  const { data: serviceData, loading, error, request: fetchService } = useApi();

  useEffect(() => {
    fetchService(`/services/${slug}`).catch(() => {});
  }, [slug, fetchService]);

  const service = serviceData?.data;

  // Custom diagnostic content mapping based on categories
  const diagnosticContent = {
    // Civil Waterproofing
    terrace: {
      problem: 'Rainwater accumulation, concrete micro-cracks, and expansion joint breakdown leading to ceiling leaks.',
      approach: 'Moisture mapping, structural visual inspection, and thermal scan of joint borders.',
      solutions: 'Cleaning slab, sealing structural cracks with polyurethane injection, and applying an elastomeric multi-layer membrane.',
    },
    basement: {
      problem: 'Hydrostatic pressure pushing groundwater through floor slabs, wall cracks, and plumbing entries.',
      approach: 'Slab moisture testing, scanning for hidden water tables, and inspecting foundation details.',
      solutions: 'High-pressure PU grouting in wall-floor joints, setting negative-side crystalline coatings, and cavity drainage.',
    },
    bathroom: {
      problem: 'Broken drain trap seals, deteriorated tile grout, and failure of tile-underlayment waterproofing.',
      approach: 'Testing drain trap lines, dye tests, and moisture readings behind tiled walls.',
      solutions: 'Slab stripping, setting high-performance epoxy grout seals, and applying waterproofing coatings under tile layers.',
    },
    tank: {
      problem: 'Cracks in concrete tank walls causing chemical water loss or external dirt seepages.',
      approach: 'Inspecting internal walls, dye checks for fissures, and checking pipeline junctions.',
      solutions: 'Non-toxic, food-grade crystalline coating application and filling tank cracks using structural epoxy mortars.',
    },
    facade: {
      problem: 'Wind-driven rain ingress through porous external brickwork, plaster fractures, and windows.',
      approach: 'Inspecting external walls from scaffolds and checking sealants around window panes.',
      solutions: 'Applying breathable silane-siloxane water repellent coatings and filling structural wall plaster cracks.',
    },
    'injection-grouting': {
      problem: 'Structural voids or honeycombs in concrete slabs and columns compromising density.',
      approach: 'Ultrasonic pulse velocity testing to locate internal honeycombs and voids.',
      solutions: 'Drilling ports at intersections and injecting low-viscosity structural epoxy or expanding polyurethane grout.',
    },

    // Web & Software
    'e-commerce': {
      problem: 'Friction in checkout flows, checkout abandonment, slow database search execution, or lack of payment gateways.',
      approach: 'Core web vitals audit, secure payment gateway review, and MongoDB schema queries diagnostics.',
      solutions: 'Engage in Next.js/Stripe multi-currency portals, integrate real-time inventory updates, and implement clean caching layers.',
    },
    'corporate-site': {
      problem: 'Static site performance degradation, high bounce rates, and outdated marketing capabilities.',
      approach: 'Speed indexing checks, accessibility audits, and search engine crawling reports.',
      solutions: 'Deploy Next.js server-side static rendering, wire up headless CMS platforms, and optimize image assets.',
    },
    'web-app': {
      problem: 'Complex user role security flaws, latency in API endpoints, and scaling difficulties on standard servers.',
      approach: 'Endpoint load tests, penetration audits, and Sequelize query optimization audits.',
      solutions: 'Refactor into TypeScript-Express backend patterns, containerize using Docker, and configure auto-scaling AWS instances.',
    },
    'seo-maintenance': {
      problem: 'Keywords ranking degradation, legacy module security vulnerabilities, and platform downtime errors.',
      approach: 'Crawling diagnostics via GA4/Search Console and continuous telemetry review (Sentry/Sln).',
      solutions: 'Deliver technical SEO patches, execute monthly package updates, and configure continuous system heartbeat logs.',
    },
    'custom-development': {
      problem: 'Data discrepancies across disjoint legacy systems and bottlenecks in high-concurrency microservices.',
      approach: 'Data schema sync audit and gRPC request tracing.',
      solutions: 'Implement lightweight microservices in Go/Python, build custom REST APIs, and coordinate secure data queues.',
    },

    // Financial Advisory
    'business-loan': {
      problem: 'High cost of corporate loans, poor credit ratings, and lack of structuring expertise for CMA submissions.',
      approach: 'Audit balance sheet metrics, verify CMA projections, and inspect collateral assets valuations.',
      solutions: 'Structure corporate loans with competitive interest rates and coordinate bank representations.',
    },
    'working-capital': {
      problem: 'EBITDA cash flow mismatch, inventory gaps, and high debtor turnaround cycles.',
      approach: 'Analyse cash conversion cycles, debtor aging structures, and liquidity limits.',
      solutions: 'Secure structured Cash Credit (CC) limits, factoring services, or trade finance Letter of Credit (LC) lines.',
    },
    'investment-advisory': {
      problem: 'Sub-optimal asset allocation yields, taxation losses on gains, and uncoordinated portfolio risks.',
      approach: 'Run mutual funds audit metrics, risk profile checks, and correlate asset coefficients.',
      solutions: 'Provide HNW wealth strategies, custom PMS allocation plans, and tax-efficient mutual fund strategies.',
    },
    'tax-consultancy': {
      problem: 'Over-taxation liability on dynamic structures, auditing compliance errors, and GST representation issues.',
      approach: 'Review tax filing records and model corporate deduction limits.',
      solutions: 'Construct legally compliant corporate tax structures and represent clients in tax audits.',
    },
    'personal-loan': {
      problem: 'Unsecured personal loan approvals blocked by low credit profiling or high interest margin rates.',
      approach: 'Check CIBIL score details, evaluate debt-to-income limits, and scan bank products.',
      solutions: 'Coordinate personal loans across top banking channels at competitive floating interest margins.',
    }
  };

  const currentDiagnostics = service ? (diagnosticContent[service.category] || diagnosticContent.terrace) : null;

  return (
    <>
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" aria-label="Loading service details"></div>
        </div>
      ) : error ? (
        <section className="section">
          <div className="container">
            <div className="error-panel">
              <h3 className="error-title">Could not load service details</h3>
              <p>{error.message}</p>
              <Link to={`/${segment}/services`} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                <ArrowLeft size={18} /> Back to Services
              </Link>
            </div>
          </div>
        </section>
      ) : !service ? (
        <section className="section">
          <div className="container text-center">
            <h3>Service not found</h3>
            <p>The requested category does not exist.</p>
            <Link to={`/${segment}/services`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Services
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Helmet>
            <title>{`${service.title} | ${segment.toUpperCase()} Division CWF`}</title>
            <meta name="description" content={service.shortDescription} />
          </Helmet>

          {/* Banner */}
          <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', padding: '3.5rem 0' }}>
            <div className="container">
              <Link to={`/${segment}/services`} style={{ color: 'var(--volt)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'var(--font-data)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <ArrowLeft size={18} /> Back to Services
              </Link>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem' }}>
                {service.title}
              </h1>
              <p style={{ color: 'var(--ink)', opacity: 0.8, margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontFamily: 'var(--font-data)' }}>
                Category: {service.category.replace('-', ' ')}
              </p>
            </div>
          </section>

          {/* Page Grid */}
          <section className="section">
            <div className="container bento-grid" style={{ gap: '2rem' }}>
              
              {/* Left Side - Details Bento Column */}
              <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                
                {/* Visual Cover Image */}
                <div style={{ borderRadius: '6px', border: '3px solid var(--ink)', overflow: 'hidden', height: '400px' }}>
                  <img
                    src={getOptimizedCloudinaryUrl(service.coverImage, 800)}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Overview Text */}
                <div className="bento-cell" style={{ margin: 0 }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Overview
                  </h2>
                  <div 
                    style={{ fontSize: '1.05rem', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: service.fullDescription }}
                  />

                  {/* CONDITIONAL EXTRA DETAILS BLOCK */}
                  {segment === 'civil' && service.warrantyYears && (
                    <div style={{ marginTop: '2rem', borderTop: '2px solid var(--ink)', paddingTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ShieldCheck size={28} style={{ color: 'var(--volt)' }} />
                      <div>
                        <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.85rem' }}>Division Warranty</h4>
                        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--graphite)' }}>This diagnostic scope carries a certified <strong>{service.warrantyYears}-Year</strong> structural warranty.</p>
                      </div>
                    </div>
                  )}

                  {segment === 'web' && (
                    <div style={{ marginTop: '2rem', borderTop: '2px solid var(--ink)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', margin: 0 }}>Implementation Profile</h3>
                      <div className="bento-grid" style={{ gap: '1rem' }}>
                        <div className="bento-cell" style={{ gridColumn: 'span 4', margin: 0, padding: '1rem' }}>
                          <Clock size={20} style={{ color: 'var(--volt)', marginBottom: '0.25rem' }} />
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', color: 'var(--graphite)' }}>Expected Timeline</span>
                          <strong>{service.projectTimeline}</strong>
                        </div>
                        <div className="bento-cell" style={{ gridColumn: 'span 4', margin: 0, padding: '1rem' }}>
                          <DollarSign size={20} style={{ color: 'var(--volt)', marginBottom: '0.25rem' }} />
                          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', color: 'var(--graphite)' }}>Pricing Model</span>
                          <strong style={{ textTransform: 'capitalize' }}>{service.pricingModel}</strong>
                        </div>
                        {service.techStack && (
                          <div className="bento-cell" style={{ gridColumn: 'span 4', margin: 0, padding: '1rem' }}>
                            <Code size={20} style={{ color: 'var(--volt)', marginBottom: '0.25rem' }} />
                            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', display: 'block', color: 'var(--graphite)' }}>Primary Tech Stack</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                              {service.techStack.slice(0, 3).map((tech, idx) => (
                                <span key={idx} style={{ fontSize: '0.65rem', backgroundColor: 'var(--ink)', color: 'var(--white)', padding: '0.1rem 0.35rem', borderRadius: '2px' }}>{tech}</span>
                              ))}
                              {service.techStack.length > 3 && <span style={{ fontSize: '0.65rem' }}>+{service.techStack.length - 3}</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {segment === 'finance' && (
                    <div style={{ marginTop: '2rem', borderTop: '2px solid var(--ink)', paddingTop: '1.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', marginBottom: '1rem' }}>Capital Scope & Eligibility</h3>
                      <ul className="footer-nav" style={{ listStyle: 'none', padding: 0 }}>
                        {service.loanRangeMin && (
                          <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                            <span>Consulting Loan Range</span>
                            <strong>₹ {(service.loanRangeMin/100000).toFixed(0)} Lakhs - {(service.loanRangeMax/10000000).toFixed(1)} Crores</strong>
                          </li>
                        )}
                        {service.interestRateInfo && (
                          <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                            <span>Interest Guideline</span>
                            <strong>{service.interestRateInfo}</strong>
                          </li>
                        )}
                        {service.eligibilityNotes && (
                          <li style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem 0' }}>
                            <span>Eligibility Framework</span>
                            <strong style={{ color: 'var(--graphite)', fontSize: '0.9rem' }}>{service.eligibilityNotes}</strong>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Technical Diagnostics approach bento */}
                {currentDiagnostics && (
                  <div className="bento-cell solid-ink" style={{ margin: 0 }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.5rem', marginBottom: '2rem' }}>
                      Scientific Diagnosis & Treatment Approach
                    </h2>
                    
                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                      <div style={{ padding: '0.65rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)', flexShrink: 0 }}>
                        <HelpCircle size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                          The Challenge
                        </h4>
                        <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>
                          {currentDiagnostics.problem}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', alignItems: 'flex-start' }}>
                      <div style={{ padding: '0.65rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)', flexShrink: 0 }}>
                        <ClipboardList size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                          Our Diagnostic Review Method
                        </h4>
                        <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>
                          {currentDiagnostics.approach}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                      <div style={{ padding: '0.65rem', backgroundColor: 'var(--volt)', borderRadius: '4px', color: 'var(--white)', flexShrink: 0 }}>
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '0.9rem' }}>
                          Recommended Scope Specification
                        </h4>
                        <p style={{ fontSize: '0.95rem', margin: 0, opacity: 0.9 }}>
                          {currentDiagnostics.solutions}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {service.gallery && service.gallery.length > 0 && (
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                      Gallery
                    </h2>
                    <div className="bento-grid">
                      {service.gallery.map((imgUrl, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            gridColumn: 'span 4',
                            borderRadius: '4px', 
                            overflow: 'hidden', 
                            aspectRatio: '4/3', 
                            border: '3px solid var(--ink)', 
                            backgroundColor: 'var(--panel)' 
                          }}
                        >
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, 300)}
                            alt={`Gallery item ${i + 1} for ${service.title}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Sticky Lead Form Bento Cell */}
              <div style={{ gridColumn: 'span 4' }}>
                <div 
                  className="bento-cell" 
                  style={{ 
                    position: 'sticky', 
                    top: '6rem', 
                    padding: '2rem', 
                    backgroundColor: 'var(--panel)',
                    border: '3px solid var(--ink)',
                    margin: 0
                  }}
                >
                  <LeadForm defaultService={service.category} defaultSegment={segment} />
                </div>
              </div>

            </div>
          </section>
        </>
      )}
    </>
  );
}
