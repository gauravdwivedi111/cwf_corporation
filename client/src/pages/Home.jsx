import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Code, TrendingUp, HelpCircle, ClipboardList, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import LeadForm from '../components/LeadForm.jsx';
import CountUp from '../components/CountUp.jsx';

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
        <title>CWF Consulting Corporation | Multi-Disciplinary Engineering & Financial Solutions</title>
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
          backgroundColor: '#050716',
          borderBottom: '3px solid var(--ink)',
          overflow: 'hidden',
          textAlign: 'center'
        }}
      >
        <div className="bento-canvas" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.12 }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem', animation: 'fadeSlideUp 0.8s ease 0.2s both' }}>
            [CWF CONSULTING CORPORATION PUNE]
          </span>
          <h1 
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4.5rem)',
              fontWeight: 500,
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#fff',
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
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.7)',
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
      <section id="about" className="section" style={{ borderBottom: '1px solid rgba(138, 203, 193, 0.12)' }}>
        <div className="container grid-2" style={{ alignItems: 'center', gap: '3rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
              [PROFILE: CORPORATE FOUNDATION]
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', fontSize: '1.75rem', marginBottom: '1.25rem' }}>
              Diagnosing Waterproofing & Engineering Deficiencies Since 2011
            </h2>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              CWF Consulting Corporation was founded to solve a critical issue in Pune&apos;s construction market: the lack of engineering diagnostics in waterproofing repairs and corporate development operations. Standard contractors often apply surface solutions without identifying the structural pathway of water ingress.
            </p>
            <p style={{ lineHeight: '1.6', fontSize: '0.98rem', margin: 0, color: 'rgba(255, 255, 255, 0.85)' }}>
              Operating as independent consultants, our certified engineers perform forensic concrete testing, scalable software designs, and corporate debt advisory. We provide rigorous drawings, specifications, and project management oversight to guarantee standard compliance across all three business divisions.
            </p>
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
