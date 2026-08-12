import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

/**
 * ProjectsManager CRUD handles portfolio case studies,
 * linking before/after visual assets and client classes.
 */
export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [clientType, setClientType] = useState('residential');
  const [serviceCategory, setServiceCategory] = useState('terrace');
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [sqftTreated, setSqftTreated] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Delete Confirm States
  const [deleteId, setDeleteId] = useState(null);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi('/projects');
      if (res.success) {
        setProjects(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch portfolio projects.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

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

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await authApi('/admin/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.success) return res.url;
    } catch (err) {
      addToast(err.message || 'Image upload failed.', 'error');
    }
    return null;
  };

  const handleBeforeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB.', 'error');
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      setBeforeImages((prev) => [...prev, url]);
      addToast('Before image added.', 'success');
    }
  };

  const handleAfterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size must be less than 5MB.', 'error');
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      setAfterImages((prev) => [...prev, url]);
      addToast('After image added.', 'success');
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setLocation('');
    setClientType('residential');
    setServiceCategory('terrace');
    setBeforeImages([]);
    setAfterImages([]);
    setSqftTreated('');
    setCompletionDate('');
    setIsFeatured(false);
    setIsOpen(true);
  };

  const openEditModal = (project) => {
    setEditId(project._id);
    setTitle(project.title);
    // Projects API may not have slug or completionDate fields if schema differed, fallback safely
    setSlug(project.slug || project.title.toLowerCase().replace(/\s+/g, '-'));
    setDescription(project.description);
    setLocation(project.location);
    setClientType(project.clientType || 'residential');
    setServiceCategory(project.serviceCategory || 'terrace');
    setBeforeImages(project.beforeImages || []);
    setAfterImages(project.afterImages || []);
    setSqftTreated(project.sqftTreated || '');
    
    // Format date string for standard date inputs: YYYY-MM-DD
    const dateStr = project.completionDate
      ? new Date(project.completionDate).toISOString().split('T')[0]
      : '';
    setCompletionDate(dateStr);
    
    setIsFeatured(project.isFeatured !== false);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !description || !location || !sqftTreated || !completionDate) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        description,
        location,
        clientType,
        serviceCategory,
        beforeImages,
        afterImages,
        sqftTreated: Number(sqftTreated),
        completionDate: new Date(completionDate).toISOString(),
        isFeatured,
      };

      let res;
      if (editId) {
        res = await authApi(`/projects/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authApi('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        addToast(`Project ${editId ? 'updated' : 'created'} successfully.`, 'success');
        setIsOpen(false);
        fetchProjects();
      }
    } catch (err) {
      addToast(err.message || 'Operation failed. Verify input syntax.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authApi(`/projects/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        addToast('Project record removed successfully.', 'success');
        fetchProjects();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete project.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="projects-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects list table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Title</th>
                <th className="admin-th">Location</th>
                <th className="admin-th">Client Type</th>
                <th className="admin-th">Service Area</th>
                <th className="admin-th">Area (Sqft)</th>
                <th className="admin-th">Featured</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing portfolio records...</span>
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <tr key={project._id}>
                    <td className="admin-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {project.afterImages?.[0] ? (
                          <img
                            src={project.afterImages[0]}
                            alt=""
                            style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--color-gray-border)' }}
                          />
                        ) : (
                          <div style={{ width: '40px', height: '30px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{project.title}</span>
                      </div>
                    </td>
                    <td className="admin-td">{project.location}</td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{project.clientType}</td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{project.serviceCategory?.replace('-', ' ')}</td>
                    <td className="admin-td" style={{ fontFamily: 'monospace' }}>{project.sqftTreated}</td>
                    <td className="admin-td">
                      <span className={`badge-status ${project.isFeatured ? 'converted' : 'neutral'}`}>
                        {project.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="admin-td">
                      <div className="admin-actions-cell">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => openEditModal(project)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', borderColor: 'rgba(217, 83, 79, 0.3)', color: 'var(--color-error)' }}
                          onClick={() => setDeleteId(project._id)}
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
                    {"No portfolio projects created. Click 'New Project' to start."}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)} disabled={submitting} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Project Details' : 'Create New Portfolio Project'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="proj-title" className="admin-form-label">Project Title *</label>
                  <input
                    type="text"
                    id="proj-title"
                    className="admin-form-control"
                    placeholder="e.g. Concrete Floor Coating at Warehouse"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="proj-slug" className="admin-form-label">URL Slug *</label>
                  <input
                    type="text"
                    id="proj-slug"
                    className="admin-form-control"
                    placeholder="e.g. concrete-coating-warehouse"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="proj-loc" className="admin-form-label">Location (Area, City) *</label>
                  <input
                    type="text"
                    id="proj-loc"
                    className="admin-form-control"
                    placeholder="e.g. Kothrud, Pune"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="proj-client" className="admin-form-label">Client Type *</label>
                  <select
                    id="proj-client"
                    className="admin-form-control"
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="proj-service" className="admin-form-label">Waterproofing Area Category *</label>
                  <select
                    id="proj-service"
                    className="admin-form-control"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="terrace">Terrace Sealing</option>
                    <option value="basement">Basement Grouting</option>
                    <option value="bathroom">Bathroom Sealing</option>
                    <option value="tank">Water Tank Lining</option>
                    <option value="facade">Exterior Wall Facade</option>
                    <option value="injection-grouting">Injection Grouting</option>
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="admin-form-group">
                    <label htmlFor="proj-sqft" className="admin-form-label">Area Treated (Sqft) *</label>
                    <input
                      type="number"
                      id="proj-sqft"
                      className="admin-form-control"
                      value={sqftTreated}
                      onChange={(e) => setSqftTreated(e.target.value)}
                      disabled={submitting}
                      min="0"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label htmlFor="proj-date" className="admin-form-label">Completion Date *</label>
                    <input
                      type="date"
                      id="proj-date"
                      className="admin-form-control"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      disabled={submitting}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="proj-desc" className="admin-form-label">Case Study Description *</label>
                <textarea
                  id="proj-desc"
                  className="admin-form-control"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  placeholder="Detail the audit diagnosis findings, target leakage pathways, and materials applied..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={submitting}
                  required
                />
              </div>

              {/* Before Images Row */}
              <div className="admin-form-group" style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <label className="admin-form-label">Before Images (Audits & Dampness Sites)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="image-upload-zone" style={{ padding: '1rem' }}>
                    <input type="file" accept="image/*" onChange={handleBeforeUpload} style={{ display: 'none' }} />
                    <div className="image-upload-prompt" style={{ flexDirection: 'row', gap: '0.5rem' }}>
                      <Upload size={16} />
                      <span>Select an image to add to Before gallery</span>
                    </div>
                  </label>
                  {beforeImages.length > 0 && (
                    <div className="image-preview-grid">
                      {beforeImages.map((url, idx) => (
                        <div key={idx} className="image-preview-wrapper" style={{ aspectRatio: '16/10' }}>
                          <img src={url} alt="" className="image-preview-img" />
                          <button
                            type="button"
                            className="image-preview-delete"
                            onClick={() => setBeforeImages((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* After Images Row */}
              <div className="admin-form-group" style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <label className="admin-form-label">After Images (Finished Membranes & Sealed Coatings)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label className="image-upload-zone" style={{ padding: '1rem' }}>
                    <input type="file" accept="image/*" onChange={handleAfterUpload} style={{ display: 'none' }} />
                    <div className="image-upload-prompt" style={{ flexDirection: 'row', gap: '0.5rem' }}>
                      <Upload size={16} />
                      <span>Select an image to add to After gallery</span>
                    </div>
                  </label>
                  {afterImages.length > 0 && (
                    <div className="image-preview-grid">
                      {afterImages.map((url, idx) => (
                        <div key={idx} className="image-preview-wrapper" style={{ aspectRatio: '16/10' }}>
                          <img src={url} alt="" className="image-preview-img" />
                          <button
                            type="button"
                            className="image-preview-delete"
                            onClick={() => setAfterImages((prev) => prev.filter((_, i) => i !== idx))}
                          >
                            &times;
                          </button>
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
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    disabled={submitting}
                  />
                  <span>Feature this case study on the Home Page slider</span>
                </label>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving changes...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Project Case Study"
        message="Are you sure you want to delete this case study from the portfolio? This will remove before/after image sets from all public layouts."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
