import React, { useEffect, useState, useRef } from 'react';
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
  const [windowWidth, setWindowWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    fetchSegments('/segments').catch(() => {});
  }, [fetchSegments]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const segments = segmentsData?.data || [];

  const renderWords = (text, type, baseDelay, stagger) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      const delay = baseDelay + index * stagger;
      return (
        <span
          key={index}
          className={type === 'heading' ? 'word-heading' : 'word-subline'}
          style={{
            animationDelay: `${delay}ms`,
            display: 'inline-block',
            whiteSpace: 'pre'
          }}
        >
          {word}{index < words.length - 1 ? ' ' : ''}
        </span>
      );
    });
  };

  const fadeUpStyle = (delay) => ({
    opacity: 0,
    transform: 'translateY(1.25rem)',
    animation: `flowstateFadeIn 700ms cubic-bezier(0.2, 0, 0, 1) ${delay}ms forwards`
  });

  const fadeDownStyle = (delay) => ({
    opacity: 0,
    transform: 'translateY(-0.75rem)',
    animation: `flowstateFadeIn 700ms cubic-bezier(0.2, 0, 0, 1) ${delay}ms forwards`
  });

  const isLg = windowWidth >= 1024;
  const isSm = windowWidth >= 640;

  const styleTag = `
    .flowstate-hero {
      --hero-base:            #04050c;
      --heading:             #eef0f6;
      --body-muted:          #b9becf;
      --on-media:            #ffffff;
      --action-inverse:      #ffffff;
      --action-inverse-fg:   #2f2f33;
      --glass-fill:          rgba(255,255,255,0.08);
      --glass-border:        rgba(255,255,255,0.16);
      --scrim:               rgba(4,5,12,0.46);
      --scrim-strong:        rgba(4,5,12,0.68);
      --scrim-soft:          rgba(4,5,12,0.12);
      --duration-fast:       150ms;
      --ease-entrance:       cubic-bezier(0.2, 0, 0, 1);

      font-family: "Onest", sans-serif;
      font-size: 16px;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 70lvh;
      width: 100vw;
      overflow: hidden;
      background: var(--hero-base);
      text-align: center;
      padding: 0 1.25rem;
      box-sizing: border-box;
    }
    @media (max-width: 1920px) { .flowstate-hero { font-size: 0.833333vw; } }
    @media (max-width: 1440px) { .flowstate-hero { font-size: 1.111111vw; } }
    @media (max-width: 1024px) { .flowstate-hero { font-size: 1.5625vw;   } }
    @media (max-width: 640px)  { 
      .flowstate-hero { font-size: 4.444444vw; padding: 0 2.5rem; }
    }
    
    /* Word reveal animations */
    .word-heading {
      display: inline-block;
      opacity: 0;
      transform: translateY(26px);
      animation: headingWordKeyframe 720ms cubic-bezier(0.33, 1, 0.68, 1) forwards;
    }
    @keyframes headingWordKeyframe {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .word-subline {
      display: inline-block;
      opacity: 0;
      transform: translateY(14px);
      animation: sublineWordKeyframe 600ms cubic-bezier(0.33, 1, 0.68, 1) forwards;
    }
    @keyframes sublineWordKeyframe {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes flowstateFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .flowstate-input::placeholder {
      color: var(--body-muted);
    }
    .flowstate-input:focus {
      outline: none;
    }
    
    .flowstate-pill-button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px rgba(255,255,255,0.7) !important;
    }
  `;

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
          minHeight: isMobile ? 'calc(100dvh - 4.5rem)' : '75vh', 
          padding: isMobile ? '4rem 0 3.5rem' : '10rem 0 9rem',
          backgroundImage: 'url("/unsplash_16.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: isMobile ? '25% center' : 'right center',
          borderBottom: '3px solid var(--ink)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: styleTag }} />

        {/* Hero Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/hero-bg.mp4"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: isMobile ? '28% center' : 'center center',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        
        {/* Split-visibility gradient overlay: dark left, clear right */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: isMobile 
              ? 'linear-gradient(to bottom, rgba(5, 7, 22, 0.75) 0%, rgba(5, 7, 22, 0.9) 55%, rgba(5, 7, 22, 0.98) 100%)'
              : 'linear-gradient(to right, rgba(5, 7, 22, 1) 0%, rgba(5, 7, 22, 0.9) 35%, rgba(5, 7, 22, 0.45) 60%, transparent 85%)',
            zIndex: 1 
          }} 
        />

        {/* Left column content container */}
        <div className="container" style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          width: '100%',
          marginLeft: 0,
          marginRight: 'auto',
          maxWidth: isMobile ? '100%' : '44%',
          paddingLeft: isMobile ? '1.25rem' : '2rem',
          paddingRight: isMobile ? '1.25rem' : '2rem'
        }}>
          {/* 1. Parent Company Name Badge */}
          <span style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: isMobile ? '0.85rem' : '0.85rem',
            color: 'var(--volt)',
            backgroundColor: isMobile ? 'rgba(138, 203, 193, 0.14)' : 'transparent',
            border: isMobile ? '1px solid rgba(138, 203, 193, 0.3)' : 'none',
            borderRadius: isMobile ? '100px' : '0',
            padding: isMobile ? '0.45rem 1rem' : '0',
            fontFamily: 'var(--font-data)',
            fontWeight: 'bold',
            letterSpacing: isMobile ? '2.5px' : '3px',
            textTransform: 'uppercase',
            marginBottom: isMobile ? '1.25rem' : '1rem',
            opacity: 0,
            transform: 'translateY(1rem)',
            animation: 'fadeSlideUp 0.8s ease 0.2s both'
          }}>
            {isMobile && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--volt)', display: 'inline-block' }}></span>}
            CWF CONSULTING CORPORATION
          </span>

          {/* 2. Main Brand Statement Headline */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: isMobile ? 'clamp(2.4rem, 9.5vw, 3.2rem)' : 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: isMobile ? 1.12 : 1.15,
            color: '#eef0f6',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: isMobile ? '1.5rem' : '2rem',
            marginInline: '0',
            maxWidth: '100%',
            opacity: 0,
            transform: 'translateY(1rem)',
            animation: 'fadeSlideUp 0.8s ease 0.5s both'
          }}>
            ONE PARTNER.<br/>
            <span style={{ color: 'var(--volt)', textShadow: '0 0 25px rgba(138, 203, 193, 0.35)' }}>INFINITE POSSIBILITIES.</span>
          </h1>

          {/* 3. Business Verticals Navigation/Identity element */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile ? 'space-around' : 'flex-start',
            gap: isMobile ? '0.75rem' : '1rem',
            fontFamily: 'var(--font-data)',
            fontSize: isMobile ? '0.92rem' : 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.95)',
            letterSpacing: isMobile ? '2.5px' : '4px',
            textTransform: 'uppercase',
            background: isMobile ? 'rgba(10, 19, 26, 0.85)' : 'transparent',
            backdropFilter: isMobile ? 'blur(8px)' : 'none',
            WebkitBackdropFilter: isMobile ? 'blur(8px)' : 'none',
            border: isMobile ? '1px solid rgba(138, 203, 193, 0.25)' : 'none',
            borderTop: isMobile ? '1px solid rgba(138, 203, 193, 0.25)' : '1px solid rgba(255, 255, 255, 0.15)',
            borderBottom: isMobile ? '1px solid rgba(138, 203, 193, 0.25)' : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: isMobile ? '10px' : '0',
            padding: isMobile ? '0.65rem 1rem' : '0.75rem 0',
            width: isMobile ? '100%' : 'auto',
            marginBottom: isMobile ? '1.75rem' : '2rem',
            opacity: 0,
            transform: 'translateY(1rem)',
            animation: 'fadeSlideUp 0.8s ease 0.8s both'
          }}>
            <span>CIVIL</span>
            <span style={{ color: 'var(--volt)', opacity: 0.7 }}>{isMobile ? '•' : '|'}</span>
            <span>WEB</span>
            <span style={{ color: 'var(--volt)', opacity: 0.7 }}>{isMobile ? '•' : '|'}</span>
            <span>FINANCE</span>
          </div>

          {/* 4. Supporting statement: Simple vertical pointers on mobile, horizontal single line on desktop */}
          {isMobile ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              width: '100%',
              marginBottom: '2.25rem',
              opacity: 0,
              transform: 'translateY(1rem)',
              animation: 'fadeSlideUp 0.8s ease 1.1s both'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.95)', fontSize: '1.08rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                <span style={{ color: 'var(--volt)', fontSize: '1.5rem', lineHeight: 1 }}>•</span>
                <span>Protecting Assets</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.95)', fontSize: '1.08rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                <span style={{ color: 'var(--volt)', fontSize: '1.5rem', lineHeight: 1 }}>•</span>
                <span>Powering Digital Growth</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.95)', fontSize: '1.08rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
                <span style={{ color: 'var(--volt)', fontSize: '1.5rem', lineHeight: 1 }}>•</span>
                <span>Building Financial Futures</span>
              </div>
            </div>
          ) : (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              lineHeight: 1.6,
              color: '#b9becf',
              fontWeight: 300,
              marginInline: '0',
              marginBottom: 0,
              opacity: 0,
              transform: 'translateY(1rem)',
              animation: 'fadeSlideUp 0.8s ease 1.1s both'
            }}>
              Protecting Assets <span style={{ color: 'var(--volt)', margin: '0 0.25rem' }}>•</span> Powering Digital Growth <span style={{ color: 'var(--volt)', margin: '0 0.25rem' }}>•</span> Building Financial Futures
            </p>
          )}

          {/* 5. Mobile Action Buttons */}
          {isMobile && (
            <div style={{
              display: 'flex',
              gap: '0.85rem',
              width: '100%',
              opacity: 0,
              transform: 'translateY(1rem)',
              animation: 'fadeSlideUp 0.8s ease 1.3s both'
            }}>
              <a href="#services" className="btn btn-primary" style={{ flex: '1 1 50%', textAlign: 'center', padding: '1rem 1rem', fontSize: '1rem', minHeight: '52px' }}>
                Explore Divisions
              </a>
              <a href="#contact" className="btn btn-secondary" style={{ flex: '1 1 50%', textAlign: 'center', padding: '1rem 1rem', fontSize: '1rem', minHeight: '52px' }}>
                Contact Us
              </a>
            </div>
          )}
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
                <Link
                  key={seg._id}
                  to={`/${seg.segment}`}
                  className="bento-cell solid-ink"
                  style={{
                    gridColumn: isMobile ? 'span 12' : 'span 4',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.5rem 2rem',
                    margin: 0,
                    minHeight: '380px',
                    animation: `fadeSlideUp 0.8s ease ${0.9 + index * 0.15}s both`,
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer'
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
                    <span className="btn btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
                      Enter Division
                    </span>
                  </div>
                </Link>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.96rem', lineHeight: '1.6' }}>
                
                {/* Intro block in premium glass container */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(27, 43, 50, 0.4) 0%, rgba(16, 32, 42, 0.6) 100%)',
                  border: '1px solid rgba(138, 203, 193, 0.15)',
                  borderRadius: '8px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <p style={{ fontWeight: '500', color: 'var(--white)', margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>
                    CWF Consulting Corporation is a multi-disciplinary consulting and solutions organization committed to delivering integrated expertise across Civil Consulting, Web & Digital Solutions, and Financial Services.
                  </p>
                  
                  <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                    We believe that today&apos;s clients need more than individual service providers—they need a reliable partner who understands their challenges and delivers practical, professional, and result-oriented solutions. Our approach brings together technical expertise, digital innovation, and financial guidance under one platform.
                  </p>
                </div>

                {/* Styled Division Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  
                  {/* Civil Card */}
                  <div className="about-division-card" style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 32, 42, 0.3)',
                    borderLeft: '4px solid var(--volt)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ color: 'var(--volt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={28} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Civil Consulting
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                        Specialized support for waterproofing, flooring, landscaping, painting, repair and rehabilitation, technical inspections, quality assurance, BOQ preparation, specifications, cost estimation, and project supervision.
                      </p>
                    </div>
                  </div>

                  {/* Web Card */}
                  <div className="about-division-card" style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 32, 42, 0.3)',
                    borderLeft: '4px solid var(--volt)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ color: 'var(--volt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Code size={28} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Web & Digital Solutions
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                        Helping businesses establish, strengthen, and transform their digital presence through websites, web applications, business portals, automation, and other technology-driven solutions.
                      </p>
                    </div>
                  </div>

                  {/* Finance Card */}
                  <div className="about-division-card" style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    background: 'rgba(16, 32, 42, 0.3)',
                    borderLeft: '4px solid var(--volt)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    borderRight: '1px solid rgba(255,255,255,0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{ color: 'var(--volt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={28} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.05rem', fontFamily: 'var(--font-heading)', color: 'var(--white)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Financial Services
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                        Supporting clients with investment, insurance, loan assistance, NRI-focused solutions, behavioural profiling, risk profiling, and financial planning, helping individuals and businesses make more informed financial decisions.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Conclusion paragraph in glass container */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(27, 43, 50, 0.25) 0%, rgba(16, 32, 42, 0.45) 100%)',
                  border: '1px solid rgba(138, 203, 193, 0.1)',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.92rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <p style={{ margin: 0 }}>
                    At CWF Consulting Corporation, we are driven by a commitment to professionalism, integrity, innovation, and long-term relationships. We focus on understanding every client&apos;s unique requirements and connecting them with the right expertise and solutions.
                  </p>
                </div>

              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '380px', margin: isMobile ? '0 auto' : '0 0 0 auto' }}>
              
              {/* Founder Profile Card */}
              <div style={{ border: '3px solid var(--ink)', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'var(--panel)', padding: '1.5rem', width: '100%' }}>
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

              {/* Founder Quote Card */}
              <div style={{
                marginTop: '1.5rem',
                background: 'linear-gradient(135deg, rgba(27, 43, 50, 0.3) 0%, rgba(16, 32, 42, 0.5) 100%)',
                border: '1px solid rgba(138, 203, 193, 0.1)',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'left',
                position: 'relative',
                width: '100%'
              }}>
                <span style={{ fontSize: '3rem', color: 'var(--volt)', opacity: 0.15, position: 'absolute', top: '-0.5rem', left: '0.5rem', fontFamily: 'serif', lineHeight: 1 }}>“</span>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.88rem', color: 'rgba(255,255,255,0.9)', paddingLeft: '1rem', lineHeight: '1.5' }}>
                  Our foundation is built on trust, quality, and client success. We don't just solve immediate problems; we engineer lasting value across every vertical we touch.
                </p>
                <p style={{ margin: '0.5rem 0 0 0', textAlign: 'right', fontSize: '0.78rem', fontFamily: 'var(--font-data)', color: 'var(--volt)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                  — Ashok Dwivedi
                </p>
              </div>

              {/* Corporate Credentials Block */}
              <div style={{
                marginTop: '1.5rem',
                textAlign: 'left',
                width: '100%'
              }}>
                <h4 style={{ fontSize: '0.75rem', fontFamily: 'var(--font-data)', color: 'var(--volt)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                  Corporate Credentials
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', background: 'rgba(16,32,42,0.2)' }}>
                    <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.78rem', color: 'var(--white)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>ISO 9001:2015</h5>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>Quality Management</p>
                  </div>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', background: 'rgba(16,32,42,0.2)' }}>
                    <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.78rem', color: 'var(--white)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>WAI Member</h5>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>Waterproofing Assoc.</p>
                  </div>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', background: 'rgba(16,32,42,0.2)' }}>
                    <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.78rem', color: 'var(--white)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>MSME Registered</h5>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>Govt of India</p>
                  </div>
                  <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.75rem', background: 'rgba(16,32,42,0.2)' }}>
                    <h5 style={{ margin: '0 0 0.15rem 0', fontSize: '0.78rem', color: 'var(--white)', textTransform: 'uppercase', fontFamily: 'var(--font-data)' }}>1200+ Audits</h5>
                    <p style={{ margin: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', lineHeight: '1.3' }}>Verified Projects</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 2 & 3. Vision & Mission */}
        <div className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)', background: 'linear-gradient(180deg, rgba(27, 43, 50, 0.45) 0%, rgba(16, 32, 42, 0.5) 100%)', padding: '6rem 0' }}>
          <div className="container grid-2" style={{ gap: '4rem', alignItems: 'stretch' }}>
            
            {/* Vision card */}
            <div style={{ 
              border: '1px solid rgba(138, 203, 193, 0.15)', 
              padding: '3rem 2.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              background: 'linear-gradient(135deg, rgba(27, 43, 50, 0.6) 0%, rgba(16, 32, 42, 0.85) 100%)',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                textTransform: 'uppercase', 
                fontSize: '1.4rem', 
                color: 'var(--volt)', 
                marginBottom: '1.5rem', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem' 
              }}>
                <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(138, 203, 193, 0.1)', border: '1px solid rgba(138, 203, 193, 0.15)', color: 'var(--volt)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>
                </span>
                Our Vision
              </h2>
              <p style={{ lineHeight: '1.8', fontSize: '1.02rem', color: 'rgba(238, 242, 243, 0.95)', margin: 0, fontWeight: 300, fontStyle: 'italic' }}>
                &ldquo;To become a trusted, integrated consulting platform that brings together infrastructure expertise, digital innovation, and financial solutions&mdash;empowering individuals and businesses to build stronger, smarter, and more sustainable futures.&rdquo;
              </p>
            </div>

            {/* Mission card */}
            <div style={{ 
              border: '1px solid rgba(138, 203, 193, 0.15)', 
              padding: '3rem 2.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'flex-start', 
              background: 'linear-gradient(135deg, rgba(27, 43, 50, 0.6) 0%, rgba(16, 32, 42, 0.85) 100%)',
              borderRadius: '12px',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 style={{ 
                fontFamily: 'var(--font-heading)', 
                textTransform: 'uppercase', 
                fontSize: '1.4rem', 
                color: 'var(--volt)', 
                marginBottom: '1.5rem', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem' 
              }}>
                <span style={{ display: 'inline-flex', padding: '6px', borderRadius: '6px', backgroundColor: 'rgba(138, 203, 193, 0.1)', border: '1px solid rgba(138, 203, 193, 0.15)', color: 'var(--volt)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                Our Mission
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.98rem', color: 'rgba(238, 242, 243, 0.9)', marginBottom: '1.5rem', fontWeight: 300 }}>
                Our mission is to deliver reliable, innovative, and client-focused solutions by:
              </p>
              <ul style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem', 
                padding: 0, 
                margin: 0, 
                listStyle: 'none'
              }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Providing professional and practical consulting services.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Delivering quality-driven solutions across civil, digital, and financial domains.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Connecting clients with the right expertise, technology, and opportunities.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Building long-term relationships based on trust, transparency, and accountability.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Continuously adopting innovation to create better and more efficient solutions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.92rem', lineHeight: '1.5', color: 'rgba(238, 242, 243, 0.88)' }}>
                  <span style={{ color: 'var(--volt)', fontWeight: 'bold', marginTop: '0.1rem' }}>✓</span>
                  <span>Helping our clients protect their assets, strengthen their businesses, and achieve their financial goals.</span>
                </li>
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
