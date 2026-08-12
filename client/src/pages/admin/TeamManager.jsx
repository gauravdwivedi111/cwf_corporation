import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

/**
 * TeamManager CRUD manages profile summaries for structural engineers
 * and project auditors.
 */
export default function TeamManager() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fields State
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [order, setOrder] = useState(1);

  // Delete Confirm States
  const [deleteId, setDeleteId] = useState(null);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi('/team');
      if (res.success) {
        setTeam(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch team members list.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

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
    setName('');
    setDesignation('');
    setBio('');
    setPhoto('');
    setOrder(team.length + 1);
    setIsOpen(true);
  };

  const openEditModal = (member) => {
    setEditId(member._id);
    setName(member.name);
    setDesignation(member.designation);
    setBio(member.bio || '');
    setPhoto(member.photo || '');
    setOrder(member.order || 1);
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !designation || !photo) {
      addToast('Please fill out all required fields and upload a photo.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        designation,
        bio,
        photo,
        order: Number(order),
      };

      let res;
      if (editId) {
        res = await authApi(`/team/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        res = await authApi('/team', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        addToast(`Team profile ${editId ? 'updated' : 'created'} successfully.`, 'success');
        setIsOpen(false);
        fetchTeam();
      }
    } catch (err) {
      addToast(err.message || 'Operation failed. Verify inputs.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await authApi(`/team/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        addToast('Team member profile deleted.', 'success');
        fetchTeam();
      }
    } catch (err) {
      addToast(err.message || 'Failed to delete team profile.', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="team-manager-wrapper">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Table list */}
      <div className="admin-table-wrapper">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th" style={{ width: '80px' }}>Order</th>
                <th className="admin-th">Name</th>
                <th className="admin-th">Designation</th>
                <th className="admin-th">Bio Description</th>
                <th className="admin-th" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing team indexes...</span>
                  </td>
                </tr>
              ) : team.length > 0 ? (
                team.map((member) => (
                  <tr key={member._id}>
                    <td className="admin-td" style={{ fontWeight: 700 }}>{member.order}</td>
                    <td className="admin-td">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={member.photo}
                          alt=""
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-gray-border)' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{member.name}</span>
                      </div>
                    </td>
                    <td className="admin-td" style={{ fontWeight: 500 }}>{member.designation}</td>
                    <td className="admin-td" style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {member.bio || <span style={{ color: 'var(--color-gray-text)', fontStyle: 'italic' }}>No bio added</span>}
                    </td>
                    <td className="admin-td">
                      <div className="admin-actions-cell">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem' }}
                          onClick={() => openEditModal(member)}
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.55rem', borderColor: 'rgba(217, 83, 79, 0.3)', color: 'var(--color-error)' }}
                          onClick={() => setDeleteId(member._id)}
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
                  <td colSpan="5" className="admin-td" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-text)' }}>
                    {"No team members defined. Click 'Add Member' to start."}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)} disabled={submitting} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              {editId ? 'Edit Team Member Profile' : 'Add Team Member Profile'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-grid-2">
                <div className="admin-form-group">
                  <label htmlFor="member-name" className="admin-form-label">Full Name *</label>
                  <input
                    type="text"
                    id="member-name"
                    className="admin-form-control"
                    placeholder="e.g. Vikram Shinde"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="member-desig" className="admin-form-label">Designation / Role *</label>
                  <input
                    type="text"
                    id="member-desig"
                    className="admin-form-control"
                    placeholder="e.g. Lead Concrete Inspector"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="member-order" className="admin-form-label">Display Order *</label>
                <input
                  type="number"
                  id="member-order"
                  className="admin-form-control"
                  style={{ maxWidth: '150px' }}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={submitting}
                  min="1"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="member-bio" className="admin-form-label">Brief Bio / Qualifications</label>
                <textarea
                  id="member-bio"
                  className="admin-form-control"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  placeholder="Detail certification bounds, years in service, or academic background..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={submitting}
                />
              </div>

              {/* Photo Upload Row */}
              <div className="admin-form-group">
                <label className="admin-form-label">Profile Photo *</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {photo ? (
                    <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
                      <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        className="image-preview-delete"
                        onClick={() => setPhoto('')}
                        style={{ top: '0.15rem', right: '0.15rem', width: '22px', height: '22px', fontSize: '0.95rem' }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label className="image-upload-zone" style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                      <div className="image-upload-prompt" style={{ fontSize: '0.65rem' }}>
                        <Upload size={14} />
                        <span>Upload photo</span>
                      </div>
                    </label>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>
                    Square portrait format recommended. Size limit: 2MB.
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsOpen(false)} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Team Profile"
        message="Are you sure you want to delete this team member profile? This will remove them from the public About Page listings."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
