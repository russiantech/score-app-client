// v4
// src/components/modals/ModuleFormModal.tsx
import type { ModuleProps } from '@/types/course/module';
import { useState, useEffect } from 'react';

export const ModuleFormModal = ({
  isOpen,
  onClose,
  onSave,
  courseId,
  module = null,
  isEditing = false,
  existingOrders = []
}: ModuleProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && module) {
      setFormData({
        title: module.title,
        description: module.description || '',
        order: module.order
      });
    } else {
      // Auto-suggest next order number
      const maxOrder = Math.max(0, ...existingOrders);
      setFormData({
        title: '',
        description: '',
        order: maxOrder + 1
      });
    }
    setErrors({});
  }, [isEditing, module, existingOrders, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    // Note: Order conflict checking removed - backend handles automatic reordering
    // When you set order to 2 and module 2 already exists, the backend will
    // automatically shift the existing module 2 to order 3, etc.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setSaving(true);
    try {
      const data = isEditing
        ? formData
        : { ...formData, course_id: courseId };
      
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Failed to save module:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input (user might be clearing to type new number)
    if (value === '') {
      handleChange('order', 1); // Default to 1
      return;
    }
    
    // Parse to number
    const numValue = parseInt(value, 10);
    
    // Only update if it's a valid positive number
    if (!isNaN(numValue) && numValue >= 1) {
      handleChange('order', numValue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? 'Edit Module' : 'Add New Module'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Title */}
              <div className="mb-3">
                <label htmlFor="module-title" className="form-label">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  id="module-title"
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  placeholder="e.g., Introduction to Programming"
                  disabled={saving}
                  autoFocus
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>

              {/* Description */}
              <div className="mb-3">
                <label htmlFor="module-description" className="form-label">
                  Description
                </label>
                <textarea
                  id="module-description"
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  placeholder="Brief description of this module..."
                  disabled={saving}
                />
              </div>

              {/* Order */}
              <div className="mb-3">
                <label htmlFor="module-order" className="form-label">
                  Order <span className="text-danger">*</span>
                </label>
                <input
                  id="module-order"
                  type="number"
                  className={`form-control ${errors.order ? 'is-invalid' : ''}`}
                  value={formData.order}
                  onChange={handleOrderChange}
                  min={1}
                  step={1}
                  disabled={saving}
                  placeholder="Module Number / Order"
                />
                {errors.order && (
                  <div className="invalid-feedback">{errors.order}</div>
                )}
                <small className="form-text text-muted">
                  Determines the display order of this module (e.g., 1, 2, 3...)
                </small>
              </div>

              {/* Show existing orders for reference */}
              {existingOrders.length > 0 && (
                <div className="alert alert-info py-2 px-3">
                  <small>
                    <strong>Existing orders:</strong> {existingOrders.sort((a, b) => a - b).join(', ')}
                  </small>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Saving...
                  </>
                ) : (
                  <>{isEditing ? 'Update' : 'Create'} Module</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModuleFormModal;
