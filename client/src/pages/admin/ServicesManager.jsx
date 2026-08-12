import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import HtmlEditor from '../../components/admin/HtmlEditor.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

/**
 * ServicesManager CRUD handles creation, editing, reordering,
 * and media attachments for company offerings.
 */
export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('terrace');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [icon, setIcon] = useState('droplet');
  const [order, setOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  // Delete Confirm States
  const [deleteId, setDeleteId] = useState(null);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all services including drafts (all=true)
      const res = await authApi('/services?all=true');
      if (res.success) {
        setServices(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch services list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Generate slug dynamically from title if editing slug isn't manual
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!editId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      setSlug(generated);
    }
  };

  // Upload an image asset to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authApi('/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success) {
        return res.url;
      }
    } catch (err) {
      addToast(err.message || 'Image upload failed.', 'error');
    }
    return null;
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Cover image size must be less than 5MB.', 'error');
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      setCoverImage(url);
      addToast('Cover image uploaded.', 'success');
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    addToast('Uploading gallery images...', 'info');
    const uploadedUrls = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        addToast(`Skipping ${file.name} (exceeds 5MB size limit).`, 'error');
        continue;
      }
      const url = await uploadImage(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }

    if (uploadedUrls.length > 0) {
      setGallery((prev) => [...prev, ...uploadedUrls]);
      addToast(`Added ${uploadedUrls.length} image(s) to gallery.`, 'success');
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setCategory('terrace');
    setShortDescription('');
    setFullDescription('');
    setCoverImage('');
    setGallery([]);
    setIcon('droplet');
    setOrder(services.length + 1);
    setIsPublished(true);
    setIsOpen(true);
  };

  const openEditModal = (service) => {
    setEditId(service._id);
    setTitle(service.title);
    setSlug(service.slug);
    setCategory(service.category);
    setShortDescription(service.shortDescription);
    setFullDescription(service.fullDescription);
    setCoverImage(service.coverImage);
    setGallery(service.gallery || []);
    setIcon(service.icon || 'droplet');
    setOrder(service.order || 1);
    setIsPublished(service.isPublished !== false);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !shortDescription || !fullDescription || !coverImage) {
      addToast('Please fill out all required fields and upload a cover image.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        category,
        shortDescription,
        fullDescription,
        coverImage,
        gallery,
        icon,
        order: Number(order),
        isPublished,
      };

      let res;
      if (editId) {
        res = await authApi(`/services/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authApi('/services', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        addToast(`Service ${editId ? 'updated' : 'created'} successfully.`, 'success');
        setIsOpen(false);
        fetchServices();
      }
    } catch (err) {
      addToast(err.message || 'Operation failed. Verify fields (e.g. unique slug).', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authApi(`/services/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        addToast('Service record deleted successfully.', 'success');
        fetchServices();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete service.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="services-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>New Service</span>
        </button>
      </div>

      {/* Services Table List */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th" style={{ width: '80px' }}>Order</th>
                <th className="admin-th">Title</th>
                <th className="admin-th">Category</th>
                <th className="admin-th">Icon</th>
                <th className="admin-th">Status</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing service registry...</span>
                  </td>
                </tr>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <tr key={service._id}>
                    <td className="admin-td" style={{ fontWeight: 700 }}>{service.order}</td>
                    <td className="admin-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={service.coverImage}
                          alt=""
                          style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--color-gray-border)' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{service.title}</span>
                      </div>
                    </td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{service.category?.replace('-', ' ')}</td>
                    <td className="admin-td" style={{ fontFamily: 'monospace' }}>{service.icon}</td>
                    <td className="admin-td">
                      <span className={`badge-status ${service.isPublished ? 'converted' : 'rejected'}`}>
                        {service.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="admin-actions-cell">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => openEditModal(service)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', borderColor: 'rgba(217, 83, 79, 0.3)', color: 'var(--color-error)' }}
                          onClick={() => setDeleteId(service._id)}
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
                  <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-text)' }}>
                    {"No services created. Click 'New Service' to start."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Drawer Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => !submitting && setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)} disabled={submitting} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Service' : 'Create New Service'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="service-title" className="admin-form-label">Service Title *</label>
                  <input
                    type="text"
                    id="service-title"
                    className="admin-form-control"
                    placeholder="e.g. Retaining Wall Injection Sealing"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="service-slug" className="admin-form-label">URL Slug *</label>
                  <input
                    type="text"
                    id="service-slug"
                    className="admin-form-control"
                    placeholder="e.g. wall-injection-sealing"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="service-cat" className="admin-form-label">Category *</label>
                  <select
                    id="service-cat"
                    className="admin-form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="terrace">Terrace Waterproofing</option>
                    <option value="basement">Basement Seeping</option>
                    <option value="bathroom">Bathroom Sealing</option>
                    <option value="tank">Water Tank Repair</option>
                    <option value="facade">Exterior Wall Facade</option>
                    <option value="injection-grouting">Pressure Injection Grouting</option>
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label htmlFor="service-icon" className="admin-form-label">Lucide Icon *</label>
                    <select
                      id="service-icon"
                      className="admin-form-control"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      disabled={submitting}
                    >
                      <option value="droplet">Droplet (Water)</option>
                      <option value="shield">Shield (Protection)</option>
                      <option value="bath">Bath (Bathroom)</option>
                      <option value="home">Home (Basement)</option>
                      <option value="check">Check (Audit)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="service-order" className="admin-form-label">Listing Order *</label>
                    <input
                      type="number"
                      id="service-order"
                      className="admin-form-control"
                      value={order}
                      onChange={(e) => setOrder(e.target.value)}
                      disabled={submitting}
                      min="1"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="service-short" className="admin-form-label">Short Description (Max 250 Chars) *</label>
                <textarea
                  id="service-short"
                  className="admin-form-control"
                  style={{ minHeight: '60px', resize: 'vertical' }}
                  placeholder="Provide a brief summary for service listing cards..."
                  maxLength="250"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Custom HTML Editor for Full Description */}
              <HtmlEditor
                value={fullDescription}
                onChange={setFullDescription}
                label="Full Diagnostic & Treatment Description *"
              />

              {/* Cover Image Upload Row */}
              <div className="admin-form-group">
                <label className="admin-form-label">Cover image *</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {coverImage ? (
                    <div style={{ position: 'relative', width: '150px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
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
                    <label className="image-upload-zone" style={{ width: '150px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                      <div className="image-upload-prompt" style={{ fontSize: '0.75rem' }}>
                        <Upload size={16} />
                        <span>Upload cover</span>
                      </div>
                    </label>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                    Recommended size: 800x500. Formats: JPEG, PNG, WEBP. Limit: 5MB.
                  </div>
                </div>
              </div>

              {/* Gallery Images Upload row */}
              <div className="admin-form-group">
                <label className="admin-form-label">Gallery Images</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="image-upload-zone" style={{ padding: '1rem' }}>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
                    <div className="image-upload-prompt" style={{ flexDirection: 'row', gap: '0.5rem' }}>
                      <Upload size={16} />
                      <span>Select multiple images to add to the gallery</span>
                    </div>
                  </label>

                  {gallery.length > 0 && (
                    <div className="image-preview-grid">
                      {gallery.map((url, idx) => (
                        <div key={idx} className="image-preview-wrapper" style={{ aspectRatio: '16/10' }}>
                          <img src={url} alt="" className="image-preview-img" />
                          <button
                            type="button"
                            className="image-preview-delete"
                            onClick={() => removeGalleryImage(idx)}
                          >
                            &times;
                          </button>
                          <span className="image-preview-badge">#{idx + 1}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <span>Publish this service immediately</span>
                </label>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving changes...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Service"
        message="Are you sure you want to delete this service category? This will break public dynamic page rendering if the slug matches active links."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
