
// v5 - Multi-role support with admin management, fully responsive and professional
import { UserService } from '@/services/users/UserService';
import type { UserModalProps, CreateUserDTO, UpdateUserDTO, User, UserRole } from '@/types/users';
import { normalizeRoles, hasAnyRole, getRoleInfo, getPrimaryRole } from '@/utils/auth/roles';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const AVAILABLE_ROLES: UserRole[] = ['student', 'parent', 'tutor', 'admin'];

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  defaultRole = 'student',
  onClose,
  onSuccess,
  currentUser,
}) => {
  const [parents, setParents] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserDTO>({
    username: '',
    names: '',
    email: '',
    phone: '',
    roles: [defaultRole],
    password: '',
    parent_id: null,
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    names: '',
    email: '',
    password: '',
    roles: '',
  });

  const modalContentRef = useRef<HTMLDivElement>(null);

  // Normalize and check admin role
  const currentUserRoles = currentUser ? normalizeRoles(currentUser.roles) : [];
  const isAdmin = hasAnyRole(currentUserRoles, ['admin', 'super_admin']);
  
  // Determine if roles can be changed
  const canChangeRoles = !editingUser || (editingUser && isAdmin);

  const staticParents: User[] = [
    {
      id: 'p1',
      username: 'chris_james',
      names: 'Mr. Chris James',
      email: 'chris@dunis.ng',
      roles: ['parent'],
      is_active: true,
      is_verified: true,
      created_at: '',
      updated_at: '',
      isActive: undefined,
      department: undefined,
      qualifications: undefined
    },
    {
      id: 'p2',
      username: 'selime',
      names: 'Mr Selime Folake',
      email: 'selime@edet.com',
      roles: ['parent'],
      is_active: true,
      is_verified: true,
      created_at: '',
      updated_at: '',
      isActive: undefined,
      department: undefined,
      qualifications: undefined
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadParents();
      if (editingUser) {
        const normalizedRoles = normalizeRoles(editingUser.roles);
        setFormData({
          username: editingUser.username ?? '',
          names: editingUser.names ?? '',
          email: editingUser.email ?? '',
          phone: editingUser.phone ?? '',
          roles: normalizedRoles.length > 0 ? normalizedRoles : [defaultRole],
          password: '',
          parent_id: null,
        });
      } else {
        resetForm();
      }
      
      // Reset scroll position when modal opens
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, editingUser, defaultRole]);

  const loadParents = async () => {
    try {
      const response = await UserService.getParents();
      const parentsArray = Array.isArray(response?.data?.parents)
        ? response.data.parents
        : response.data?.users || [];
      setParents(parentsArray);
    } catch (error) {
      console.warn('Using static parents:', error);
      setParents(staticParents);
    }
  };

  const validateForm = (): boolean => {
    const errors = { username: '', names: '', email: '', password: '', roles: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (!/^[a-zA-Z0-9._-]{3,20}$/.test(formData.username)) {
      errors.username = 'Username must be 3-20 characters, letters, numbers, .-_ allowed';
      isValid = false;
    }

    if (!formData.names.trim()) {
      errors.names = 'Full name is required';
      isValid = false;
    } else if (formData.names.trim().length < 3) {
      errors.names = 'Name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    // Roles validation
    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = 'At least one role must be selected';
      isValid = false;
    }

    // Password validation - required for new users, optional for edits
    if (!editingUser) {
      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSubmit: CreateUserDTO | UpdateUserDTO = { 
        ...formData,
        // Only include parent_id if role includes student and value is set
        parent_id: formData.roles.includes('student') && formData.parent_id 
          ? formData.parent_id 
          : null
      };
      
      // Remove password if editing and password is empty
      if (editingUser && !dataToSubmit.password) {
        delete (dataToSubmit as UpdateUserDTO).password;
      }

      if (editingUser) {
        await UserService.update_partial(editingUser.id, dataToSubmit as UpdateUserDTO);
        toast.success('User updated successfully!');
      } else {
        await UserService.create(dataToSubmit as CreateUserDTO);
        toast.success('User created successfully!');
      }
      
      onSuccess();
      handleClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to save user';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      names: '',
      email: '',
      phone: '',
      roles: [defaultRole],
      password: '',
      parent_id: null,
    });
    setFormErrors({ username: '', names: '', email: '', password: '', roles: '' });
    setShowPassword(false);
  };

  const handleRoleToggle = (role: UserRole) => {
    const currentRoles = [...formData.roles];
    const roleIndex = currentRoles.indexOf(role);
    
    if (roleIndex > -1) {
      // Remove role if already selected (minimum 1 role required)
      if (currentRoles.length > 1) {
        currentRoles.splice(roleIndex, 1);
      } else {
        toast.error('At least one role must be selected');
        return;
      }
    } else {
      // Add role if not selected
      currentRoles.push(role);
    }
    
    setFormData({ 
      ...formData, 
      roles: currentRoles,
      // Clear parent_id if student role is removed
      parent_id: currentRoles.includes('student') ? formData.parent_id : null
    });
    
    setFormErrors({ ...formErrors, roles: '' });
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  const primaryRole = getPrimaryRole(formData.roles);
  const primaryRoleInfo = getRoleInfo(primaryRole);

  const roleDescriptions: Record<UserRole, string[]> = {
    student: [
      'Can enroll in courses',
      'Can view their performance',
      'Can be linked to parents'
    ],
    tutor: [
      'Can manage assigned courses',
      'Can add lessons and modules',
      'Can record attendance & scores'
    ],
    parent: [
      'Can view children\'s performance',
      'Can track attendance & scores'
    ],
    admin: [
      'Full system access',
      'Can manage users, courses & enrollments',
      'Can update user roles and permissions'
    ],
    super_admin: [
      'Highest level access',
      'System configuration',
      'All admin capabilities'
    ],
    user: [
      'Basic system access'
    ],
    dev: [
      'Full system access',
      'Can manage users',
    ],

  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
        style={{ 
          maxHeight: 'calc(100vh - 2rem)',
          margin: '1rem auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content" style={{ 
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header - Fixed */}
          <div className="modal-header bg-white border-bottom" style={{ flexShrink: 0 }}>
            <h5 className="modal-title d-flex align-items-center">
              <i className="fa fa-user me-2"></i>
              {editingUser ? (
                <>
                  Edit User
                  {isAdmin && (
                    <span className="badge bg-info ms-2 small">Admin Mode</span>
                  )}
                </>
              ) : (
                'Create New User'
              )}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={loading}
              aria-label="Close"
            />
          </div>

          <form onSubmit={handleSubmit} style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Scrollable Body */}
            <div 
              ref={modalContentRef}
              className="modal-body overflow-auto"
              style={{ 
                flex: 1,
                paddingBottom: '1rem'
              }}
            >
              {/* Admin Notice when editing */}
              {editingUser && isAdmin && (
                <div className="alert alert-info d-flex align-items-start mb-4">
                  <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
                  <div className="small">
                    <strong>Admin Privileges:</strong> You can update this user's roles, password, and all information without requiring their current password.
                  </div>
                </div>
              )}

              {/* Role Selection - Multi-select */}
              <div className="mb-4">
                <label className="form-label fw-semibold d-flex align-items-center justify-content-between">
                  <span>
                    User Roles <span className="text-danger">*</span>
                    <small className="text-muted fw-normal ms-2">(Select one or more)</small>
                  </span>
                  {editingUser && !isAdmin && (
                    <span className="badge bg-secondary small">Roles locked</span>
                  )}
                </label>
                
                <div className="row g-2">
                  {AVAILABLE_ROLES.map((role) => {
                    const info = getRoleInfo(role);
                    const isSelected = formData.roles.includes(role);
                    const isPrimary = role === primaryRole;
                    
                    return (
                      <div key={role} className="col-6 col-md-3">
                        <div className={`card h-100 ${
                            isSelected 
                              ? `border-${info.color} bg-${info.color} bg-opacity-10` 
                              : 'border-secondary'
                          } ${!canChangeRoles ? 'opacity-50' : ''}`}
                          style={{ 
                            cursor: canChangeRoles ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => canChangeRoles && handleRoleToggle(role)}
                        >
                          <div className="card-body text-center p-3 position-relative">
                            {/* Checkbox indicator */}
                            <div className="position-absolute top-0 end-0 m-2">
                              {isSelected ? (
                                <i className="fa fa-check-circle text-success fa-lg" />
                              ) : (
                                <i className="fa fa-circle text-muted" />
                              )}
                            </div>
                            
                            {/* Primary role indicator */}
                            {isPrimary && isSelected && (
                              <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem' }}>
                                  Primary
                                </span>
                              </div>
                            )}
                            
                            {/* Role icon */}
                            <i className={`fa ${info.icon} fa-2x mb-2 ${ isSelected ? `text-${info.color}` : 'text-muted' }`} />
                            
                            {/* Role label */}
                            <div className={`small fw-semibold text-capitalize ${
                              isSelected ? `text-${info.color}` : 'text-muted'
                            }`}>
                              {info.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {formErrors.roles && (
                  <div className="text-danger small mt-2">
                    <i className="fa fa-exclamation-circle me-1" />
                    {formErrors.roles}
                  </div>
                )}
                
                {editingUser && isAdmin && (
                  <small className="text-muted d-block mt-2">
                    <i className="fa fa-shield-alt me-1" />
                    As an admin, you can add or remove roles for this user
                  </small>
                )}
                
                {/* Current roles display */}
                {formData.roles.length > 0 && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <strong className="small text-muted">Selected Roles:</strong>
                      <span className="badge bg-secondary">{formData.roles.length}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.roles.map((role) => {
                        const info = getRoleInfo(role);
                        const isPrimary = role === primaryRole;
                        return (
                          <span 
                            key={role} 
                            className={`badge bg-${info.color} d-flex align-items-center gap-2`}
                          >
                            <i className={`fa ${info.icon}`} />
                            {info.label}
                            {isPrimary && (
                              <span className="badge bg-warning text-dark ms-1" style={{ fontSize: '0.6rem' }}>
                                Primary
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.username && 'is-invalid'}`}
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    setFormErrors({ ...formErrors, username: '' });
                  }}
                  disabled={loading || !!editingUser}
                  placeholder="Enter username (3-20 characters)"
                />
                <div className="invalid-feedback">{formErrors.username}</div>
                {editingUser && (
                  <small className="text-muted d-block mt-1">
                    <i className="fa fa-lock me-1" />
                    Username cannot be changed after creation
                  </small>
                )}
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${formErrors.names && 'is-invalid'}`}
                  value={formData.names}
                  onChange={(e) => {
                    setFormData({ ...formData, names: e.target.value });
                    setFormErrors({ ...formErrors, names: '' });
                  }}
                  disabled={loading}
                  placeholder="Last And 1st Names"
                />
                <div className="invalid-feedback">{formErrors.names}</div>
              </div>

              {/* Email & Phone */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email && 'is-invalid'}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFormErrors({ ...formErrors, email: '' });
                    }}
                    disabled={loading || (!!editingUser && !isAdmin)}
                    placeholder="user@edet.com"
                  />
                  <div className="invalid-feedback">{formErrors.email}</div>
                  {editingUser && !isAdmin && (
                    <small className="text-muted d-block mt-1">
                      <i className="fa fa-lock me-1" />
                      Contact admin to change email
                    </small>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                    placeholder="+234 XXX (optional)"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold d-flex align-items-center justify-content-between">
                  <span>
                    Password {!editingUser && <span className="text-danger">*</span>}
                  </span>
                  {editingUser && (
                    <span className="badge bg-warning text-dark small">
                      {isAdmin ? 'Admin can reset' : 'Leave blank to keep current'}
                    </span>
                  )}
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${formErrors.password && 'is-invalid'}`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setFormErrors({ ...formErrors, password: '' });
                    }}
                    disabled={loading}
                    placeholder={editingUser ? 'Enter new password to change' : 'Minimum 6 characters'}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                </div>
                <div className="invalid-feedback d-block">
                  {formErrors.password}
                </div>
                {editingUser && isAdmin && formData.password && (
                  <small className="text-info d-block mt-1">
                    <i className="fa fa-shield-alt me-1" />
                    As admin, you can reset passwords without current password verification
                  </small>
                )}
              </div>

              {/* Parent Selector - Only shown if student role is selected */}
              {formData.roles.includes('student') && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Assign Parent/Guardian
                  </label>
                  <select
                    className="form-select w-100 border"
                    value={formData.parent_id || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_id: e.target.value || null })
                    }
                    disabled={loading}
                  >
                    <option value="">No parent assigned (optional)</option>
                    {parents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.names} ({p.email})
                      </option>
                    ))}
                  </select>
                  <small className="text-muted d-block mt-1">
                    <i className="fa fa-info-circle me-1" />
                    Parents can view student performance and attendance
                  </small>
                </div>
              )}

              {/* Role Info Alert - Shows permissions for primary role */}
              <div className={`alert alert-${primaryRoleInfo.color} mb-0`}>
                <div className="d-flex align-items-start">
                  <i className={`fa ${primaryRoleInfo.icon} fa-2x me-3 mt-1 flex-shrink-0`} />
                  <div className="flex-grow-1">

                    <div className="d-flex align-items-center">
                    <strong className=""> {primaryRoleInfo.label.toUpperCase()} PERMISSIONS </strong>
                     <span className="badge bg-white text-dark me-1 small">Primary</span>
                    </div>

                    <ul className="mb-0 ps-3">
                      {roleDescriptions[primaryRole as UserRole]?.map((d, i) => (
                        <li key={i} className="mb-1">{d}</li>
                      ))}
                    </ul>
                    {formData.roles.length > 1 && (
                      <div className="mt-2 pt-2 border-top border-white border-opacity-25">
                        <small>
                          <strong>Additional roles:</strong> {' '}
                          {formData.roles
                            .filter(r => r !== primaryRole)
                            .map(r => getRoleInfo(r).label)
                            .join(', ')}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="modal-footer bg-white border-top" style={{ flexShrink: 0 }}>
              <div className="d-flex gap-2 w-100 justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={handleClose}
                  disabled={loading}
                >
                  <i className="fa fa-times me-2" />
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading} 
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-check me-2" />
                      {editingUser ? 'Update User' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  
  );
};
