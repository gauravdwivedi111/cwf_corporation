import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getBlogImage } from '../utils/imageFallbacks.js';

/**
 * Dynamic Blog Post Detail Reader view.
 * Fetches article by slug and parses raw content strings to rich HTML elements.
 */
export default function BlogPostDetail() {
  const { segment, slug } = useParams();
  const { data: blogData, loading, error, request: fetchPost } = useApi();

  useEffect(() => {
    fetchPost(`/blog/${slug}`).catch(() => {});
  }, [slug, fetchPost]);

  const post = blogData?.data;

  return (
    <>
      {loading ? (
        <div className="spinner-wrapper">
          <div className="spinner" aria-label="Loading blog post"></div>
        </div>
      ) : error ? (
        <section className="section">
          <div className="container">
            <div className="error-panel">
              <h3 className="error-title">Could not load blog post</h3>
              <p>{error.message}</p>
              <Link to={`/${segment}/blog`} className="btn btn-outline" style={{ marginTop: '1rem' }}>
                <ArrowLeft size={18} /> Back to Blog
              </Link>
            </div>
          </div>
        </section>
      ) : !post ? (
        <section className="section">
          <div className="container text-center">
            <h3>Article not found</h3>
            <p>The requested blog article does not exist or has been removed.</p>
            <Link to={`/${segment}/blog`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Blog
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Helmet>
            <title>{post.seoTitle || `${post.title} | CWF Blog`}</title>
            <meta name="description" content={post.seoDescription || post.title} />
          </Helmet>

          {/* Article Header */}
          <section className="section bento-canvas" style={{ borderBottom: '3px solid var(--ink)', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <Link to={`/${segment}/blog`} style={{ color: 'var(--volt)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 'bold', textDecoration: 'none', fontFamily: 'var(--font-data)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                <ArrowLeft size={18} /> Back to Blog List
              </Link>
              <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--ink)', textTransform: 'uppercase', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '1.25rem' }}>
                {post.title}
              </h1>
              
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--ink)',
                  opacity: 0.8,
                  fontFamily: 'var(--font-data)'
                }}
              >
                <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <Calendar size={16} />
                  <span className="data-num">
                    {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).toUpperCase()}
                  </span>
                </span>
                <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', textTransform: 'uppercase' }}>
                  <User size={16} />
                  By {post.author?.role || 'ENGINEER'}
                </span>
              </div>
            </div>
          </section>

          {/* Reader Block */}
          <section className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ borderRadius: '6px', border: '3px solid var(--ink)', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '450px' }}>
                <img
                  src={getBlogImage(post, segment, 0, 900)}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Rich text container */}
              <article
                className="blog-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--ink)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '2px solid var(--ink)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Tag size={18} style={{ color: 'var(--volt)' }} />
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: 'var(--panel)',
                        color: 'var(--ink)',
                        border: '1.5px solid var(--ink)',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-data)'
                      }}
                    >
                      #{tag.toUpperCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
