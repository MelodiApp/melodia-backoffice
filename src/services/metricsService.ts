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

  async getUsersList(type: 'total'|'active'|'new', from?: string, to?: string, skip?: number, limit?: number) {
    const params: any = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (skip !== undefined) params.skip = skip;
    if (limit !== undefined) params.limit = limit;
    if (type === 'total') return this.get('/metrics/users/list/total', { params });
    if (type === 'active') return this.get('/metrics/users/list/active', { params });
    return this.get('/metrics/users/list/new', { params });
  }
}

export const metricsService = new MetricsService();
