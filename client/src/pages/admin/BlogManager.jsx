import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import HtmlEditor from '../../components/admin/HtmlEditor.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

/**
 * BlogManager CRUD handles article entries, SEO metadata nodes,
 * and cover image uploads.
 */
export default function BlogManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [segmentFilter, setSegmentFilter] = useState('all');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [segment, setSegment] = useState('civil');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState(''); // comma-separated input string
  const [isPublished, setIsPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Delete Confirm States
  const [deleteId, setDeleteId] = useState(null);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all posts including drafts (all=true)
      const res = await authApi('/blog?all=true');
      if (res.success) {
        setBlogs(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch blog list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated);
      
      // Auto-populate SEO title
      if (val.length <= 50) {
        setSeoTitle(`${val} | CWF Consulting Corporation`);
      }
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Cover image size must be less than 5MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    addToast('Uploading cover image...', 'info');
    try {
      const res = await authApi('/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success) {
        setCoverImage(res.url);
        addToast('Cover image uploaded successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Cover image upload failed.', 'error');
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setSegment('civil');
    setContent('');
    setCoverImage('');
    setTagsInput('');
    setIsPublished(false);
    setSeoTitle('');
    setSeoDescription('');
    setIsOpen(true);
  };

  const openEditModal = (post) => {
    setEditId(post._id);
    setTitle(post.title);
    setSlug(post.slug);
    setSegment(post.segment || 'civil');
    setContent(post.content);
    setCoverImage(post.coverImage);
    setTagsInput(post.tags?.join(', ') || '');
    setIsPublished(post.isPublished !== false);
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content || !coverImage) {
      addToast('Please fill out all required fields and upload a cover photo.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Parse tags input comma string into array
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        title,
        slug,
        segment,
        content,
        coverImage,
        tags,
        isPublished,
        seoTitle,
        seoDescription,
      };

      let res;
      if (editId) {
        res = await authApi(`/blog/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authApi('/blog', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        addToast(`Blog post ${editId ? 'updated' : 'created'} successfully.`, 'success');
        setIsOpen(false);
        fetchBlogs();
      }
    } catch (err) {
      addToast(err.message || 'Operation failed. Verify unique slug values.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authApi(`/blog/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        addToast('Blog post deleted successfully.', 'success');
        fetchBlogs();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete blog post.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredBlogs = segmentFilter === 'all'
    ? blogs
    : blogs.filter((b) => b.segment === segmentFilter);

  return (
    <div className="blog-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'civil', 'web', 'finance', 'general'].map((seg) => (
            <button
              key={seg}
              type="button"
              className={`btn btn-sm ${segmentFilter === seg ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize', minWidth: '80px' }}
              onClick={() => setSegmentFilter(seg)}
            >
              {seg}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>New Article</span>
        </button>
      </div>

      {/* Blogs Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Cover</th>
                <th className="admin-th">Title</th>
                <th className="admin-th" style={{ width: '120px' }}>Segment</th>
                <th className="admin-th">Author</th>
                <th className="admin-th">Tags</th>
                <th className="admin-th">Published Date</th>
                <th className="admin-th">Status</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing editorial logs...</span>
                  </td>
                </tr>
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((post) => (
                  <tr key={post._id}>
                    <td className="admin-td">
                      <img
                        src={post.coverImage}
                        alt=""
                        style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--color-gray-border)' }}
                      />
                    </td>
                    <td className="admin-td">
                      <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{post.title}</span>
                    </td>
                    <td className="admin-td">
                      <span 
                        style={
                          post.segment === 'civil' 
                            ? { backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                            : post.segment === 'web'
                            ? { backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                            : post.segment === 'finance'
                            ? { backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                            : { backgroundColor: 'rgba(156, 163, 175, 0.1)', color: '#9ca3af', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                        }
                      >
                        {post.segment || 'general'}
                      </span>
                    </td>
                    <td className="admin-td" style={{ fontSize: '0.85rem' }}>
                      {post.author?.email ? post.author.email.split('@')[0] : 'System'}
                    </td>
                    <td className="admin-td">
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {post.tags?.map((t) => (
                          <span 
                            key={t} 
                            style={{ 
                              display: 'inline-flex', 
                              padding: '0.2rem 0.5rem', 
                              borderRadius: '4px', 
                              fontSize: '0.65rem', 
                              fontWeight: '700', 
                              backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                              color: '#f3f4f6', 
                              border: '1px solid rgba(255, 255, 255, 0.15)' 
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="admin-td">
                      {post.publishedAt ? (
                        new Date(post.publishedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>Not published</span>
                      )}
                    </td>
                    <td className="admin-td">
                      <span className={`badge-status ${post.isPublished ? 'converted' : 'rejected'}`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="admin-actions-cell">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => openEditModal(post)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', borderColor: 'rgba(217, 83, 79, 0.3)', color: 'var(--color-error)' }}
                          onClick={() => setDeleteId(post._id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-text)' }}>
                    {"No blog articles created. Click 'New Article' to start."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal overlay */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)} disabled={submitting} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Article Details' : 'Write New Blog Article'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="blog-segment" className="admin-form-label">Business Segment *</label>
                  <select
                    id="blog-segment"
                    className="admin-form-control"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="civil">Civil & Waterproofing</option>
                    <option value="web">Software & Web Solutions</option>
                    <option value="finance">Financial Services</option>
                    <option value="general">General / Corporate</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="blog-title" className="admin-form-label">Article Title *</label>
                  <input
                    type="text"
                    id="blog-title"
                    className="admin-form-control"
                    placeholder="e.g. Kapurthala Terrace Inspection Review"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="blog-slug" className="admin-form-label">URL Slug *</label>
                  <input
                    type="text"
                    id="blog-slug"
                    className="admin-form-control"
                    placeholder="e.g. kapurthala-terrace-inspection"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              {/* Custom HTML Editor for blog content */}
              <HtmlEditor
                value={content}
                onChange={setContent}
                label="Article Body Content *"
              />

              <div className="form-grid-2">
                {/* Cover Image Upload row */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Cover Image *</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    {coverImage ? (
                      <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
                        <img src={coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          className="image-preview-delete"
                          onClick={() => setCoverImage('')}
                          style={{ top: '0.25rem', right: '0.25rem' }}
                        >
                          &times;
                        </button>
                      </div>
                    ) : (
                      <label className="image-upload-zone" style={{ width: '120px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                        <div className="image-upload-prompt" style={{ fontSize: '0.7rem' }}>
                          <Upload size={14} />
                          <span>Upload cover</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Tags row */}
                <div className="admin-form-group">
                  <label htmlFor="blog-tags" className="admin-form-label">Tags / Keywords</label>
                  <input
                    type="text"
                    id="blog-tags"
                    className="admin-form-control"
                    placeholder="e.g. terrace, audit, moisture, concrete"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    disabled={submitting}
                  />
                  <small style={{ color: 'var(--color-gray-text)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                    Comma separated values.
                  </small>
                </div>
              </div>

              {/* SEO METADATA ROW */}
              <div style={{ backgroundColor: 'var(--color-neutral-light)', padding: '1.25rem 1.5rem', borderRadius: '6px', border: '1px solid var(--color-gray-border)', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-primary-dark)' }}>
                  <span>Search Engine Optimization (SEO Metadata)</span>
                </h4>
                
                <div className="admin-form-group">
                  <label htmlFor="seo-title" className="admin-form-label" style={{ fontSize: '0.8rem' }}>Meta Title (Max 60 Chars)</label>
                  <input
                    type="text"
                    id="seo-title"
                    className="admin-form-control"
                    maxLength="60"
                    placeholder="e.g. Terrace Auditing and Dampness Checks | CWF Corp"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="admin-form-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="seo-desc" className="admin-form-label" style={{ fontSize: '0.8rem' }}>Meta Description (Max 160 Chars)</label>
                  <textarea
                    id="seo-desc"
                    className="admin-form-control"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    maxLength="160"
                    placeholder="Learn standard structural dampness checks, thermal imaging, and slab inspections..."
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="checkbox-label-wrapper">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    disabled={submitting}
                  />
                  <span>Publish this article directly (Unchecked keeps it as Draft)</span>
                </label>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving article...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Blog Article"
        message="Are you sure you want to remove this blog article? The link will immediately break for any external search engine crawlers."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
