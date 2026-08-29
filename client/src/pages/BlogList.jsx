import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Public Blog List page.
 * Loads and displays published blog posts filtered by segment.
 */
export default function BlogList() {
  const { segment } = useParams();
  const { data: blogData, loading, error, request: fetchBlogs } = useApi();

  useEffect(() => {
    fetchBlogs(`/blog?segment=${segment}`).catch(() => {});
  }, [segment, fetchBlogs]);

  const posts = blogData?.data || [];

  // Strips HTML brackets to fetch raw content text snippet
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '');
  };

  const segmentMeta = {
    civil: {
      title: 'Waterproofing Insights & Advice',
      subtitle: 'Scientific Engineering articles to preserve concrete integrity',
      bannerLabel: '[ENGINEERING: KNOWLEDGE BASE]',
      description: 'Read structural waterproofing repair advice, leakage diagnostics case studies, and chemical sealing insights from CWF Consulting Corporation Pune engineers.'
    },
    web: {
      title: 'Software & Web Development Articles',
      subtitle: 'Modern software engineering, full-stack scaling, and API architectures',
      bannerLabel: '[SOFTWARE: KNOWLEDGE BASE]',
      description: 'Explore CWF Software & Web engineering blogs. Find tutorials on Next.js, full-stack scaling, caching strategies, and secure database connections.'
    },
    finance: {
      title: 'Financial Planning & Capital Insights',
      subtitle: 'Strategic debt advisory briefs and SME tax compliance analysis',
      bannerLabel: '[ADVISORY: KNOWLEDGE BASE]',
      description: 'Analyse business capital resources with CWF Financial Advisory. Read debt restructuring briefs, GST filing guidelines, and corporate finance tips.'
    }
  };

  const currentMeta = segmentMeta[segment] || segmentMeta.civil;

  return (
    <>
      <Helmet>
        <title>{`${currentMeta.title} | CWF Consulting Corporation`}</title>
        <meta name="description" content={currentMeta.description} />
      </Helmet>

      {/* Header Banner */}
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            {currentMeta.bannerLabel}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '2.5rem', lineHeight: 1.1 }}>
            {currentMeta.title}
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
            {currentMeta.subtitle}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div className="spinner-wrapper">
              <div className="spinner" aria-label="Loading blog posts"></div>
            </div>
          ) : error ? (
            <div className="error-panel">
              <h3 className="error-title">Could not load blog posts</h3>
              <p>{error.message}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              <p>No blog posts are published under the {segment} division currently.</p>
            </div>
          ) : (
            <div className="bento-grid">
              {posts.map((post, index) => {
                const plainTextSnippet = stripHtml(post.content);
                const summary = plainTextSnippet.length > 110
                  ? `${plainTextSnippet.substring(0, 110)}...`
                  : plainTextSnippet;

                return (
                  <div 
                    key={post._id} 
                    className="bento-cell solid-ink" 
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%', 
                      padding: '1.5rem',
                      margin: 0
                    }}
                  >
                    <div style={{ width: '100%', height: '180px', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                      <img
                        src={getOptimizedCloudinaryUrl(post.coverImage, 500)}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.78rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: 'var(--font-data)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <Calendar size={14} />
                          {post.publishedAt ? (
                            <span className="data-num">
                              {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }).toUpperCase()}
                            </span>
                          ) : (
                            'UNPUBLISHED'
                          )}
                        </span>
                        <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', textTransform: 'uppercase' }}>
                          <User size={14} />
                          {post.author?.role || 'AUTHOR'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.2rem', color: 'var(--white)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.75rem', minHeight: '3.2rem', lineClamp: 2 }}>
                        {post.title}
                      </h3>
                      
                      <p style={{ fontSize: '0.9rem', flexGrow: 1, margin: 0, opacity: 0.9, color: 'var(--white)', fontFamily: 'var(--font-body)', lineHeight: '1.5' }}>
                        {summary}
                      </p>

                      <div style={{ marginTop: '1.5rem', alignSelf: 'flex-start', zIndex: 10, width: '100%' }}>
                        <Link
                          to={`/${segment}/blog/${post.slug}`}
                          className="btn btn-primary"
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            gap: '0.35rem',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center',
                          }}
                        >
                          Read Article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
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
