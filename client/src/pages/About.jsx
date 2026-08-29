import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * About page displaying CWF structural story, 4-step waterproofing audit methodology,
 * and listing corporate engineers fetched from the /team endpoint.
 * Redesigned for Bento / Structural Bold concept with verified client content.
 */
export default function About() {
  const { data: teamData, loading: teamLoading, error: teamError, request: fetchTeam } = useApi();
  const methodRef = null;
  const methodVisible = true;
  const teamRef = null;
  const teamVisible = true;
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    fetchTeam('/team').catch(() => {});
  }, [fetchTeam]);

  const team = teamData?.data || [];

  return (
    <>
      <Helmet>
        <title>About CWF Consulting Corporation | Waterproofing Consultants Pune</title>
        <meta
          name="description"
          content="Learn about CWF Consulting Corporation's scientific waterproofing audit methodology (Survey, Report, Recommend, Supervise) and our team of Pune structural consultants."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            [PROFILE: CIVIL ENGINEERING CONSULTANTS]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem' }}>
            About CWF Consulting Corporation
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Scientific Diagnostic Waterproofing Consultants in Pune, India
          </p>
        </div>
      </section>

      {/* 1. ABOUT CWF CONSULTING CORPORATION SECTION */}
      <section className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.75rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--white)' }}>
            About CWF Consulting Corporation
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', lineHeight: '1.7', fontSize: '0.98rem', color: 'rgba(255, 255, 255, 0.88)' }}>
            <p>
              CWF Consulting Corporation is a multi-disciplinary consulting and solutions organization committed to delivering integrated expertise across Civil Consulting, Web & Digital Solutions, and Financial Services.
            </p>
            <p>
              We believe that today's clients need more than individual service providers—they need a reliable partner who understands their challenges and delivers practical, professional, and result-oriented solutions. Our approach brings together technical expertise, digital innovation, and financial guidance under one platform.
            </p>
            <p>
              In our Civil Consulting division, we provide specialized support for waterproofing, flooring, landscaping, painting, repair and rehabilitation, technical inspections, quality assurance, BOQ preparation, specifications, cost estimation, and project supervision.
            </p>
            <p>
              Through our Web & Digital Solutions, we help businesses establish, strengthen, and transform their digital presence through websites, web applications, business portals, automation, and other technology-driven solutions.
            </p>
            <p>
              Our Financial Services division supports clients with investment, insurance, loan assistance, NRI-focused solutions, behavioural profiling, risk profiling, and financial planning, helping individuals and businesses make more informed financial decisions.
            </p>
            <p>
              At CWF Consulting Corporation, we are driven by a commitment to professionalism, integrity, innovation, and long-term relationships. We focus on understanding every client's unique requirements and connecting them with the right expertise and solutions.
            </p>
          </div>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-block',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 'bold',
              color: 'var(--volt)',
              letterSpacing: '3px',
              border: '2px solid var(--volt)',
              padding: '0.65rem 1.5rem',
              borderRadius: '2px',
              textTransform: 'uppercase'
            }}>
              ONE PARTNER. INFINITE POSSIBILITIES.
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. OUR VISION & OUR MISSION SECTION */}
      <section className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)', background: 'var(--panel)', padding: '5rem 0' }}>
        <div className="container grid-2" style={{ gap: '4rem', alignItems: 'stretch' }}>
          {/* Vision card */}
          <div style={{ border: '3px solid var(--ink)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: '#050716' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--volt)' }}>
              Our Vision
            </h2>
            <p style={{ lineHeight: '1.7', fontSize: '0.98rem', color: 'var(--white)', margin: 0 }}>
              To become a trusted, integrated consulting platform that brings together infrastructure expertise, digital innovation, and financial solutions—empowering individuals and businesses to build stronger, smarter, and more sustainable futures.
            </p>
          </div>

          {/* Mission card */}
          <div style={{ border: '3px solid var(--ink)', padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: '#050716' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1.25rem', color: 'var(--volt)' }}>
              Our Mission
            </h2>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', color: 'var(--white)', marginBottom: '1.25rem' }}>
              Our mission is to deliver reliable, innovative, and client-focused solutions by:
            </p>
            <ul style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.65rem', 
              paddingLeft: '1.25rem', 
              margin: 0, 
              fontSize: '0.92rem', 
              lineHeight: '1.55',
              color: 'rgba(255, 255, 255, 0.88)',
              listStyleType: 'square'
            }}>
              <li>Providing professional and practical consulting services.</li>
              <li>Delivering quality-driven solutions across civil, digital, and financial domains.</li>
              <li>Connecting clients with the right expertise, technology, and opportunities.</li>
              <li>Building long-term relationships based on trust, transparency, and accountability.</li>
              <li>Continuously adopting innovation to create better and more efficient solutions.</li>
              <li>Helping our clients protect their assets, strengthen their businesses, and achieve their financial goals.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. OUR CORE VALUES SECTION */}
      <section className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Our Core Values
            </h2>
            <p style={{ maxWidth: '600px', margin: '0.5rem auto 0', color: 'var(--graphite)' }}>
              The principles that guide CWF Consulting Corporation in every assignment.
            </p>
          </div>

          <div className="bento-grid" style={{ gap: '1.5rem' }}>
            {/* INTEGRITY */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                INTEGRITY
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                We believe in honesty, transparency, and ethical business practices.
              </p>
            </div>

            {/* EXPERTISE */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                EXPERTISE
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                We bring professional knowledge and specialized solutions to every assignment.
              </p>
            </div>

            {/* INNOVATION */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                INNOVATION
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                We continuously explore smarter ways to solve challenges.
              </p>
            </div>

            {/* TRUST */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                TRUST
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                We build lasting relationships through reliability and accountability.
              </p>
            </div>

            {/* CLIENT FOCUS */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                CLIENT FOCUS
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                Every solution begins with understanding our client's requirements.
              </p>
            </div>

            {/* COLLABORATION */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '160px', margin: 0 }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.15rem', color: 'var(--volt)', marginBottom: '0.75rem' }}>
                COLLABORATION
              </h3>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                We believe the best results are achieved by connecting the right people, expertise, and opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CWF? SECTION */}
      <section className="section" style={{ borderBottom: '3px solid var(--ink)', background: 'var(--panel)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '2rem', color: 'var(--white)', marginBottom: '0.5rem' }}>
              Why CWF?
            </h2>
            <p style={{ fontFamily: 'var(--font-data)', fontSize: '0.9rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
              Integrated Thinking. Connected Solutions.
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto 4rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.88)', lineHeight: '1.7', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1.25rem' }}>
              Today's challenges do not exist in isolation. Infrastructure decisions, digital transformation, and financial planning increasingly require connected thinking.
            </p>
            <p style={{ margin: 0 }}>
              CWF brings multiple areas of expertise together under one platform—helping clients access the right solution, right expertise, and right direction for their specific requirements.
            </p>
          </div>

          {/* 5-item Feature Grid */}
          <div className="bento-grid" style={{ gap: '1.5rem', justifyContent: 'center' }}>
            {/* One Platform */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', minHeight: '180px', margin: 0 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--volt)', marginTop: '0.2rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    One Platform
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Multiple professional solutions under one ecosystem.
                  </p>
                </div>
              </div>
            </div>

            {/* Expert-Led Approach */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', minHeight: '180px', margin: 0 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--volt)', marginTop: '0.2rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    Expert-Led Approach
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Connecting clients with specialized knowledge and professional expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* Technology-Enabled */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 4', padding: '2rem', minHeight: '180px', margin: 0 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--volt)', marginTop: '0.2rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    Technology-Enabled
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Using digital tools, automation, and AI-enabled capabilities to improve efficiency and client experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Client-Centric */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 6', padding: '2rem', minHeight: '180px', margin: 0 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--volt)', marginTop: '0.2rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    Client-Centric
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Solutions designed around individual requirements—not a one-size-fits-all approach.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust & Transparency */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 6', padding: '2rem', minHeight: '180px', margin: 0 }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--volt)', marginTop: '0.2rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: 0 }}>
                    Trust & Transparency
                  </h4>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.5', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Building long-term relationships through professional conduct and clear communication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story / Founder */}
      <section className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
              Diagnosing Waterproofing Deficiencies Since 2011
            </h2>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '1rem' }}>
              CWF Consulting Corporation was founded to solve a critical issue in Pune&apos;s construction market: the lack of engineering diagnostics in waterproofing repairs. Standard contractors often apply sealants to surface areas without identifying the structural pathway of water ingress.
            </p>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', margin: 0 }}>
              We operate as independent consultants. Our certified civil engineers conduct forensic testing on slab cracks, basement joints, and external facade pathways using moisture meters, thermal imagers, and core tests. We provide structural drawings and specifications, then supervise the execution phase to guarantee standard compliance.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ border: '3px solid var(--ink)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--panel)', padding: '1.5rem', display: 'inline-block', width: '100%', maxWidth: '380px' }}>
              <img
                src="/owner.webp"
                alt="Ashok Dwivedi, Owner of CWF Consulting Corporation"
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
      <section className="section" style={{ borderBottom: '3px solid var(--ink)', background: 'var(--panel)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Our 4-Step Technical Methodology
            </h2>
            <p style={{ maxWidth: '650px', margin: '1rem auto 0' }}>
              We apply scientific procedures to ensure the structural integrity of your concrete slabs and basement retains.
            </p>
          </div>

          <div className="bento-grid" style={{ gap: '2rem' }}>
            {/* SURVEY */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 3', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '340px', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                STAGE 01 / SURVEY
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1rem' }}>
                FORENSIC SCANNING
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                We inspect concrete slabs, joints, and facades using infrared thermal imaging, electrical impedance moisture scan meters, and core testing.
              </p>
            </div>

            {/* REPORT */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 3', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '340px', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                STAGE 02 / REPORT
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1rem' }}>
                PATHWAY ANALYSIS
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                We deliver diagnostic CAD layout maps locating damp paths, failure points, and grading concrete thickness issues with moisture parameters.
              </p>
            </div>

            {/* RECOMMEND */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 3', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '340px', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                STAGE 03 / RECOMMEND
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1rem' }}>
                BOQ SPECIFICATION
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                We draft custom technical waterproofing specifications, select compliant chemical slurries, and prepare standard Bill of Quantities (BOQ).
              </p>
            </div>

            {/* SUPERVISE */}
            <div className="bento-cell solid-ink" style={{ gridColumn: 'span 3', padding: '2rem', display: 'flex', flexDirection: 'column', minHeight: '340px', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', marginBottom: '1.25rem' }}>
                STAGE 04 / SUPERVISE
              </div>
              <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '1rem' }}>
                QUALITY AUDIT
              </h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                Our engineers monitor application, supervise concrete moisture levels, enforce curing cycles, and verify chemical film thickness rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Engineers List */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              CWF Lead Engineers
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
                const cellClass = 'bento-cell solid-ink';
                const textStyle = { color: 'var(--white)' };
                const designationColor = 'var(--volt)';

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
                    <p style={{ ...textStyle, fontSize: '0.85rem', margin: 0, opacity: 0.9, lineHeight: '1.5' }}>
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
