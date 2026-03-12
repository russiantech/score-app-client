// // src/pages/profile/Me.tsx
// import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { UserService } from '@/services/users/UserService';
// import toast from 'react-hot-toast';

// interface ProfileFormData {
//   names: string;
//   phone: string;
//   address: string;
// }

// const Me: React.FC = () => {
//   const { auth, updateUser } = useAuth();
//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [formData, setFormData] = useState<ProfileFormData>({
//     names: auth?.user?.names || '',
//     phone: auth?.user?.phone || '',
//     address: auth?.user?.address || '',
//   });

//   const handleEdit = () => {
//     setEditing(true);
//     setFormData({
//       names: auth?.user?.names || '',
//       phone: auth?.user?.phone || '',
//       address: auth?.user?.address || '',
//     });
//   };

//   const handleCancel = () => {
//     setEditing(false);
//     setFormData({
//       names: auth?.user?.names || '',
//       phone: auth?.user?.phone || '',
//       address: auth?.user?.address || '',
//     });
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       // Update via UserService
//       const updated = await UserService.update(auth!.user.id, formData);
      
//       // Update auth context
//       await updateUser(updated);

//       toast.success('Profile updated successfully!');
//       setEditing(false);
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleChange = (field: keyof ProfileFormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   return (
//     <div className="profile-area">
//       {/* Profile Header */}
//       <div className="author-bx">
//         <div className="dz-media">
//           <img 
//             src={auth?.user?.profile_picture || "/assets/images/avatar/avatar.png"} 
//             alt={auth?.user?.names} 
//           />
//           <span className="user-role-badge-profile">
//             {auth?.user?.roles?.[0]?.toUpperCase()}
//           </span>
//         </div>
//         <div className="dz-content">
//           <h4 className="name">{auth?.user?.names}</h4>
//           <p className="text-primary">{auth?.user?.username}</p>
//         </div>
//       </div>

//       {/* Edit/Save Buttons */}
//       <div className="mb-3">
//         {!editing ? (
//           <button 
//             className="btn btn-primary btn-sm w-100"
//             onClick={handleEdit}
//           >
//             <i className="fa fa-edit me-2"></i>
//             Edit Profile
//           </button>
//         ) : (
//           <div className="d-flex gap-2">
//             <button 
//               className="btn btn-outline-secondary btn-sm flex-fill"
//               onClick={handleCancel}
//               disabled={saving}
//             >
//               <i className="fa fa-times me-2"></i>
//               Cancel
//             </button>
//             <button 
//               className="btn btn-primary btn-sm flex-fill"
//               onClick={handleSave}
//               disabled={saving}
//             >
//               {saving ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2"></span>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <i className="fa fa-check me-2"></i>
//                   Save
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Profile Information */}
//       <div className="widget_getintuch pb-15">
//         <ul>
//           {/* Full Name */}
//           <li>
//             <div className="icon-bx">
//               <i className="fa fa-user text-primary fa-lg"></i>
//             </div>
//             <div className="dz-content">
//               <p className="sub-title">Full Name</p>
//               {editing ? (
//                 <input
//                   type="text"
//                   className="form-control form-control-sm"
//                   value={formData.names}
//                   onChange={(e) => handleChange('names', e.target.value)}
//                   placeholder="Enter your full name"
//                 />
//               ) : (
//                 <h6 className="title">{auth?.user?.names || 'N/A'}</h6>
//               )}
//             </div>
//           </li>

//           {/* Mobile Phone */}
//           <li>
//             <div className="icon-bx">
//               <svg className="svg-primary" enableBackground="new 0 0 507.983 507.983" height="24" viewBox="0 0 507.983 507.983" width="24">
//                 <path d="m200.75 148.678c11.79-27.061 5.828-58.58-15.03-79.466l-48.16-48.137c-15.999-16.19-38.808-23.698-61.296-20.178-22.742 3.34-42.496 17.4-53.101 37.794-23.286 43.823-29.276 94.79-16.784 142.817 30.775 121.9 198.319 289.559 320.196 320.104 16.452 4.172 33.357 6.297 50.33 6.326 32.253-.021 64.009-7.948 92.487-23.087 35.138-18.325 48.768-61.665 30.443-96.803-3.364-6.451-7.689-12.352-12.828-17.502l-48.137-48.16c-20.894-20.862-52.421-26.823-79.489-15.03-12.631 5.444-24.152 13.169-33.984 22.787-11.774 11.844-55.201-5.31-98.675-48.76s-60.581-86.877-48.876-98.698c9.658-9.834 17.422-21.361 22.904-34.007zm-6.741 165.397c52.939 52.893 124.14 88.562 163.919 48.76 5.859-5.609 12.688-10.108 20.155-13.275 9.59-4.087 20.703-1.9 28.028 5.518l48.137 48.137c5.736 5.672 8.398 13.754 7.157 21.725-1.207 8.191-6.286 15.298-13.645 19.093-33.711 18.115-73.058 22.705-110.033 12.836-104.724-26.412-260.078-181.765-286.489-286.627-9.858-37.009-5.26-76.383 12.86-110.126 3.823-7.318 10.924-12.358 19.093-13.552 1.275-.203 2.564-.304 3.856-.3 6.714-.002 13.149 2.683 17.869 7.457l48.137 48.137c7.407 7.321 9.595 18.421 5.518 28.005-3.153 7.516-7.652 14.394-13.275 20.294-39.804 39.686-4.18 110.817 48.713 163.918z"></path>
//               </svg>
//             </div>
//             <div className="dz-content">
//               <p className="sub-title">Mobile Phone</p>
//               {editing ? (
//                 <input
//                   type="tel"
//                   className="form-control form-control-sm"
//                   value={formData.phone}
//                   onChange={(e) => handleChange('phone', e.target.value)}
//                   placeholder="Enter your phone number"
//                 />
//               ) : (
//                 <h6 className="title">{auth?.user?.phone || 'N/A'}</h6>
//               )}
//             </div>
//           </li>

//           {/* Email Address (Read-only) */}
//           <li>
//             <div className="icon-bx">
//               <svg className="svg-primary" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <path d="M22 3H2C1.73478 3 1.48043 3.10536 1.29289 3.29289C1.10536 3.48043 1 3.73478 1 4V20C1 20.2652 1.10536 20.5196 1.29289 20.7071C1.48043 20.8946 1.73478 21 2 21H22C22.2652 21 22.5196 20.8946 22.7071 20.7071C22.8946 20.5196 23 20.2652 23 20V4C23 3.73478 22.8946 3.48043 22.7071 3.29289C22.5196 3.10536 22.2652 3 22 3ZM21 19H3V9.477L11.628 12.929C11.867 13.0237 12.133 13.0237 12.372 12.929L21 9.477V19ZM21 7.323L12 10.923L3 7.323V5H21V7.323Z" fill="#4A3749"></path>
//               </svg>
//             </div>
//             <div className="dz-content">
//               <p className="sub-title">Email Address</p>
//               <h6 className="title">{auth?.user?.email}</h6>
//               {editing && (
//                 <small className="text-muted">Email cannot be changed</small>
//               )}
//             </div>
//           </li>

//           {/* Address */}
//           <li>
//             <div className="icon-bx">
//               <svg className="svg-primary" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                 <path d="M11.9993 5.48404C9.59314 5.48404 7.64258 7.4346 7.64258 9.84075C7.64258 12.2469 9.59314 14.1975 11.9993 14.1975C14.4054 14.1975 16.356 12.2469 16.356 9.84075C16.356 7.4346 14.4054 5.48404 11.9993 5.48404ZM11.9993 12.0191C10.7962 12.0191 9.82096 11.0438 9.82096 9.84075C9.82096 8.6377 10.7962 7.66242 11.9993 7.66242C13.2023 7.66242 14.1776 8.6377 14.1776 9.84075C14.1776 11.0438 13.2023 12.0191 11.9993 12.0191Z" fill="#4A3749"></path>
//                 <path d="M21.793 9.81896C21.8074 4.41054 17.4348 0.0144869 12.0264 5.09008e-05C6.61797 -0.0143851 2.22191 4.35827 2.20748 9.76664C2.16044 15.938 5.85106 21.5248 11.546 23.903C11.6884 23.9674 11.8429 24.0005 11.9991 24C12.1565 24.0002 12.3121 23.9668 12.4555 23.9019C18.1324 21.5313 21.8191 15.9709 21.793 9.81896ZM11.9992 21.7127C7.30495 19.646 4.30485 14.9691 4.38364 9.84071C4.38364 5.63477 7.79323 2.22518 11.9992 2.22518C16.2051 2.22518 19.6147 5.63477 19.6147 9.84071V9.91152C19.6686 15.0154 16.672 19.6591 11.9992 21.7127Z" fill="#4A3749"></path>
//               </svg>
//             </div>
//             <div className="dz-content">
//               <p className="sub-title">Address</p>
//               {editing ? (
//                 <textarea
//                   className="form-control form-control-sm"
//                   rows={2}
//                   value={formData.address}
//                   onChange={(e) => handleChange('address', e.target.value)}
//                   placeholder="Enter your address"
//                 />
//               ) : (
//                 <h6 className="title">{auth?.user?.address || 'N/A'}</h6>
//               )}
//             </div>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Me;



// v2
// src/pages/profile/Me.tsx

import { useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserService } from "@/services/users/UserService";
import toast from "react-hot-toast";

interface ProfileFormData {
  names: string;
  phone: string;
  address: string;
  profile_picture?: string;
}

const Me: React.FC = () => {
  const { auth, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const getInitialData = (): ProfileFormData => ({
    names: auth?.user?.names || "",
    phone: auth?.user?.phone || "",
    address: auth?.user?.address || "",
    profile_picture: auth?.user?.profile_picture,
  });

  const [formData, setFormData] = useState(getInitialData());

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (!editing) return;
    fileRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await UserService.uploadAvatar(file);
      setFormData((prev) => ({
        ...prev,
        profile_picture: uploaded.url,
      }));
    } catch {
      toast.error("Failed to upload avatar");
    }
  };

  const handleEdit = () => {
    setFormData(getInitialData());
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(getInitialData());
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // const updated = await UserService.update(auth!.user.id, formData);
      const updated = await UserService.update_partial(auth!.user.id, formData);

      await updateUser(updated);

      toast.success("Profile updated");
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-area">

      {/* PROFILE HEADER */}
      <div className="author-bx d-flex align-items-center gap-3 mb-4">

        <div
          className={`position-relative ${editing ? "cursor-pointer" : ""}`}
          onClick={handleAvatarClick}
        >
          <img
            src={
              formData.profile_picture ||
              "/assets/images/avatar/avatar.png"
            }
            alt="profile"
            className="rounded-circle"
            style={{
              width: 70,
              height: 70,
              objectFit: "cover",
            }}
          />

          {editing && (
            <span
              className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 24,
                height: 24,
                fontSize: 12,
                zIndex: 999,
              }}
            >
              <i className="fa fa-camera"></i>
            </span>
          )}

          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        

        <div className="dz-content flex-grow-1">

          {editing ? (
            <input
              type="text"
              className="form-control form-control-sm mb-1"
              value={formData.names}
              onChange={(e) =>
                handleChange("names", e.target.value)
              }
            />
          ) : (
            <h5 className="mb-0">{auth?.user?.names}</h5>
          )}

          <small className="text-primary">
            @{auth?.user?.username}
          </small>
        </div>
      </div>

      {/* PROFILE DETAILS */}
      <div className="card border-0 shadow-sm p-3 mb-3">

        {/* PHONE */}
        <div className="d-flex align-items-start gap-3 mb-3">

          <div
            className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{ width: 40, height: 40 }}
          >
            <i className="fa fa-phone text-primary"></i>
          </div>

          <div className="flex-grow-1">
            <small className="text-muted">Phone</small>

            {editing ? (
              <input
                type="tel"
                className="form-control form-control-sm"
                value={formData.phone}
                onChange={(e) =>
                  handleChange("phone", e.target.value)
                }
              />
            ) : (
              <div>{auth?.user?.phone || "N/A"}</div>
            )}
          </div>
        </div>

        {/* EMAIL */}
        <div className="d-flex align-items-start gap-3 mb-3">

          <div
            className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{ width: 40, height: 40 }}
          >
            <i className="fa fa-envelope text-primary"></i>
          </div>

          <div className="flex-grow-1">
            <small className="text-muted">Email</small>
            <div>{auth?.user?.email}</div>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="d-flex align-items-start gap-3">

          <div
            className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{ width: 40, height: 40 }}
          >
            <i className="fa fa-map-marker text-primary"></i>
          </div>

          <div className="flex-grow-1">
            <small className="text-muted">Address</small>

            {editing ? (
              <textarea
                className="form-control form-control-sm"
                rows={2}
                value={formData.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
              />
            ) : (
              <div>{auth?.user?.address || "N/A"}</div>
            )}
          </div>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="d-flex gap-2">

        {!editing ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={handleEdit}
          >
            <i className="fa fa-edit me-1"></i>
            Edit
          </button>
        ) : (
          <>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1"></span>
                  Saving
                </>
              ) : (
                <>
                  <i className="fa fa-check me-1"></i>
                  Save
                </>
              )}
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Me;
