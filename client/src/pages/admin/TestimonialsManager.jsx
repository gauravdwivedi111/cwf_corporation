import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { Plus, Edit, Trash2, X, Upload, Star } from 'lucide-react';

/**
 * TestimonialsManager CRUD manages customer reviews, ratings,
 * and links them to case studies.
 */
export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fields State
  const [clientName, setClientName] = useState('');
  const [clientType, setClientType] = useState('individual');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Delete Confirm States
  const [deleteId, setDeleteId] = useState(null);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi('/testimonials?all=true');
      if (res.success) {
        setTestimonials(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch testimonials list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await authApi('/projects');
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects list for testimonials:', err.message);
    }
  }, [authApi]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('Profile photo size must be less than 2MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    addToast('Uploading profile photo...', 'info');
    try {
      const res = await authApi('/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success) {
        setPhoto(res.url);
        addToast('Profile photo uploaded successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Photo upload failed.', 'error');
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setClientName('');
    setClientType('individual');
    setRating(5);
    setText('');
    setPhoto('');
    setProjectRef('');
    setIsPublished(true);
    setIsOpen(true);
  };

  const openEditModal = (testimonial) => {
    setEditId(testimonial._id);
    setClientName(testimonial.clientName);
    setClientType(testimonial.clientType || 'individual');
    setRating(testimonial.rating || 5);
    setText(testimonial.text);
    setPhoto(testimonial.photo || '');
    setProjectRef(testimonial.projectRef?._id || testimonial.projectRef || '');
    setIsPublished(testimonial.isPublished !== false);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !text || !rating) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        clientName,
        clientType,
        rating: Number(rating),
        text,
        photo: photo || null,
        projectRef: projectRef || null,
        isPublished,
      };

      let res;
      if (editId) {
        res = await authApi(`/testimonials/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authApi('/testimonials', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        addToast(`Testimonial ${editId ? 'updated' : 'created'} successfully.`, 'success');
        setIsOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      addToast(err.message || 'Operation failed. Verify review data.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authApi(`/testimonials/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        addToast('Testimonial record removed successfully.', 'success');
        fetchTestimonials();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete testimonial.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="testimonials-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>New Testimonial</span>
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Client</th>
                <th className="admin-th">Classification</th>
                <th className="admin-th">Rating</th>
                <th className="admin-th">Linked Project</th>
                <th className="admin-th">Review Excerpt</th>
                <th className="admin-th">Status</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing client reviews...</span>
                  </td>
                </tr>
              ) : testimonials.length > 0 ? (
                testimonials.map((test) => (
                  <tr key={test._id}>
                    <td className="admin-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {test.photo ? (
                          <img
                            src={test.photo}
                            alt=""
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-gray-border)' }}
                          />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>
                            {test.clientName[0]}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{test.clientName}</span>
                      </div>
                    </td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{test.clientType}</td>
                    <td className="admin-td">
                      <div style={{ display: 'flex', color: '#fbbf24', gap: '0.1rem' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < test.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </td>
                    <td className="admin-td">
                      {test.projectRef?.title || test.projectRef ? (
                        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-primary-mid)' }}>
                          {test.projectRef.title || 'Referenced Project'}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>None</span>
                      )}
                    </td>
                    <td className="admin-td" style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {test.text}
                    </td>
                    <td className="admin-td">
                      <span className={`badge-status ${test.isPublished ? 'converted' : 'rejected'}`}>
                        {test.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="admin-actions-cell">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => openEditModal(test)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', borderColor: 'rgba(217, 83, 79, 0.3)', color: 'var(--color-error)' }}
                          onClick={() => setDeleteId(test._id)}
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
                    {"No client reviews created. Click 'New Testimonial' to start."}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)} disabled={submitting} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Testimonial' : 'Register New Testimonial'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="client-name" className="admin-form-label">Client Name *</label>
                  <input
                    type="text"
                    id="client-name"
                    className="admin-form-control"
                    placeholder="e.g. Anil Deshmukh"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="client-type" className="admin-form-label">Client Type *</label>
                  <select
                    id="client-type"
                    className="admin-form-control"
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="individual">Individual / Owner</option>
                    <option value="residential">Residential Complex</option>
                    <option value="commercial">Commercial Entity</option>
                    <option value="industrial">Industrial Developer</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="client-rating" className="admin-form-label">Review Rating *</label>
                  <select
                    id="client-rating"
                    className="admin-form-control"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Poor)</option>
                    <option value="1">1 Star (Very Bad)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="client-proj" className="admin-form-label">Link Portfolio Project</label>
                  <select
                    id="client-proj"
                    className="admin-form-control"
                    value={projectRef}
                    onChange={(e) => setProjectRef(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="">No project link (None)</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} ({p.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="client-text" className="admin-form-label">Testimonial Text *</label>
                <textarea
                  id="client-text"
                  className="admin-form-control"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Paste review or audit feedback received from the customer..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Reviewer Photo Row */}
              <div className="admin-form-group">
                <label className="admin-form-label">Client Photo</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {photo ? (
                    <div style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        className="image-preview-delete"
                        onClick={() => setPhoto('')}
                        style={{ top: '0.15rem', right: '0.15rem', width: '20px', height: '20px', fontSize: '0.9rem' }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-zone" style={{ width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                      <div className="image-upload-prompt" style={{ fontSize: '0.65rem' }}>
                        <Upload size={14} />
                        <span>Upload photo</span>
                      </div>
                    </label>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                    Optional photo of the client representative. Size limit: 2MB.
                  </div>
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
                  <span>Publish this testimonial immediately</span>
                </label>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving changes...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Testimonial"
        message="Are you sure you want to remove this client testimonial? It will immediately stop appearing on the home page carousel slider."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
