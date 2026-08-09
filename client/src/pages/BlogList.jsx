import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinaryUrl.js';

/**
 * Public Blog List page.
 * Loads all published blog posts.
 * Strips HTML formatting from rich-text content to render card summaries.
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
      <section className="section" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', textAlign: 'center', padding: '4rem 0' }}>
        <div className="container">
          <h1 style={{ color: 'var(--color-white)', marginBottom: '0.5rem' }}>Waterproofing Insights & Advice</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0 }}>Scientific Engineering articles to preserve concrete integrity</p>
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
            <div className="grid-3">
              {posts.map((post) => {
                const plainTextSnippet = stripHtml(post.content);
                const summary = plainTextSnippet.length > 120
                  ? `${plainTextSnippet.substring(0, 120)}...`
                  : plainTextSnippet;

                return (
                  <div key={post._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
                    <div className="card-image-wrapper">
                      <img
                        src={getOptimizedCloudinaryUrl(post.coverImage, 500)}
                        alt={post.title}
                        className="card-img"
                        loading="lazy"
                      />
                    </div>
                    <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.8rem',
                          color: 'var(--color-gray-text)',
                          marginBottom: '0.75rem',
                        }}
                      >
                        <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <Calendar size={14} />
                          {post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Unpublished'}
                        </span>
                        <span style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', textTransform: 'capitalize' }}>
                          <User size={14} />
                          {post.author?.role || 'Author'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', minHeight: '3.2rem', lineClamp: 2 }}>
                        {post.title}
                      </h3>
                      
                      <p style={{ fontSize: '0.9rem', flexGrow: 1, margin: 0 }}>{summary}</p>

                      <div style={{ marginTop: '1.5rem', alignSelf: 'flex-start' }}>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="btn btn-outline"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            gap: '0.35rem',
                            alignItems: 'center',
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
