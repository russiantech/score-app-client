// // src/components/modals/LessonFormModal.tsx
// import type { Module, Lesson, LessonCreate, LessonUpdate } from '@/types/course';
// import { useState, useEffect } from 'react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: LessonCreate | LessonUpdate) => Promise<void>;
//   module: Module;
//   lesson?: Lesson | null;
//   isEditing?: boolean;
// }

// export const LessonFormModal = ({
//   isOpen,
//   onClose,
//   onSave,
//   module,
//   lesson = null,
//   isEditing = false
// }: Props) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     date: '',
//     status: 'upcoming' as const
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (isEditing && lesson) {
//       setFormData({
//         title: lesson.title,
//         description: lesson.description || '',
//         duration: lesson.duration || '',
//         date: lesson.date || '',
//         status: lesson.status || 'upcoming'
//       });
//     } else {
//       setFormData({
//         title: '',
//         description: '',
//         duration: '',
//         date: '',
//         status: 'upcoming'
//       });
//     }
//     setErrors({});
//   }, [isEditing, lesson, isOpen]);

//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Title is required';
//     } else if (formData.title.length < 3) {
//       newErrors.title = 'Title must be at least 3 characters';
//     }

//     if (formData.date && new Date(formData.date) < new Date()) {
//       if (!isEditing || formData.status === 'upcoming') {
//         // Only warn for new lessons or upcoming lessons
//         console.warn('Date is in the past');
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validate()) return;

//     setSaving(true);
//     try {
//       const data = isEditing
//         ? formData
//         : {
//             ...formData,
//             module_id: module.id,
//             description: formData.description || undefined,
//             duration: formData.duration || undefined,
//             date: formData.date || undefined
//           };
      
//       await onSave(data as any);
//       onClose();
//     } catch (error) {
//       console.error('Failed to save lesson:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[field];
//         return newErrors;
//       });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <div>
//               <h5 className="modal-title mb-1">
//                 {isEditing ? 'Edit Lesson' : 'Add New Lesson'}
//               </h5>
//               <small className="text-muted">Module: {module.title}</small>
//             </div>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={onClose}
//               disabled={saving}
//             />
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               {/* Title */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Title <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`form-control ${errors.title ? 'is-invalid' : ''}`}
//                   value={formData.title}
//                   onChange={e => handleChange('title', e.target.value)}
//                   placeholder="e.g., Introduction to Variables"
//                   disabled={saving}
//                 />
//                 {errors.title && (
//                   <div className="invalid-feedback">{errors.title}</div>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mb-3">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control"
//                   rows={3}
//                   value={formData.description}
//                   onChange={e => handleChange('description', e.target.value)}
//                   placeholder="What will students learn in this lesson?"
//                   disabled={saving}
//                 />
//               </div>

//               <div className="row">
//                 {/* Date */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Date</label>
//                   <input
//                     type="date"
//                     className="form-control"
//                     value={formData.date}
//                     onChange={e => handleChange('date', e.target.value)}
//                     disabled={saving}
//                   />
//                 </div>

//                 {/* Duration */}
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Duration</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={formData.duration}
//                     onChange={e => handleChange('duration', e.target.value)}
//                     placeholder="e.g., 2 hours, 90 minutes"
//                     disabled={saving}
//                   />
//                 </div>
//               </div>

//               {/* Status */}
//               {isEditing && (
//                 <div className="mb-3">
//                   <label className="form-label">Status</label>
//                   <select
//                     className="form-select"
//                     value={formData.status}
//                     onChange={e => handleChange('status', e.target.value)}
//                     disabled={saving}
//                   >
//                     <option value="upcoming">Upcoming</option>
//                     <option value="ongoing">Ongoing</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               )}
//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={onClose}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <>
//                     <span className="spinner-border spinner-border-sm me-2" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>{isEditing ? 'Update' : 'Create'} Lesson</>
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LessonFormModal;





// // v2
// // src/components/modals/LessonFormModal.tsx
// import type { Module, Lesson, LessonCreate, LessonUpdate } from '@/types/course';
// import { useState, useEffect } from 'react';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: LessonCreate | LessonUpdate) => Promise<void>;
//   module: Module;
//   lesson?: Lesson | null;
//   isEditing?: boolean;
// }

