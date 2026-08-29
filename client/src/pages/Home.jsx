import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Code, TrendingUp, HelpCircle, ClipboardList, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import LeadForm from '../components/LeadForm.jsx';
import CountUp from '../components/CountUp.jsx';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Public Home Page (Segment Hub).
 * Serves as the gateway for CWF Corporation's three business lines.
 * Lists the divisions in equal-weight panels and shows company-wide stats.
 */
export default function Home() {
  const { data: segmentsData, loading, error, request: fetchSegments } = useApi();
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    fetchSegments('/segments').catch(() => {});
  }, [fetchSegments]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const segments = segmentsData?.data || [];

  const getSegmentIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldAlert':
      case 'Shield':
        return <ShieldCheck size={40} style={{ color: 'var(--volt)' }} />;
      case 'Code':
        return <Code size={40} style={{ color: 'var(--volt)' }} />;
      case 'TrendingUp':
        return <TrendingUp size={40} style={{ color: 'var(--volt)' }} />;
      default:
        return <ShieldCheck size={40} style={{ color: 'var(--volt)' }} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>CWF Consulting Corporation | Integrated Expertise. Innovative Solutions. Lasting Value.</title>
        <meta
          name="description"
          content="CWF Consulting Corporation Pune provides scientific waterproofing diagnostics, custom software engineering, and corporate financial advisory. Learn more about our divisions."
        />
      </Helmet>

      {/* HERO SECTION */}
      <section 
        style={{
          position: 'relative',
          padding: '8rem 0 5rem',
          background: 'linear-gradient(to bottom, #090e18 0%, #10202a 100%)',
          borderBottom: '1px solid rgba(138, 203, 193, 0.15)',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <div className="bento-canvas" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}></div>
        
        {/* Ambient backlight glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '550px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(138, 203, 193, 0.08) 0%, rgba(219, 176, 87, 0.04) 50%, rgba(0,0,0,0) 80%)',
          pointerEvents: 'none',
          zIndex: 1,
          filter: 'blur(30px)'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ 
            fontFamily: 'var(--font-data)', 
            fontSize: '0.78rem', 
            color: 'var(--volt)', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '3px', 
            display: 'inline-block',
            padding: '0.35rem 0.95rem',
            borderRadius: '100px',
            border: '1px solid rgba(138, 203, 193, 0.25)',
            backgroundColor: 'rgba(138, 203, 193, 0.06)',
            marginBottom: '1.5rem', 
            animation: 'fadeSlideUp 0.8s ease 0.2s both' 
          }}>
            CWF CONSULTING CORPORATION PUNE
          </span>
          <h1 
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
              fontWeight: 700,
              lineHeight: '1.15',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #ffffff 40%, #8acbc1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '1.5rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              animation: 'fadeSlideUp 0.8s ease 0.4s both'
            }}
          >
            One Standard of Integrity.<br />Three Business Lines.
          </h1>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              lineHeight: '1.65',
              color: 'rgba(238, 242, 243, 0.85)',
              maxWidth: '38rem',
              margin: '0 auto 2.5rem',
              fontWeight: 300,
              fontFamily: 'var(--font-body)',
              animation: 'fadeSlideUp 0.8s ease 0.7s both'
            }}
          >
            We bridge scientific concrete waterproofing inspections, custom software engineering, and corporate finance advisory solutions under Pune&apos;s leading consultancy group.
          </p>
        </div>
      </section>

      {/* SEGMENT HUB PICKER */}
      <section id="services" className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              Select a Division
            </h2>
            <p style={{ maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Select one of our specialized divisions to view diagnostic services, portfolios, and case studies:
            </p>
          </div>

          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading segments"></div>
            </div>
          ) : error ? (
            <div className="error-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 className="error-title">Unable to load business divisions</h3>
              <p>{error.message}</p>
            </div>
          ) : (
            <div className="bento-grid" style={{ gap: '2rem' }}>
              {segments.map((seg, index) => (
                <div
                  key={seg._id}
                  className="bento-cell solid-ink"
                  style={{
                    gridColumn: isMobile ? 'span 12' : 'span 4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.5rem 2rem',
                    margin: 0,
                    minHeight: '380px',
                    animation: `fadeSlideUp 0.8s ease ${0.9 + index * 0.15}s both`
                  }}
                >
                  <div>
                    <div style={{ marginBottom: '1.5rem' }}>
                      {getSegmentIcon(seg.icon)}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      {seg.displayName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', fontFamily: 'var(--font-data)', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.5px' }}>
                      {seg.tagline}
                    </p>
                    <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)', lineHeight: '1.5', margin: 0 }}>
                      {seg.heroDescription}
                    </p>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <Link to={`/${seg.segment}`} className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                      Enter Division
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST STATISTICS */}
      <section id="company" className="section" style={{ padding: '5rem 0', borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>
              CWF Group Milestones
            </h2>
            <p style={{ maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Delivering verified diagnostic excellence and business consultations across Pune since 2011.
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-cell" style={{ gridColumn: isMobile ? 'span 12' : 'span 3', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                <CountUp end={15} isStart={true} />+
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Years in Pune
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Established consultancy operations serving local enterprises and societies.
              </p>
            </div>

            <div className="bento-cell" style={{ gridColumn: isMobile ? 'span 12' : 'span 3', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                <CountUp end={1200} isStart={true} />+
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Audits & Implementations
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Concrete diagnostic inspections, web platform releases, and debt facilitations.
              </p>
            </div>

            <div className="bento-cell" style={{ gridColumn: isMobile ? 'span 12' : 'span 3', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                3
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Core Segments
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Specialized engineering divisions operating with symmetric quality parameters.
              </p>
            </div>

            <div className="bento-cell" style={{ gridColumn: isMobile ? 'span 12' : 'span 3', margin: 0 }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: '3rem', fontWeight: 'bold', color: 'var(--volt)', marginBottom: '0.5rem' }}>
                ISO 9001
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Certified Quality
              </h4>
              <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--graphite)' }}>
                Standardized processes for inspection supervision and risk verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" style={{ borderBottom: '3px solid var(--ink)' }}>
        {/* 1. Profile & Founder Grid */}
        <div className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
          <div className="container grid-2" style={{ alignItems: 'flex-start', gap: '3rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
                [PROFILE: CORPORATE FOUNDATION]
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--white)' }}>
                ABOUT CWF CONSULTING CORPORATION
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.96rem', lineHeight: '1.6' }}>
                <p style={{ fontWeight: '500', color: 'var(--white)' }}>
                  CWF Consulting Corporation is a multi-disciplinary consulting and solutions organization committed to delivering integrated expertise across Civil Consulting, Web & Digital Solutions, and Financial Services.
                </p>
                
                <p>
                  We believe that today&apos;s clients need more than individual service providers—they need a reliable partner who understands their challenges and delivers practical, professional, and result-oriented solutions. Our approach brings together technical expertise, digital innovation, and financial guidance under one platform.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0', paddingLeft: '1rem', borderLeft: '3px solid var(--volt)' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    <strong>Civil Consulting:</strong> Specialized support for waterproofing, flooring, landscaping, painting, repair and rehabilitation, technical inspections, quality assurance, BOQ preparation, specifications, cost estimation, and project supervision.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    <strong>Web & Digital Solutions:</strong> Helping businesses establish, strengthen, and transform their digital presence through websites, web applications, business portals, automation, and other technology-driven solutions.
                  </p>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    <strong>Financial Services:</strong> Supporting clients with investment, insurance, loan assistance, NRI-focused solutions, behavioural profiling, risk profiling, and financial planning, helping individuals and businesses make more informed financial decisions.
                  </p>
                </div>

                <p>
                  At CWF Consulting Corporation, we are driven by a commitment to professionalism, integrity, innovation, and long-term relationships. We focus on understanding every client&apos;s unique requirements and connecting them with the right expertise and solutions.
                </p>
              </div>

              <div style={{
                marginTop: '2rem',
                display: 'inline-block',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'var(--volt)',
                letterSpacing: '2px',
                border: '2px solid var(--volt)',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
                textTransform: 'uppercase'
              }}>
                ONE PARTNER. INFINITE POSSIBILITIES.
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ border: '3px solid var(--ink)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--panel)', padding: '1.5rem', display: 'inline-block', width: '100%', maxWidth: '380px' }}>
                <img
                  src="/owner.webp"
                  alt="Ashok Dwivedi, Owner of CWF Consulting Corporation"
                  style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
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
        </div>

        {/* 2 & 3. Vision & Mission */}
        <div className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)', background: 'var(--panel)', padding: '5rem 0' }}>
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
        </div>

        {/* 4. Our Core Values */}
        <div className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
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
        </div>

        {/* 5. Why CWF? */}
        <div className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)', background: 'var(--panel)', padding: '5rem 0' }}>
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
        </div>

      </section>

      {/* LEAD CAPTURE FORM */}
      <section id="contact" className="section">
        <div className="container" style={{ maxWidth: '650px' }}>
          <div className="bento-cell" style={{ padding: '2.5rem', border: '3px solid var(--ink)', backgroundColor: 'var(--panel)', margin: 0 }}>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
