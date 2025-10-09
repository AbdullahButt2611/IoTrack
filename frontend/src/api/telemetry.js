import { apiRequest } from '../utils/apiRequest';

export function getTelemetry(deviceId, limit = 50) {
  return apiRequest('telemetry/', {
    method: 'GET',
    params: { deviceId, limit }
  });
}