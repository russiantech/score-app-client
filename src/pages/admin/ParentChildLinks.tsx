// // src/pages/admin/ParentChildLinks.tsx
// import type { AdminService } from '@/services/admin/AdminService';
// import React, { useState, useEffect } from 'react';

// const ParentChildLinks: React.FC = () => {
//   const [parents, setParents] = useState([]);
//   const [students, setChildren] = useState([]);
//   const [links, setLinks] = useState([]);
//   const [selectedParent, setSelectedParent] = useState('');
//   const [selectedChild, setSelectedChild] = useState('');
//   const [relationship, setRelationship] = useState('parent');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const [parentsData, studentsData, linksData] = await Promise.all([
//       AdminService.getParents(),
//       AdminService.getStudents(),
//       AdminService.getParentChildLinks(),
//     ]);
//     setParents(parentsData);
//     setChildren(studentsData);
//     setLinks(linksData);
//   };

//   const handleLinkCreate = async () => {
//     await AdminService.linkParentChild(selectedParent, selectedChild, relationship);
//     await fetchData();
//     setSelectedParent('');
//     setSelectedChild('');
//   };

//   const handleUnlink = async (linkId: string) => {
//     if (confirm('Remove this parent-child link?')) {
//       await AdminService.unlinkParentChild(linkId);
//       await fetchData();
//     }
//   };

//   return (
//     <div className="parent-child-links">
//       <div className="title-bar mb-4">
//         <h5 className="title">Parent-Child Links</h5>
//       </div>

//       {/* Create Link Form */}
//       <div className="card mb-4">
//         <div className="card-header">
//           <h6 className="mb-0">Create New Link</h6>
//         </div>
//         <div className="card-body">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <select className="form-select" value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)}>
//                 <option value="">Select Parent...</option>
//                 {parents.map(p => (
//                   <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-4">
//               <select className="form-select" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
//                 <option value="">Select Child...</option>
//                 {students.map(s => (
//                   <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-2">
//               <select className="form-select" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
//                 <option value="parent">Parent</option>
//                 <option value="guardian">Guardian</option>
//               </select>
//             </div>
//             <div className="col-md-2">
//               <button className="btn btn-primary w-100" onClick={handleLinkCreate} disabled={!selectedParent || !selectedChild}>
//                 Link
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Existing Links */}
//       <div className="card">
//         <div className="card-header">
//           <h6 className="mb-0">Existing Links ({links.length})</h6>
//         </div>
//         <div className="card-body">
//           <div className="table-responsive">
//             <table className="table table-hover">
//               <thead>
//                 <tr>
//                   <th>Parent</th>
//                   <th>Child</th>
//                   <th>Relationship</th>
//                   <th>Linked Date</th>
//                   <th className="text-end">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {links.map(link => (
//                   <tr key={link.id}>
//                     <td>{link.parentName}</td>
//                     <td>{link.childName}</td>
//                     <td><span className="badge bg-info">{link.relationship}</span></td>
//                     <td>{new Date(link.linkedAt).toLocaleDateString()}</td>
//                     <td className="text-end">
//                       <button className="btn btn-sm btn-outline-danger" onClick={() => handleUnlink(link.id)}>
//                         Unlink
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParentChildLinks;


// // v2 - src/pages/admin/ParentChildLinks.tsx
// import type { User } from '@/types/auth';
// import type { ParentChildLink } from '@/types/parent';
// import { formatDate } from '@/utils/format';
// import  { getInitials } from '@/utils/helpers';
// import { useState, useEffect } from 'react';

// // Main Component
// const ParentChildLinks = () => {
//   const [parents, setParents] = useState<User[]>([]);
//   const [students, setChildren] = useState<User[]>([]);
//   const [links, setLinks] = useState<ParentChildLink[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedParent, setSelectedParent] = useState('');
//   const [selectedChild, setSelectedChild] = useState('');
//   const [relationship, setRelationship] = useState<'parent' | 'guardian'>('parent');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRelationship, setFilterRelationship] = useState<'all' | 'parent' | 'guardian'>('all');
//   const [showUnlinkModal, setShowUnlinkModal] = useState(false);
//   const [linkToUnlink, setLinkToUnlink] = useState<ParentChildLink | null>(null);

//   // Static fallback data
//   const staticParents: User[] = [
//     {
//       id: 'p1', names: 'Favor Ike', email: 'favor.ike@example.com', roles: ['parent'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
//     {
//       id: 'p2', names: 'Robert Johnson', email: 'robert.j@example.com', roles: ['parent'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
//     {
//       id: 'p3', names: 'Mary Williams', email: 'mary.w@example.com', roles: ['parent'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },

//   ];

//   const staticStudents: User[] = [
//     {
//       id: 's1', names: 'Edet James', email: 'edet.james@example.com', roles: ['student'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
//     {
//       id: 's2', names: 'Sarah Williams', email: 'sarah.w@example.com', roles: ['student'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
//     {
//       id: 's3', names: 'Michael Brown', email: 'michael.b@example.com', roles: ['student'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
//     {
//       id: 's4', names: 'Emily Davis', email: 'emily.d@example.com', roles: ['student'], is_active: true,
//       isActive: undefined,
//       department: undefined,
//       qualifications: undefined,
//       is_verified: false,
//       created_at: '',
//       updated_at: ''
//     },
   
//   ];

//   const staticLinks: ParentChildLink[] = [
//     { id: 'l1', parentId: 'p1', parentName: 'Favor Ike', parentEmail: 'favor.ike@example.com', childId: 's1', childName: 'Edet James', childEmail: 'edet.james@example.com', relationship: 'parent', linkedAt: '2024-01-15T10:00:00Z', status: 'active' },
//     { id: 'l2', parentId: 'p2', parentName: 'Robert Johnson', parentEmail: 'robert.j@example.com', childId: 's2', childName: 'Sarah Williams', childEmail: 'sarah.w@example.com', relationship: 'parent', linkedAt: '2024-01-16T11:30:00Z', status: 'active' },
//     { id: 'l3', parentId: 'p2', parentName: 'Robert Johnson', parentEmail: 'robert.j@example.com', childId: 's5', childName: 'David Johnson', childEmail: 'david.j@example.com', relationship: 'parent', linkedAt: '2024-01-22T09:00:00Z', status: 'active' },
//   ];

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       // Backend: const [p, s, l] = await Promise.all([fetch('/api/admin/parents'), ...])
//       setTimeout(() => {
//         setParents(staticParents);
//         setChildren(staticStudents);
//         setLinks(staticLinks);
//         setLoading(false);
//       }, 500);
//     } catch (error) {
//       console.error('Error:', error);
//       setParents(staticParents);
//       setChildren(staticStudents);
//       setLinks(staticLinks);
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     const linkedParentIds = new Set(links.map(l => l.parentId));
//     const linkedChildrenIds = new Set(links.map(l => l.childId));
//     return {
//       totalLinks: links.length,
//       parentsWithLinks: linkedParentIds.size,
//       studentsWithLinks: linkedChildrenIds.size,
//       unlinkedChildren: children.length - linkedChildrenIds.size
//     };
//   };

//   const stats = calculateStats();

//   const filteredLinks = links.filter(link => {
//     const matchesSearch = link.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          link.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          link.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          link.childEmail.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRelationship = filterRelationship === 'all' || link.relationship === filterRelationship;
//     return matchesSearch && matchesRelationship;
//   });

//   const getAvailableStudents = () => {
//     if (!selectedParent) return students;
//     const linkedIds = links.filter(l => l.parentId === selectedParent).map(l => l.childId);
//     return students.filter(s => !linkedIds.includes(s.id));
//   };

//   const getChildrenForParent = (parentId: string) => links.filter(l => l.parentId === parentId);

//   const handleLinkCreate = async () => {
//     if (!selectedParent || !selectedChild) {
//       alert('Please select both a parent and a child');
//       return;
//     }

//     const existingLink = links.find(l => l.parentId === selectedParent && l.childId === selectedChild);
//     if (existingLink) {
//       alert('This parent-child link already exists');
//       return;
//     }

//     try {
//       // Backend: await fetch('/api/admin/parent-child-links', { method: 'POST', ... })
//       const parent = parents.find(p => p.id === selectedParent);
//       const child = students.find(s => s.id === selectedChild);
      
//       const newLink: ParentChildLink = {
//         id: `l${links.length + 1}`,
//         parentId: selectedParent,
//         parentName: parent?.names || '',
//         parentEmail: parent?.email || '',
//         childId: selectedChild,
//         childName: child?.names || '',
//         childEmail: child?.email || '',
//         relationship,
//         linkedAt: new Date().toISOString(),
//         status: 'active'
//       };

//       setLinks(prev => [...prev, newLink]);
//       setSelectedParent('');
//       setSelectedChild('');
//       setRelationship('parent');
//       alert('Link created successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to create link');
//     }
//   };

//   const handleUnlink = async () => {
//     if (!linkToUnlink) return;
//     try {
//       // Backend: await fetch(`/api/admin/parent-child-links/${linkToUnlink.id}`, { method: 'DELETE' })
//       setLinks(prev => prev.filter(l => l.id !== linkToUnlink.id));
//       setShowUnlinkModal(false);
//       setLinkToUnlink(null);
//       alert('Link removed successfully!');
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Failed to remove link');
//     }
//   };

//   const UnlinkModal = () => (
//     <div className={`modal fade ${showUnlinkModal ? 'show d-block' : ''}`} style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Confirm Unlink</h5>
//             <button type="button" className="btn-close" onClick={() => setShowUnlinkModal(false)}></button>
//           </div>
//           <div className="modal-body">
//             <p>Remove the link between:</p>
//             <div className="alert alert-info mb-3">
//               <div className="mb-2"><strong>Parent:</strong> {linkToUnlink?.parentName}</div>
//               <div><strong>Child:</strong> {linkToUnlink?.childName}</div>
//             </div>
//             <div className="alert alert-warning mb-0">
//               <i className="fa fa-exclamation-triangle me-2"></i>
//               The parent will lose access to this child's information.
//             </div>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-outline-secondary" onClick={() => setShowUnlinkModal(false)}>Cancel</button>
//             <button className="btn btn-danger" onClick={handleUnlink}>Remove Link</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
//         <div className="spinner-border text-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <div className="page-content bg-white p-4">
//         <div className="container-fluid">
//           <div className="mb-4">
//             <h4 className="mb-1">Parent-Child Links</h4>
//             <p className="text-muted mb-0">Manage relationships between parents/guardians and students</p>
//           </div>