// type LessonFormState = {
//   title: string;
//   order: number;
//   description: string;
//   date: string;
//   status: 'completed' | 'ongoing' | 'upcoming' | 'cancelled';
// };


// export const LessonFormModal = ({
//   isOpen,
//   onClose,
//   onSave,
//   module,
//   lesson = null,
//   isEditing = false,
// }: Props) => {

//   const [formData, setFormData] = useState<LessonFormState>({
//   title: '',
//   order: 1,
//   description: '',
//   date: '',
//   status: 'upcoming',
// });


//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [saving, setSaving] = useState(false);

//   /* -----------------------------------------
//      Populate form on edit / reset on open
//   ------------------------------------------ */
//   useEffect(() => {
//     if (isEditing && lesson) {
//       setFormData({
//         title: lesson.title,
//         order: lesson.order,
//         description: lesson.description ?? '',
//         date: lesson.date ?? '',
//         status: lesson.status,
//       });
//     } else {
//       setFormData({
//         title: '',
//         order: 1,
//         description: '',
//         date: '',
//         status: 'upcoming',
//       });
//     }
//     setErrors({});
//   }, [isEditing, lesson, isOpen]);

//   /* -----------------------------------------
//      Validation
//   ------------------------------------------ */
//   const validate = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'Lesson title is required';
//     } else if (formData.title.length < 3) {
//       newErrors.title = 'Lesson title must be at least 3 characters';
//     }

//     if (!Number.isInteger(formData.order) || formData.order < 1) {
//       newErrors.order = 'Lesson number must be a positive integer';
//     }

//     if (!formData.date) {
//       newErrors.date = 'Lesson date is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* -----------------------------------------
//      Submit
//   ------------------------------------------ */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setSaving(true);
//     try {
//       const payload = isEditing
//         ? ({
//             title: formData.title.trim(),
//             order: formData.order,
//             description: formData.description || undefined,
//             date: formData.date,
//           } satisfies LessonUpdate)
//         : ({
//             title: formData.title.trim(),
//             order: formData.order,
//             description: formData.description || undefined,
//             date: formData.date,
//             module_id: module.id,
//           } satisfies LessonCreate);

//       await onSave(payload);
//       onClose();
//     } catch (error) {
//       console.error('Failed to save lesson:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChange = <K extends keyof LessonFormState>(
//     field: K,
//     value: LessonFormState[K]
//   ) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (errors[field]) {
//       setErrors(prev => {
//         const copy = { ...prev };
//         delete copy[field];
//         return copy;
//       });
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//       <div className="modal-dialog modal-dialog-centered modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <div>
//               <h5 className="modal-title mb-1">
//                 {isEditing ? 'Edit Lesson' : 'Add New Lesson'}
//               </h5>
//               <small className="text-muted">Module: {module.title}</small>
//             </div>
//             <button className="btn-close" onClick={onClose} disabled={saving} />
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="modal-body">
//               {/* Lesson Title */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Lesson Title <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className={`form-control ${errors.title ? 'is-invalid' : ''}`}
//                   value={formData.title}
//                   onChange={e => handleChange('title', e.target.value)}
//                   placeholder="e.g., Introduction to Variables"
//                   disabled={saving}
//                 />
//                 {errors.title && <div className="invalid-feedback">{errors.title}</div>}
//               </div>

//               {/* Lesson Number */}
//               <div className="mb-3">
//                 <label className="form-label">
//                   Lesson Number <span className="text-danger">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   min={1}
//                   className={`form-control ${errors.order ? 'is-invalid' : ''}`}
//                   value={formData.order}
//                   onChange={e => handleChange('order', Number(e.target.value))}
//                   disabled={saving}
//                 />
//                 {errors.order && (
//                   <div className="invalid-feedback">{errors.order}</div>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="mb-3">
//                 <label className="form-label">Description</label>
//                 <textarea
//                   className="form-control"
//                   rows={3}
//                   value={formData.description}
//                   onChange={e => handleChange('description', e.target.value)}
//                   placeholder="What will students learn in this lesson?"
//                   disabled={saving}
//                 />
//               </div>
//               <div className="row">
//                 {/* Date */}
//                 <div className="mb-3 col-12 col-md-6">
//                   <label className="form-label">
//                     Lesson Date <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     className={`form-control ${errors.date ? 'is-invalid' : ''}`}
//                     value={formData.date}
//                     onChange={e => handleChange('date', e.target.value)}
//                     disabled={saving}
//                   />
//                   {errors.date && (
//                     <div className="invalid-feedback">{errors.date}</div>
//                   )}
//                 </div>

