// @ts-nocheck
/* eslint-env jest */
import { isoToLocalDatetimeInput, localDatetimeInputToIso } from '../date';

describe('date utils', () => {
  test('roundtrip iso -> local input -> iso preserves instant', () => {
    const iso = '2025-12-01T00:00:00Z';
    const localInput = isoToLocalDatetimeInput(iso);
    const iso2 = localDatetimeInputToIso(localInput);
    expect(iso2).toEqual(new Date(iso).toISOString());
  });

  test('local input to iso creates a valid ISO string', () => {
    const local = '2030-07-10T14:30';
    const iso = localDatetimeInputToIso(local);
    const parsed = new Date(iso);
    expect(parsed.getFullYear()).toBe(2030);
    expect(parsed.getHours()).toBeGreaterThanOrEqual(0); // sanity check
  });

  test('validateDateRange returns invalid when from > to', () => {
    const { validateDateRange } = require('../date');
    const r = validateDateRange('2025-12-02', '2025-12-01');
    expect(r.valid).toBeFalsy();
    expect(r.error).toBeTruthy();
  });

  test('validateDateRange is valid when one side missing', () => {
    const { validateDateRange } = require('../date');
    expect(validateDateRange(undefined, '2025-12-01').valid).toBeTruthy();
    expect(validateDateRange('2025-12-01', undefined).valid).toBeTruthy();
  });
});
