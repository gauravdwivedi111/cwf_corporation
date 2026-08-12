import React, { useState, useEffect } from 'react';
import { useAuthApi } from '../../hooks/useAuthApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Save, AlertTriangle } from 'lucide-react';

/**
 * SettingsManager provides a single form to adjust company metadata.
 * Gated to superadmin writes, so editors view a locked layout.
 */
export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Address sub-fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('India');

  // Social links sub-fields
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // Primary fields
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');

  const { user } = useAuth();
  const authApi = useAuthApi();
  const { addToast } = useToast();

  const isSuperadmin = user?.role === 'superadmin';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await authApi('/settings');
        if (res.success && res.data) {
          const s = res.data;
          setCompanyPhone(s.companyPhone || '');
          setCompanyEmail(s.companyEmail || '');
          setBusinessHours(s.businessHours || '');
          setAboutText(s.aboutText || '');
          
          if (s.address) {
            setStreet(s.address.street || '');
            setCity(s.address.city || '');
            setStateName(s.address.state || '');
            setPincode(s.address.pincode || '');
            setCountry(s.address.country || 'India');
          }

          if (s.socialLinks) {
            setFacebook(s.socialLinks.facebook || '');
            setInstagram(s.socialLinks.instagram || '');
            setLinkedin(s.socialLinks.linkedin || '');
          }

          if (s.certifications) {
            setCertificationsInput(s.certifications.join(', '));
          }
        }
      } catch (err) {
        addToast(err.message || 'Failed to fetch global site settings.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [authApi, addToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSuperadmin) {
      addToast('Only superadmin accounts can edit site configurations.', 'error');
      return;
    }

    if (!companyPhone || !companyEmail || !street || !city || !stateName || !pincode || !businessHours || !aboutText) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // Split certifications input into array
      const certifications = certificationsInput
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const payload = {
        companyPhone,
        companyEmail,
        address: {
          street,
          city,
          state: stateName,
          pincode,
          country,
        },
        businessHours,
        aboutText,
        socialLinks: {
          facebook,
          instagram,
          linkedin,
        },
        certifications,
      };

      const res = await authApi('/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        addToast('Site settings updated successfully.', 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to save settings.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-wrapper">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings-manager-wrapper">
      {/* Role Restriction Alert Banner */}
      {!isSuperadmin && (
        <div className="error-panel" style={{ padding: '1rem', borderStyle: 'solid', backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
          <AlertTriangle size={24} />
          <div>
            <h4 style={{ color: '#92400e', fontSize: '0.95rem', margin: 0 }}>View Only Access</h4>
            <p style={{ color: '#b45309', fontSize: '0.85rem', margin: 0 }}>
              Your profile is registered as an Editor. Only Superadmin roles can update corporate settings.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card">
        <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          Corporate Office & Contact Info
        </h3>
        
        <div className="form-grid-2">
          <div className="admin-form-group">
            <label htmlFor="comp-phone" className="admin-form-label">Phone Hotline *</label>
            <input
              type="text"
              id="comp-phone"
              className="admin-form-control"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              disabled={!isSuperadmin || submitting}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="comp-email" className="admin-form-label">Corporate Email *</label>
            <input
              type="email"
              id="comp-email"
              className="admin-form-control"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              disabled={!isSuperadmin || submitting}
              required
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="comp-street" className="admin-form-label">Street Address *</label>
          <input
            type="text"
            id="comp-street"
            className="admin-form-control"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            disabled={!isSuperadmin || submitting}
            required
          />
        </div>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label htmlFor="comp-city" className="admin-form-label">City *</label>
            <input
              type="text"
              id="comp-city"
              className="admin-form-control"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!isSuperadmin || submitting}
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="admin-form-group">
              <label htmlFor="comp-state" className="admin-form-label">State *</label>
              <input
                type="text"
                id="comp-state"
                className="admin-form-control"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                disabled={!isSuperadmin || submitting}
                required
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="comp-pin" className="admin-form-label">Pincode *</label>
              <input
                type="text"
                id="comp-pin"
                className="admin-form-control"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                disabled={!isSuperadmin || submitting}
                required
              />
            </div>
          </div>
        </div>

        <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', marginTop: '2.5rem' }}>
          Business Hours & Corporate Text
        </h3>

        <div className="admin-form-group">
          <label htmlFor="comp-hours" className="admin-form-label">Working Hours Description *</label>
          <input
            type="text"
            id="comp-hours"
            className="admin-form-control"
            placeholder="e.g. Monday - Saturday: 9:00 AM - 6:00 PM"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            disabled={!isSuperadmin || submitting}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="comp-about" className="admin-form-label">Footer About Text *</label>
          <textarea
            id="comp-about"
            className="admin-form-control"
            style={{ minHeight: '80px', resize: 'vertical' }}
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            disabled={!isSuperadmin || submitting}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="comp-certs" className="admin-form-label">Certifications list (Comma Separated)</label>
          <input
            type="text"
            id="comp-certs"
            className="admin-form-control"
            placeholder="e.g. ISO 9001:2015 Structural Safety, Maharashtra Waterproofing Association"
            value={certificationsInput}
            onChange={(e) => setCertificationsInput(e.target.value)}
            disabled={!isSuperadmin || submitting}
          />
        </div>

        <h3 style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem', marginTop: '2.5rem' }}>
          Social Channels Reference
        </h3>

        <div className="form-grid-2">
          <div className="admin-form-group">
            <label htmlFor="social-fb" className="admin-form-label">Facebook Profile Link</label>
            <input
              type="url"
              id="social-fb"
              className="admin-form-control"
              placeholder="https://facebook.com/company"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              disabled={!isSuperadmin || submitting}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="social-insta" className="admin-form-label">Instagram Profile Link</label>
            <input
              type="url"
              id="social-insta"
              className="admin-form-control"
              placeholder="https://instagram.com/company"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              disabled={!isSuperadmin || submitting}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="social-li" className="admin-form-label">LinkedIn Corporate Page Link</label>
          <input
            type="url"
            id="social-li"
            className="admin-form-control"
            placeholder="https://linkedin.com/company/organization"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            disabled={!isSuperadmin || submitting}
          />
        </div>

        {isSuperadmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--color-gray-border)', paddingTop: '1.25rem' }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={18} />
              <span>{submitting ? 'Saving modifications...' : 'Save Settings'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
