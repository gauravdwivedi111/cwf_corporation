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
  const [segmentFilter, setSegmentFilter] = useState('all');

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [segment, setSegment] = useState('civil');
  const [serviceCategory, setServiceCategory] = useState('waterproofing');
  const [description, setDescription] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Civil specific fields
  const [location, setLocation] = useState('');
  const [clientType, setClientType] = useState('residential');
  const [beforeImages, setBeforeImages] = useState([]);
  const [afterImages, setAfterImages] = useState([]);
  const [sqftTreated, setSqftTreated] = useState('');

  // Web specific fields
  const [techStack, setTechStack] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  // Finance specific fields
  const [outcomeMetric, setOutcomeMetric] = useState('');
  const [clientIndustry, setClientIndustry] = useState('');

  const [coverImage, setCoverImage] = useState('');

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

  const handleSegmentChange = (selectedSegment) => {
    setSegment(selectedSegment);
    if (selectedSegment === 'civil') {
      setServiceCategory('waterproofing');
    } else if (selectedSegment === 'web') {
      setServiceCategory('e-commerce');
    } else if (selectedSegment === 'finance') {
      setServiceCategory('working-capital');
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

  const openCreateModal = () => {
    setEditId(null);
    setTitle('');
    setSlug('');
    setSegment('civil');
    setServiceCategory('waterproofing');
    setDescription('');
    setCompletionDate('');
    setIsFeatured(false);
    setCoverImage('');

    // Reset Civil fields
    setLocation('');
    setClientType('residential');
    setBeforeImages([]);
    setAfterImages([]);
    setSqftTreated('');

    // Reset Web fields
    setTechStack('');
    setLiveUrl('');

    // Reset Finance fields
    setOutcomeMetric('');
    setClientIndustry('');

    setIsOpen(true);
  };

  const openEditModal = (project) => {
    setEditId(project._id);
    setTitle(project.title);
    setSlug(project.slug);
    setSegment(project.segment || 'civil');
    setServiceCategory(project.serviceCategory || 'waterproofing');
    setDescription(project.description);
    setCompletionDate(project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '');
    setIsFeatured(project.isFeatured === true);
    setCoverImage(project.coverImage || '');

    // Set Civil fields
    setLocation(project.location || '');
    setClientType(project.clientType || 'residential');
    setBeforeImages(project.beforeImages || []);
    setAfterImages(project.afterImages || []);
    setSqftTreated(project.sqftTreated || '');

    // Set Web fields
    setTechStack(project.techStack?.join(', ') || '');
    setLiveUrl(project.liveUrl || '');

    // Set Finance fields
    setOutcomeMetric(project.outcomeMetric || '');
    setClientIndustry(project.clientIndustry || '');

    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !description || !completionDate) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        segment,
        description,
        serviceCategory,
        completionDate: new Date(completionDate).toISOString(),
        isFeatured,
        coverImage: coverImage || (afterImages.length > 0 ? afterImages[0] : ''),
      };

      // Add segment specific attributes
      if (segment === 'civil') {
        payload.location = location;
        payload.clientType = clientType;
        payload.sqftTreated = sqftTreated ? Number(sqftTreated) : 0;
        payload.beforeImages = beforeImages;
        payload.afterImages = afterImages;
      } else if (segment === 'web') {
        payload.techStack = techStack ? techStack.split(',').map((s) => s.trim()).filter(Boolean) : [];
        payload.liveUrl = liveUrl || '';
      } else if (segment === 'finance') {
        payload.outcomeMetric = outcomeMetric || '';
        payload.clientIndustry = clientIndustry || '';
      }

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
      addToast(err.message || 'Operation failed. Verify input fields.', 'error');
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

  const filteredProjects = segmentFilter === 'all'
    ? projects
    : projects.filter((p) => p.segment === segmentFilter);

  return (
    <div className="projects-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'civil', 'web', 'finance'].map((seg) => (
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
                <th className="admin-th" style={{ width: '120px' }}>Segment</th>
                <th className="admin-th">Category</th>
                <th className="admin-th">Segment Details</th>
                <th className="admin-th" style={{ width: '110px' }}>Featured</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing portfolio records...</span>
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="admin-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {project.coverImage || project.afterImages?.[0] ? (
                          <img
                            src={project.coverImage || project.afterImages[0]}
                            alt=""
                            style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '2px', border: '1px solid var(--color-gray-border)' }}
                          />
                        ) : (
                          <div style={{ width: '40px', height: '30px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
                        )}
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{project.title}</span>
                      </div>
                    </td>
                    <td className="admin-td">
                      <span 
                        style={
                          project.segment === 'civil' 
                            ? { backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                            : project.segment === 'web'
                            ? { backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                            : { backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase' }
                        }
                      >
                        {project.segment}
                      </span>
                    </td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{project.serviceCategory?.replace('-', ' ')}</td>
                    <td className="admin-td" style={{ fontSize: '0.85rem' }}>
                      {project.segment === 'civil' && (
                        <span>📍 {project.location || 'N/A'} ({project.clientType || 'N/A'})</span>
                      )}
                      {project.segment === 'web' && (
                        <span>💻 {project.techStack?.join(', ') || 'N/A'}</span>
                      )}
                      {project.segment === 'finance' && (
                        <span>🎯 {project.clientIndustry || 'N/A'}</span>
                      )}
                    </td>
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
                  <label htmlFor="proj-segment" className="admin-form-label">Business Segment *</label>
                  <select
                    id="proj-segment"
                    className="admin-form-control"
                    value={segment}
                    onChange={(e) => handleSegmentChange(e.target.value)}
                    disabled={submitting}
                  >
                    <option value="civil">Civil & Waterproofing</option>
                    <option value="web">Software & Web Solutions</option>
                    <option value="finance">Financial Services</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="proj-service" className="admin-form-label">Category *</label>
                  <select
                    id="proj-service"
                    className="admin-form-control"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    disabled={submitting}
                  >
                    {segment === 'civil' && (
                      <>
                        <option value="waterproofing">Waterproofing</option>
                        <option value="flooring">Flooring Systems</option>
                        <option value="landscaping">Landscaping</option>
                        <option value="painting">Painting</option>
                        <option value="repairs">Structural & Civil Repairs</option>
                        <option value="rehabilitation">Rehabilitation & Restoration</option>
                        <option value="inspection">Technical Inspection</option>
                        <option value="quality-assurance">Quality Assurance</option>
                        <option value="boq-estimation">BOQ & Cost Estimation</option>
                        <option value="supervision">Project & Application Supervision</option>
                      </>
                    )}
                    {segment === 'web' && (
                      <>
                        <option value="e-commerce">E-Commerce Solutions</option>
                        <option value="corporate-site">Corporate Site</option>
                        <option value="web-app">Web App</option>
                        <option value="seo-maintenance">SEO & Maintenance</option>
                        <option value="custom-development">Custom Development</option>
                      </>
                    )}
                    {segment === 'finance' && (
                      <>
                        <option value="business-loan">Business Loan</option>
                        <option value="personal-loan">Personal Loan</option>
                        <option value="investment-advisory">Investment Advisory</option>
                        <option value="tax-consultancy">Tax Consultancy</option>
                        <option value="working-capital">Working Capital</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
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

              {/* Segment-Specific Input Fields */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px dashed var(--color-gray-border)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-primary-dark)', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  {segment} Project Details
                </h4>

                {segment === 'civil' && (
                  <>
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
                          required={segment === 'civil'}
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
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="proj-sqft" className="admin-form-label">Area Treated (Sqft) *</label>
                      <input
                        type="number"
                        id="proj-sqft"
                        className="admin-form-control"
                        value={sqftTreated}
                        onChange={(e) => setSqftTreated(e.target.value)}
                        disabled={submitting}
                        min="0"
                        required={segment === 'civil'}
                      />
                    </div>
                  </>
                )}

                {segment === 'web' && (
                  <>
                    <div className="admin-form-group">
                      <label htmlFor="proj-tech" className="admin-form-label">Tech Stack (comma separated)</label>
                      <input
                        type="text"
                        id="proj-tech"
                        className="admin-form-control"
                        placeholder="e.g. React, Node.js, Express"
                        value={techStack}
                        onChange={(e) => setTechStack(e.target.value)}
                        disabled={submitting}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="proj-live" className="admin-form-label">Live Site URL</label>
                      <input
                        type="url"
                        id="proj-live"
                        className="admin-form-control"
                        placeholder="https://my-live-project.com"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        disabled={submitting}
                      />
                    </div>
                  </>
                )}

                {segment === 'finance' && (
                  <>
                    <div className="admin-form-group">
                      <label htmlFor="proj-outcome" className="admin-form-label">Outcome Metric / Highlight *</label>
                      <input
                        type="text"
                        id="proj-outcome"
                        className="admin-form-control"
                        placeholder="e.g. Saved INR 24 Lakhs annually in interest charges"
                        value={outcomeMetric}
                        onChange={(e) => setOutcomeMetric(e.target.value)}
                        disabled={submitting}
                        required={segment === 'finance'}
                      />
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label htmlFor="proj-industry" className="admin-form-label">Client Industry *</label>
                      <input
                        type="text"
                        id="proj-industry"
                        className="admin-form-control"
                        placeholder="e.g. Automotive Components Manufacturing"
                        value={clientIndustry}
                        onChange={(e) => setClientIndustry(e.target.value)}
                        disabled={submitting}
                        required={segment === 'finance'}
                      />
                    </div>
                  </>
                )}
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

              {/* Cover Image Upload Row (Web and Finance) */}
              {segment !== 'civil' && (
                <div className="admin-form-group" style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                  <label className="admin-form-label">Cover Image *</label>
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
              )}

              {/* Before Images Row (Civil only) */}
              {segment === 'civil' && (
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
              )}

              {/* After Images Row (Civil only) */}
              {segment === 'civil' && (
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
              )}

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
