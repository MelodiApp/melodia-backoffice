// @ts-nocheck
/* eslint-env jest */
import { isTransitionAllowed, validateTransition } from '../catalogStates';

describe('catalog state transitions', () => {
  test('scheduled can transition to published and blocked but not to scheduled', () => {
    expect(isTransitionAllowed('scheduled', 'published')).toBeTruthy();
    expect(isTransitionAllowed('scheduled', 'blocked')).toBeTruthy();
    expect(isTransitionAllowed('scheduled', 'scheduled')).toBeFalsy();
  });

  test('validateTransition rejects scheduled->scheduled', () => {
    const v = validateTransition('scheduled', 'scheduled', {});
    expect(v.valid).toBeFalsy();
  });

  test('validateTransition allows blocked->scheduled when given a future local datetime input', () => {
    // local datetime-local format (no timezone suffix), validateTransition will parse it
    const futureLocal = '2030-01-01T12:00';
    const v = validateTransition('blocked', 'scheduled', { scheduledDate: futureLocal });
    expect(v.valid).toBeTruthy();
  });

  test('validateTransition rejects blocked->scheduled when given a past local datetime input', () => {
    const pastLocal = '2000-01-01T12:00';
    const v = validateTransition('blocked', 'scheduled', { scheduledDate: pastLocal });
    expect(v.valid).toBeFalsy();
  });
});
