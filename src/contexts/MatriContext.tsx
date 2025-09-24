import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { matriServices, matriSocket } from '../lib/matri-api';
import { toast } from 'sonner';

interface MatriContextType {
  // Connection status
  isConnected: boolean;
  isSocketConnected: boolean;
  
  // Current user context
  currentUser: any;
  currentTeam: any;
  
  // Socket methods
  joinTeam: (teamId: string) => void;
  leaveTeam: (teamId: string) => void;
  sendTyping: (teamId: string, isTyping: boolean) => void;
  
  // IDE methods
  joinIDESession: (teamId: string) => void;
  leaveIDESession: (teamId: string) => void;
  onCodeChange: (callback: (data: any) => void) => void;
  
  // Video call methods
  joinVideoCall: (teamId: string) => void;
  leaveVideoCall: (teamId: string) => void;
  onParticipantUpdate: (callback: (data: any) => void) => void;
  
  // Whiteboard methods
  joinWhiteboard: (teamId: string) => void;
  leaveWhiteboard: (teamId: string) => void;
  onWhiteboardUpdate: (callback: (data: any) => void) => void;
  
  // Task methods
  onTaskUpdate: (callback: (task: any) => void) => void;
  
  // Real-time event handlers
  onMessage: (callback: (message: any) => void) => void;
  onTyping: (callback: (data: any) => void) => void;
  onUserJoined: (callback: (user: any) => void) => void;
  onUserLeft: (callback: (user: any) => void) => void;
  onIdeUpdate: (callback: (data: any) => void) => void;
  onVideoCallUpdate: (callback: (data: any) => void) => void;
  
  // Utility methods
  setCurrentTeam: (team: any) => void;
  checkHealth: () => Promise<boolean>;
}

const MatriContext = createContext<MatriContextType | undefined>(undefined);

interface MatriProviderProps {
  children: ReactNode;
  user?: any;
}

