import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Code, TrendingUp, HelpCircle, ClipboardList, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import LeadForm from '../components/LeadForm.jsx';
import CountUp from '../components/CountUp.jsx';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';
import StaggeredEntrance from '../components/animation/StaggeredEntrance.jsx';

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
          <StaggeredEntrance delay={200}>
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
              marginBottom: '1.5rem'
            }}>
              CWF CONSULTING CORPORATION PUNE
            </span>
          </StaggeredEntrance>

          <StaggeredEntrance delay={400}>
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
                textTransform: 'uppercase'
              }}
            >
              One Standard of Integrity.<br />Three Business Lines.
            </h1>
          </StaggeredEntrance>

          <StaggeredEntrance delay={700}>
            <p
              style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
                lineHeight: '1.65',
                color: 'rgba(238, 242, 243, 0.85)',
                maxWidth: '38rem',
                margin: '0 auto 2.5rem',
                fontWeight: 300,
                fontFamily: 'var(--font-body)'
              }}
            >
              We bridge scientific concrete waterproofing inspections, custom software engineering, and corporate finance advisory solutions under Pune&apos;s leading consultancy group.
            </p>
          </StaggeredEntrance>
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
        <div id="why-cwf" className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.08)', padding: '6rem 0' }}>
          <div className="container">
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row', 
              gap: isMobile ? '3rem' : '5rem',
              alignItems: 'flex-start'
            }}>
              
              {/* Left Column: Strategic Title */}
              <div style={{ width: isMobile ? '100%' : '38%', position: 'sticky', top: '100px' }}>
                <span style={{ 
                  fontFamily: 'var(--font-data)', 
                  fontSize: '0.78rem', 
                  color: 'var(--volt)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '3px', 
                  display: 'block',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}>
                  Why Choose CWF
                </span>
                <h2 style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', 
                  color: 'var(--white)',
                  lineHeight: '1.2',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  fontWeight: 700
                }}>
                  The Advantage of Connected Solutions
                </h2>
                <p style={{ color: 'var(--graphite)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0, fontWeight: 300 }}>
                  Today's corporate challenges do not exist in isolation. Infrastructure decisions, digital capability upgrades, and capital planning require coordinated thinking. CWF brings these vital disciplines under one platform, delivering professional, result-oriented guidance.
                </p>
              </div>

              {/* Right Column: Minimalist Value Stack */}
              <div style={{ width: isMobile ? '100%' : '62%', display: 'flex', flexDirection: 'column' }}>
                
                {/* 01: One Platform */}
                <div style={{ borderTop: '1px solid rgba(138, 203, 193, 0.1)', padding: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: '1rem', color: 'var(--volt)', fontWeight: 'bold' }}>01</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      One Platform
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--graphite)', margin: 0, fontWeight: 300 }}>
                      Access comprehensive civil diagnostics, digital product development, and structured corporate finance advisory under one synchronized platform.
                    </p>
                  </div>
                </div>

                {/* 02: Expert-Led Approach */}
                <div style={{ borderTop: '1px solid rgba(138, 203, 193, 0.1)', padding: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: '1rem', color: 'var(--volt)', fontWeight: 'bold' }}>02</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Expert-Led Approach
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--graphite)', margin: 0, fontWeight: 300 }}>
                      Connect directly with highly qualified structural engineers, principal software architects, and corporate advisors who understand your specific needs.
                    </p>
                  </div>
                </div>

                {/* 03: Technology-Enabled */}
                <div style={{ borderTop: '1px solid rgba(138, 203, 193, 0.1)', padding: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: '1rem', color: 'var(--volt)', fontWeight: 'bold' }}>03</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Tech-Enabled Capabilities
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--graphite)', margin: 0, fontWeight: 300 }}>
                      We employ advanced moisture-mapping scanners, automation pipelines, and modern cloud technologies to deliver exceptional accuracy and speed.
                    </p>
                  </div>
                </div>

                {/* 04: Client-Centric */}
                <div style={{ borderTop: '1px solid rgba(138, 203, 193, 0.1)', padding: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: '1rem', color: 'var(--volt)', fontWeight: 'bold' }}>04</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Client-Centric Solutions
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--graphite)', margin: 0, fontWeight: 300 }}>
                      Our advisory and implementations are tailored around your constraints, objectives, and parameters—not a one-size-fits-all product.
                    </p>
                  </div>
                </div>

                {/* 05: Trust & Transparency */}
                <div style={{ borderTop: '1px solid rgba(138, 203, 193, 0.1)', borderBottom: '1px solid rgba(138, 203, 193, 0.1)', padding: '2rem 0', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-data)', fontSize: '1rem', color: 'var(--volt)', fontWeight: 'bold' }}>05</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Trust & Transparency
                    </h3>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--graphite)', margin: 0, fontWeight: 300 }}>
                      We operate with complete clarity under standard fee disclosures, technical reporting, and clear milestone deliverables.
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
