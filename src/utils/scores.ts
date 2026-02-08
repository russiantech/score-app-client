export function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'info';
  if (grade.startsWith('D')) return 'warning';
  return 'danger';
}
