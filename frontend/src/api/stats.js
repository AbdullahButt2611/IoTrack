import { apiRequest } from '../utils/apiRequest';

export function getStatsAvg(deviceId, window = 10) {
  return apiRequest('stats/avg/', {
    method: 'GET',
    params: { deviceId, window }
  });
}