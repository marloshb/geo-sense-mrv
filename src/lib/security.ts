/**
 * HTML escape function to prevent XSS attacks
 * Converts special HTML characters to their entity equivalents
 */
export function escapeHtml(text: string | number | undefined | null): string {
  if (text === undefined || text === null) {
    return '';
  }
  
  const str = String(text);
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return str.replace(/[&<>"']/g, (m) => map[m]);
}
