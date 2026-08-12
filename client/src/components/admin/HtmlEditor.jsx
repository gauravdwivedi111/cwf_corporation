import React, { useState, useRef } from 'react';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link2, Eye, Code } from 'lucide-react';

/**
 * HtmlEditor builds a clean editor around standard textarea components.
 * Restricts package overhead and styles HTML markup using the design system.
 */
export default function HtmlEditor({ value, onChange, label = 'Content Description' }) {
  const [previewMode, setPreviewMode] = useState(false);
  const textareaRef = useRef(null);

  const insertTag = (tagOpen, tagClose = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement = '';
    if (tagClose) {
      replacement = `${tagOpen}${selectedText || 'Text'}${tagClose}`;
    } else {
      replacement = tagOpen;
    }

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Re-focus and select inserted text block
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + tagOpen.length,
        start + tagOpen.length + (selectedText || 'Text').length
      );
    }, 0);
  };

  return (
    <div className="admin-form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <label className="admin-form-label" style={{ marginBottom: 0 }}>{label}</label>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              border: '1px solid #dbe1e8',
              borderRadius: '4px',
              background: !previewMode ? '#e0f2f1' : '#fff',
              color: !previewMode ? 'var(--color-accent)' : 'var(--color-primary-mid)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
            onClick={() => setPreviewMode(false)}
          >
            <Code size={14} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.25rem 0.5rem',
              border: '1px solid #dbe1e8',
              borderRadius: '4px',
              background: previewMode ? '#e0f2f1' : '#fff',
              color: previewMode ? 'var(--color-accent)' : 'var(--color-primary-mid)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}
            onClick={() => setPreviewMode(true)}
          >
            <Eye size={14} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="editor-container">
        {!previewMode ? (
          <>
            <div className="editor-toolbar">
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<strong>', '</strong>')}
                title="Bold Text"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<em>', '</em>')}
                title="Italic Text"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<h1>', '</h1>')}
                title="Heading 1"
              >
                <Heading1 size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<h2>', '</h2>')}
                title="Heading 2"
              >
                <Heading2 size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
                title="Bullet List"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
                title="Numbered List"
              >
                <ListOrdered size={16} />
              </button>
              <button
                type="button"
                className="editor-btn"
                onClick={() => {
                  const url = prompt('Enter hyper-link destination:', 'https://');
                  if (url) insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
                }}
                title="Add Hyperlink"
              >
                <Link2 size={16} />
              </button>
            </div>
            <textarea
              ref={textareaRef}
              className="editor-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write description content or use the formatting helpers above..."
            />
          </>
        ) : (
          <div
            className="editor-preview-tab"
            dangerouslySetInnerHTML={{
              __html: value || '<p style="color: var(--color-gray-text); font-style: italic; margin-bottom: 0;">No content entered to preview yet.</p>'
            }}
          />
        )}
      </div>
    </div>
  );
}
