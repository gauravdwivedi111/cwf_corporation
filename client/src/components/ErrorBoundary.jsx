import React from 'react';

/**
 * React Error Boundary component wrapping the root layout.
 * Prevents full-page blanks on visitors by capturing rendering exceptions.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log exception metadata to browser developer console
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: '#f8fafc',
          }}
        >
          <div
            style={{
              maxWidth: '550px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#f8fafc' }}>
              Unexpected Application Error
            </h1>
            
            <p style={{ color: '#94a3b8', fontSize: '0.975rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              We apologize for the inconvenience. A client-side component crash occurred. Our engineering logs have captured the diagnostic stack.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: '#ef4444',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '2rem',
                  maxHeight: '120px',
                }}
              >
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                  transition: 'transform 0.2s',
                }}
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
