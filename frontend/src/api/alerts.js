import { apiRequest } from '../utils/apiRequest';

export function getAlerts() {
  return apiRequest('alerts/', { method: 'GET' });
}