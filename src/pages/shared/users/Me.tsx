// // src/pages/profile/Me.tsx

// import { useRef, useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { UserService } from "@/services/users/UserService";
// import toast from "react-hot-toast";

// interface ProfileFormData {
//   names: string;
//   phone: string;
//   address: string;
//   profile_picture?: string;
// }

// const Me: React.FC = () => {
//   const { auth, updateUser } = useAuth();
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [editing, setEditing] = useState(false);
//   const [saving, setSaving] = useState(false);

//   // Holds a pending avatar File before save — keeps upload deferred until Save
//   const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);

//   const getInitialData = (): ProfileFormData => ({
//     names: auth?.user?.names || "",
//     phone: auth?.user?.phone || "",
//     address: auth?.user?.address || "",
//     profile_picture: auth?.user?.profile_picture,
//   });

//   const [formData, setFormData] = useState(getInitialData());

//   const handleChange = (field: keyof ProfileFormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAvatarClick = () => {
//     if (!editing) return;
//     fileRef.current?.click();
//   };

//   // Preview locally; defer actual upload until Save
//   const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setPendingAvatar(file);

//     // Show local preview immediately
//     const localUrl = URL.createObjectURL(file);
//     setFormData((prev) => ({ ...prev, profile_picture: localUrl }));
//   };

//   const handleEdit = () => {
//     setFormData(getInitialData());
//     setPendingAvatar(null);
//     setEditing(true);
//   };

//   const handleCancel = () => {
//     setFormData(getInitialData());
//     setPendingAvatar(null);
//     setEditing(false);
//   };

//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       const { profile_picture, ...rest } = formData;
//       let updated: Awaited<ReturnType<typeof UserService.update_partial>>;

//       if (pendingAvatar) {
//         // Upload avatar + patch profile in one call
//         updated = await UserService.updateWithAvatar(
//           auth!.user.id,
//           rest,
//           pendingAvatar
//         );
//       } else {
//         // No new avatar — patch only changed fields
//         updated = await UserService.update_partial(auth!.user.id, {
//           ...rest,
//           profile_picture,
//         });
//       }

//       await updateUser(updated);
//       setPendingAvatar(null);
//       toast.success("Profile updated");
//       setEditing(false);
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="profile-area">

//       {/* PROFILE HEADER */}
//       <div className="author-bx d-flex align-items-center gap-3 mb-4">

//         <div
//           className={`position-relative ${editing ? "cursor-pointer" : ""}`}
//           onClick={handleAvatarClick}
//         >
//           <img
//             src={formData.profile_picture || "/assets/images/avatar/avatar.png"}
//             alt="profile"
//             className="rounded-circle"
//             style={{ width: 70, height: 70, objectFit: "cover" }}
//           />

//           {editing && (
//             <span
//               className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
//               style={{ width: 24, height: 24, fontSize: 12, zIndex: 999 }}
//             >
//               <i className="fa fa-camera"></i>
//             </span>
//           )}

//           <input
//             type="file"
//             ref={fileRef}
//             hidden
//             accept="image/*"
//             onChange={handleAvatarChange}
//           />
//         </div>

//         <div className="dz-content flex-grow-1">
//           {editing ? (
//             <input
//               type="text"
//               className="form-control form-control-sm mb-1"
//               value={formData.names}
//               onChange={(e) => handleChange("names", e.target.value)}
//             />
//           ) : (
//             <h5 className="mb-0">{auth?.user?.names}</h5>
//           )}

//           <small className="text-primary">@{auth?.user?.username}</small>
//         </div>
//       </div>

//       {/* PROFILE DETAILS */}
//       <div className="card border-0 shadow-sm p-3 mb-3">

//         {/* PHONE */}
//         <div className="d-flex align-items-start gap-3 mb-3">
//           <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 40, height: 40 }}>
//             <i className="fa fa-phone text-primary"></i>
//           </div>
//           <div className="flex-grow-1">
//             <small className="text-muted">Phone</small>
//             {editing ? (
//               <input
//                 type="tel"
//                 className="form-control form-control-sm"
//                 value={formData.phone}
//                 onChange={(e) => handleChange("phone", e.target.value)}
//               />
//             ) : (
//               <div>{auth?.user?.phone || "N/A"}</div>
//             )}
//           </div>
//         </div>

//         {/* EMAIL */}
//         <div className="d-flex align-items-start gap-3 mb-3">
//           <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 40, height: 40 }}>
//             <i className="fa fa-envelope text-primary"></i>
//           </div>
//           <div className="flex-grow-1">
//             <small className="text-muted">Email</small>
//             <div>{auth?.user?.email}</div>
//           </div>
//         </div>

