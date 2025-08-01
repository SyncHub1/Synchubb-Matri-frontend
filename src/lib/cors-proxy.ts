// CORS Proxy Utility for handling cross-origin requests
// This is a fallback solution when backend CORS is not properly configured

export class CorsProxy {
  private static instance: CorsProxy;
  private proxyUrl: string;

  constructor() {
    // Use a CORS proxy service as fallback
    this.proxyUrl = import.meta.env.VITE_CORS_PROXY_URL || 'https://cors-anywhere.herokuapp.com/';
  }

  static getInstance(): CorsProxy {
    if (!CorsProxy.instance) {
      CorsProxy.instance = new CorsProxy();
    }
    return CorsProxy.instance;
  }

  // Check if CORS proxy is needed
  private needsProxy(url: string): boolean {
    const currentOrigin = window.location.origin;
    const targetOrigin = new URL(url).origin;
    return currentOrigin !== targetOrigin;
  }

  // Get proxied URL if needed
  getProxiedUrl(url: string): string {
    if (this.needsProxy(url)) {
      return `${this.proxyUrl}${url}`;
    }
    return url;
  }

  // Create a fetch wrapper with CORS handling
  async fetchWithCors(url: string, options: RequestInit = {}): Promise<Response> {
    const finalUrl = this.getProxiedUrl(url);
    
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include' as RequestCredentials,
    };

    try {
      const response = await fetch(finalUrl, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      console.error('CORS Proxy fetch error:', error);
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
  }

  // Create an axios instance with CORS handling
  createAxiosInstance(baseURL: string) {
    const axios = require('axios');
    
    const instance = axios.create({
      baseURL: this.getProxiedUrl(baseURL),
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });

    // Add request interceptor for CORS headers
    instance.interceptors.request.use((config: any) => {
      if (this.needsProxy(config.url)) {
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
      }
      return config;
    });

    // Add response interceptor for error handling
    instance.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
          console.error('CORS Error detected. Using fallback proxy.');
          // You can implement fallback logic here
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }
}

// Export singleton instance
export const corsProxy = CorsProxy.getInstance(); 