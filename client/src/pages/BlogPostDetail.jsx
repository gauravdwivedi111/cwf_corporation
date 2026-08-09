import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Dynamic Blog Post Detail Reader view.
 * Fetches article by slug and parses raw content strings to rich HTML elements.
 */
export default function BlogPostDetail() {
  const { slug } = useParams();
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
              <Link to="/blog" className="btn btn-outline" style={{ marginTop: '1rem' }}>
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
            <Link to="/blog" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Back to Blog
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Helmet>
            {/* Inject dynamic SEO Title and description fallbacks */}
            <title>{post.seoTitle || `${post.title} | CWF Blog`}</title>
            <meta name="description" content={post.seoDescription || post.title} />
          </Helmet>

          {/* Article Header */}
          <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <Link to="/blog" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Blog List
              </Link>
              <h1 style={{ color: 'var(--color-white)', fontSize: '2.5rem', marginBottom: '1.25rem' }}>{post.title}</h1>
              
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <Calendar size={16} />
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', textTransform: 'capitalize' }}>
                  <User size={16} />
                  By {post.author?.role || 'Engineer'}
                </span>
              </div>
            </div>
          </section>

          {/* Reader Block */}
          <section className="section">
            <div className="container" style={{ maxWidth: '800px' }}>
              <div style={{ borderRadius: '6px', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '450px' }}>
                <img
                  src={getOptimizedCloudinaryUrl(post.coverImage, 900)}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Rich text container */}
              <article
                className="blog-content"
                style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-neutral-dark)' }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags && post.tags.length > 0 && (
                <div style={{ marginTop: '3.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-gray-border)', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Tag size={18} style={{ color: 'var(--color-accent)' }} />
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: 'var(--color-neutral-light)',
                        color: 'var(--color-primary-mid)',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        borderRadius: '4px',
                      }}
                    >
                      #{tag}
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