//         {/* ADDRESS */}
//         <div className="d-flex align-items-start gap-3">
//           <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ width: 40, height: 40 }}>
//             <i className="fa fa-map-marker text-primary"></i>
//           </div>
//           <div className="flex-grow-1">
//             <small className="text-muted">Address</small>
//             {editing ? (
//               <textarea
//                 className="form-control form-control-sm"
//                 rows={2}
//                 value={formData.address}
//                 onChange={(e) => handleChange("address", e.target.value)}
//               />
//             ) : (
//               <div>{auth?.user?.address || "N/A"}</div>
//             )}
//           </div>
//         </div>

//       </div>

//       {/* ACTION BUTTONS */}
//       <div className="d-flex gap-2">
//         {!editing ? (
//           <button className="btn btn-primary btn-sm" onClick={handleEdit}>
//             <i className="fa fa-edit me-1"></i>Edit
//           </button>
//         ) : (
//           <>
//             <button
//               className="btn btn-outline-secondary btn-sm"
//               onClick={handleCancel}
//               disabled={saving}
//             >
//               Cancel
//             </button>

//             <button
//               className="btn btn-primary btn-sm"
//               onClick={handleSave}
//               disabled={saving}
//             >
//               {saving ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-1"></span>
//                   Saving
//                 </>
//               ) : (
//                 <>
//                   <i className="fa fa-check me-1"></i>Save
//                 </>
//               )}
//             </button>
//           </>
//         )}
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

  const [editing, setEditing]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState<File | null>(null);

  const getInitialData = (): ProfileFormData => ({
    names:           auth?.user?.names           || "",
    phone:           auth?.user?.phone           || "",
    address:         auth?.user?.address         || "",
    profile_picture: auth?.user?.profile_picture || "",
  });

  const [formData, setFormData] = useState<ProfileFormData>(getInitialData);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarClick = () => {
    if (editing) fileRef.current?.click();
  };

  // Show instant local preview; defer actual upload until Save
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingAvatar(file);
    setFormData((prev) => ({
      ...prev,
      profile_picture: URL.createObjectURL(file),
    }));
  };

  const handleEdit = () => {
    setFormData(getInitialData());
    setPendingAvatar(null);
    setEditing(true);
  };

  const handleCancel = () => {
    // Revoke any pending object URL to avoid memory leaks
    if (pendingAvatar && formData.profile_picture?.startsWith("blob:")) {
      URL.revokeObjectURL(formData.profile_picture);
    }
    setFormData(getInitialData());
    setPendingAvatar(null);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!auth?.user?.id) return;

    try {
      setSaving(true);

      let updated = await UserService.update_partial(auth.user.id, {
        names:   formData.names,
        phone:   formData.phone,
        address: formData.address,
      });

      // Avatar is a separate PATCH /users/:id/avatar (multipart)
      // Do it after the text update; backend returns the full user either way
      if (pendingAvatar) {
        updated = await UserService.uploadAvatar(auth.user.id, pendingAvatar);

        // Revoke the temporary blob URL now that we have the real URL
        if (formData.profile_picture?.startsWith("blob:")) {
          URL.revokeObjectURL(formData.profile_picture);
        }
      }

      // Sync the full updated user back into auth context → triggers re-render everywhere
      await updateUser(updated);

      // Keep formData in sync with the server response (real URL, not blob)
      setFormData({
        names:           updated.names           || "",
        phone:           updated.phone           || "",
        address:         updated.address         || "",
        profile_picture: updated.profile_picture || "",
      });

      setPendingAvatar(null);
      toast.success("Profile updated");
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  // Use formData.profile_picture (may be blob: preview or real URL)
  // Fall back to the live auth value, then the default avatar
  const avatarSrc =
    formData.profile_picture ||
    auth?.user?.profile_picture ||
    "/assets/images/avatar/avatar.png";

  return (
    <div className="profile-area">

      {/* PROFILE HEADER */}
      <div className="author-bx d-flex align-items-center gap-3 mb-4">

        <div
          className={`position-relative ${editing ? "cursor-pointer" : ""}`}
          onClick={handleAvatarClick}
          title={editing ? "Change profile picture" : undefined}
        >
          <img
            src={avatarSrc}
            alt="profile"
            className="rounded-circle"
            style={{ width: 70, height: 70, objectFit: "cover" }}
          />

          {editing && (
            <span
              className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 24, height: 24, fontSize: 12, zIndex: 999 }}
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
              onChange={(e) => handleChange("names", e.target.value)}
              placeholder="Full name"
            />
          ) : (
            <h5 className="mb-0">{auth?.user?.names || "—"}</h5>
          )}

          <small className="text-primary">@{auth?.user?.username}</small>
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
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            ) : (
              <div>{auth?.user?.phone || "N/A"}</div>
            )}
          </div>
        </div>

        {/* EMAIL (read-only) */}
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
                onChange={(e) => handleChange("address", e.target.value)}
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
          <button className="btn btn-primary btn-sm" onClick={handleEdit}>
            <i className="fa fa-edit me-1"></i>Edit
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
                  Saving...
                </>
              ) : (
                <>
                  <i className="fa fa-check me-1"></i>Save
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
