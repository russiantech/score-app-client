import type { UserAvatarProps } from "@/types/users";
import { getInitials } from "@/utils/helpers";

export const UserAvatar: React.FC<UserAvatarProps> = ({
  names: name,
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
