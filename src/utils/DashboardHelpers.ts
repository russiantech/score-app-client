export const getRoleName = (user: any) => {
  const role = user?.role;
  if (!role) return 'User';
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export const getRoleColor = (user: any) => {
  switch (user?.role) {
    case 'admin': return 'bg-danger';
    case 'tutor': return 'bg-primary';
    case 'student': return 'bg-warning';
    case 'parent': return 'bg-success';
    default: return 'bg-secondary';
  }
};

export function formatRole(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

// export function getPrimaryRole(roles: string[]): string {
//   return roles[0] ?? 'user';
// }

export function getPrimaryRole(roles?: string[]): string {
  if (!Array.isArray(roles) || roles.length === 0) {
    return 'user';
  }

  return roles[0];
}
