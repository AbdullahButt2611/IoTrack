import { apiRequest } from '../utils/apiRequest';

export function getDevices() {
  return apiRequest('devices/', { method: 'GET' });
}