//           {/* Stats */}
//           <div className="row mb-4">
//             <div className="col-md-3">
//               <div className="card bg-primary text-white">
//                 <div className="card-body">
//                   <h3 className="mb-0">{stats.totalLinks}</h3>
//                   <p className="mb-0 small">Total Links</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-info text-white">
//                 <div className="card-body">
//                   <h3 className="mb-0">{stats.parentsWithLinks}/{parents.length}</h3>
//                   <p className="mb-0 small">Parents Linked</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-success text-white">
//                 <div className="card-body">
//                   <h3 className="mb-0">{stats.studentsWithLinks}/{children.length}</h3>
//                   <p className="mb-0 small">Students Linked</p>
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-3">
//               <div className="card bg-warning text-white">
//                 <div className="card-body">
//                   <h3 className="mb-0">{stats.unlinkedChildren}</h3>
//                   <p className="mb-0 small">Unlinked Students</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Create Link */}
//           <div className="card mb-4">
//             <div className="card-header bg-light">
//               <h6 className="mb-0"><i className="fa fa-plus-circle me-2"></i>Create New Link</h6>
//             </div>
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-4">
//                   <label className="form-label">Select Parent/Guardian *</label>
//                   <select className="form-select" value={selectedParent} onChange={(e) => {
//                     setSelectedParent(e.target.value);
//                     setSelectedChild('');
//                   }}>
//                     <option value="">Choose a parent...</option>
//                     {parents.map(p => (
//                       <option key={p.id} value={p.id}>
//                         {p.names} - {getChildrenForParent(p.id).length} child(ren)
//                       </option>
//                     ))}
//                   </select>
//                   {selectedParent && <small className="text-muted">{parents.find(p => p.id === selectedParent)?.email}</small>}
//                 </div>
//                 <div className="col-md-4">
//                   <label className="form-label">Select Child/Student *</label>
//                   <select className="form-select" value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
//                     <option value="">Choose a student...</option>
//                     {getAvailableStudents().map(s => (
//                       <option key={s.id} value={s.id}>{s.names}</option>
//                     ))}
//                   </select>
//                   {selectedChild && <small className="text-muted">{students.find(s => s.id === selectedChild)?.email}</small>}
//                 </div>
//                 <div className="col-md-2">
//                   <label className="form-label">Relationship *</label>
//                   <select className="form-select" value={relationship} onChange={(e) => setRelationship(e.target.value as any)}>
//                     <option value="parent">Parent</option>
//                     <option value="guardian">Guardian</option>
//                   </select>
//                 </div>
//                 <div className="col-md-2 d-flex align-items-end">
//                   <button className="btn btn-primary w-100" onClick={handleLinkCreate} disabled={!selectedParent || !selectedChild}>
//                     <i className="fa fa-link me-2"></i>Create
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="card mb-4">
//             <div className="card-body">
//               <div className="row g-3">
//                 <div className="col-md-8">
//                   <input type="text" className="form-control" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//                 </div>
//                 <div className="col-md-4">
//                   <select className="form-select" value={filterRelationship} onChange={(e) => setFilterRelationship(e.target.value as any)}>
//                     <option value="all">All Relationships</option>
//                     <option value="parent">Parents Only</option>
//                     <option value="guardian">Guardians Only</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Links Table */}
//           <div className="card">
//             <div className="card-header">
//               <h6 className="mb-0"><i className="fa fa-list me-2"></i>Existing Links ({filteredLinks.length})</h6>
//             </div>
//             <div className="card-body">
//               {filteredLinks.length === 0 ? (
//                 <div className="text-center py-4">
//                   <i className="fa fa-link fa-3x text-muted mb-3"></i>
//                   <h5>No links found</h5>
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <table className="table table-hover align-middle">
//                     <thead>
//                       <tr>
//                         <th>Parent/Guardian</th>
//                         <th>Child/Student</th>
//                         <th className="text-center">Relationship</th>
//                         <th className="text-center">Linked Date</th>
//                         <th className="text-end">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredLinks.map(link => (
//                         <tr key={link.id}>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-2"
//                                    style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
//                                 {getInitials(link.parentName)}
//                               </div>
//                               <div>
//                                 <strong>{link.parentName}</strong>
//                                 <div className="text-muted small">{link.parentEmail}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td>
//                             <div className="d-flex align-items-center">
//                               <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-2"
//                                    style={{ width: '40px', height: '40px', fontSize: '14px', fontWeight: 'bold' }}>
//                                 {getInitials(link.childName)}
//                               </div>
//                               <div>
//                                 <strong>{link.childName}</strong>
//                                 <div className="text-muted small">{link.childEmail}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="text-center">
//                             <span className={`badge bg-${link.relationship === 'parent' ? 'primary' : 'warning'}`}>
//                               {link.relationship.charAt(0).toUpperCase() + link.relationship.slice(1)}
//                             </span>
//                           </td>
//                           <td className="text-center">
//                             <small className="text-muted">{formatDate(link.linkedAt)}</small>
//                           </td>
//                           <td className="text-end">
//                             <button className="btn btn-sm btn-outline-danger" onClick={() => {
//                               setLinkToUnlink(link);
//                               setShowUnlinkModal(true);
//                             }}>
//                               <i className="fa fa-unlink me-1"></i>Unlink
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//       {showUnlinkModal && <UnlinkModal />}
//     </div>
//   );
// };

// export default ParentChildLinks;





// // v10 - Professionally refactored with DRY principles, proper types, and services
// // src/pages/admin/ParentChildLinks.tsx

// import { useState, useEffect, useCallback } from 'react';
// import { UserService } from '@/services/users/UserService';
// import { ParentService } from '@/services/users/parent';
// import toast from 'react-hot-toast';
// import type { User } from '@/types/auth';
// import type { 
//   ParentChildLink, 
//   ParentChildLinkFilters, 
//   ParentChildLinkStats,
//   CreateParentChildLinkPayload 
// } from '@/types/parent';
// import { formatDate } from '@/utils/format';
// import { getInitials } from '@/utils/helpers';

// // ============================================================================
// // REUSABLE COMPONENTS (DRY Principle)
// // ============================================================================

// interface StatCardProps {
//   value: number | string;
//   label: string;
//   icon: string;
//   bgColor: string;
//   loading?: boolean;
// }

// const StatCard: React.FC<StatCardProps> = ({
//   value,
//   label,
//   icon,
//   bgColor,
//   loading,
// }) => (
//   <div className="col-6 col-md-3">
//     <div className={`card ${bgColor} text-white shadow-sm h-100`}>
//       <div className="card-body d-flex align-items-center p-3">
//         <div className="d-flex w-100 align-items-center justify-content-between gap-2">
//           <div className="flex-grow-1 min-w-0">
//             <div className="fw-bold lh-1 fs-4 fs-md-3 text-break">
//               {loading ? (
//                 <span className="spinner-border spinner-border-sm text-white" role="status" />
//               ) : (
//                 value
//               )}
//             </div>
//             <div className="small opacity-75 mt-1 text-wrap">{label}</div>
//           </div>
//           <div className="flex-shrink-0">
//             <i className={`${icon} fs-2 opacity-25`} aria-hidden="true" />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// interface FormSelectProps {
//   label: string;
//   value: string;
//   onChange: (value: string) => void;
//   options: Array<{ value: string; label: string; disabled?: boolean }>;
//   disabled?: boolean;
//   required?: boolean;
//   hint?: string;
//   placeholder?: string;
//   error?: string;
//   colClass?: string;
// }

// const FormSelect: React.FC<FormSelectProps> = ({
//   label,
//   value,
//   onChange,
//   options,
//   disabled = false,
//   required = false,
//   hint,
//   placeholder = 'Choose...',
//   error,
//   colClass = 'col-12'
// }) => (
//   <div className={colClass}>
//     <label className="form-label small fw-semibold text-muted mb-1">
//       {label} {required && <span className="text-danger">*</span>}
//     </label>
//     <select
//       className={`form-select w-100 ${error ? 'is-invalid' : ''}`}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       disabled={disabled}
//     >
//       <option value="">{placeholder}</option>
//       {options.map((opt) => (
//         <option key={opt.value} value={opt.value} disabled={opt.disabled}>
//           {opt.label}
//         </option>
//       ))}
//     </select>
//     {error && <div className="invalid-feedback d-block">{error}</div>}
//     {hint && (
//       <small className="text-muted d-block mt-1" style={{
//         overflow: 'hidden',
//         textOverflow: 'ellipsis',
//         whiteSpace: 'nowrap'
//       }} title={hint}>
//         {hint}
//       </small>
//     )}
//   </div>
// );

// interface ButtonProps {
//   onClick: () => void;
//   disabled?: boolean;
//   loading?: boolean;
//   variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger' | 'outline-primary' | 'light';
//   size?: 'sm' | 'md' | 'lg';
//   icon?: string;
//   children: React.ReactNode;
//   className?: string;
//   block?: boolean;
//   type?: 'button' | 'submit' | 'reset';
// }

// const Button: React.FC<ButtonProps> = ({
//   onClick,
//   disabled = false,
//   loading = false,
//   variant = 'primary',
//   size = 'sm',
//   icon,
//   children,
//   className = '',
//   block = false,
//   type = 'button'
// }) => {
//   const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
//   const blockClass = block ? 'w-100' : '';
  
//   return (
//     <button
//       type={type}
//       className={`btn btn-${variant} ${sizeClass} ${blockClass} ${className}`}
//       onClick={onClick}
//       disabled={disabled || loading}
//     >
//       {loading ? (
//         <>
//           <span className="spinner-border spinner-border-sm me-2" role="status" />
//           {children}
//         </>
//       ) : (
//         <>
//           {icon && <i className={`${icon} me-2`} />}
//           {children}
//         </>
//       )}
//     </button>
//   );
// };

// interface FilterBadgeProps {
//   children: React.ReactNode;
//   onRemove: () => void;
//   icon?: string;
//   color?: string;
// }

// const FilterBadge: React.FC<FilterBadgeProps> = ({ 
//   children, 
//   onRemove, 
//   icon, 
//   color = 'primary' 
// }) => (
//   <span className={`badge bg-${color} rounded-pill d-inline-flex align-items-center`}>
//     {icon && <i className={`${icon} me-1`} />}
//     <span className="text-truncate" style={{ maxWidth: '150px' }}>
//       {children}
//     </span>
//     <button
//       type="button"
//       className="btn-close btn-close-white ms-2"
//       style={{ fontSize: '0.5rem', padding: '0.25rem' }}
//       onClick={onRemove}
//       aria-label="Remove filter"
//     />
//   </span>
// );

// interface EmptyStateProps {
//   icon: string;
//   title: string;
//   description: string;
//   actionLabel?: string;
//   onAction?: () => void;
//   small?: boolean;
// }

// const EmptyState: React.FC<EmptyStateProps> = ({
//   icon,
//   title,
//   description,
//   actionLabel,
//   onAction,
//   small = false
// }) => (
//   <div className={`text-center py-${small ? '4' : '5'}`}>
//     <i className={`${icon} ${small ? 'fa-2x' : 'fa-3x'} text-muted mb-3`} />
//     <h5 className={small ? 'h6' : ''}>{title}</h5>
//     <p className={`text-muted ${small ? 'small' : ''} mb-3`}>{description}</p>
//     {actionLabel && onAction && (
//       <Button
//         variant="outline-primary"
//         size={small ? 'sm' : 'md'}
//         onClick={onAction}
//       >
//         {actionLabel}
//       </Button>
//     )}
//   </div>
// );

// interface AvatarProps {
//   name: string;
//   size?: number;
//   bgColor?: string;
//   className?: string;
// }

// const Avatar: React.FC<AvatarProps> = ({
//   name,
//   size = 36,
//   bgColor = 'bg-primary',
//   className = ''
// }) => (
//   <div
//     className={`rounded-circle ${bgColor} text-white d-flex align-items-center justify-content-center ${className}`}
//     style={{
//       width: `${size}px`,
//       height: `${size}px`,
//       fontSize: `${Math.max(10, size * 0.35)}px`,
//       fontWeight: 'bold',
//       flexShrink: 0
//     }}
//     title={name}
//   >
//     {getInitials(name || 'NA')}
//   </div>
// );

// interface PaginationProps {
//   page: number;
//   totalPages: number;
//   hasNextPage: boolean;
//   hasPrevPage: boolean;
//   onPageChange: (page: number) => void;
//   loading?: boolean;
// }

