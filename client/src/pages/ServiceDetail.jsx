import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, ArrowLeft, ClipboardList, HelpCircle } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import LeadForm from '../components/LeadForm.jsx';

/**
 * Dynamic Service Details Page.
 * Fetches a single service detail using route slug params.
 * Automatically increments view counts on load.
 */
export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: serviceData, loading, error, request: fetchService } = useApi();

  useEffect(() => {
    fetchService(`/services/${slug}`).catch(() => {});
  }, [slug, fetchService]);

  const service = serviceData?.data;

  // Custom diagnostic content mapping based on categories
  const diagnosticContent = {
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
              <Link to="/services" className="btn btn-outline" style={{ marginTop: '1rem' }}>
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
            <Link to="/services" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Services
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Helmet>
            <title>{`${service.title} Diagnostics | CWF Corporation Pune`}</title>
            <meta name="description" content={service.shortDescription} />
          </Helmet>

          {/* Banner */}
          <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '3.5rem 0' }}>
            <div className="container">
              <Link to="/services" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Services
              </Link>
              <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>{service.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
                Category: {service.category.replace('-', ' ')}
              </p>
            </div>
          </section>

          {/* Page Grid */}
          <section className="section">
            <div className="container grid-2" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '3rem' }}>
              {/* Left Side - Details */}
              <div>
                <div style={{ borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem', maxHeight: '400px' }}>
                  <img
                    src={getOptimizedCloudinaryUrl(service.coverImage, 800)}
                    alt={service.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <h2>Overview</h2>
                  <p style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{service.fullDescription}</p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-gray-border)', margin: '2.5rem 0' }} />

                {/* Technical diagnostics content */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ marginBottom: '1.5rem' }}>Scientific Diagnosis & Treatment Approach</h2>
                  
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>The Problem</h4>
                      <p style={{ fontSize: '0.92rem', margin: 0 }}>{currentDiagnostics.problem}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                      <ClipboardList size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Our Diagnostic Audit Method</h4>
                      <p style={{ fontSize: '0.92rem', margin: 0 }}>{currentDiagnostics.approach}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-accent-light)', borderRadius: '4px', color: 'var(--color-accent)' }}>
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>Recommended Treatment Specification</h4>
                      <p style={{ fontSize: '0.92rem', margin: 0 }}>{currentDiagnostics.solutions}</p>
                    </div>
                  </div>
                </div>

                {service.gallery && service.gallery.length > 0 && (
                  <div style={{ marginTop: '3rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Service Gallery</h2>
                    <div className="grid-3">
                      {service.gallery.map((imgUrl, i) => (
                        <div key={i} style={{ borderRadius: '4px', overflow: 'hidden', aspectRatio: '4/3', backgroundColor: 'var(--color-neutral-light)' }}>
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, 300)}
                            alt={`Gallery image ${i + 1} for ${service.title}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Sticky Lead Form */}
              <div>
                <div style={{ position: 'sticky', top: '6rem' }}>
                  <LeadForm defaultService={service.category} />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
