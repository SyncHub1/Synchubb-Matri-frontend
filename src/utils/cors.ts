// CORS Configuration Utility
export const getCorsOrigins = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080'
    ];
  }
  
  return [
    'https://www.synchubb.in',
    'https://synchubb-matri-frontend.vercel.app',
    'https://synchubb.vercel.app',
    'https://synchubb.netlify.app'
  ];
};

export const getCorsHeaders = (origin: string) => {
  const allowedOrigins = getCorsOrigins();
  
  if (allowedOrigins.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    };
  }
  
  return {
    'Access-Control-Allow-Origin': allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}; 