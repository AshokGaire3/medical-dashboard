// API Configuration
// Ensure HTTP is used for localhost:5000 (not HTTPS)
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Auto-fix common mistake: HTTPS on port 5000 should be HTTP
if (API_BASE_URL.startsWith('https://localhost:5000')) {
  API_BASE_URL = API_BASE_URL.replace('https://', 'http://');
  console.warn('API URL was using HTTPS on port 5000. Changed to HTTP:', API_BASE_URL);
}

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// Helper function to create fetch with better error handling
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(response);
  } catch (error) {
    // Handle SSL/TLS protocol errors (ERR_SSL_PROTOCOL_ERROR from browser)
    // Check error message, name, or stack for SSL-related errors
    const errorStr = String(error).toLowerCase();
    const errorName = (error as any)?.name?.toLowerCase() || '';
    const errorMessage = (error instanceof Error ? error.message : String(error)).toLowerCase();
    
    if (errorStr.includes('ssl') || errorStr.includes('tls') || errorStr.includes('protocol') ||
        errorName.includes('ssl') || errorName.includes('tls') ||
        errorMessage.includes('ssl') || errorMessage.includes('tls') ||
        url.startsWith('https://localhost:5000')) {
      const httpUrl = url.replace('https://', 'http://');
      throw new Error(`SSL Protocol Error: The API URL is using HTTPS but the server is running on HTTP. Use: ${httpUrl}`);
    }
    
    // Handle network errors (connection refused, CORS, etc.)
    if (error instanceof TypeError) {
      const msg = errorMessage;
      if (msg.includes('failed to fetch') || msg.includes('networkerror')) {
        // Check if URL is HTTPS but should be HTTP
        if (url.startsWith('https://localhost:5000')) {
          const httpUrl = url.replace('https://', 'http://');
          throw new Error(`Cannot connect to API. The URL is using HTTPS (${url}) but should be HTTP. Use: ${httpUrl}`);
        }
        throw new Error(`Cannot connect to API at ${url}. Make sure the backend is running and accessible.`);
      }
      if (msg.includes('cors')) {
        throw new Error(`CORS error: The backend is not allowing requests from this origin. Check CORS configuration in the backend.`);
      }
    }
    // Re-throw other errors
    throw error;
  }
}

export { handleResponse };

