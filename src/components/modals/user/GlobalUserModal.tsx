// // ============================================================================
// // COMPONENT: GlobalUserModal.tsx
// // Wrapper that connects to context
// // ============================================================================

// import { useUserModal } from "@/context/UserModalContext";
// import { UserModal } from "./UserModal";

// export const GlobalUserModal: React.FC = () => {
//   const { isOpen, editingUser, defaultRole, closeModal, triggerRefresh } = useUserModal();

//   return (
//     // <UserModal
//     //   isOpen={isOpen}
//     //   editingUser={editingUser}
//     //   defaultRole={defaultRole}
//     //   onClose={closeModal}
//     //   onSuccess={triggerRefresh}
//     // />

//     // v2 usage
//     // <UserModal
//     //     isOpen={isOpen}
//     //     editingUser={null}
//     //     defaultRole="student"  // Will start with student selected
//     //     onClose={() => setShowModal(false)}
//     //     onSuccess={() => {
//     //       console.log('User created!');
//     //       setShowModal(false);
//     //     }}
//     //     currentUser={currentUser}
//     //   />

//     // v3
//     <UserModal
//         isOpen={isOpen}
//         editingUser={editingUser}
//         defaultRole={defaultRole}  // Will start with student selected
//         onClose={closeModal}
//         onSuccess={triggerRefresh}
//         currentUser={currentUser}
//       />
//   );
// };



// // v2
// import { useUserModal } from '@/context/UserModalContext';
// // import { useAuth } from '@/context/AuthContext'; // or wherever auth lives
// import { UserModal } from './UserModal';
// import { useAuth } from '@/hooks/useAuth';

// export const GlobalUserModal: React.FC = () => {
//   const {
//     isOpen,
//     editingUser,
//     defaultRole,
//     closeModal,
//     triggerRefresh,
//   } = useUserModal();

//   const { currentUser } = useAuth(); // ✅ NOW DEFINED

//   return (
//     <UserModal
//       isOpen={isOpen}
//       editingUser={editingUser}
//       defaultRole={defaultRole}
//       onClose={closeModal}
//       onSuccess={triggerRefresh}
//       currentUser={currentUser}   // ✅ SAFE
//     />
//   );
// };


// v3
// GlobalUserModal.tsx
import { useUserModal } from '@/context/UserModalContext';
import { useAuth } from '@/hooks/useAuth';
import { UserModal } from './UserModal';

export const GlobalUserModal: React.FC = () => {
  const { isOpen, editingUser, defaultRole, closeModal, triggerRefresh } =
    useUserModal();

  const { auth } = useAuth();

  return (
    <UserModal
      isOpen={isOpen}
      editingUser={editingUser}
      defaultRole={defaultRole}
      onClose={closeModal}
      onSuccess={triggerRefresh}
      currentUser={auth?.user} // ✅ correct source
    />
  );
};