// const Pagination: React.FC<PaginationProps> = ({
//   page,
//   totalPages,
//   hasNextPage,
//   hasPrevPage,
//   onPageChange,
//   loading
// }) => (
//   <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
//     <Button
//       variant="outline-secondary"
//       size="sm"
//       icon="fa fa-chevron-left"
//       disabled={!hasPrevPage || loading}
//       onClick={() => onPageChange(page - 1)}
//       className="order-1 order-md-1"
//     >
//       <span className="d-none d-sm-inline">Previous</span>
//     </Button>

//     <span className="small text-muted text-center order-3 order-md-2 w-100 w-md-auto">
//       Page <strong>{page}</strong> of <strong>{totalPages}</strong>
//     </span>

//     <Button
//       variant="outline-secondary"
//       size="sm"
//       disabled={!hasNextPage || loading}
//       onClick={() => onPageChange(page + 1)}
//       className="order-2 order-md-3"
//     >
//       <span className="d-none d-sm-inline">Next</span>
//       <i className="fa fa-chevron-right ms-2" />
//     </Button>
//   </div>
// );

// // ============================================================================
// // LINK CREATION MODAL COMPONENT
// // ============================================================================

// interface LinkCreationModalProps {
//   show: boolean;
//   onClose: () => void;
//   parents: User[];
//   children: User[];
//   links: ParentChildLink[];
//   onCreateLink: (parentId: string, childId: string, relationship: 'parent' | 'guardian') => Promise<void>;
//   creating: boolean;
//   preselectedParentId?: string;
//   preselectedChildId?: string;
// }

// const LinkCreationModal: React.FC<LinkCreationModalProps> = ({
//   show,
//   onClose,
//   parents,
//   children,
//   links,
//   onCreateLink,
//   creating,
//   preselectedParentId = '',
//   preselectedChildId = ''
// }) => {
//   const [selectedParent, setSelectedParent] = useState(preselectedParentId);
//   const [selectedChild, setSelectedChild] = useState(preselectedChildId);
//   const [relationship, setRelationship] = useState<'parent' | 'guardian'>('parent');
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     setSelectedParent(preselectedParentId);
//     setSelectedChild(preselectedChildId);
//   }, [preselectedParentId, preselectedChildId]);

//   useEffect(() => {
//     if (!show) {
//       setFormErrors({});
//     }
//   }, [show]);

//   const getParentLinkCount = (parentId: string) => {
//     return links.filter(l => l.parentId === parentId && l.status === 'active').length;
//   };

//   const getAvailableChildren = () => {
//     if (!selectedParent) return children;
//     const linkedIds = links
//       .filter(l => l.parentId === selectedParent && l.status === 'active')
//       .map(l => l.childId);
//     return children.filter(s => !linkedIds.includes(s.id));
//   };

//   const validateForm = () => {
//     const errors: Record<string, string> = {};
    
//     if (!selectedParent) {
//       errors.parent = 'Please select a parent/guardian';
//     }
    
//     if (!selectedChild) {
//       errors.child = 'Please select a child/student';
//     }
    
//     // Check for existing link
//     if (selectedParent && selectedChild) {
//       const existingLink = links.find(
//         l => l.parentId === selectedParent && 
//              l.childId === selectedChild && 
//              l.status === 'active'
//       );
//       if (existingLink) {
//         errors.child = 'This parent-child link already exists';
//       }
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     try {
//       await onCreateLink(selectedParent, selectedChild, relationship);
//       setSelectedParent('');
//       setSelectedChild('');
//       setRelationship('parent');
//       setFormErrors({});
//       onClose();
//     } catch (error) {
//       // Error is handled by parent
//     }
//   };

//   const handleClose = () => {
//     if (!creating) {
//       setSelectedParent('');
//       setSelectedChild('');
//       setRelationship('parent');
//       setFormErrors({});
//       onClose();
//     }
//   };

//   const parentOptions = parents.map(parent => ({
//     value: parent.id,
//     label: `${parent.names} (${getParentLinkCount(parent.id)} ${getParentLinkCount(parent.id) === 1 ? 'child' : 'children'})`,
//     disabled: !parent.is_active
//   }));

//   const childOptions = getAvailableChildren().map(child => ({
//     value: child.id,
//     label: child.names
//   }));

//   const selectedParentData = parents.find(p => p.id === selectedParent);
//   const selectedChildData = children.find(s => s.id === selectedChild);

//   if (!show) return null;

//   return (
//     <div
//       className="modal fade show d-block"
//       style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
//       onClick={handleClose}
//     >
//       <div
//         className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-md"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="modal-content">
//           <div className="modal-header bg-primary text-white">
//             <h5 className="modal-title">
//               <i className="fa fa-link me-2" />
//               Create Parent-Child Link
//             </h5>
//             <button
//               type="button"
//               className="btn-close btn-close-white"
//               onClick={handleClose}
//               disabled={creating}
//               aria-label="Close"
//             />
//           </div>

//           <div className="modal-body">
//             <div className="alert alert-info d-flex align-items-start mb-4">
//               <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
//               <div className="small">
//                 Link a parent or guardian to a student. This will grant the parent access to view the student's academic information.
//               </div>
//             </div>

//             <div className="row g-3">
//               <FormSelect
//                 label="Select Parent/Guardian"
//                 value={selectedParent}
//                 onChange={(value) => {
//                   setSelectedParent(value);
//                   setSelectedChild('');
//                   setFormErrors(prev => ({ ...prev, parent: '' }));
//                 }}
//                 options={parentOptions}
//                 disabled={creating}
//                 required
//                 placeholder="Choose a parent/guardian..."
//                 error={formErrors.parent}
//                 colClass="col-12"
//               />

//               {selectedParentData && (
//                 <div className="col-12">
//                   <div className="card bg-light border-0">
//                     <div className="card-body p-3">
//                       <div className="d-flex align-items-center">
//                         <Avatar 
//                           name={selectedParentData.names} 
//                           size={48} 
//                           bgColor="bg-info"
//                         />
//                         <div className="ms-3 flex-grow-1 overflow-hidden">
//                           <div className="fw-bold">{selectedParentData.names}</div>
//                           <div className="text-muted small text-truncate">{selectedParentData.email}</div>
//                           <div className="mt-1">
//                             <span className="badge bg-info me-2">
//                               <i className="fa fa-users me-1" />
//                               {getParentLinkCount(selectedParentData.id)} Linked Child{getParentLinkCount(selectedParentData.id) !== 1 ? 'ren' : ''}
//                             </span>
//                             {selectedParentData.is_active ? (
//                               <span className="badge bg-success">Active</span>
//                             ) : (
//                               <span className="badge bg-secondary">Inactive</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <FormSelect
//                 label="Select Child/Student"
//                 value={selectedChild}
//                 onChange={(value) => {
//                   setSelectedChild(value);
//                   setFormErrors(prev => ({ ...prev, child: '' }));
//                 }}
//                 options={childOptions}
//                 disabled={!selectedParent || creating}
//                 required
//                 placeholder={!selectedParent ? "Select a parent first..." : "Choose a student..."}
//                 error={formErrors.child}
//                 colClass="col-12"
//               />

//               {selectedChildData && (
//                 <div className="col-12">
//                   <div className="card bg-light border-0">
//                     <div className="card-body p-3">
//                       <div className="d-flex align-items-center">
//                         <Avatar 
//                           name={selectedChildData.names} 
//                           size={48} 
//                           bgColor="bg-success"
//                         />
//                         <div className="ms-3 flex-grow-1 overflow-hidden">
//                           <div className="fw-bold">{selectedChildData.names}</div>
//                           <div className="text-muted small text-truncate">{selectedChildData.email}</div>
//                           <div className="mt-1">
//                             {selectedChildData.is_active ? (
//                               <span className="badge bg-success">Active Student</span>
//                             ) : (
//                               <span className="badge bg-secondary">Inactive</span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <FormSelect
//                 label="Relationship Type"
//                 value={relationship}
//                 onChange={(value) => setRelationship(value as 'parent' | 'guardian')}
//                 options={[
//                   { value: 'parent', label: 'Parent' },
//                   { value: 'guardian', label: 'Guardian' }
//                 ]}
//                 disabled={creating}
//                 required
//                 colClass="col-12"
//               />

//               {selectedParent && childOptions.length === 0 && (
//                 <div className="col-12">
//                   <div className="alert alert-warning mb-0">
//                     <i className="fa fa-exclamation-triangle me-2" />
//                     This parent is already linked to all available students.
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* <div className="modal-footer border-0 bg-light">
//             <div className="d-flex gap-2 justify-content-end flex-row flex-sm-row">
//               <Button
//                 variant="outline-secondary"
//                 onClick={handleClose}
//                 disabled={creating}
//                 // block
//                 size="md"
//                 className="order-2 order-sm-1"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 variant="primary"
//                 onClick={handleSubmit}
//                 disabled={!selectedParent || !selectedChild || creating}
//                 loading={creating}
//                 icon="fa fa-check"
//                 // block
//                 size="md"
//                 className="order-1 order-sm-2"
//               >
//                 {creating ? 'Creating Link...' : 'Create Link'}
//               </Button>
//             </div>
//           </div> */}
//           <div className="modal-footer border-0 bg-light">
//   <div className="d-flex gap-2 justify-content-end">
//     <Button
//       variant="outline-secondary"
//       onClick={handleClose}
//       disabled={creating}
//       size="md"
//     >
//       Cancel
//     </Button>

//     <Button
//       variant="primary"
//       onClick={handleSubmit}
//       disabled={!selectedParent || !selectedChild || creating}
//       loading={creating}
//       icon="fa fa-check"
//       size="md"
//     >
//       {creating ? 'Creating Link...' : 'Create Link'}
//     </Button>
//   </div>
// </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================================
// // MAIN COMPONENT
// // ============================================================================

// const ParentChildLinks: React.FC = () => {
//   // State
//   const [parents, setParents] = useState<User[]>([]);
//   const [children, setChildren] = useState<User[]>([]);
//   const [links, setLinks] = useState<ParentChildLink[]>([]);
//   const [stats, setStats] = useState<ParentChildLinkStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Modal state
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [preselectedParent, setPreselectedParent] = useState('');
//   const [preselectedChild, setPreselectedChild] = useState('');
//   const [creating, setCreating] = useState(false);

//   // Filter state
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRelationship, setFilterRelationship] = useState<'all' | 'parent' | 'guardian'>('all');
//   const [filterParent, setFilterParent] = useState<string>('all');
//   const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

//   // Pagination state
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(50);
//   const [total, setTotal] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);

//   // Unlink modal state
//   const [showUnlinkModal, setShowUnlinkModal] = useState(false);
//   const [linkToUnlink, setLinkToUnlink] = useState<ParentChildLink | null>(null);
//   const [unlinking, setUnlinking] = useState(false);

//   // UI state
//   const [showParentOverview, setShowParentOverview] = useState(false);
//   const [activeTab, setActiveTab] = useState<'all' | 'linked' | 'unlinked'>('all');

//   // Reset to page 1 when filters change
//   useEffect(() => {
//     setPage(1);
//   }, [searchTerm, filterRelationship, filterParent, filterStatus, activeTab]);

//   // Fetch links when dependencies change
//   const fetchLinks = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       const params: ParentChildLinkFilters = { 
//         page, 
//         page_size: pageSize,
//         relationship: filterRelationship !== 'all' ? filterRelationship : undefined,
//         parent_id: filterParent !== 'all' ? filterParent : undefined,
//         status: filterStatus !== 'all' ? filterStatus : undefined,
//         search: searchTerm || undefined,
//         include_relations: true,
//       };

//       const response = await ParentService.getAll(params);
      
