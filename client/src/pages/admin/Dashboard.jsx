import React, { useState, useEffect } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  Inbox,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Eye,
  X
} from 'lucide-react';

/**
 * Dashboard page renders stats summaries, recent inquiries,
 * and a status progress distribution chart.
 */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const authApi = useAuthApi();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats & recent inquiries concurrently
        const [statsRes, leadsRes] = await Promise.all([
          authApi('/admin/dashboard/stats'),
          authApi('/inquiries?limit=5')
        ]);
        
        if (statsRes.success) setStats(statsRes.data);
        if (leadsRes.success) setRecentLeads(leadsRes.data);
      } catch (err) {
        addToast(err.message || 'Failed to fetch dashboard metrics.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authApi, addToast]);

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  // Calculate totals and status percentages
  const totalLeads = stats
    ? Object.values(stats.leadsByStatus).reduce((a, b) => a + b, 0)
    : 0;

  const getPercent = (value) => {
    if (totalLeads === 0) return 0;
    return Math.round((value / totalLeads) * 100);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Stats counters grid */}
      <div className="admin-stats-grid">
        <div className="stat-card accent">
          <div className="stat-card-info">
            <span className="stat-card-title">Total Inquiries</span>
            <span className="stat-card-value">{totalLeads}</span>
            <span className="stat-card-subtitle neutral">Lifetime database entries</span>
          </div>
          <div className="stat-card-icon">
            <Inbox size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">New Inquiries</span>
            <span className="stat-card-value">
              {stats?.leadVolumeComparison?.thisWeek || 0}
            </span>
            <span className={`stat-card-subtitle ${stats?.leadVolumeComparison?.growthRate >= 0 ? '' : 'neutral'}`}>
              {stats?.leadVolumeComparison?.growthRate >= 0 ? '+' : ''}
              {stats?.leadVolumeComparison?.growthRate || 0}% vs last week
            </span>
          </div>
          <div className="stat-card-icon">
            <TrendingUp size={24} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">Converted Leads</span>
            <span className="stat-card-value">
              {stats?.leadsByStatus?.converted || 0}
            </span>
            <span className="stat-card-subtitle">
              {getPercent(stats?.leadsByStatus?.converted || 0)}% conversion rate
            </span>
          </div>
          <div className="stat-card-icon">
            <CheckCircle size={24} style={{ color: 'var(--color-success)' }} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-info">
            <span className="stat-card-title">New Leads Needed Contact</span>
            <span className="stat-card-value">
              {stats?.leadsByStatus?.new || 0}
            </span>
            <span className="stat-card-subtitle" style={{ color: 'var(--color-error)' }}>
              Requires attention
            </span>
          </div>
          <div className="stat-card-icon">
            <AlertCircle size={24} style={{ color: 'var(--color-error)' }} />
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* CSS Chart: Leads Status Distribution */}
        <div className="admin-chart-card">
          <h3>Inquiry Status Breakdown</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', marginBottom: '1.5rem' }}>
            Distribution of leads based on workflow pipeline state.
          </p>

          <div className="admin-chart-container">
            <div className="admin-chart-bar-wrapper">
              <div className="admin-chart-bar-label">
                <span>New / Uncontacted</span>
                <span>{stats?.leadsByStatus?.new || 0} ({getPercent(stats?.leadsByStatus?.new || 0)}%)</span>
              </div>
              <div className="admin-chart-bar-outer">
                <div
                  className="admin-chart-bar-inner inbox"
                  style={{ width: `${getPercent(stats?.leadsByStatus?.new || 0)}%` }}
                ></div>
              </div>
            </div>

            <div className="admin-chart-bar-wrapper">
              <div className="admin-chart-bar-label">
                <span>Contacted / Site Visited</span>
                <span>
                  {((stats?.leadsByStatus?.contacted || 0) + (stats?.leadsByStatus?.['site-visit-scheduled'] || 0))} ({getPercent((stats?.leadsByStatus?.contacted || 0) + (stats?.leadsByStatus?.['site-visit-scheduled'] || 0))}%)
                </span>
              </div>
              <div className="admin-chart-bar-outer">
                <div
                  className="admin-chart-bar-inner contacted"
                  style={{ width: `${getPercent((stats?.leadsByStatus?.contacted || 0) + (stats?.leadsByStatus?.['site-visit-scheduled'] || 0))}%` }}
                ></div>
              </div>
            </div>

            <div className="admin-chart-bar-wrapper">
              <div className="admin-chart-bar-label">
                <span>Quoted</span>
                <span>{stats?.leadsByStatus?.quoted || 0} ({getPercent(stats?.leadsByStatus?.quoted || 0)}%)</span>
              </div>
              <div className="admin-chart-bar-outer">
                <div
                  className="admin-chart-bar-inner contacted"
                  style={{ width: `${getPercent(stats?.leadsByStatus?.quoted || 0)}%`, backgroundColor: '#3b82f6' }}
                ></div>
              </div>
            </div>

            <div className="admin-chart-bar-wrapper">
              <div className="admin-chart-bar-label">
                <span>Converted / Won</span>
                <span>{stats?.leadsByStatus?.converted || 0} ({getPercent(stats?.leadsByStatus?.converted || 0)}%)</span>
              </div>
              <div className="admin-chart-bar-outer">
                <div
                  className="admin-chart-bar-inner converted"
                  style={{ width: `${getPercent(stats?.leadsByStatus?.converted || 0)}%` }}
                ></div>
              </div>
            </div>

            <div className="admin-chart-bar-wrapper">
              <div className="admin-chart-bar-label">
                <span>Closed / Lost</span>
                <span>{stats?.leadsByStatus?.closed || 0} ({getPercent(stats?.leadsByStatus?.closed || 0)}%)</span>
              </div>
              <div className="admin-chart-bar-outer">
                <div
                  className="admin-chart-bar-inner rejected"
                  style={{ width: `${getPercent(stats?.leadsByStatus?.closed || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top-Viewed Service Categories */}
        <div className="admin-chart-card">
          <h3>Popular Waterproofing Areas</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', marginBottom: '1.5rem' }}>
            Top page views recorded across dynamic service listings.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.topServices && stats.topServices.length > 0 ? (
              stats.topServices.map((service, index) => (
                <div
                  key={service._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-neutral-light)',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${index === 0 ? 'var(--color-accent)' : 'var(--color-gray-border)'}`
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                      {service.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', textTransform: 'capitalize' }}>
                      Category: {service.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {service.views} views
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-gray-text)', fontStyle: 'italic' }}>No service view stats registered.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Leads Table Panel */}
      <div className="admin-table-wrapper" style={{ marginTop: '2rem' }}>
        <div className="admin-table-header">
          <h3>Recent Inquiries</h3>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Client</th>
                <th className="admin-th">Property</th>
                <th className="admin-th">Service</th>
                <th className="admin-th">Date</th>
                <th className="admin-th">Status</th>
                <th className="admin-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads && recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td className="admin-td">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>{lead.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-text)' }}>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{lead.propertyType}</td>
                    <td className="admin-td" style={{ textTransform: 'capitalize' }}>{lead.serviceInterested}</td>
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
                      <button
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye size={14} />
                        <span>Quick View</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin-td" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-gray-text)' }}>
                    No recent inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content lead-detail-overlay" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedLead(null)} aria-label="Close modal">
              <X size={20} />
            </button>
            <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              Inquiry Details
            </h3>

            <div className="lead-detail-grid">
              <div className="lead-detail-section">
                <span className="lead-detail-label">Client Name</span>
                <span className="lead-detail-value">{selectedLead.name}</span>
              </div>
              <div className="lead-detail-section">
                <span className="lead-detail-label">Contact Details</span>
                <span className="lead-detail-value">{selectedLead.phone} {selectedLead.email ? `| ${selectedLead.email}` : ''}</span>
              </div>
              <div className="lead-detail-section">
                <span className="lead-detail-label">Property Classification</span>
                <span className="lead-detail-value" style={{ textTransform: 'capitalize' }}>{selectedLead.propertyType}</span>
              </div>
              <div className="lead-detail-section">
                <span className="lead-detail-label">Waterproofing Area Interest</span>
                <span className="lead-detail-value" style={{ textTransform: 'capitalize' }}>{selectedLead.serviceInterested}</span>
              </div>
              <div className="lead-detail-section">
                <span className="lead-detail-label">Submission Date</span>
                <span className="lead-detail-value">
                  {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="lead-detail-section">
                <span className="lead-detail-label">Inquiry Source</span>
                <span className="lead-detail-value" style={{ textTransform: 'capitalize' }}>{selectedLead.source || 'website-form'}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="lead-detail-label">Client Description / Message</span>
              <p className="lead-detail-value" style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontWeight: 'normal', color: 'var(--color-neutral-dark)', backgroundColor: 'var(--color-neutral-light)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--color-gray-border)' }}>
                {selectedLead.message}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setSelectedLead(null)}>
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
