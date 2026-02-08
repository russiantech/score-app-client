
import { useState, useEffect } from 'react';
import { useUserModal } from '@/context/UserModalContext';
import toast from 'react-hot-toast';
import { getFullName, getInitials, getRoleColor } from '@/utils/helpers';
import { formatDate } from '@/utils/format';
import { UserService } from '@/services/users/UserService';
import type { UserStats } from '@/types/users';
import type { User, UserRole } from '@/types/users';

type RoleFilter = UserRole | 'all';

const ManageUsers: React.FC = () => {
  const { openCreateModal, openEditModal, refreshTrigger } = useUserModal();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // const [roleFilter, setRoleFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Static fallback data
  const staticUsers: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      names: 'John Doe',
      phone: '+234 801 234 5678',
      roles: ['student'],
      is_active: true,
      is_verified: true,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-16T14:20:00Z',
      isActive: undefined,
      department: undefined,
      qualifications: undefined
    },
    {
      id: '2',
      email: 'engr.chris@academy.com',
      names: 'Engr. Chris',
      phone: '+234 802 345 6789',
      roles: ['tutor'],
      is_active: true,
      is_verified: true,
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-11T11:45:00Z',
      isActive: undefined,
      department: undefined,
      qualifications: undefined
    },
    {
      id: '3',
      email: 'parent@example.com',
      names: 'Mrs. Johnson',
      phone: '+234 803 456 7890',
      roles: ['parent'],
      is_active: true,
      is_verified: true,
      created_at: '2024-02-01T08:00:00Z',
      updated_at: '2024-02-02T16:30:00Z',
      isActive: undefined,
      department: undefined,
      qualifications: undefined
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  // const fetchUsers = async () => {
  //   try {
  //     setLoading(true);
  //     const filter: any = {};
  //     if (roleFilter !== 'all') filter.role = roleFilter;
  //     if (statusFilter !== 'all') filter.is_active = statusFilter === 'active';

  //     const data = await UserService.getAll(filter);

  //     console.log(data);

  //     setUsers(data);

  //   } catch (error) {
  //     console.warn('Using static data:', error);
  //     setUsers(staticUsers);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const calculateStats = (): UserStats => ({
  //   total: users.length,
  //   students: users.filter((u) => u.roles.includes('student')).length,
  //   tutors: users.filter((u) => u.roles.includes('tutor')).length,
  //   parents: users.filter((u) => u.roles.includes('parent')).length,
  //   admins: users.filter((u) => u.roles.includes('admin')).length,
  // });

  const fetchUsers = async () => {
  try {
    setLoading(true);

    const filter: any = {};
    if (roleFilter !== 'all') filter.role = roleFilter;
    if (statusFilter !== 'all') filter.is_active = statusFilter === 'active';

    const response = await UserService.getAll(filter);

    // ✅ Normalize response
    const usersArray: User[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.users)
          ? response.data.users
          : [];

    setUsers(usersArray);
  
  } catch (error) {
    console.warn('Using static data:', error);
    setUsers(staticUsers);
  } finally {
    setLoading(false);
  }
};

/*
  const calculateStats = (): UserStats => {
  if (!Array.isArray(users)) {
    return {
      total: 0,
      students: 0,
      tutors: 0,
      parents: 0,
      admins: 0,
    };
  }

  return {
    total: users.length,
    students: users.filter(u => u.roles.includes('student')).length,
    tutors: users.filter(u => u.roles.includes('tutor')).length,
    parents: users.filter(u => u.roles.includes('parent')).length,
    admins: users.filter(u => u.roles.includes('admin')).length,
  };
};
*/


// const calculateStats = (): UserStats => ({
//   total: users.length,
//   students: users.filter(u => u.roles.includes('student' as UserRole)).length,
//   tutors: users.filter(u => u.roles.includes('tutor' as UserRole)).length,
//   parents: users.filter(u => u.roles.includes('parent' as UserRole)).length,
//   admins: users.filter(u => u.roles.includes('admin' as UserRole)).length,
// });

const isRole = (u: User, role: UserRole) => u.roles.includes(role);

const calculateStats = (): UserStats => ({
  total: users.length,
  students: users.filter(u => isRole(u, 'student')).length,
  tutors: users.filter(u => isRole(u, 'tutor')).length,
  parents: users.filter(u => isRole(u, 'parent')).length,
  admins: users.filter(u => isRole(u, 'admin')).length,
  active: 0,
  inactive: 0
});


  const stats = calculateStats();

  const roleTabs: Array<{ key: RoleFilter; label: string }> = [
  { key: 'all', label: `All (${stats.total})` },
  { key: 'student', label: `Students (${stats.students})` },
  { key: 'tutor', label: `Tutors (${stats.tutors})` },
  { key: 'parent', label: `Parents (${stats.parents})` },
  { key: 'admin', label: `Admins (${stats.admins})` },
];


  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      getFullName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    const status = user.is_active ? 'active' : 'inactive';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  
  });


  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await UserService.delete(selectedUser.id);
      toast.success('User deleted successfully!');
      fetchUsers();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await UserService.toggleStatus(user.id);
      const newStatus = !user.is_active;
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'}!`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const DeleteModal = () => (
    <div
      className={`modal fade ${showDeleteModal ? 'show d-block' : ''}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowDeleteModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete{' '}
              <strong>{selectedUser?.names}</strong>?
            </p>
            <div className="alert alert-warning mb-0">
              <i className="fa fa-exclamation-triangle me-2"></i>
              This will remove all user data and cannot be undone.
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteUser}>
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content bg-white p-4">
        <div className="container-fluid">
          {/* Header */}
          {/* <div className="d-flex justify-content-between align-items-center mb-4"> */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

            <div>
              <h4 className="mb-1">Manage Users</h4>
              <p className="text-muted mb-0">View and manage all system users</p>
            </div>
            <div className="btn-group">
              <button 
                className="btn btn-primary" 
                onClick={() => openCreateModal('student')}
              >
                <i className="fa fa-user-plus me-2"></i>Add User
              </button>
              <button
                type="button"
                className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => openCreateModal('student')}
                  >
                    <i className="fa fa-user-graduate me-2"></i>Add Student
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => openCreateModal('tutor')}
                  >
                    <i className="fa fa-chalkboard-teacher me-2"></i>Add Tutor
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => openCreateModal('parent')}
                  >
                    <i className="fa fa-users me-2"></i>Add Parent
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => openCreateModal('admin')}
                  >
                    <i className="fa fa-user-shield me-2"></i>Add Admin
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Role Filter Tabs */}
          {/* <div className="mb-4">
            <div className="btn-group w-100" role="group">
              <button
                className={`btn ${roleFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setRoleFilter('all')}
              >
                All ({stats.total})
              </button>
              <button
                className={`btn ${roleFilter === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setRoleFilter('student')}
              >
                Students ({stats.students})
              </button>
              <button
                className={`btn ${roleFilter === 'tutor' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setRoleFilter('tutor')}
              >
                Tutors ({stats.tutors})
              </button>
              <button
                className={`btn ${roleFilter === 'parent' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setRoleFilter('parent')}
              >
                Parents ({stats.parents})
              </button>
              <button
                className={`btn ${roleFilter === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setRoleFilter('admin')}
              >
                Admins ({stats.admins})
              </button>
            </div>
          </div> */}

          {/* <div className="mb-4">
            <div
              className="d-flex flex-nowrap gap-2 overflow-auto"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {
                
              [
                ['all', `All (${stats.total})`],
                ['student', `Students (${stats.students})`],
                ['tutor', `Tutors (${stats.tutors})`],
                ['parent', `Parents (${stats.parents})`],
                ['admin', `Admins (${stats.admins})`],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`btn btn-sm flex-shrink-0 ${
                    roleFilter === key ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={() => setRoleFilter(key)}
                >
                  {label}
                </button>
              ))
              
              }
            </div>
          </div> */}

          <div className="mb-4">
            <div className="d-flex flex-nowrap gap-2 overflow-auto">
              {roleTabs.map(({ key, label }) => (
                <button
                  key={key}
                  className={`btn btn-sm flex-shrink-0 ${
                    roleFilter === key ? 'btn-primary' : 'btn-outline-primary'
                  }`}
                  onClick={() => setRoleFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>


    {/* Search and Filters */}
<div className="card mb-4">
  <div className="card-body">
    <div className="row g-3 align-items-center">
      {/* Search Input */}
      <div className="col-12 col-md-8">
        <div className="input-group">
          <span className="input-group-text">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minHeight: '44px' }} // Ensures input height matches select
          />
        </div>
      </div>

      {/* Status Dropdown */}
      <div className="col-12 col-md-4">
        <select
          className="form-select w-100 border"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minHeight: '44px' }} // Match input height
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>
    </div>
  </div>
</div>

          {/* Users List */}
          <div className="row">
            {filteredUsers.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fa fa-users fa-3x text-muted mb-3"></i>
                    <h5>No users found</h5>
                    <p className="text-muted">
                      Try adjusting your search or filters, or create a new user
                    </p>
                    <button className="btn btn-primary" onClick={() => openCreateModal()}>
                      <i className="fa fa-user-plus me-2"></i>Create First User
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const mainRole = user.roles[0] || 'user';
                const status = user.is_active ? 'active' : 'inactive';

                return (
                  <div key={user.id} className="col-12 mb-3">
                    <div className="card">
                      <div className="card-body">
                        {/* <div className="d-flex justify-content-between align-items-start"> */}
                        <div className="d-flex flex-column flex-md-row gap-3">

                          <div className="d-flex align-items-center flex-grow-1">
                            <div
                              className={`rounded-circle bg-${getRoleColor(mainRole)} text-white d-flex align-items-center justify-content-center me-3`}
                              style={{
                                width: '50px',
                                height: '50px',
                                fontSize: '18px',
                                fontWeight: 'bold',
                              }}
                            >
                              {getInitials(user.names || '')}
                              
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{getFullName(user)}</h6>
                              <p className="text-muted mb-2 small">
                                <i className="fa fa-envelope me-1"></i>
                                {user.email}
                                {user.phone && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <i className="fa fa-phone me-1"></i>
                                    {user.phone}
                                  </>
                                )}
                              </p>
                              <div className="d-flex gap-2 align-items-center flex-wrap">
                                <span className={`badge bg-${getRoleColor(mainRole)}`} >
                                  {mainRole.charAt(0).toUpperCase() + mainRole.slice(1)}
                                </span>
                                <span
                                  className={`badge bg-${
                                    status === 'active' ? 'success' : 'secondary'
                                  }`}
                                >
                                  {status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                                {user.is_verified && (
                                  <span className="badge bg-info">
                                    <i className="fa fa-check-circle me-1"></i>
                                    Verified
                                  </span>
                                )}
                                <span className="text-muted small">
                                  <i className="fa fa-calendar me-1"></i>
                                  Joined {formatDate(user.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>

<div className="d-flex gap-1 flex-shrink-0 align-self-start">
  <button
    className="btn btn-sm btn-outline-secondary"
    onClick={() => openEditModal(user)}
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    title="Edit user"
  >
    <i className="fa fa-edit"></i>
  </button>

  <button
    className="btn btn-sm btn-outline-warning"
    onClick={() => handleToggleStatus(user)}
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    title={user.is_active ? 'Deactivate user' : 'Activate user'}
  >
    <i className={`fa fa-${user.is_active ? 'ban' : 'check'}`} />
  </button>

  <button
    className="btn btn-sm btn-outline-danger"
    onClick={() => {
      setSelectedUser(user);
      setShowDeleteModal(true);
    }}
    data-bs-toggle="tooltip"
    data-bs-placement="top"
    title="Delete user"
  >
    <i className="fa fa-trash"></i>
  </button>
</div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ManageUsers;