//       const linksData = response.data?.links || [];
//       const metaData = response.data?.page_meta || {};

//       setLinks(Array.isArray(linksData) ? linksData : []);
      
//       const totalCount = metaData.total_items_count ?? linksData.length;
//       setTotal(totalCount);
//       setTotalPages(metaData.total_pages_count ?? Math.ceil(totalCount / pageSize));
      
//     } catch (error: any) {
//       console.error('Failed to fetch links:', error);
//       toast.error('Failed to load parent-child links');
//       setLinks([]);
//       setTotal(0);
//       setTotalPages(0);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, searchTerm, filterRelationship, filterParent, filterStatus, pageSize]);

//   // Fetch initial data
//   useEffect(() => {
//     fetchInitialData();
//   }, []);

//   const fetchInitialData = async () => {
//     try {
//       setInitialLoading(true);
//       const [parentsResponse, studentsResponse, statsResponse] = await Promise.all([
//         UserService.getAll({ role: 'parent', is_active: true }),
//         UserService.getAll({ role: 'student', is_active: true }),
//         ParentService.getStats(),
//       ]);

//       setParents(parentsResponse.data?.users || []);
//       setChildren(studentsResponse.data?.users || []);
      
//       const statsData = statsResponse.data || statsResponse.success || null;
//       setStats(statsData);
//     } catch (error) {
//       console.error('Failed to fetch initial data:', error);
//       toast.error('Failed to load initial data');
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLinks();
//   }, [fetchLinks]);

//   const refreshData = () => {
//     fetchLinks();
//     fetchInitialData();
//   };

//   // ============================================================================
//   // LINK ACTIONS
//   // ============================================================================

//   const openCreateModal = (parentId: string = '', childId: string = '') => {
//     setPreselectedParent(parentId);
//     setPreselectedChild(childId);
//     setShowCreateModal(true);
//   };

//   const handleCreateLink = async (
//     parentId: string, 
//     childId: string, 
//     relationship: 'parent' | 'guardian'
//   ) => {
//     try {
//       setCreating(true);
      
//       const payload: CreateParentChildLinkPayload = {
//         parent_id: parentId,
//         child_id: childId,
//         relationship
//       };
      
//       await ParentService.create(payload);

//       toast.success('Parent-child link created successfully');
//       refreshData();
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to create link');
//       throw error;
//     } finally {
//       setCreating(false);
//     }
//   };

//   const handleUnlink = async () => {
//     if (!linkToUnlink) return;

//     try {
//       setUnlinking(true);
//       await ParentService.delete(linkToUnlink.id);

//       toast.success('Link removed successfully');
//       setShowUnlinkModal(false);
//       setLinkToUnlink(null);

//       if (links.length === 1 && page > 1) {
//         setPage(page - 1);
//       } else {
//         refreshData();
//       }
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to remove link');
//     } finally {
//       setUnlinking(false);
//     }
//   };

//   // ============================================================================
//   // HELPER FUNCTIONS
//   // ============================================================================

//   const getChildrenForParent = (parentId: string) => {
//     return links.filter(l => l.parentId === parentId && l.status === 'active');
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setFilterRelationship('all');
//     setFilterParent('all');
//     setFilterStatus('all');
//     setPage(1);
//   };

//   const getRelationshipBadgeClass = (relationship: string) => {
//     return relationship === 'parent' ? 'bg-primary' : 'bg-warning';
//   };

//   const getStatusBadgeClass = (status: string) => {
//     switch (status) {
//       case 'active': return 'bg-success';
//       case 'inactive': return 'bg-secondary';
//       default: return 'bg-secondary';
//     }
//   };

//   // ============================================================================
//   // COMPUTED VALUES
//   // ============================================================================

//   const hasNextPage = page < totalPages;
//   const hasPrevPage = page > 1;
//   const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
//   const endItem = Math.min(page * pageSize, total);
//   const hasActiveFilters = searchTerm || filterRelationship !== 'all' || filterParent !== 'all' || filterStatus !== 'all';

//   const linkedParentIds = new Set(
//     links.filter(l => l.status === 'active').map(l => l.parentId)
//   );
  
//   const linkedChildrenIds = new Set(
//     links.filter(l => l.status === 'active').map(l => l.childId)
//   );

//   const linkedParents = parents.filter(p => linkedParentIds.has(p.id));
//   const unlinkedChildren = children.filter(s => !linkedChildrenIds.has(s.id));

//   const parentFilterOptions = [
//     { value: 'all', label: 'All Parents' },
//     ...parents.map(parent => ({
//       value: parent.id,
//       label: parent.names
//     }))
//   ];

//   const relationshipOptions = [
//     { value: 'all', label: 'All Relationships' },
//     { value: 'parent', label: 'Parents Only' },
//     { value: 'guardian', label: 'Guardians Only' }
//   ];

//   const statusOptions = [
//     { value: 'all', label: 'All Statuses' },
//     { value: 'active', label: 'Active' },
//     { value: 'inactive', label: 'Inactive' }
//   ];

//   // ============================================================================
//   // RENDER
//   // ============================================================================

//   if (initialLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center min-vh-50">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
//           <p className="text-muted">Loading parent-child links...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="page-wrapper">
//       <div className="page-content bg-white p-2 p-md-3 p-lg-4">
//         <div className="container-fluid px-0 px-md-3">
//           {/* Header */}
//           <div className="mb-4">
//             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
//               <div>
//                 <h4 className="mb-1">Parent-Child Links</h4>
//                 <p className="text-muted mb-0 small">Manage relationships between parents/guardians and students</p>
//               </div>
//               <div className="d-flex gap-2 flex-wrap">
//                 <Button
//                   onClick={() => openCreateModal()}
//                   variant="primary"
//                   size="sm"
//                   icon="fa fa-plus"
//                 >
//                   <span className="d-none d-sm-inline">New Link</span>
//                   <span className="d-inline d-sm-none">Link</span>
//                 </Button>
//                 <Button
//                   onClick={refreshData}
//                   variant="outline-primary"
//                   size="sm"
//                   icon="fa fa-sync-alt"
//                   loading={loading}
//                 >
//                   <span className="d-none d-sm-inline">Refresh</span>
//                 </Button>
//               </div>
//             </div>

//             {/* Quick Stats Bar */}
//             <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
//               <span className="badge bg-info rounded-pill">
//                 <i className="fa fa-users me-1" /> {parents.length} Parents
//               </span>
//               <span className="badge bg-success rounded-pill">
//                 <i className="fa fa-user-graduate me-1" /> {children.length} Students
//               </span>
//               <span className="badge bg-primary rounded-pill">
//                 <i className="fa fa-link me-1" /> {total} Links
//               </span>
//               <button
//                 className="btn btn-sm btn-outline-secondary ms-auto"
//                 onClick={() => setShowParentOverview(!showParentOverview)}
//               >
//                 <i className={`fa fa-${showParentOverview ? 'minus' : 'plus'} me-1`} />
//                 {showParentOverview ? 'Hide' : 'Show'} Overview
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="row g-3 mb-4">
//             <StatCard
//               value={stats?.total_links || 0}
//               label="Total Links"
//               icon="fa fa-link"
//               bgColor="bg-primary"
//               loading={initialLoading}
//             />
//             <StatCard
//               value={`${stats?.parents_with_links || 0}/${stats?.total_parents || 0}`}
//               label="Parents Linked"
//               icon="fa fa-user-check"
//               bgColor="bg-info"
//               loading={initialLoading}
//             />
//             <StatCard
//               value={`${stats?.children_with_links || 0}/${stats?.total_children || 0}`}
//               label="Students Linked"
//               icon="fa fa-user-graduate"
//               bgColor="bg-success"
//               loading={initialLoading}
//             />
//             <StatCard
//               value={stats?.unlinked_children || 0}
//               label="Unlinked Students"
//               icon="fa fa-exclamation-triangle"
//               bgColor="bg-warning"
//               loading={initialLoading}
//             />
//           </div>

//           {/* Search and Filter */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
//               <h6 className="mb-0 d-flex align-items-center">
//                 <i className="fa fa-filter me-2" />
//                 Filters & Search
//               </h6>
//               {hasActiveFilters && (
//                 <button
//                   className="btn btn-sm btn-outline-secondary"
//                   onClick={clearFilters}
//                 >
//                   <i className="fa fa-times me-1" />
//                   Clear All
//                 </button>
//               )}
//             </div>
//             <div className="card-body">
//               <div className="row g-3 align-items-end">
//                 <div className="col-12 col-md-4">
//                   <label className="form-label small fw-semibold text-muted mb-1">Relationship</label>
//                   <select
//                     className="form-select w-100"
//                     value={filterRelationship}
//                     onChange={(e) => setFilterRelationship(e.target.value as typeof filterRelationship)}
//                   >
//                     {relationshipOptions.map(opt => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-12 col-md-4">
//                   <label className="form-label small fw-semibold text-muted mb-1">Parent</label>
//                   <select
//                     className="form-select w-100"
//                     value={filterParent}
//                     onChange={(e) => setFilterParent(e.target.value)}
//                   >
//                     {parentFilterOptions.map(opt => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="col-12 col-md-4">
//                   <label className="form-label small fw-semibold text-muted mb-1">Status</label>
//                   <select
//                     className="form-select w-100"
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
//                   >
//                     {statusOptions.map(opt => (
//                       <option key={opt.value} value={opt.value}>{opt.label}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="col-12">
//                   <label className="form-label small fw-semibold text-muted mb-1">Search</label>
//                   <div className="input-group input-group-sm">
//                     <span className="input-group-text bg-white border-end-0">
//                       <i className="fa fa-search text-muted" />
//                     </span>
//                     <input
//                       type="text"
//                       className="form-control input-group-sm border-start-0"
//                       placeholder="Search by parent name, child name, or email..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                     {searchTerm && (
//                       <button
//                         className="btn btn-outline-secondary"
//                         type="button"
//                         onClick={() => setSearchTerm('')}
//                       >
//                         <i className="fa fa-times" />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {hasActiveFilters && (
//                 <div className="mt-3 pt-3 border-top">
//                   <div className="d-flex align-items-center gap-2 flex-wrap">
//                     <span className="small text-muted">Active filters:</span>
//                     {searchTerm && (
//                       <FilterBadge icon="fa fa-search" onRemove={() => setSearchTerm('')}>
//                         Search: {searchTerm}
//                       </FilterBadge>
//                     )}
//                     {filterRelationship !== 'all' && (
//                       <FilterBadge icon="fa fa-filter" onRemove={() => setFilterRelationship('all')}>
//                         Type: {filterRelationship}
//                       </FilterBadge>
//                     )}
//                     {filterParent !== 'all' && (
//                       <FilterBadge icon="fa fa-user" onRemove={() => setFilterParent('all')} color="info">
//                         Parent: {parents.find(p => p.id === filterParent)?.names || filterParent}
//                       </FilterBadge>
//                     )}
//                     {filterStatus !== 'all' && (
//                       <FilterBadge icon="fa fa-circle" onRemove={() => setFilterStatus('all')} color="success">
//                         Status: {filterStatus}
//                       </FilterBadge>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="mt-3 pt-3 border-top">
//                 <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
//                   <p className="mb-0 small text-muted">
//                     {total > 0 ? (
//                       <>
//                         Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
//                         <strong>{total}</strong> links
//                         {totalPages > 1 && (
//                           <span className="ms-2">
//                             (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
//                           </span>
//                         )}
//                       </>
//                     ) : (
//                       'No links found'
//                     )}
//                   </p>
//                   <div className="d-flex gap-2">
//                     <span className="badge bg-light text-dark border">
//                       <i className="fa fa-check-circle text-success me-1" />
//                       {links.filter(l => l.status === 'active').length} Active
//                     </span>
//                     <span className="badge bg-light text-dark border">
//                       <i className="fa fa-times-circle text-secondary me-1" />
//                       {links.filter(l => l.status === 'inactive').length} Inactive
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Links Table */}
//           <div className="card mb-4 shadow-sm">
//             <div className="card-header bg-light py-3">
//               <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
//                 <h6 className="mb-0 d-flex align-items-center">
//                   <i className="fa fa-list me-2" />
//                   Parent-Child Links
//                 </h6>
                
