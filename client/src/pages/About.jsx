import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * About page displaying CWF structural story, 4-step waterproofing audit methodology,
 * and listing corporate engineers fetched from the /team endpoint.
 */
export default function About() {
  const { data: teamData, loading: teamLoading, error: teamError, request: fetchTeam } = useApi();

  useEffect(() => {
    fetchTeam('/team').catch(() => {});
  }, [fetchTeam]);

  const team = teamData?.data || [];

  return (
    <>
      <Helmet>
        <title>About CWF Corporation | Waterproofing Consultants Pune</title>
        <meta
          name="description"
          content="Learn about CWF Corporation's scientific waterproofing audit methodology (Survey, Report, Recommend, Supervise) and our team of Pune structural consultants."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>About CWF Corporation</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Scientific Diagnostic waterproofing Consultants in Pune, India</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>Diagnosing Waterproofing Deficiencies Since 2011</h2>
            <p>
              CWF Corporation was founded to solve a critical issue in Pune&apos;s construction market: the lack of engineering diagnostics in waterproofing repairs. Standard contractors often apply sealants to surface areas without identifying the structural pathway of water ingress.
            </p>
            <p>
              We operate as independent consultants. Our certified civil engineers conduct forensic testing on slab cracks, basement joints, and external facade pathways using moisture meters, thermal imagers, and core tests. We provide structural drawings and specifications, then supervise the execution phase to guarantee standard compliance.
            </p>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/demo/image/upload/w_800,h_500,c_fill/canyon.jpg"
              alt="Structural engineer scanning concrete slab for leakage pathways"
              style={{ width: '100%', borderRadius: '6px', boxShadow: 'var(--card-shadow)' }}
            />
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="section section-bg" style={{ borderTop: '1px solid var(--color-gray-border)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2>Our 4-Step Technical Methodology</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto' }}>
              We apply scientific procedures to ensure the structural integrity of your concrete slabs and basement retains.
            </p>
          </div>

          <div className="grid-4">
            <div className="card method-step">
              <div className="method-number">1</div>
              <h3>1. Site Survey</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Forensic moisture scanning, thermal mapping, and slab core drills are conducted by our engineers to detect water ingress points.
              </p>
            </div>
            <div className="card method-step">
              <div className="method-number">2</div>
              <h3>2. Diagnostic Report</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                We deliver a detailed report charting moisture indices, concrete health, and mapping exact leakage paths.
              </p>
            </div>
            <div className="card method-step">
              <div className="method-number">3</div>
              <h3>3. Prescriptions</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                We draft technical specifications defining the exact chemical compounds (polyurethane, epoxy) and membrane thickness required.
              </p>
            </div>
            <div className="card method-step">
              <div className="method-number">4</div>
              <h3>4. Supervision</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Our field engineers supervise the contracting crew, verifying slab preparation, compound mixes, and membrane application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2>Our Engineering Consultants</h2>
            <p style={{ maxWidth: '650px', margin: '0 auto' }}>
              Meet the structural consultants directing audits and supervising repairs in Pune.
            </p>
          </div>

          {teamLoading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading team members"></div>
            </div>
          ) : teamError ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load team profiles</h3>
              <p>{teamError.message}</p>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center" style={{ padding: '2rem' }}>
              <p>No team members listed at this time.</p>
            </div>
          ) : (
            <div className="grid-4">
              {team.map((member) => (
                <div key={member._id} className="card text-center" style={{ padding: '1.5rem' }}>
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      margin: '0 auto 1.25rem',
                      border: '4px solid var(--color-accent-light)',
                      backgroundColor: 'var(--color-neutral-light)',
                    }}
                  >
                    <img
                      src={getOptimizedCloudinaryUrl(member.photo, 200)}
                      alt={member.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                  <p
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {member.designation}
                  </p>
                  <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--color-gray-text)' }}>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
