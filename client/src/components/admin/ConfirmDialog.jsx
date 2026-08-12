import React from 'react';

/**
 * ConfirmDialog prompts users for confirmation before completing critical tasks.
 * Overlays a translucent backdrop and blocks interaction with the rest of the workspace.
 */
export default function ConfirmDialog({
  isOpen,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to remove this record? This operation is permanent.',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="admin-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="admin-confirm-card">
        <h3 className="admin-confirm-title" id="confirm-title">
          {title}
        </h3>
        <p>{message}</p>
        <div className="admin-confirm-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ backgroundColor: 'var(--color-error)' }}
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
