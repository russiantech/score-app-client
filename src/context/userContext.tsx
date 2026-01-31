// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useAuth } from './AuthContext';
// import { User, UserRole } from '../types';

// interface UserContextType {
//   user: User | null;
//   role: UserRole;
//   setRole: (role: UserRole) => void;
//   originalRole: UserRole | null;
//   isRoleSwitched: boolean;
//   restoreOriginalRole: () => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within UserProvider');
//   }
//   return context;
// };

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const { user: authUser } = useAuth();
//   const [currentRole, setCurrentRole] = useState<UserRole>('student');
//   const [originalRole, setOriginalRole] = useState<UserRole | null>(null);
//   const [isRoleSwitched, setIsRoleSwitched] = useState(false);

//   useEffect(() => {
//     if (authUser) {
//       setOriginalRole(authUser.role);
//       setCurrentRole(authUser.role);
//       setIsRoleSwitched(false);
//     } else {
//       setOriginalRole(null);
//       setCurrentRole('student');
//       setIsRoleSwitched(false);
//     }
//   }, [authUser]);

//   const switchRole = (newRole: UserRole) => {
//     if (authUser && authUser.role === 'admin') {
//       setCurrentRole(newRole);
//       setIsRoleSwitched(newRole !== authUser.role);
//     }
//   };

//   const restoreOriginalRole = () => {
//     if (authUser) {
//       setCurrentRole(authUser.role);
//       setIsRoleSwitched(false);
//     }
//   };

//   const user = authUser ? { ...authUser, role: currentRole } : null;

//   return (
//     <UserContext.Provider value={{
//       user,
//       role: currentRole,
//       setRole: switchRole,
//       originalRole,
//       isRoleSwitched,
//       restoreOriginalRole,
//     }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

