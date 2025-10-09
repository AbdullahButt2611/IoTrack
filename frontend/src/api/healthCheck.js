import { apiRequest } from '../utils/apiRequest';

export function getHealth() {
  return apiRequest('health/', { method: 'GET' });
}