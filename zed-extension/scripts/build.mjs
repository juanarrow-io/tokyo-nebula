export function normalizeHex(value) {
  if (value == null) return null;
  const v = String(value).trim();
  if (v === '') return null;
  if (!v.startsWith('#')) return null;
  const hex = v.slice(1).toLowerCase();
  if (hex.length === 3) {
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 4) {
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 6 || hex.length === 8) {
    return '#' + hex;
  }
  return null;
}