//                 {/* Status */}
//                 <div className="mb-3 col-12 col-md-6">
//                   <label className="form-label">Lesson Status</label>
//                   <select
//                     className="form-select form-select-lg w-100"
//                     value={formData.status}
//                     onChange={e => handleChange('status', e.target.value as LessonFormState['status'])}
//                     disabled={saving}
//                   >
//                     <option value="upcoming">Upcoming</option>
//                     <option value="ongoing">Ongoing</option>
//                     <option value="completed">Completed</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </div>
//               </div>

//             </div>

//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={onClose}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary" disabled={saving}>
//                 {saving ? 'Saving…' : isEditing ? 'Update Lesson' : 'Create Lesson'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LessonFormModal;




// v3
// import type { Module, Lesson, CreateLessonDTO, UpdateLessonDTO } from '@/types/course';
import type { CreateLessonDTO, UpdateLessonDTO, Lesson } from '@/types/course/lesson';
import type { Module } from '@/types/course/module';
import { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLessonDTO | UpdateLessonDTO) => Promise<void>;
  module: Module;
  lesson?: Lesson | null;
  isEditing?: boolean;
}

type LessonFormState = {
  title: string;
  order: number;
  description: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
};

const defaultFormState = (): LessonFormState => ({
  title: '',
  order: 1,
  description: '',
  date: '',
  status: 'upcoming',
});

export const LessonFormModal = ({
  isOpen,
  onClose,
  onSave,
  module,
  lesson = null,
  isEditing = false,
}: Props) => {
  const [formData, setFormData] = useState<LessonFormState>(defaultFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing && lesson) {
      setFormData({
        title: lesson.title,
        order: lesson.order,
        description: lesson.description ?? '',
        date: lesson.date ?? '',
        status: lesson.status ?? 'upcoming',
      });
    } else {
      setFormData(defaultFormState());
    }
    setErrors({});
  }, [isEditing, lesson, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Lesson title is required';
    else if (formData.title.length < 3) newErrors.title = 'Lesson title must be at least 3 characters';
    if (!Number.isInteger(formData.order) || formData.order < 1) newErrors.order = 'Lesson number must be a positive integer';
    if (!formData.date) newErrors.date = 'Lesson date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof LessonFormState>(field: K, value: LessonFormState[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const copy = { ...prev }; delete copy[field]; return copy; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload: CreateLessonDTO | UpdateLessonDTO = isEditing
        ? {
            title: formData.title.trim(),
            order: formData.order,
            description: formData.description || undefined,
            date: formData.date,
            status: formData.status,
          }
        : {
            module_id: module.id,
            title: formData.title.trim(),
            order: formData.order,
            description: formData.description || undefined,
            date: formData.date,
            status: formData.status,
          };

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error('Failed to save lesson:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h5 className="modal-title mb-1">{isEditing ? 'Edit Lesson' : 'Add New Lesson'}</h5>
              <small className="text-muted">Module: {module.title}</small>
            </div>
            <button className="btn-close" onClick={onClose} disabled={saving} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Lesson Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  value={formData.title}
                  onChange={e => handleChange('title', e.target.value)}
                  disabled={saving}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Lesson Number <span className="text-danger">*</span></label>
                <input
                  type="number"
                  min={1}
                  className={`form-control ${errors.order ? 'is-invalid' : ''}`}
                  value={formData.order}
                  onChange={e => handleChange('order', Number(e.target.value))}
                  disabled={saving}
                />
                {errors.order && <div className="invalid-feedback">{errors.order}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="row">
                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Lesson Date <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    value={formData.date}
                    onChange={e => handleChange('date', e.target.value)}
                    disabled={saving}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>

                <div className="mb-3 col-12 col-md-6">
                  <label className="form-label">Lesson Status</label>
                  <select
                    className="form-select form-select-lg w-100"
                    value={formData.status}
                    onChange={e => handleChange('status', e.target.value as LessonFormState['status'])}
                    disabled={saving}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : isEditing ? 'Update Lesson' : 'Create Lesson'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LessonFormModal;
