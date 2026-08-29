import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApi } from '../hooks/useApi.js';

/**
 * Public Inquiry Form component capturing customer lead info.
 * Enforces client-side validation and dynamically adjusts input fields based on the selected segment.
 */
export default function LeadForm({ defaultService = 'terrace', defaultSegment = '' }) {
  const { loading, error, request: submitInquiry } = useApi();
  const [success, setSuccess] = useState(false);
  
  const [selectedSegment, setSelectedSegment] = useState(defaultSegment);

  // Sync state if defaultSegment changes from parent component
  useEffect(() => {
    if (defaultSegment) {
      setSelectedSegment(defaultSegment);
    }
  }, [defaultSegment]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: 'residential',
    serviceInterested: defaultService || 'terrace',
    projectBudget: '< ₹5L',
    timeline: '1 - 3 months',
    loanAmount: '₹10L - ₹50L',
    financePurpose: 'Working Capital Overdraft',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSegmentChange = (e) => {
    setSelectedSegment(e.target.value);
    setFieldErrors((prev) => ({ ...prev, segment: '' }));
  };

  const validateClientSide = () => {
    const errors = {};
    if (!selectedSegment) {
      errors.segment = 'Please select a business division.';
    }
    if (!formData.name.trim()) {
      errors.name = 'Full name is required.';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number (e.g. 10 to 15 digits).';
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address format.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please outline your project requirements.';
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

    // Map segments and specific discriminator details
    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      segment: selectedSegment,
      message: formData.message,
    };

    if (selectedSegment === 'civil') {
      payload.propertyType = formData.propertyType;
      payload.serviceInterested = formData.serviceInterested;
    } else if (selectedSegment === 'web') {
      payload.segmentDetails = {
        projectBudget: formData.projectBudget,
        timeline: formData.timeline,
      };
    } else if (selectedSegment === 'finance') {
      payload.segmentDetails = {
        loanAmount: formData.loanAmount,
        financePurpose: formData.financePurpose,
      };
    }

    try {
      await submitInquiry('/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        propertyType: 'residential',
        serviceInterested: defaultService || 'terrace',
        projectBudget: '< ₹5L',
        timeline: '1 - 3 months',
        loanAmount: '₹10L - ₹50L',
        financePurpose: 'Working Capital Overdraft',
        message: '',
      });
      if (!defaultSegment) {
        setSelectedSegment('');
      }
    } catch (err) {
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
      <div style={{ padding: '2rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <CheckCircle2
          size={56}
          style={{ color: 'var(--volt)', marginBottom: '1rem', display: 'inline-block' }}
        />
        <h3 style={{ color: 'var(--volt)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Inquiry Submitted</h3>
        <p style={{ color: 'var(--ink)', fontWeight: '500', marginBottom: '0.5rem' }}>
          Thank you for reaching out to CWF, {formData.name || 'Client'}.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--graphite)' }}>
          Your lead has been captured. A CWF division specialist will contact you shortly to review details.
        </p>
        <button
          className="btn btn-secondary"
          style={{ marginTop: '1.5rem', width: '100%' }}
          onClick={() => setSuccess(false)}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <h3 style={{ marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)', textTransform: 'uppercase' }}>Submit a Project Inquiry</h3>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
        Consult with certified Pune advisors and structural engineers.
      </p>

      {error && !error.errors && (
        <div className="error-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} style={{ color: 'var(--volt)' }} />
          <p className="error-title" style={{ fontSize: '0.85rem', margin: 0 }}>
            {error.message}
          </p>
        </div>
      )}

      {/* Segment Selector at the top */}
      <div className="form-group">
        <label htmlFor="segmentSelect" className="form-label">Business Division *</label>
        <select
          id="segmentSelect"
          name="segment"
          className={`form-select ${fieldErrors.segment ? 'is-invalid' : ''}`}
          value={selectedSegment}
          onChange={handleSegmentChange}
          disabled={loading || !!defaultSegment}
        >
          <option value="">-- Please Select Business Division --</option>
          <option value="civil">🛡️ Civil & Waterproofing</option>
          <option value="web">💻 Software & Web Development</option>
          <option value="finance">📈 Financial Advisory & Planning</option>
        </select>
        {fieldErrors.segment && <span className="invalid-feedback">{fieldErrors.segment}</span>}
      </div>

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

      {/* CONDITIONAL SEGMENT SPECIFIC INPUTS */}
      {selectedSegment === 'civil' && (
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
      )}

      {selectedSegment === 'web' && (
        <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
          <div className="form-group">
            <label htmlFor="projectBudget" className="form-label">Expected Budget Range *</label>
            <select
              id="projectBudget"
              name="projectBudget"
              className="form-select"
              value={formData.projectBudget}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="< ₹5L">Under ₹5 Lakhs</option>
              <option value="₹5L - ₹10L">₹5 Lakhs - ₹10 Lakhs</option>
              <option value="₹10L - ₹20L">₹10 Lakhs - ₹20 Lakhs</option>
              <option value="₹20L+">Above ₹20 Lakhs</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeline" className="form-label">Expected Timeline *</label>
            <select
              id="timeline"
              name="timeline"
              className="form-select"
              value={formData.timeline}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="< 1 month">Under 1 Month</option>
              <option value="1 - 3 months">1 to 3 Months</option>
              <option value="3 - 6 months">3 to 6 Months</option>
              <option value="6+ months">Over 6 Months</option>
            </select>
          </div>
        </div>
      )}

      {selectedSegment === 'finance' && (
        <div className="grid-2" style={{ gap: '1rem', marginBottom: '0.5rem' }}>
          <div className="form-group">
            <label htmlFor="loanAmount" className="form-label">Funding/Loan Amount *</label>
            <select
              id="loanAmount"
              name="loanAmount"
              className="form-select"
              value={formData.loanAmount}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="< ₹10L">Under ₹10 Lakhs</option>
              <option value="₹10L - ₹50L">₹10 Lakhs - ₹50 Lakhs</option>
              <option value="₹50L - ₹1Cr">₹50 Lakhs - ₹1 Crore</option>
              <option value="₹1Cr+">Above ₹1 Crore</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="financePurpose" className="form-label">Consulting Purpose *</label>
            <select
              id="financePurpose"
              name="financePurpose"
              className="form-select"
              value={formData.financePurpose}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Debt Restructuring">Debt Restructuring & Consolidation</option>
              <option value="Working Capital Overdraft">Working Capital & Overdraft CC Limits</option>
              <option value="HNW Wealth PMS">HNW Wealth PMS Advisory</option>
              <option value="Corporate Tax Planning">Corporate Tax Planning & Audits</option>
              <option value="Personal Loan">Personal Loan Consult</option>
              <option value="Other">Other Advisory Services</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message" className="form-label">Describe your project requirements *</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className={`form-textarea ${fieldErrors.message ? 'is-invalid' : ''}`}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          placeholder="E.g., details on leakage areas, tech specifications, business turnover, or specific advisory timelines..."
        ></textarea>
        {fieldErrors.message && <span className="invalid-feedback">{fieldErrors.message}</span>}
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
        {loading ? (
          'Submitting Request...'
        ) : (
          <>
            <Send size={18} />
            Submit Inquiry
          </>
        )}
      </button>
    </form>
  );
}
