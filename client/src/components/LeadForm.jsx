import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';

/**
 * Public Inquiry Form component capturing customer lead info.
 * Enforces client-side validation rules and maps server-side validation error arrays.
 */
export default function LeadForm({ defaultService = 'terrace' }) {
  const { loading, error, request: submitInquiry } = useApi();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'residential',
    serviceInterested: defaultService,
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateClientSide = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (e.g. 10 to 15 digits).';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address format.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please describe the leakage issue.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    try {
      await submitInquiry('/inquiries', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        propertyType: 'residential',
        serviceInterested: defaultService,
        message: '',
      });
    } catch (err) {
      // Parse validation error arrays from the express-validator middleware
      if (err.errors) {
        const serverErrors = {};
        err.errors.forEach((validationError) => {
          serverErrors[validationError.field] = validationError.message;
        });
        setFieldErrors(serverErrors);
      }
    }
  };

  if (success) {
    return (
      <div
        className="card"
        style={{
          padding: '3.5rem 2rem',
          textAlign: 'center',
          borderColor: 'var(--color-success)',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <CheckCircle2
          size={56}
          style={{ color: 'var(--color-success)', marginBottom: '1rem', display: 'inline-block' }}
        />
        <h3 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>Inspection Scheduled</h3>
        <p style={{ color: 'var(--color-neutral-dark)', fontWeight: '500', marginBottom: '0.5rem' }}>
          Thank you for reaching out, {formData.name || 'Client'}.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-text)' }}>
          Your lead has been captured. A CWF waterproofing expert will contact you shortly to coordinate a technical site audit.
        </p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: '1.5rem' }}
          onClick={() => setSuccess(false)}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>Book a Technical Site Audit</h3>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Get a structural diagnostic inspection by our certified Pune engineers.
      </p>

      {error && !error.errors && (
        <div className="error-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} style={{ color: 'var(--color-error)' }} />
          <p className="error-title" style={{ fontSize: '0.85rem', margin: 0 }}>
            {error.message}
          </p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name" className="form-label">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${fieldErrors.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
          placeholder="e.g. Ashok Dwivedi"
        />
        {fieldErrors.name && <span className="invalid-feedback">{fieldErrors.name}</span>}
      </div>

      <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={`form-input ${fieldErrors.phone ? 'is-invalid' : ''}`}
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. +91 98765 43210"
          />
          {fieldErrors.phone && <span className="invalid-feedback">{fieldErrors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address (Optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${fieldErrors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g. ashok@example.com"
          />
          {fieldErrors.email && <span className="invalid-feedback">{fieldErrors.email}</span>}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
        <div className="form-group">
          <label htmlFor="propertyType" className="form-label">Property Type *</label>
          <select
            id="propertyType"
            name="propertyType"
            className="form-select"
            value={formData.propertyType}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="residential">Residential Complex / Bungalow</option>
            <option value="commercial">Commercial Office / Mall</option>
            <option value="industrial">Industrial Shed / Warehouse</option>
            <option value="other">Other Structure Type</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="serviceInterested" className="form-label">Area of Leakage *</label>
          <select
            id="serviceInterested"
            name="serviceInterested"
            className="form-select"
            value={formData.serviceInterested}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="terrace">Terrace / Slab Crack</option>
            <option value="basement">Basement Wall / Retaining Wall</option>
            <option value="bathroom">Bathroom / Wet Areas</option>
            <option value="tank">Overhead or Undergound Water Tank</option>
            <option value="facade">Facade / External Wall Dampness</option>
            <option value="injection-grouting">Injection Grouting / Gaps</option>
            <option value="other">Other Leakage Issue</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">Describe structural leakage issues *</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className={`form-textarea ${fieldErrors.message ? 'is-invalid' : ''}`}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          placeholder="Describe your issue. E.g. Active seepage on ceiling during heavy monsoon, water pooling, concrete cracks..."
        ></textarea>
        {fieldErrors.message && <span className="invalid-feedback">{fieldErrors.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? (
          'Submitting Request...'
        ) : (
          <>
            <Send size={18} />
            Submit Audit Request
          </>
        )}
      </button>
    </form>
  );
}
