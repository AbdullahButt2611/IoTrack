/**
 * Build query parameters string from an object
 */
function buildQueryParams(params) {
  if (!params || Object.keys(params).length === 0) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Simple API request function for Django REST Framework
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {object} options - { method, data, params, headers }
 * @returns {Promise<any>} - Resolves to response data
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    data,
    params,
    headers = {},
  } = options;

  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  let url = `${baseUrl}${cleanEndpoint}`;

  // Add query parameters for GET requests
  if (method === 'GET' && params) {
    url += buildQueryParams(params);
  }

  const fetchOptions = {
    method,
    headers: { ...headers },
  };

  // Handle request body and content type
  if (method !== 'GET' && data) {
    if (data instanceof FormData) {
      fetchOptions.body = data;
      // Don't set Content-Type for FormData
    } else {
      fetchOptions.body = JSON.stringify(data);
      fetchOptions.headers['Content-Type'] = 'application/json';
    }
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Use default error message if parsing fails
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
}