export const MatriProvider: React.FC<MatriProviderProps> = ({ children, user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [currentTeam, setCurrentTeam] = useState(null);

  // Initialize connection on mount
  useEffect(() => {
    initializeConnection();
    
    return () => {
      matriSocket.disconnect();
    };
  }, []);

  // Update user when prop changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const initializeConnection = async () => {
    try {
      console.log('🔍 Checking Matri service health...');
      
      // Check if Matri service is healthy
      const health = await matriServices.health.checkHealth();
      console.log('🌡️ Matri service health check result:', health);
      
      const isHealthy = health.status === 'healthy';
      setIsConnected(isHealthy);
      
      if (isHealthy) {
        console.log('✅ Matri service is healthy, initializing socket...');
        
        // Initialize socket connection
        const token = localStorage.getItem('authToken');
        if (token) {
          const socket = matriSocket.connect(token);
          
          if (socket) {
            // Set up socket event listeners
            socket.on('connect', () => {
              setIsSocketConnected(true);
              console.log('✅ Matri Socket connected successfully');
              toast.success('Connected to Matri service');
            });

            socket.on('disconnect', () => {
              setIsSocketConnected(false);
              console.log('🔌 Matri Socket disconnected');
              toast.warning('Disconnected from Matri service');
            });

            socket.on('connect_error', (error: any) => {
              console.error('❌ Matri Socket connection error:', error);
              setIsSocketConnected(false);
              toast.error('Failed to connect to Matri service');
            });

            // Set up real-time event listeners
            setupRealtimeListeners(socket);
          }
        } else {
          console.warn('⚠️ No auth token found, skipping socket connection');
        }
      } else {
        console.warn('⚠️ Matri service is not healthy, using fallback mode');
        toast.warning('Matri service unavailable - some features may be limited');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Matri connection:', error);
      setIsConnected(false);
      toast.error('Unable to connect to Matri service. Please check if the service is running.');
    }
  };

  const setupRealtimeListeners = (socket: any) => {
    // Store event callbacks for cleanup
    const eventCallbacks = new Map();

    // Helper to register event with cleanup
    const registerEvent = (event: string, callback: (data: any) => void) => {
      socket.on(event, callback);
      if (!eventCallbacks.has(event)) {
        eventCallbacks.set(event, []);
      }
      eventCallbacks.get(event).push(callback);
    };

    // Global error handler
    registerEvent('error', (error: any) => {
      console.error('Matri Socket error:', error);
      toast.error('Real-time connection error');
    });

    // Connection status updates
    registerEvent('user_connected', (data: any) => {
      console.log('User connected:', data);
    });

    registerEvent('user_disconnected', (data: any) => {
      console.log('User disconnected:', data);
    });
  };

  // Socket methods
  const joinTeam = (teamId: string) => {
    if (isSocketConnected) {
      matriSocket.joinTeam(teamId);
      console.log(`Joined team room: ${teamId}`);
    }
  };

  const leaveTeam = (teamId: string) => {
    if (isSocketConnected) {
      matriSocket.leaveTeam(teamId);
      console.log(`Left team room: ${teamId}`);
    }
  };

  const sendTyping = (teamId: string, isTyping: boolean) => {
    if (isSocketConnected) {
      matriSocket.sendTyping(teamId, isTyping);
    }
  };

  // Real-time event handlers
  const onMessage = (callback: (message: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('new_message', callback);
    }
  };

  const onTyping = (callback: (data: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('user_typing', callback);
    }
  };

  const onUserJoined = (callback: (user: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('user_joined_team', callback);
    }
  };

  const onUserLeft = (callback: (user: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('user_left_team', callback);
    }
  };



  const onIdeUpdate = (callback: (data: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('ide_file_updated', callback);
    }
  };

  const onVideoCallUpdate = (callback: (data: any) => void) => {
    if (isSocketConnected) {
      matriSocket.on('video_call_updated', callback);
    }
  };

  // Utility methods
  const handleSetCurrentTeam = (team: any) => {
    // Leave previous team room
    if (currentTeam) {
      leaveTeam(currentTeam._id || currentTeam.id);
    }
    
    // Set new team
    setCurrentTeam(team);
    
    // Join new team room
    if (team) {
      joinTeam(team._id || team.id);
    }
  };

  const checkHealth = async (): Promise<boolean> => {
    try {
      const health = await matriServices.health.checkHealth();
      const isHealthy = health.status === 'healthy';
      setIsConnected(isHealthy);
      return isHealthy;
    } catch (error) {
      setIsConnected(false);
      return false;
    }
  };

  // Additional methods for IDE, Video, and Whiteboard
  const joinIDESession = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('join_ide_session', { teamId, userId: currentUser?.id });
    }
  };

  const leaveIDESession = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('leave_ide_session', { teamId, userId: currentUser?.id });
    }
  };

  const onCodeChange = (callback: (data: any) => void) => {
    if (matriSocket.getSocket()) {
      matriSocket.on('code_changed', callback);
    }
  };

  const joinVideoCall = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('join_video_call', { teamId, userId: currentUser?.id });
    }
  };

  const leaveVideoCall = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('leave_video_call', { teamId, userId: currentUser?.id });
    }
  };

  const onParticipantUpdate = (callback: (data: any) => void) => {
    if (matriSocket.getSocket()) {
      matriSocket.on('participant_updated', callback);
    }
  };

  const joinWhiteboard = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('join_whiteboard', { teamId, userId: currentUser?.id });
    }
  };

  const leaveWhiteboard = (teamId: string) => {
    if (matriSocket.getSocket()) {
      matriSocket.emit('leave_whiteboard', { teamId, userId: currentUser?.id });
    }
  };

  const onWhiteboardUpdate = (callback: (data: any) => void) => {
    if (matriSocket.getSocket()) {
      matriSocket.on('whiteboard_updated', callback);
    }
  };

  const onTaskUpdate = (callback: (data: any) => void) => {
    if (matriSocket.getSocket()) {
      matriSocket.on('task_updated', callback);
    }
  };

  const contextValue: MatriContextType = {
    // Connection status
    isConnected,
    isSocketConnected,
    
    // Current context
    currentUser,
    currentTeam,
    
    // Socket methods
    joinTeam,
    leaveTeam,
    sendTyping,
    
    // IDE methods
    joinIDESession,
    leaveIDESession,
    onCodeChange,
    
    // Video call methods
    joinVideoCall,
    leaveVideoCall,
    onParticipantUpdate,
    
    // Whiteboard methods
    joinWhiteboard,
    leaveWhiteboard,

    
    // Real-time event handlers
    onMessage,
    onTyping,
    onUserJoined,
    onUserLeft,
    onTaskUpdate,
    onWhiteboardUpdate,
    onIdeUpdate,
    onVideoCallUpdate,
    
    // Utility methods
    setCurrentTeam: handleSetCurrentTeam,
    checkHealth
  };

  return (
    <MatriContext.Provider value={contextValue}>
      {children}
    </MatriContext.Provider>
  );
};

// Custom hook to use Matri context
export const useMatri = (): MatriContextType => {
  const context = useContext(MatriContext);
  if (context === undefined) {
    throw new Error('useMatri must be used within a MatriProvider');
  }
  return context;
};

// Connection status component
export const MatriConnectionStatus: React.FC = () => {
  const { isConnected, isSocketConnected, checkHealth } = useMatri();

  const handleRetryConnection = async () => {
    const isHealthy = await checkHealth();
    if (isHealthy) {
      toast.success('Connection restored!');
    } else {
      toast.error('Still unable to connect to Matri service');
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-red-700">
              Matri service unavailable - using offline mode
            </span>
          </div>
          <button
            onClick={handleRetryConnection}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isSocketConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-yellow-700">
            Real-time features limited - reconnecting...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
      <div className="flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        <span className="text-sm text-green-700">
          All systems connected
        </span>
      </div>
    </div>
  );
};

export default MatriProvider;
