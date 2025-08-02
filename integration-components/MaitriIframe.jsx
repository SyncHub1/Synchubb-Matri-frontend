import React, { useEffect, useState } from 'react';

/**
 * MaitriIframe Component
 * 
 * This component should be used in your main SyncHubb application
 * to embed the Maitri collaboration platform when users click on "Maitri".
 * 
 * Usage in main app:
 * <Route path="/dashboard/maitri/*" element={<MaitriIframe />} />
 * 
 * Routing Structure:
 * - /dashboard/maitri - Main Maitri dashboard (TeamDiscovery)
 * - /dashboard/maitri/teams - Teams listing
 * - /dashboard/maitri/teams/create - Create new team
 * - /dashboard/maitri/teams/:id/chat - Team chat
 * - /dashboard/maitri/teams/:id/ide - Team IDE
 * - /dashboard/maitri/teams/:id/video - Team video
 * - /dashboard/maitri/teams/:id/tasks - Team tasks
 * - /dashboard/maitri/teams/:id/whiteboard - Team whiteboard
 * - /dashboard/maitri/teams/:id/analytics - Team analytics
 */

const MaitriIframe = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get Maitri service URL from environment
  const MAITRI_URL = process.env.REACT_APP_MAITRI_URL || 'http://localhost:5173';

  useEffect(() => {
    // Check if Maitri service is available
    const checkMaitriHealth = async () => {
      try {
        const response = await fetch(`${MAITRI_URL}/health`);
        if (!response.ok) {
          throw new Error('Maitri service is not available');
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to connect to Maitri service');
        setIsLoading(false);
      }
    };

    checkMaitriHealth();
  }, [MAITRI_URL]);

  // Handle messages from Maitri iframe
  useEffect(() => {
    const handleMaitriMessage = (event) => {
      // Only handle messages from Maitri
      if (event.origin !== MAITRI_URL) return;

      const { type, data } = event.data;

      switch (type) {
        case 'maitri-navigation':
          // Handle navigation requests
          console.log('Maitri navigation:', data.path);
          break;
        
        case 'maitri-auth-required':
          // Handle authentication requests
          console.log('Maitri requires authentication');
          break;
        
        case 'maitri-error':
          // Handle errors from Maitri
          console.error('Maitri error:', data.error);
          break;
        
        default:
          console.log('Unknown message from Maitri:', event.data);
      }
    };

    window.addEventListener('message', handleMaitriMessage);
    return () => window.removeEventListener('message', handleMaitriMessage);
  }, [MAITRI_URL]);

  // Send authentication token to Maitri
  useEffect(() => {
    const sendAuthToMaitri = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token) {
        const iframe = document.getElementById('maitri-iframe');
        if (iframe && iframe.contentWindow) {
          // Send auth token
          iframe.contentWindow.postMessage({
            type: 'set-auth-token',
            token: token
          }, MAITRI_URL);
          
          // Send user data if available
          if (userData) {
            try {
              const user = JSON.parse(userData);
              iframe.contentWindow.postMessage({
                type: 'set-user-data',
                user: user
              }, MAITRI_URL);
            } catch (error) {
              console.error('Failed to parse user data:', error);
            }
          }
        }
      }
    };

    // Send auth token after iframe loads
    const iframe = document.getElementById('maitri-iframe');
    if (iframe) {
      iframe.onload = sendAuthToMaitri;
    }
  }, [MAITRI_URL]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Maitri Collaboration Platform...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="maitri-container w-full h-screen bg-background">
      <iframe
        id="maitri-iframe"
        src={MAITRI_URL}
        title="Maitri Collaboration Platform"
        className="w-full h-full border-0"
        allow="camera; microphone; fullscreen; clipboard-read; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default MaitriIframe; 