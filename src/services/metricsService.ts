import { BaseApiService } from './apiClient';

class MetricsService extends BaseApiService {
  async getUsersOverview(from?: string, to?: string) {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    return this.get('/metrics/users/overview', { params });
  }

  async exportUsersCsv(from?: string, to?: string) {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    // Use axios direct client for blob
    const axios = (this as any).client; // BaseApiService client
    const resp = await axios.get('/metrics/users/export', { params, responseType: 'blob' });
    return resp;
  }

  async getUsersDetail(from: string, to: string) {
    const params: any = { from, to };
    return this.get('/metrics/users/detail', { params });
  }
}

export const metricsService = new MetricsService();
