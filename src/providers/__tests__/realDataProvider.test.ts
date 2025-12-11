// @ts-nocheck
/* eslint-env jest */
import { realDataProvider } from '../realDataProvider';

describe('realDataProvider update rules', () => {
  test('rejects updating publishDate when item is already scheduled and date changes', async () => {
    const params = {
      id: '5',
      data: { publishDate: '2025-12-05T00:00:00Z' },
      previousData: { status: 'scheduled', publishDate: '2025-12-01T00:00:00Z' },
    } as any;

    await expect(realDataProvider.update('songs', params)).rejects.toThrow(
      /No es posible reprogramar una publicación ya programada/i
    );
  });

  test('allows update when publishDate is the same', async () => {
    const params = {
      id: '5',
      data: { publishDate: '2025-12-01T00:00:00Z' },
      previousData: { status: 'scheduled', publishDate: '2025-12-01T00:00:00Z' },
    } as any;

    // We expect it to attempt to call the catalogService, which would normally hit network.
    // For the purpose of this test we only care that it doesn't throw the re-schedule error.
    await expect(realDataProvider.update('songs', params)).resolves.toBeDefined();
  });
});
