import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import { useScrollReveal } from '../hooks/useScrollReveal.js';

/**
 * About page displaying CWF structural story, 4-step waterproofing audit methodology,
 * and listing corporate engineers fetched from the /team endpoint.
 * Redesigned for Bento / Structural Bold concept.
 */
export default function About() {
  const { data: teamData, loading: teamLoading, error: teamError, request: fetchTeam } = useApi();
  const [methodRef, methodVisible] = useScrollReveal();
  const [teamRef, teamVisible] = useScrollReveal();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            [PROFILE: CIVIL ENGINEERING CONSULTANTS]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            About CWF Corporation
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Scientific Diagnostic Waterproofing Consultants in Pune, India
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
              Diagnosing Waterproofing Deficiencies Since 2011
            </h2>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '1rem' }}>
              CWF Corporation was founded to solve a critical issue in Pune&apos;s construction market: the lack of engineering diagnostics in waterproofing repairs. Standard contractors often apply sealants to surface areas without identifying the structural pathway of water ingress.
            </p>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', margin: 0 }}>
              We operate as independent consultants. Our certified civil engineers conduct forensic testing on slab cracks, basement joints, and external facade pathways using moisture meters, thermal imagers, and core tests. We provide structural drawings and specifications, then supervise the execution phase to guarantee standard compliance.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ border: '3px solid var(--ink)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--panel)', padding: '1.5rem', display: 'inline-block', width: '100%', maxWidth: '380px' }}>
              <img
                src="/owner.webp"
                alt="Ashok Dwivedi, Owner of CWF Corporation"
                style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
                loading="lazy"
              />
              <div style={{ marginTop: '1.25rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', margin: '0 0 0.25rem' }}>
                  Ashok Dwivedi
                </h3>
                <p style={{ color: 'var(--volt)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', fontFamily: 'var(--font-data)', margin: 0 }}>
                  Founder & Managing Director
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section - Bento Cards Grid */}
      <section ref={methodRef} className="section" style={{ borderTop: '3px solid var(--ink)', borderBottom: '3px solid var(--ink)', background: 'var(--panel)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Our 4-Step Technical Methodology
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              We apply scientific procedures to ensure the structural integrity of your concrete slabs and basement retains.
            </p>
          </div>

          <div className="bento-grid">
            {[
              {
                num: '01',
                title: 'Site Survey',
                desc: 'Forensic moisture scanning, thermal mapping, and slab core drills are conducted by our engineers to detect water ingress points.'
              },
              {
                num: '02',
                title: 'Diagnostic Report',
                desc: 'We deliver a detailed report charting moisture indices, concrete health, and mapping exact leakage paths.'
              },
              {
                num: '03',
                title: 'Prescriptions',
                desc: 'We draft technical specifications defining the exact chemical compounds (polyurethane, epoxy) and membrane thickness required.'
              },
              {
                num: '04',
                title: 'Supervision',
                desc: 'Our field engineers supervise the contracting crew, verifying slab preparation, compound mixes, and membrane application.'
              }
            ].map((step, index) => {
              // Uniform premium dark bento cell styling
              const cellClass = 'bento-cell solid-ink';
              const textStyle = { color: 'var(--white)' };
              const categoryColor = 'var(--volt)';

              return (
                <div 
                  key={index} 
                  className={cellClass}
                  style={{
                    gridColumn: 'span 3',
                    opacity: methodVisible ? 1 : 0,
                    transform: methodVisible ? 'scale(1)' : 'scale(0.96)',
                    transition: prefersReduced ? 'none' : `opacity 0.4s ease-out ${index * 85}ms, transform 0.4s ease-out ${index * 85}ms`,
                    padding: '2rem',
                    margin: 0
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: '1.25rem', fontWeight: 'bold', color: categoryColor, marginBottom: '0.75rem' }}>
                    {step.num}
                  </div>
                  <h3 style={{ ...textStyle, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ ...textStyle, opacity: index === 0 || index === 3 ? 0.8 : 0.9, fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section - Alternating Bento Cards */}
      <section ref={teamRef} className="section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Our Engineering Consultants
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
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
            <div className="bento-grid">
              {team.map((member, index) => {
                // Uniform premium dark bento cell styling
                const cellClass = 'bento-cell solid-ink';
                const textStyle = { color: 'var(--white)' };
                const designationColor = 'var(--volt)';
                const isDark = true;

                return (
                  <div 
                    key={member._id} 
                    className={cellClass}
                    style={{ 
                      gridColumn: 'span 3',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      opacity: teamVisible ? 1 : 0,
                      transform: teamVisible ? 'scale(1)' : 'scale(0.96)',
                      transition: prefersReduced ? 'none' : `opacity 0.4s ease-out ${index * 80}ms, transform 0.4s ease-out ${index * 80}ms`
                    }}
                  >
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        margin: '0 auto 1.25rem',
                        border: '3px solid var(--ink)',
                        backgroundColor: 'var(--panel)',
                      }}
                    >
                      <img
                        src={getOptimizedCloudinaryUrl(member.photo, 200)}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <h3 style={{ ...textStyle, fontSize: '1.15rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                      {member.name}
                    </h3>
                    <p
                      style={{
                        color: designationColor,
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-data)'
                      }}
                    >
                      {member.designation}
                    </p>
                    <p style={{ ...textStyle, fontSize: '0.85rem', margin: 0, opacity: isDark ? 0.9 : 0.8, lineHeight: '1.5' }}>
                      {member.bio}
                    </p>
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
