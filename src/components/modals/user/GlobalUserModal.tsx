// v2
// src/components/modals/user/GlobalUserModal.tsx
import { useUserModal } from '@/context/UserModalContext';
import { useAuth } from '@/hooks/useAuth';
import { UserModal } from './UserModal';

export const GlobalUserModal: React.FC = () => {
  const { isOpen, editingUser, defaultRole, closeModal, triggerRefresh } = useUserModal();
  const { auth } = useAuth();

  return (
    <UserModal
      isOpen={isOpen}
      editingUser={editingUser}
      defaultRole={defaultRole ?? undefined} // Convert null to undefined
      onClose={closeModal}
      onSuccess={triggerRefresh}
      currentUser={auth?.user}
    />
  );
};