//                 <ul className="nav nav-pills nav-sm">
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
//                       onClick={() => setActiveTab('all')}
//                     >
//                       All ({total})
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${activeTab === 'linked' ? 'active' : ''}`}
//                       onClick={() => setActiveTab('linked')}
//                     >
//                       <i className="fa fa-check-circle me-1" />
//                       <span className="d-none d-sm-inline">Linked </span>({linkedParents.length})
//                     </button>
//                   </li>
//                   <li className="nav-item">
//                     <button
//                       className={`nav-link ${activeTab === 'unlinked' ? 'active' : ''}`}
//                       onClick={() => setActiveTab('unlinked')}
//                     >
//                       <i className="fa fa-exclamation-circle me-1" />
//                       <span className="d-none d-sm-inline">Unlinked </span>({unlinkedChildren.length})
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             </div>
            
//             <div className="card-body p-0">
//               {loading ? (
//                 <div className="text-center py-4">
//                   <div className="spinner-border text-primary" />
//                   <p className="text-muted mt-2">Loading links...</p>
//                 </div>
//               ) : activeTab === 'unlinked' ? (
//                 unlinkedChildren.length === 0 ? (
//                   <EmptyState
//                     icon="fa fa-check-circle"
//                     title="All students linked!"
//                     description="Great! Every student has at least one parent/guardian linked."
//                     small
//                   />
//                 ) : (
//                   <div className="p-3">
//                     <div className="row g-3">
//                       {unlinkedChildren.map(student => (
//                         <div key={student.id} className="col-12 col-sm-6 col-lg-4">
//                           <div className="card h-100 border-warning shadow-sm">
//                             <div className="card-body d-flex flex-column">
//                               <div className="d-flex justify-content-between align-items-start mb-3">
//                                 <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
//                                   <Avatar 
//                                     name={student.names} 
//                                     size={48} 
//                                     bgColor="bg-success"
//                                     className="flex-shrink-0"
//                                   />
//                                   <div className="ms-3 overflow-hidden">
//                                     <h6 className="mb-0 text-truncate" title={student.names}>
//                                       {student.names}
//                                     </h6>
//                                     <p className="text-muted small mb-0 text-truncate" title={student.email}>
//                                       {student.email}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <span className="badge bg-warning text-dark flex-shrink-0 ms-2">
//                                   <i className="fa fa-exclamation-circle me-1" />
//                                   Unlinked
//                                 </span>
//                               </div>
                              
//                               <Button
//                                 variant="outline-primary"
//                                 size="sm"
//                                 icon="fa fa-user-plus"
//                                 block
//                                 onClick={() => openCreateModal('', student.id)}
//                                 className="mt-auto"
//                               >
//                                 Link Parent
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )
//               ) : links.length === 0 ? (
//                 <EmptyState
//                   icon="fa fa-link"
//                   title="No links found"
//                   description={hasActiveFilters ? 'Try adjusting your filters' : 'Create a parent-child link to get started'}
//                   actionLabel={hasActiveFilters ? 'Clear Filters' : 'New Link'}
//                   onAction={hasActiveFilters ? clearFilters : () => openCreateModal()}
//                 />
//               ) : (
//                 <>
//                   {/* Mobile Cards View */}
//                   <div className="d-block d-lg-none">
//                     {links.map(link => (
//                       <div key={link.id} className="border-bottom p-3">
//                         <div className="d-flex justify-content-between align-items-start mb-2">
//                           <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
//                             <Avatar name={link.parentName} size={40} bgColor="bg-info" className="flex-shrink-0" />
//                             <div className="ms-3 overflow-hidden">
//                               <div className="fw-bold text-truncate">{link.parentName}</div>
//                               <div className="small text-muted text-truncate">{link.parentEmail}</div>
//                             </div>
//                           </div>
//                           <span className={`badge ${getRelationshipBadgeClass(link.relationship)} flex-shrink-0 ms-2`}>
//                             {link.relationship}
//                           </span>
//                         </div>

//                         <div className="mb-3 ps-5 ms-2">
//                           <div className="d-flex align-items-center">
//                             <Avatar name={link.childName} size={32} bgColor="bg-success" className="flex-shrink-0" />
//                             <div className="ms-2 overflow-hidden">
//                               <div className="fw-bold text-truncate">{link.childName}</div>
//                               <div className="small text-muted text-truncate">{link.childEmail}</div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="d-flex justify-content-between align-items-center ps-5 ms-2">
//                           <div className="small text-muted">
//                             Linked: {formatDate(link.linkedAt)}
//                           </div>
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             icon="fa fa-unlink"
//                             onClick={() => {
//                               setLinkToUnlink(link);
//                               setShowUnlinkModal(true);
//                             }}
//                           >
//                             <span className="d-none d-sm-inline">Unlink</span>
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Desktop Table View */}
//                   <div className="d-none d-lg-block">
//                     <div className="table-responsive">
//                       <table className="table table-hover align-middle mb-0">
//                         <thead className="table-light">
//                           <tr>
//                             <th className="border-0 ps-4">Parent/Guardian</th>
//                             <th className="border-0">Child/Student</th>
//                             <th className="text-center border-0">Relationship</th>
//                             <th className="text-center border-0">Status</th>
//                             <th className="text-center border-0">Linked Date</th>
//                             <th className="text-end border-0 pe-4">Actions</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {links.map(link => (
//                             <tr key={link.id}>
//                               <td className="ps-4">
//                                 <div className="d-flex align-items-center">
//                                   <Avatar name={link.parentName} bgColor="bg-info" />
//                                   <div className="ms-3 overflow-hidden" style={{ maxWidth: '200px' }}>
//                                     <div className="fw-bold text-truncate">{link.parentName}</div>
//                                     <div className="text-muted small text-truncate">{link.parentEmail}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td>
//                                 <div className="d-flex align-items-center">
//                                   <Avatar name={link.childName} bgColor="bg-success" />
//                                   <div className="ms-3 overflow-hidden" style={{ maxWidth: '200px' }}>
//                                     <div className="fw-bold text-truncate">{link.childName}</div>
//                                     <div className="text-muted small text-truncate">{link.childEmail}</div>
//                                   </div>
//                                 </div>
//                               </td>
//                               <td className="text-center">
//                                 <span className={`badge ${getRelationshipBadgeClass(link.relationship)}`}>
//                                   {link.relationship.charAt(0).toUpperCase() + link.relationship.slice(1)}
//                                 </span>
//                               </td>
//                               <td className="text-center">
//                                 <span className={`badge ${getStatusBadgeClass(link.status)}`}>
//                                   {link.status.toUpperCase()}
//                                 </span>
//                               </td>
//                               <td className="text-center">
//                                 <small className="text-muted">
//                                   {formatDate(link.linkedAt)}
//                                 </small>
//                               </td>
//                               <td className="text-end pe-4">
//                                 <Button
//                                   variant="outline-danger"
//                                   size="sm"
//                                   icon="fa fa-unlink"
//                                   onClick={() => {
//                                     setLinkToUnlink(link);
//                                     setShowUnlinkModal(true);
//                                   }}
//                                 >
//                                   Unlink
//                                 </Button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>

//                   {/* Pagination */}
//                   {totalPages > 1 && activeTab !== 'unlinked' && (
//                     <Pagination
//                       page={page}
//                       totalPages={totalPages}
//                       hasNextPage={hasNextPage}
//                       hasPrevPage={hasPrevPage}
//                       onPageChange={setPage}
//                       loading={loading}
//                     />
//                   )}
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Parent Overview */}
//           {showParentOverview && (
//             <div className="card mb-4 shadow-sm">
//               <div className="card-header bg-light py-3">
//                 <h6 className="mb-0 d-flex align-items-center">
//                   <i className="fa fa-users me-2" />
//                   Parent Overview ({parents.length} parents)
//                 </h6>
//               </div>
//               <div className="card-body">
//                 {parents.length === 0 ? (
//                   <EmptyState
//                     icon="fa fa-user-slash"
//                     title="No parents found"
//                     description="Add parents to the system to start linking them to students"
//                     small
//                   />
//                 ) : (
//                   <div className="row g-3">
//                     {parents.map(parent => {
//                       const parentLinks = getChildrenForParent(parent.id);
                      
//                       return (
//                         <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={parent.id}>
//                           <div className="border rounded p-3 h-100 bg-light">
//                             <div className="d-flex align-items-center mb-3">
//                               <Avatar name={parent.names} size={48} bgColor="bg-info" className="flex-shrink-0" />
//                               <div className="ms-3 flex-grow-1 overflow-hidden">
//                                 <div className="fw-bold text-truncate" title={parent.names}>{parent.names}</div>
//                                 <div className="text-muted small text-truncate" title={parent.email}>{parent.email}</div>
//                               </div>
//                             </div>

//                             <div className="row g-2 mb-3">
//                               <div className="col-6">
//                                 <div className="text-center bg-white rounded p-2">
//                                   <div className="fw-bold text-primary">{parentLinks.length}</div>
//                                   <small className="text-muted d-block text-truncate">Child{parentLinks.length !== 1 ? 'ren' : ''}</small>
//                                 </div>
//                               </div>
//                               <div className="col-6">
//                                 <div className="text-center bg-white rounded p-2">
//                                   <span className={`badge ${parent.is_active ? 'bg-success' : 'bg-secondary'}`}>
//                                     {parent.is_active ? 'Active' : 'Inactive'}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>

//                             {parentLinks.length === 0 ? (
//                               <div className="text-center py-2">
//                                 <p className="text-muted small mb-2">No children linked</p>
//                                 <Button
//                                   variant="outline-primary"
//                                   size="sm"
//                                   onClick={() => openCreateModal(parent.id)}
//                                 >
//                                   <i className="fa fa-plus me-1" />
//                                   Link Child
//                                 </Button>
//                               </div>
//                             ) : (
//                               <>
//                                 <div className="d-flex justify-content-between align-items-center mb-2">
//                                   <span className="small fw-semibold text-muted">Linked Children</span>
//                                   <span className="badge bg-primary">
//                                     {parentLinks.length}
//                                   </span>
//                                 </div>
//                                 <div className="small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
//                                   {parentLinks.map(link => (
//                                     <div
//                                       key={link.id}
//                                       className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
//                                     >
//                                       <div className="flex-grow-1 overflow-hidden me-2">
//                                         <div className="fw-semibold text-truncate" title={link.childName}>
//                                           {link.childName}
//                                         </div>
//                                         <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
//                                           {link.childEmail}
//                                         </div>
//                                       </div>
//                                       <span className={`badge ${getRelationshipBadgeClass(link.relationship)} flex-shrink-0`} style={{ fontSize: '0.65rem' }}>
//                                         {link.relationship}
//                                       </span>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Link Creation Modal */}
//       <LinkCreationModal
//         show={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         parents={parents}
//         children={children}
//         links={links}
//         onCreateLink={handleCreateLink}
//         creating={creating}
//         preselectedParentId={preselectedParent}
//         preselectedChildId={preselectedChild}
//       />

//       {/* Unlink Confirmation Modal */}
//       {showUnlinkModal && linkToUnlink && (
//         <div
//           className="modal fade show d-block"
//           style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
//           onClick={() => !unlinking && setShowUnlinkModal(false)}
//         >
//           <div
//             className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="modal-content">
//               <div className="modal-header border-0">
//                 <h5 className="modal-title">
//                   <i className="fa fa-unlink me-2 text-danger" />
//                   Confirm Unlink
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowUnlinkModal(false)}
//                   disabled={unlinking}
//                   aria-label="Close"
//                 />
//               </div>
//               <div className="modal-body">
//                 <div className="alert alert-danger mb-4">
//                   <i className="fa fa-exclamation-triangle me-2" />
//                   This action will remove the link between the parent and child.
//                 </div>

//                 <div className="card mb-4">
//                   <div className="card-body">
//                     <div className="row">
//                       <div className="col-12 col-md-6 mb-3 mb-md-0">
//                         <h6 className="text-muted mb-2">Parent/Guardian</h6>
//                         <div className="d-flex align-items-center">
//                           <Avatar 
//                             name={linkToUnlink.parentName} 
//                             size={48}
//                             bgColor="bg-danger"
//                           />
//                           <div className="ms-3">
//                             <h5 className="mb-1">{linkToUnlink.parentName}</h5>
//                             <p className="text-muted small mb-0">{linkToUnlink.parentEmail}</p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="col-12 col-md-6">
//                         <h6 className="text-muted mb-2">Child/Student</h6>
//                         <div className="d-flex align-items-center">
//                           <Avatar 
//                             name={linkToUnlink.childName} 
//                             size={48}
//                             bgColor="bg-success"
//                           />
//                           <div className="ms-3">
//                             <h5 className="mb-1">{linkToUnlink.childName}</h5>
//                             <p className="text-muted small mb-0">{linkToUnlink.childEmail}</p>
//                           </div>
//                         </div>
//                         <div className="mt-2">
//                           <span className={`badge ${getRelationshipBadgeClass(linkToUnlink.relationship)}`}>
//                             {linkToUnlink.relationship}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="alert alert-warning mb-0">
//                   <div className="d-flex">
//                     <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
//                     <div>
//                       <strong>Note:</strong> The parent will lose access to this child's information and will no longer receive updates about their academic progress.
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="modal-footer border-0">
//                 <div className="d-flex gap-2 w-100 flex-column flex-sm-row">
//                   <Button
//                     variant="outline-secondary"
//                     onClick={() => setShowUnlinkModal(false)}
//                     disabled={unlinking}
//                     // block
//                     size="md"
//                     className="order-2 order-sm-1"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     variant="danger"
//                     onClick={handleUnlink}
//                     loading={unlinking}
//                     icon="fa fa-unlink"
//                     // block
//                     size="md"
//                     className="order-1 order-sm-2"
//                   >
//                     {unlinking ? 'Processing...' : 'Confirm Unlink'}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ParentChildLinks;




// v3
// v11 - Professionally refactored, fully responsive, pattern-aligned
// src/pages/admin/ParentChildLinks.tsx

import { useState, useEffect, useCallback } from 'react';
import { UserService } from '@/services/users/UserService';
import { ParentService } from '@/services/users/parent';
import toast from 'react-hot-toast';
import type { User } from '@/types/auth';
import type { 
  ParentChildLink, 
  ParentChildLinkFilters, 
  ParentChildLinkStats,
  CreateParentChildLinkPayload 
} from '@/types/parent';
import { formatDate } from '@/utils/format';
import { getInitials } from '@/utils/helpers';

// ============================================================================
// REUSABLE COMPONENTS (DRY Principle)
// ============================================================================

interface StatCardProps {
  value: number | string;
  label: string;
  icon: string;
  bgColor: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, bgColor, loading }) => (
  <div className="col-6 col-md-3 mb-3">
    <div className={`card ${bgColor} text-white shadow-sm h-100`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div className="flex-grow-1">
            <h3 className="mb-1 fw-bold">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status" />
              ) : (
                value
              )}
            </h3>
            <p className="mb-0 small opacity-75 text-truncate">{label}</p>
          </div>
          <i className={`${icon} fa-2x opacity-25 ms-2 flex-shrink-0`} />
        </div>
      </div>
    </div>
  </div>
);

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  error?: string;
  colClass?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  required = false,
  hint,
  placeholder = 'Choose...',
  error,
  colClass = 'col-12'
}) => (
  <div className={colClass}>
    <label className="form-label small fw-semibold text-muted mb-1">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <select
      className={`form-select w-100 border ${error ? 'is-invalid' : ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <div className="invalid-feedback d-block">{error}</div>}
    {hint && <small className="text-muted d-block mt-1 text-truncate" title={hint}>{hint}</small>}
  </div>
);

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger' | 'outline-primary' | 'outline-warning' | 'light';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children: React.ReactNode;
  className?: string;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'sm',
  icon,
  children,
  className = '',
  block = false,
  type = 'button'
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const blockClass = block ? 'w-100' : '';
  
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${blockClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          {children}
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`} />}
          {children}
        </>
      )}
    </button>
  );
};

interface FilterBadgeProps {
  children: React.ReactNode;
  onRemove: () => void;
  icon?: string;
  color?: string;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ children, onRemove, icon, color = 'primary' }) => (
  <span className={`badge bg-${color} rounded-pill d-inline-flex align-items-center`}>
    {icon && <i className={`${icon} me-1`} />}
    <span className="text-truncate" style={{ maxWidth: '150px' }}>
      {children}
    </span>
    <button
      type="button"
      className="btn-close btn-close-white ms-2"
      style={{ fontSize: '0.5rem', padding: '0.25rem' }}
      onClick={onRemove}
      aria-label="Remove filter"
    />
  </span>
);

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  small?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  small = false
}) => (
  <div className={`text-center py-${small ? '4' : '5'}`}>
    <i className={`${icon} ${small ? 'fa-2x' : 'fa-3x'} text-muted mb-3`} />
    <h5 className={small ? 'h6' : ''}>{title}</h5>
    <p className={`text-muted ${small ? 'small' : ''} mb-3`}>{description}</p>
    {actionLabel && onAction && (
      <Button
        variant="outline-primary"
        size={small ? 'sm' : 'md'}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);

interface AvatarProps {
  name: string;
  size?: number;
  bgColor?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 36,
  bgColor = 'bg-primary',
  className = ''
}) => (
  <div
    className={`rounded-circle ${bgColor} text-white d-flex align-items-center justify-content-center ${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${Math.max(10, size * 0.35)}px`,
      fontWeight: 'bold',
      flexShrink: 0
    }}
    title={name}
  >
    {getInitials(name || 'NA')}
  </div>
);

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  loading
}) => (
  <div className="d-flex justify-content-between align-items-center p-3 border-top flex-wrap gap-2">
    <Button
      variant="outline-secondary"
      size="sm"
      icon="fa fa-chevron-left"
      disabled={!hasPrevPage || loading}
      onClick={() => onPageChange(page - 1)}
      className="order-1 order-md-1"
    >
      <span className="d-none d-sm-inline">Previous</span>
    </Button>

    <span className="small text-muted text-center order-3 order-md-2 w-100 w-md-auto">
      Page <strong>{page}</strong> of <strong>{totalPages}</strong>
      {totalPages > 10 && (
        <div className="d-inline-block ms-2">
          <input
            type="number"
            className="form-control form-control-sm d-inline-block"
            style={{ width: '60px' }}
            min={1}
            max={totalPages}
            value={page}
            onChange={(e) => {
              const newPage = parseInt(e.target.value);
              if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
                onPageChange(newPage);
              }
            }}
            disabled={loading}
          />
        </div>
      )}
    </span>

    <Button
      variant="outline-secondary"
      size="sm"
      disabled={!hasNextPage || loading}
      onClick={() => onPageChange(page + 1)}
      className="order-2 order-md-3"
    >
      <span className="d-none d-sm-inline">Next</span>
      <i className="fa fa-chevron-right ms-2" />
    </Button>
  </div>
);

// ============================================================================
// LINK CREATION MODAL COMPONENT
// ============================================================================

interface LinkCreationModalProps {
  show: boolean;
  onClose: () => void;
  parents: User[];
  children: User[];
  links: ParentChildLink[];
  onCreateLink: (parentId: string, childId: string, relationship: 'parent' | 'guardian') => Promise<void>;
  creating: boolean;
  preselectedParentId?: string;
  preselectedChildId?: string;
}

const LinkCreationModal: React.FC<LinkCreationModalProps> = ({
  show,
  onClose,
  parents,
  children,
  links,
  onCreateLink,
  creating,
  preselectedParentId = '',
  preselectedChildId = ''
}) => {
  const [selectedParent, setSelectedParent] = useState(preselectedParentId);
  const [selectedChild, setSelectedChild] = useState(preselectedChildId);
  const [relationship, setRelationship] = useState<'parent' | 'guardian'>('parent');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelectedParent(preselectedParentId);
    setSelectedChild(preselectedChildId);
  }, [preselectedParentId, preselectedChildId]);

  useEffect(() => {
    if (!show) {
      setFormErrors({});
    }
  }, [show]);

  const getParentLinkCount = (parentId: string) => {
    return links.filter(l => l.parent_id === parentId && l.status === 'active').length;
  };

  const getAvailableChildren = () => {
    if (!selectedParent) return children;
    const linkedIds = links
      .filter(l => l.parent_id === selectedParent && l.status === 'active')
      .map(l => l.child_id);
    return children.filter(s => !linkedIds.includes(s.id));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedParent) {
      errors.parent = 'Please select a parent/guardian';
    }
    
    if (!selectedChild) {
      errors.child = 'Please select a child/student';
    }
    
    if (selectedParent && selectedChild) {
      const existingLink = links.find(
        l => l.parent_id === selectedParent && 
             l.child_id === selectedChild && 
             l.status === 'active'
      );
      if (existingLink) {
        errors.child = 'This parent-child link already exists';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onCreateLink(selectedParent, selectedChild, relationship);
      setSelectedParent('');
      setSelectedChild('');
      setRelationship('parent');
      setFormErrors({});
      onClose();
    } catch (error) {
      // Error is handled by parent
    }
  };

  const handleClose = () => {
    if (!creating) {
      setSelectedParent('');
      setSelectedChild('');
      setRelationship('parent');
      setFormErrors({});
      onClose();
    }
  };

  const parentOptions = parents.map(parent => ({
    value: parent.id,
    label: `${parent.names} (${getParentLinkCount(parent.id)} linked)`,
    disabled: !parent.is_active
  }));

  const childOptions = getAvailableChildren().map(child => ({
    value: child.id,
    label: child.names
  }));

  const selectedParentData = parents.find(p => p.id === selectedParent);
  const selectedChildData = children.find(s => s.id === selectedChild);

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
        style={{ maxHeight: '100dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className="fa fa-link me-2" />
              Create Parent-Child Link
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              disabled={creating}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <div className="alert alert-info d-flex align-items-start mb-4">
              <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
              <div className="small">
                Link a parent or guardian to a student. This will grant the parent access to view the student's academic information.
              </div>
            </div>

            <div className="row g-3">
              <FormSelect
                label="Select Parent/Guardian"
                value={selectedParent}
                onChange={(value) => {
                  setSelectedParent(value);
                  setSelectedChild('');
                  setFormErrors(prev => ({ ...prev, parent: '' }));
                }}
                options={parentOptions}
                disabled={creating}
                required
                placeholder="Choose a parent/guardian..."
                error={formErrors.parent}
                colClass="col-12"
              />

              {selectedParentData && (
                <div className="col-12">
                  <div className="card bg-light border-0">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <Avatar 
                          name={selectedParentData.names} 
                          size={48} 
                          bgColor="bg-info"
                        />
                        <div className="ms-3 flex-grow-1 overflow-hidden">
                          <div className="fw-bold">{selectedParentData.names}</div>
                          <div className="text-muted small text-truncate">{selectedParentData.email}</div>
                          <div className="mt-1">
                            <span className="badge bg-info me-2">
                              <i className="fa fa-users me-1" />
                              {getParentLinkCount(selectedParentData.id)} Linked
                            </span>
                            <span className={`badge ${selectedParentData.is_active ? 'bg-success' : 'bg-secondary'}`}>
                              {selectedParentData.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <FormSelect
                label="Select Child/Student"
                value={selectedChild}
                onChange={(value) => {
                  setSelectedChild(value);
                  setFormErrors(prev => ({ ...prev, child: '' }));
                }}
                options={childOptions}
                disabled={!selectedParent || creating}
                required
                placeholder={!selectedParent ? "Select a parent first..." : "Choose a student..."}
                error={formErrors.child}
                colClass="col-12"
              />

              {selectedChildData && (
                <div className="col-12">
                  <div className="card bg-light border-0">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <Avatar 
                          name={selectedChildData.names} 
                          size={48} 
                          bgColor="bg-success"
                        />
                        <div className="ms-3 flex-grow-1 overflow-hidden">
                          <div className="fw-bold">{selectedChildData.names}</div>
                          <div className="text-muted small text-truncate">{selectedChildData.email}</div>
                          <div className="mt-1">
                            <span className={`badge ${selectedChildData.is_active ? 'bg-success' : 'bg-secondary'}`}>
                              {selectedChildData.is_active ? 'Active Student' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <FormSelect
                label="Relationship Type"
                value={relationship}
                onChange={(value) => setRelationship(value as 'parent' | 'guardian')}
                options={[
                  { value: 'parent', label: 'Parent' },
                  { value: 'guardian', label: 'Guardian' }
                ]}
                disabled={creating}
                required
                colClass="col-12"
              />

              {selectedParent && childOptions.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning mb-0">
                    <i className="fa fa-exclamation-triangle me-2" />
                    This parent is already linked to all available students.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-0 bg-light">
            <div className="d-flex gap-2 justify-content-end w-100">
              <Button
                variant="outline-secondary"
                onClick={handleClose}
                disabled={creating}
                size="md"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!selectedParent || !selectedChild || creating}
                loading={creating}
                icon="fa fa-check"
                size="md"
              >
                {creating ? 'Creating Link...' : 'Create Link'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ParentChildLinks: React.FC = () => {
  // State
  const [parents, setParents] = useState<User[]>([]);
  const [children, setChildren] = useState<User[]>([]);
  const [links, setLinks] = useState<ParentChildLink[]>([]);
  const [stats, setStats] = useState<ParentChildLinkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preselectedParent, setPreselectedParent] = useState('');
  const [preselectedChild, setPreselectedChild] = useState('');
  const [creating, setCreating] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<'all' | 'parent' | 'guardian'>('all');
  const [filterParent, setFilterParent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Unlink modal state
  const [showUnlinkModal, setShowUnlinkModal] = useState(false);
  const [linkToUnlink, setLinkToUnlink] = useState<ParentChildLink | null>(null);
  const [unlinking, setUnlinking] = useState(false);

  // UI state
  const [showParentOverview, setShowParentOverview] = useState(false);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterRelationship, filterParent, filterStatus]);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setInitialLoading(true);
      const [parentsResponse, studentsResponse, statsResponse] = await Promise.all([
        UserService.getAll({ role: 'parent', is_active: true }),
        UserService.getAll({ role: 'student', is_active: true }),
        ParentService.getStats(),
      ]);

      setParents(parentsResponse.data?.users || []);
      setChildren(studentsResponse.data?.users || []);
      
      const statsData = statsResponse.data || statsResponse.success || null;
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      toast.error('Failed to load initial data');
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch links when dependencies change
  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      
      const params: ParentChildLinkFilters = { 
        page, 
        page_size: pageSize,
        relationship: filterRelationship !== 'all' ? filterRelationship : undefined,
        parent_id: filterParent !== 'all' ? filterParent : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
        include_relations: true, // Always include relations for list view
      };

      const response = await ParentService.getAll(params);
      
      console.log('API Response:', response);

      const linksData = response.data?.links || [];
      const metaData = response.data?.page_meta || response.data?.meta || {};

      setLinks(Array.isArray(linksData) ? linksData : []);
      
      const totalCount = metaData.total ?? metaData.total_items_count ?? linksData.length;
      setTotal(totalCount);
      
      const pages = metaData.total_pages ?? metaData.total_pages_count ?? Math.ceil(totalCount / pageSize);
      setTotalPages(pages);

      console.log('Parsed data:', {
        links: linksData.length,
        total: totalCount,
        pages,
        currentPage: page
      });
      
    } catch (error: any) {
      console.error('Failed to fetch links:', error);
      toast.error('Failed to load parent-child links');
      setLinks([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterRelationship, filterParent, filterStatus, pageSize]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const refreshData = () => {
    fetchLinks();
    fetchInitialData();
  };

  // ============================================================================
  // LINK ACTIONS
  // ============================================================================

  const openCreateModal = (parentId: string = '', childId: string = '') => {
    setPreselectedParent(parentId);
    setPreselectedChild(childId);
    setShowCreateModal(true);
  };

  const handleCreateLink = async (
    parentId: string, 
    childId: string, 
    relationship: 'parent' | 'guardian'
  ) => {
    try {
      setCreating(true);
      
      const payload: CreateParentChildLinkPayload = {
        parent_id: parentId,
        child_id: childId,
        relationship
      };
      
      await ParentService.create(payload);

      toast.success('Parent-child link created successfully');
      refreshData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create link');
      throw error;
    } finally {
      setCreating(false);
    }
  };

  const handleUnlink = async () => {
    if (!linkToUnlink) return;

    try {
      setUnlinking(true);
      await ParentService.delete(linkToUnlink.id);

      toast.success('Link removed successfully');
      setShowUnlinkModal(false);
      setLinkToUnlink(null);

      if (links.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refreshData();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove link');
    } finally {
      setUnlinking(false);
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const getChildrenForParent = (parentId: string) => {
    return links.filter(l => l.parent_id === parentId && l.status === 'active');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRelationship('all');
    setFilterParent('all');
    setFilterStatus('all');
    setPage(1);
  };

  const getRelationshipBadgeClass = (relationship: string) => {
    return relationship === 'parent' ? 'bg-primary' : 'bg-warning';
  };

  const getStatusBadgeClass = (status: string) => {
    return status === 'active' ? 'bg-success' : 'bg-secondary';
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const startItem = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const endItem = Math.min(page * pageSize, total);
  const hasActiveFilters = searchTerm || filterRelationship !== 'all' || filterParent !== 'all' || filterStatus !== 'all';

  const linkedParentIds = new Set(
    links.filter(l => l.status === 'active').map(l => l.parent_id)
  );
  
  const linkedChildrenIds = new Set(
    links.filter(l => l.status === 'active').map(l => l.child_id)
  );

  const unlinkedChildren = children.filter(s => !linkedChildrenIds.has(s.id));

  const parentFilterOptions = [
    { value: 'all', label: 'All Parents' },
    ...parents.map(parent => ({
      value: parent.id,
      label: parent.names
    }))
  ];

  const relationshipOptions = [
    { value: 'all', label: 'All Relationships' },
    { value: 'parent', label: 'Parents Only' },
    { value: 'guardian', label: 'Guardians Only' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
          <p className="text-muted">Loading parent-child links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content bg-white p-2 p-md-3 p-lg-4">
        <div className="container-fluid px-0 px-md-3">
          {/* Header */}
          <div className="mb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 mb-3">
              <div>
                <h4 className="mb-1">Parent-Child Links</h4>
                <p className="text-muted mb-0 small">Manage relationships between parents/guardians and students</p>
              </div>
              <div className="d-flex gap-2">
                <Button
                  onClick={refreshData}
                  variant="outline-primary"
                  size="sm"
                  icon="fa fa-sync-alt"
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => openCreateModal()}
                  variant="primary"
                  size="sm"
                  icon="fa fa-plus"
                >
                  New Link
                </Button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <span className="badge bg-info rounded-pill">
                <i className="fa fa-users me-1" /> {parents.length} Parents
              </span>
              <span className="badge bg-success rounded-pill">
                <i className="fa fa-user-graduate me-1" /> {children.length} Students
              </span>
              <span className="badge bg-primary rounded-pill">
                <i className="fa fa-link me-1" /> {total} Links
              </span>
              {unlinkedChildren.length > 0 && (
                <span className="badge bg-warning text-dark rounded-pill">
                  <i className="fa fa-exclamation-triangle me-1" /> {unlinkedChildren.length} Unlinked
                </span>
              )}
              <button
                className="btn btn-sm btn-outline-secondary ms-auto"
                onClick={() => setShowParentOverview(!showParentOverview)}
              >
                <i className={`fa fa-${showParentOverview ? 'minus' : 'plus'} me-1`} />
                {showParentOverview ? 'Hide' : 'Show'} Overview
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <StatCard
              value={stats?.total_links || 0}
              label="Total Links"
              icon="fa fa-link"
              bgColor="bg-primary"
              loading={loading && !links.length}
            />
            <StatCard
              value={`${stats?.parents_with_links || 0}/${stats?.total_parents || 0}`}
              label="Parents Linked"
              icon="fa fa-user-check"
              bgColor="bg-info"
              loading={loading && !links.length}
            />
            <StatCard
              value={`${stats?.children_with_links || 0}/${stats?.total_children || 0}`}
              label="Students Linked"
              icon="fa fa-user-graduate"
              bgColor="bg-success"
              loading={loading && !links.length}
            />
            <StatCard
              value={stats?.unlinked_children || 0}
              label="Unlinked Students"
              icon="fa fa-exclamation-triangle"
              bgColor="bg-warning"
              loading={loading && !links.length}
            />
          </div>

          {/* Search and Filter */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-filter me-2" />
                Filters & Search
              </h6>
              {hasActiveFilters && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="fa fa-times me-1" />
                  Clear All
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-4 col-lg-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Relationship</label>
                  <select
                    className="form-select w-100 border"
                    value={filterRelationship}
                    onChange={(e) => setFilterRelationship(e.target.value as typeof filterRelationship)}
                  >
                    {relationshipOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4 col-lg-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Parent</label>
                  <select
                    className="form-select w-100 border"
                    value={filterParent}
                    onChange={(e) => setFilterParent(e.target.value)}
                  >
                    {parentFilterOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-4 col-lg-4">
                  <label className="form-label small fw-semibold text-muted mb-1">Status</label>
                  <select
                    className="form-select w-100 border"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted mb-1">Search</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa fa-search text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search by parent name, child name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="fa fa-times" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-top">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="small text-muted">Active filters:</span>
                    {searchTerm && (
                      <FilterBadge icon="fa fa-search" onRemove={() => setSearchTerm('')}>
                        {searchTerm}
                      </FilterBadge>
                    )}
                    {filterRelationship !== 'all' && (
                      <FilterBadge icon="fa fa-filter" onRemove={() => setFilterRelationship('all')} color="info">
                        Type: {filterRelationship}
                      </FilterBadge>
                    )}
                    {filterParent !== 'all' && (
                      <FilterBadge icon="fa fa-user" onRemove={() => setFilterParent('all')} color="warning">
                        Parent: {parents.find(p => p.id === filterParent)?.names || 'Selected'}
                      </FilterBadge>
                    )}
                    {filterStatus !== 'all' && (
                      <FilterBadge icon="fa fa-circle" onRemove={() => setFilterStatus('all')} color="success">
                        Status: {filterStatus}
                      </FilterBadge>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-top">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                  <p className="mb-0 small text-muted">
                    {total > 0 ? (
                      <>
                        Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
                        <strong>{total}</strong> links
                        {totalPages > 1 && (
                          <span className="ms-2">
                            (Page <strong>{page}</strong> of <strong>{totalPages}</strong>)
                          </span>
                        )}
                      </>
                    ) : (
                      'No links found'
                    )}
                  </p>
                  <div className="d-flex gap-2">
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-check-circle text-success me-1" />
                      {links.filter(l => l.status === 'active').length} Active
                    </span>
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-times-circle text-secondary me-1" />
                      {links.filter(l => l.status === 'inactive').length} Inactive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Links Table */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-light py-3">
              <h6 className="mb-0 d-flex align-items-center">
                <i className="fa fa-list me-2" />
                Parent-Child Links ({total})
              </h6>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" />
                  <p className="text-muted mt-2">Loading links...</p>
                </div>
              ) : links.length === 0 ? (
                <EmptyState
                  icon="fa fa-link"
                  title="No links found"
                  description={hasActiveFilters ? 'Try adjusting your filters' : 'Create a parent-child link to get started'}
                  actionLabel={hasActiveFilters ? 'Clear Filters' : 'New Link'}
                  onAction={hasActiveFilters ? clearFilters : () => openCreateModal()}
                />
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="d-block d-lg-none">
                    {links.map(link => {
                      const parent = link.parent || {};
                      const child = link.child || {};

                      return (
                        <div key={link.id} className="border-bottom p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                              <Avatar name={parent.names || 'NA'} size={40} bgColor="bg-info" className="flex-shrink-0" />
                              <div className="ms-3 overflow-hidden">
                                <div className="fw-bold text-truncate">{parent.names || 'Unknown'}</div>
                                <div className="small text-muted text-truncate">{parent.email || 'No email'}</div>
                              </div>
                            </div>
                            <span className={`badge ${getRelationshipBadgeClass(link.relationship)} flex-shrink-0 ms-2`}>
                              {link.relationship}
                            </span>
                          </div>

                          <div className="mb-3 ps-5 ms-2">
                            <div className="d-flex align-items-center">
                              <Avatar name={child.names || 'NA'} size={32} bgColor="bg-success" className="flex-shrink-0" />
                              <div className="ms-2 overflow-hidden">
                                <div className="fw-bold text-truncate">{child.names || 'Unknown'}</div>
                                <div className="small text-muted text-truncate">{child.email || 'No email'}</div>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center ps-5 ms-2">
                            <div>
                              <span className={`badge ${getStatusBadgeClass(link.status || '')} me-2`}>
                                {link.status?.toUpperCase()}
                              </span>
                              <small className="text-muted">
                                {formatDate(link.created_at)}
                              </small>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              icon="fa fa-unlink"
                              onClick={() => {
                                setLinkToUnlink(link);
                                setShowUnlinkModal(true);
                              }}
                            >
                              <span className="d-none d-sm-inline">Unlink</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="border-0 ps-4">Parent/Guardian</th>
                            <th className="border-0">Child/Student</th>
                            <th className="text-center border-0">Relationship</th>
                            <th className="text-center border-0">Status</th>
                            <th className="text-center border-0">Linked Date</th>
                            <th className="text-end border-0 pe-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {links.map(link => {
                            const parent = link.parent || {};
                            const child = link.child || {};

                            return (
                              <tr key={link.id}>
                                <td className="ps-4">
                                  <div className="d-flex align-items-center">
                                    <Avatar name={parent.names || 'NA'} bgColor="bg-info" />
                                    <div className="ms-3 overflow-hidden" style={{ maxWidth: '200px' }}>
                                      <div className="fw-bold text-truncate">{parent.names || 'Unknown'}</div>
                                      <div className="text-muted small text-truncate">{parent.email || 'No email'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Avatar name={child.names || 'NA'} bgColor="bg-success" />
                                    <div className="ms-3 overflow-hidden" style={{ maxWidth: '200px' }}>
                                      <div className="fw-bold text-truncate">{child.names || 'Unknown'}</div>
                                      <div className="text-muted small text-truncate">{child.email || 'No email'}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-center">
                                  <span className={`badge ${getRelationshipBadgeClass(link.relationship)}`}>
                                    {link.relationship.charAt(0).toUpperCase() + link.relationship.slice(1)}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <span className={`badge ${getStatusBadgeClass(link.status || '')}`}>
                                    {link.status?.toUpperCase()}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <small className="text-muted">
                                    {formatDate(link.created_at)}
                                  </small>
                                </td>
                                <td className="text-end pe-4">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    icon="fa fa-unlink"
                                    onClick={() => {
                                      setLinkToUnlink(link);
                                      setShowUnlinkModal(true);
                                    }}
                                  >
                                    Unlink
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      hasNextPage={hasNextPage}
                      hasPrevPage={hasPrevPage}
                      onPageChange={setPage}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Unlinked Children Alert */}
          {unlinkedChildren.length > 0 && (
            <div className="alert alert-warning shadow-sm mb-4">
              <div className="d-flex align-items-start">
                <i className="fa fa-exclamation-triangle fa-2x me-3 mt-1" />
                <div className="flex-grow-1">
                  <h6 className="alert-heading mb-2">Unlinked Students Found</h6>
                  <p className="mb-2">
                    <strong>{unlinkedChildren.length}</strong> {unlinkedChildren.length === 1 ? 'student has' : 'students have'} no parent or guardian linked.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {unlinkedChildren.slice(0, 5).map(student => (
                      <button
                        key={student.id}
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => openCreateModal('', student.id)}
                      >
                        <i className="fa fa-user-plus me-1" />
                        Link {student.names.split(' ')[0]}
                      </button>
                    ))}
                    {unlinkedChildren.length > 5 && (
                      <span className="badge bg-warning text-dark align-self-center">
                        +{unlinkedChildren.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Parent Overview */}
          {showParentOverview && (
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light py-3">
                <h6 className="mb-0 d-flex align-items-center">
                  <i className="fa fa-users me-2" />
                  Parent Overview ({parents.length} parents)
                </h6>
              </div>
              <div className="card-body">
                {parents.length === 0 ? (
                  <EmptyState
                    icon="fa fa-user-slash"
                    title="No parents found"
                    description="Add parents to the system to start linking them to students"
                    small
                  />
                ) : (
                  <div className="row g-3">
                    {parents.map(parent => {
                      const parentLinks = getChildrenForParent(parent.id);
                      
                      return (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={parent.id}>
                          <div className="border rounded p-3 h-100 bg-light">
                            <div className="d-flex align-items-center mb-3">
                              <Avatar name={parent.names} size={48} bgColor="bg-info" className="flex-shrink-0" />
                              <div className="ms-3 flex-grow-1 overflow-hidden">
                                <div className="fw-bold text-truncate" title={parent.names}>{parent.names}</div>
                                <div className="text-muted small text-truncate" title={parent.email}>{parent.email}</div>
                              </div>
                            </div>

                            <div className="row g-2 mb-3">
                              <div className="col-6">
                                <div className="text-center bg-white rounded p-2">
                                  <div className="fw-bold text-primary">{parentLinks.length}</div>
                                  <small className="text-muted d-block text-truncate">
                                    Child{parentLinks.length !== 1 ? 'ren' : ''}
                                  </small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="text-center bg-white rounded p-2">
                                  <span className={`badge ${parent.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                    {parent.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {parentLinks.length === 0 ? (
                              <div className="text-center py-2">
                                <p className="text-muted small mb-2">No children linked</p>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => openCreateModal(parent.id)}
                                  block
                                >
                                  <i className="fa fa-plus me-1" />
                                  Link Child
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <span className="small fw-semibold text-muted">Linked Children</span>
                                  <span className="badge bg-primary">{parentLinks.length}</span>
                                </div>
                                <div className="small" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                  {parentLinks.map(link => {
                                    const child = link.child || {};
                                    return (
                                      <div
                                        key={link.id}
                                        className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom"
                                      >
                                        <div className="flex-grow-1 overflow-hidden me-2">
                                          <div className="fw-semibold text-truncate" title={child.names}>
                                            {child.names || 'Unknown'}
                                          </div>
                                          <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                                            {child.email || 'No email'}
                                          </div>
                                        </div>
                                        <span 
                                          className={`badge ${getRelationshipBadgeClass(link.relationship)} flex-shrink-0`} 
                                          style={{ fontSize: '0.65rem' }}
                                        >
                                          {link.relationship}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Link Creation Modal */}
      <LinkCreationModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        parents={parents}
        children={children}
        links={links}
        onCreateLink={handleCreateLink}
        creating={creating}
        preselectedParentId={preselectedParent}
        preselectedChildId={preselectedChild}
      />

      {/* Unlink Confirmation Modal */}
      {showUnlinkModal && linkToUnlink && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
          onClick={() => !unlinking && setShowUnlinkModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down"
            style={{ maxHeight: '100dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  <i className="fa fa-unlink me-2 text-danger" />
                  Confirm Unlink
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUnlinkModal(false)}
                  disabled={unlinking}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="alert alert-danger mb-4">
                  <i className="fa fa-exclamation-triangle me-2" />
                  This action will remove the link between the parent and child.
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <h6 className="text-muted mb-2">Parent/Guardian</h6>
                        <div className="d-flex align-items-center">
                          <Avatar 
                            name={linkToUnlink.parent?.names || 'Unknown'} 
                            size={48}
                            bgColor="bg-danger"
                          />
                          <div className="ms-3 overflow-hidden">
                            <h5 className="mb-1 text-truncate">{linkToUnlink.parent?.names || 'Unknown'}</h5>
                            <p className="text-muted small mb-0 text-truncate">{linkToUnlink.parent?.email || 'No email'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <h6 className="text-muted mb-2">Child/Student</h6>
                        <div className="d-flex align-items-center">
                          <Avatar 
                            name={linkToUnlink.child?.names || 'Unknown'} 
                            size={48}
                            bgColor="bg-success"
                          />
                          <div className="ms-3 overflow-hidden">
                            <h5 className="mb-1 text-truncate">{linkToUnlink.child?.names || 'Unknown'}</h5>
                            <p className="text-muted small mb-0 text-truncate">{linkToUnlink.child?.email || 'No email'}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`badge ${getRelationshipBadgeClass(linkToUnlink.relationship)}`}>
                            {linkToUnlink.relationship}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning mb-0">
                  <div className="d-flex">
                    <i className="fa fa-info-circle mt-1 me-2 flex-shrink-0" />
                    <div>
                      <strong>Note:</strong> The parent will lose access to this child's information and will no longer receive updates about their academic progress.
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <div className="d-flex gap-2 justify-content-end w-100">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowUnlinkModal(false)}
                    disabled={unlinking}
                    size="md"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleUnlink}
                    loading={unlinking}
                    icon="fa fa-unlink"
                    size="md"
                  >
                    {unlinking ? 'Processing...' : 'Confirm Unlink'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentChildLinks;
