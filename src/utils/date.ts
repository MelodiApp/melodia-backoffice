// Utilities to convert between ISO UTC timestamps and the HTML datetime-local input value
// datetime-local expects a value like "YYYY-MM-DDTHH:mm" in local time (no timezone suffix)

const pad = (n: number) => (n < 10 ? `0${n}` : String(n));

export function isoToLocalDatetimeInput(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function localDatetimeInputToIso(local: string): string {
  if (!local) return '';
  // local expected format: YYYY-MM-DDTHH:mm (possibly with seconds but we only handle minutes)
  const [datePart, timePart] = local.split('T');
  if (!datePart || !timePart) return '';
  const [y, m, d] = datePart.split('-').map((s) => parseInt(s, 10));
  const [hh, mm] = timePart.split(':').map((s) => parseInt(s, 10));
  // Construct a Date in local timezone
  const dt = new Date(y, m - 1, d, hh, mm || 0, 0, 0);
  return dt.toISOString();
}

export function localNowDatetimeInput(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

/**
 * Validate a date range given as YYYY-MM-DD strings.
 * Rules:
 *  - If both from and to are present, from must be <= to
 *  - If one or both are missing, it's considered valid
 */
export function validateDateRange(from?: string, to?: string): { valid: boolean; error?: string } {
  if (!from || !to) return { valid: true };
  // simple lexicographic compare works for YYYY-MM-DD
  if (from > to) {
    return { valid: false, error: 'La fecha "Desde" no puede ser posterior a la fecha "Hasta"' };
  }
  return { valid: true };
}
