import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import { UserPlus, Key, Lock, Check } from 'lucide-react';

/**
 * UserManager handles staff credential creation, password resets, and deactivation.
 * Gated exclusively for superadmin access.
 */
export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New User Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');

  // Status toggle confirm state
  const [toggleUser, setToggleUser] = useState(null);

  // Password reset modal state
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authApi('/admin/users');
      if (res.success) {
        setUsers(res.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch user profiles.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authApi('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });

      if (res.success) {
        addToast(res.message || 'Staff user created successfully.', 'success');
        setEmail('');
        setPassword('');
        setRole('editor');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to create user.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!toggleUser) return;
    const nextStatus = !toggleUser.isActive;
    try {
      const res = await authApi(`/admin/users/${toggleUser._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextStatus }),
      });

      if (res.success) {
        addToast(res.message || 'User status updated.', 'success');
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message || 'Failed to toggle user status.', 'error');
    } finally {
      setToggleUser(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetUser || !newPassword) return;
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }

    setResetting(true);
    try {
      const res = await authApi(`/admin/users/${resetUser._id}/password`, {
        method: 'PATCH',
        body: JSON.stringify({ password: newPassword }),
      });

      if (res.success) {
        addToast(res.message || 'Password reset successfully.', 'success');
        setResetUser(null);
        setNewPassword('');
      }
    } catch (err) {
      addToast(err.message || 'Failed to reset password.', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="user-manager-wrapper">
      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Create Staff Form Card */}
        <div>
          <form onSubmit={handleCreateUser} className="admin-card">
            <h3>Provision Staff Account</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', marginBottom: '1.5rem' }}>
              Create standard credentials for editing or auditing access.
            </p>

            <div className="admin-form-group">
              <label htmlFor="staff-email" className="admin-form-label">Email Address *</label>
              <input
                type="email"
                id="staff-email"
                className="admin-form-control"
                placeholder="e.g. inspector@cwfcorporation.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                autoComplete="new-email"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="staff-pass" className="admin-form-label">Temporary Password *</label>
              <input
                type="password"
                id="staff-pass"
                className="admin-form-control"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="staff-role" className="admin-form-label">System Role *</label>
              <select
                id="staff-role"
                className="admin-form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={submitting}
              >
                <option value="editor">Editor (Leads & Content CRUD)</option>
                <option value="superadmin">Superadmin (All Privileges)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              <UserPlus size={18} />
              <span>Create Staff Member</span>
            </button>
          </form>
        </div>

        {/* Staff accounts list */}
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Registered Staff</h3>
          </div>
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th">User Account</th>
                  <th className="admin-th">Role</th>
                  <th className="admin-th">Status</th>
                  <th className="admin-th" style={{ width: '190px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                      <span>Loading staff listings...</span>
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((staffMember) => (
                    <tr key={staffMember._id}>
                      <td className="admin-td">
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                            {staffMember.email}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)' }}>
                            Created: {new Date(staffMember.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td className="admin-td">
                        <span className={`badge-role ${staffMember.role === 'superadmin' ? 'superadmin' : ''}`}>
                          {staffMember.role}
                        </span>
                      </td>
                      <td className="admin-td">
                        <span className={`badge-status ${staffMember.isActive ? 'converted' : 'rejected'}`}>
                          {staffMember.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="admin-td">
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                            title="Reset Password"
                            onClick={() => {
                              setResetUser(staffMember);
                              setNewPassword('');
                            }}
                          >
                            <Key size={13} />
                            <span>Pass</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.75rem',
                              borderColor: staffMember.isActive ? 'rgba(217, 83, 79, 0.3)' : 'rgba(46, 125, 50, 0.3)',
                              color: staffMember.isActive ? 'var(--color-error)' : 'var(--color-success)',
                            }}
                            onClick={() => setToggleUser(staffMember)}
                          >
                            {staffMember.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="admin-td" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-text)' }}>
                      No staff accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetUser && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="admin-card" style={{ maxWidth: '420px', width: '100%', backgroundColor: 'var(--color-surface, #0A131A)', border: '1px solid var(--volt)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Lock size={22} style={{ color: 'var(--volt)' }} />
              <h3 style={{ margin: 0 }}>Reset Password</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-gray-text)', marginBottom: '1.25rem' }}>
              Enter a new secure password for <strong>{resetUser.email}</strong>.
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="admin-form-group">
                <label className="admin-form-label">New Password *</label>
                <input
                  type="password"
                  className="admin-form-control"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={resetting}
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setResetUser(null);
                    setNewPassword('');
                  }}
                  disabled={resetting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={resetting || !newPassword}>
                  {resetting ? 'Updating...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Activation confirmation modal */}
      <ConfirmDialog
        isOpen={toggleUser !== null}
        title={toggleUser?.isActive ? 'Deactivate Staff User' : 'Activate Staff User'}
        message={`Are you sure you want to ${toggleUser?.isActive ? 'deactivate' : 'activate'} user account "${toggleUser?.email}"? Deactivated accounts cannot sign in.`}
        onConfirm={handleToggleStatus}
        onCancel={() => setToggleUser(null)}
      />
    </div>
  );
}
