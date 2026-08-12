import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Public Blog List page.
 * Loads all published blog posts in Bento cards.
 */
export default function BlogList() {
  const { data: blogData, loading, error, request: fetchBlogs } = useApi();

  useEffect(() => {
    fetchBlogs('/blog').catch(() => {});
  }, [fetchBlogs]);

  const posts = blogData?.data || [];

  // Strips HTML brackets to fetch raw content text snippet
  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '');
  };

  return (
    <>
      <Helmet>
        <title>Waterproofing Advice & Articles | CWF Corporation Pune</title>
        <meta
          name="description"
          content="Read structural waterproofing repair advice, leakage diagnostics case studies, and chemical sealing insights from CWF Corporation Pune engineers."
        />
      </Helmet>

      {/* Header Banner */}
      <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <span style={{ fontFamily: 'var(--font-data)', fontSize: '0.85rem', color: 'var(--volt)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '0.5rem' }}>
            [ENGINEERING: KNOWLEDGE BASE]
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '2.5rem', lineHeight: 1.1 }}>
            Waterproofing Insights
          </h1>
          <p style={{ color: 'var(--graphite)', margin: 0, fontFamily: 'var(--font-body)' }}>
            Scientific Engineering articles to preserve concrete integrity
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
              <p>No blog posts are published currently.</p>
            </div>
          ) : (
            <div className="bento-grid">
              {posts.map((post, index) => {
                const plainTextSnippet = stripHtml(post.content);
                const summary = plainTextSnippet.length > 110
                  ? `${plainTextSnippet.substring(0, 110)}...`
                  : plainTextSnippet;

                // Uniform premium dark bento cell styling and gold buttons
                const cellClass = 'bento-cell solid-ink';
                const textStyle = { color: 'var(--white)' };
                const metaColor = 'rgba(255, 255, 255, 0.7)';
                const btnClass = 'btn btn-primary';
                const isDark = true;

                return (
                  <div 
                    key={post._id} 
                    className={cellClass} 
                    style={{ 
                      gridColumn: 'span 4',
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%', 
                      padding: '1.5rem' 
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
                          color: metaColor,
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

                      <h3 style={{ fontSize: '1.2rem', ...textStyle, fontFamily: 'var(--font-heading)', textTransform: 'uppercase', marginBottom: '0.75rem', minHeight: '3.2rem', lineClamp: 2 }}>
                        {post.title}
                      </h3>
                      
                      <p style={{ fontSize: '0.9rem', flexGrow: 1, margin: 0, opacity: isDark ? 0.9 : 0.8, ...textStyle, fontFamily: 'var(--font-body)', lineHeight: '1.5' }}>
                        {summary}
                      </p>

                      <div style={{ marginTop: '1.5rem', alignSelf: 'flex-start', zIndex: 10, width: '100%' }}>
                        <Link
                          to={`/blog/${post.slug}`}
                          className={btnClass}
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            gap: '0.35rem',
                            alignItems: 'center',
                            width: '100%',
                            justifyContent: 'center',
                            border: index % 3 === 1 ? 'none' : undefined
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
