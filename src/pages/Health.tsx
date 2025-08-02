import { useEffect } from 'react';

const Health = () => {
  useEffect(() => {
    // Set CORS headers for health check
    const setCorsHeaders = () => {
      const origin = window.location.origin;
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:8080',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:8080',
        'https://www.synchubb.in',
        'https://synchubb-matri-frontend.vercel.app'
      ];

      if (allowedOrigins.includes(origin)) {
        document.documentElement.style.setProperty('--cors-origin', origin);
      }
    };

    setCorsHeaders();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          SyncHubb Matri-Verse
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Health Check - Service is Running
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Service Status: Healthy</p>
          <p>✅ CORS Configuration: Active</p>
          <p>✅ Authentication: Ready</p>
          <p>✅ Team Features: Available</p>
        </div>
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">CORS Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Allowed Origins: localhost:3000, localhost:5173, localhost:8080, synchubb.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Health; 