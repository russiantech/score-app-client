export const formatDate = (date: string | Date, includeTime = false): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return d.toLocaleDateString('en-US', options);
};


export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

// export const formatRelativeTime = (timestamp: string): string => {
//   const now = new Date();
//   const date = new Date(timestamp);
//   const diff = now.getTime() - date.getTime();
  
//   const seconds = Math.floor(diff / 1000);
//   const minutes = Math.floor(seconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
  
//   if (days > 7) {
//     return formatDate(timestamp);
//   } else if (days > 0) {
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   } else if (hours > 0) {
//     return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//   } else if (minutes > 0) {
//     return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//   } else {
//     return 'Just now';
//   }
// };

export const formatDateTime = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};


