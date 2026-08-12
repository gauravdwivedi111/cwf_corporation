import React, { useState, useEffect, useCallback } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Search,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * LeadsManager desk lists all client inquiries.
 * Supports updating lead status, adding internal comments,
 * and assigning staff.
 */
export default function LeadsManager() {
  const [leads, setLeads] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Form states inside Lead Modal
  const [newNote, setNewNote] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateAssignedTo, setUpdateAssignedTo] = useState('');
  const [updating, setUpdating] = useState(false);

  const authApi = useAuthApi();
  const { addToast } = useToast();

  // Fetch inquiries based on active query params
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      let query = `/inquiries?page=${page}&limit=10`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (status) query += `&status=${status}`;
      if (startDate) query += `&startDate=${startDate}`;
      if (endDate) query += `&endDate=${endDate}`;

      const res = await authApi(query);
      if (res.success) {
        setLeads(res.data);
        setTotalPages(res.pagination.pages || 1);
        setTotalCount(res.pagination.total || 0);
      }
    } catch (err) {
      addToast(err.message || 'Failed to fetch inquiries.', 'error');
    } finally {
      setLoading(false);
    }
  }, [authApi, addToast, page, search, status, startDate, endDate]);

  // Fetch staff list for assignments
  const fetchStaff = useCallback(async () => {
    try {
      const res = await authApi('/admin/users');
      if (res.success) {
        // filter for active staff members
        setStaff(res.data.filter((u) => u.isActive));
      }
    } catch (err) {
      console.error('Failed to load staff list:', err.message);
    }
  }, [authApi]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Handle Quick View Modal activation
  const openLeadDetails = (lead) => {
    setSelectedLead(lead);
    setUpdateStatus(lead.status || 'new');
    setUpdateAssignedTo(lead.assignedTo?._id || '');
    setNewNote('');
  };

  // Submit status update, assignment, or note insertion
  const handleLeadUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLead) return;

    setUpdating(true);
    try {
      const payload = {
        status: updateStatus,
        assignedTo: updateAssignedTo || null, // send null to unassign
      };
      if (newNote.trim()) {
        payload.note = newNote.trim();
      }

      const res = await authApi(`/inquiries/${selectedLead._id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        addToast('Inquiry record updated successfully.', 'success');
        setSelectedLead(res.data);
        setNewNote('');
        
        // Refresh leads list
        fetchLeads();
      }
    } catch (err) {
      addToast(err.message || 'Failed to update inquiry record.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  return (
    <div className="leads-manager-wrapper">
      {/* Filtering and search console */}
      <div className="admin-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          
          <div style={{ flexGrow: 1, minWidth: '220px' }}>
            <label className="admin-form-label" style={{ fontSize: '0.8rem' }}>Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="admin-form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search name, phone, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-text)' }}
              />
            </div>
          </div>

          <div style={{ minWidth: '150px' }}>
            <label className="admin-form-label" style={{ fontSize: '0.8rem' }}>Status Workflow</label>
            <select
              className="admin-form-control"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="site-visit-scheduled">Site Visit</option>
              <option value="quoted">Quoted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed / Lost</option>
            </select>
          </div>

          <div style={{ minWidth: '130px' }}>
            <label className="admin-form-label" style={{ fontSize: '0.8rem' }}>Start Date</label>
            <input
              type="date"
              className="admin-form-control"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div style={{ minWidth: '130px' }}>
            <label className="admin-form-label" style={{ fontSize: '0.8rem' }}>End Date</label>
            <input
              type="date"
              className="admin-form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button type="button" className="btn btn-outline" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Main leads list table */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>Inquiry Log ({totalCount} entries)</h3>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Client Details</th>
                <th className="admin-th">Property</th>
                <th className="admin-th">Service Area</th>
                <th className="admin-th">Assigned To</th>
                <th className="admin-th">Created</th>
                <th className="admin-th">Status</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="admin-loading-spinner" style={{ margin: '0 auto 1rem', width: '32px', height: '32px' }}></div>
                    <span>Refreshing inquiry registers...</span>
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="admin-td">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{lead.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>{lead.phone}</span>
                        {lead.email && <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', textDecoration: 'underline' }}>{lead.email}</span>}
                      </div>
                    </td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{lead.propertyType}</td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{lead.serviceInterested}</td>
                    <td className="admin-td">
                      {lead.assignedTo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-primary-mid)' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
                          <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lead.assignedTo.email.split('@')[0]}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>
                    <td className="admin-td">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="admin-td">
                      <span className={`badge-status ${lead.status === 'site-visit-scheduled' ? 'contacted' : lead.status === 'closed' ? 'rejected' : lead.status}`}>
                        {lead.status?.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="admin-td">
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => openLeadDetails(lead)}>
                        <Eye size={14} />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin-td" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gray-text)' }}>
                    No inquiry logs match the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Console */}
        {totalPages > 1 && (
          <div className="admin-pagination">
            <span style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button
                className="btn btn-outline"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Lead Manager Drawer Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content lead-detail-overlay" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <button className="modal-close" onClick={() => setSelectedLead(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              Manage Inquiry: {selectedLead.name}
            </h3>

            <form onSubmit={handleLeadUpdate}>
              <div className="lead-detail-grid">
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Client Name</span>
                  <span className="lead-detail-value">{selectedLead.name}</span>
                </div>
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Property Class</span>
                  <span className="lead-detail-value" style={{ textTransform: 'capitalize' }}>{selectedLead.propertyType}</span>
                </div>
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Phone Reference</span>
                  <span className="lead-detail-value">{selectedLead.phone}</span>
                </div>
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Service Category</span>
                  <span className="lead-detail-value" style={{ textTransform: 'capitalize' }}>{selectedLead.serviceInterested}</span>
                </div>
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Email Reference</span>
                  <span className="lead-detail-value">{selectedLead.email || 'None provided'}</span>
                </div>
                <div className="lead-detail-section">
                  <span className="lead-detail-label">Created At</span>
                  <span className="lead-detail-value">{new Date(selectedLead.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Message Block */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="lead-detail-label">Client Message Description</span>
                <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: 'var(--color-neutral-dark)', backgroundColor: 'var(--color-neutral-light)', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid var(--color-gray-border)', marginBottom: 0 }}>
                  {selectedLead.message}
                </p>
              </div>

              <div className="form-grid-2">
                {/* Status selector */}
                <div className="admin-form-group">
                  <label htmlFor="update-status" className="admin-form-label">Update Status</label>
                  <select
                    id="update-status"
                    className="admin-form-control"
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                  >
                    <option value="new">New / Uncontacted</option>
                    <option value="contacted">Contacted</option>
                    <option value="site-visit-scheduled">Site Visit Scheduled</option>
                    <option value="quoted">Quoted</option>
                    <option value="converted">Converted / Won</option>
                    <option value="closed">Closed / Lost</option>
                  </select>
                </div>

                {/* Staff Assignment selector */}
                <div className="admin-form-group">
                  <label htmlFor="update-assignee" className="admin-form-label">Assign Representative</label>
                  <select
                    id="update-assignee"
                    className="admin-form-control"
                    value={updateAssignedTo}
                    onChange={(e) => setUpdateAssignedTo(e.target.value)}
                  >
                    <option value="">Unassigned (None)</option>
                    {staff.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.email} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes Thread */}
              <div className="lead-notes-area" style={{ marginBottom: '1.5rem' }}>
                <span className="lead-detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Internal Consultation Notes ({selectedLead.internalNotes?.length || 0})</span>
                </span>
                
                <div className="lead-notes-list">
                  {selectedLead.internalNotes && selectedLead.internalNotes.length > 0 ? (
                    selectedLead.internalNotes.map((note, index) => (
                      <div key={index} className="lead-note-item">
                        <div className="lead-note-header">
                          <span>{note.addedBy?.email || 'System'}</span>
                          <span>{new Date(note.addedAt).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="lead-note-text">{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--color-gray-text)', fontStyle: 'italic', fontSize: '0.85rem', padding: '0.5rem 0' }}>
                      No internal notes recorded yet.
                    </p>
                  )}
                </div>

                <div className="admin-form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <label htmlFor="lead-new-note" className="admin-form-label" style={{ fontSize: '0.8rem' }}>Append New Note</label>
                  <textarea
                    id="lead-new-note"
                    className="admin-form-control"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    placeholder="Type notes on site audits, client conversations, or quotes..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit update buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setSelectedLead(null)} disabled={updating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving updates...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
