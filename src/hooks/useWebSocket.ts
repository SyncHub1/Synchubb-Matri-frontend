import { useEffect, useRef, useCallback } from 'react';
import { wsService } from '@/lib/api';
import { useAuth } from './useAuth';
import { useState } from 'react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  groupId?: string;
  type: 'text' | 'image' | 'file' | 'system';
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  messages: Message[];
  onlineUsers: string[];
}

export const useWebSocket = (groupId?: string) => {
  const { user, isAuthenticated } = useAuth();
  const stateRef = useRef<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    messages: [],
    onlineUsers: []
  });

  const [state, setState] = useState<WebSocketState>(stateRef.current);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('authToken');
      if (token) {
        wsService.connect(user.id, token);
      }
    }

    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated, user]);

  // WebSocket event listeners
  useEffect(() => {
    const handleConnect = () => {
      setState(prev => ({ ...prev, isConnected: true, isConnecting: false, error: null }));
      console.log('✅ WebSocket connected');
    };

    const handleDisconnect = () => {
      setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
      console.log('🔌 WebSocket disconnected');
    };

    const handleError = (error: any) => {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'WebSocket connection error',
        isConnecting: false 
      }));
      console.error('❌ WebSocket error:', error);
    };

    const handleMessage = (data: any) => {
      if (data.type === 'message') {
        const newMessage: Message = {
          id: data.messageId,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          timestamp: data.timestamp,
          groupId: data.groupId,
          type: data.messageType || 'text'
        };

        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));
      } else if (data.type === 'message_deleted') {
        setState(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== data.messageId)
        }));
      } else if (data.type === 'user_joined') {
        setState(prev => ({
          ...prev,
          onlineUsers: [...prev.onlineUsers, data.userId]
        }));
      } else if (data.type === 'user_left') {
        setState(prev => ({
          ...prev,
          onlineUsers: prev.onlineUsers.filter(id => id !== data.userId)
        }));
      } else if (data.type === 'online_users') {
        setState(prev => ({
          ...prev,
          onlineUsers: data.users
        }));
      }
    };

    const handleReconnectFailed = () => {
      setState(prev => ({
        ...prev,
        error: 'Failed to reconnect to WebSocket',
        isConnecting: false
      }));
    };

    // Add event listeners
    wsService.on('connected', handleConnect);
    wsService.on('disconnected', handleDisconnect);
    wsService.on('error', handleError);
    wsService.on('message', handleMessage);
    wsService.on('message_deleted', handleMessage);
    wsService.on('user_joined', handleMessage);
    wsService.on('user_left', handleMessage);
    wsService.on('online_users', handleMessage);
    wsService.on('reconnect_failed', handleReconnectFailed);

    // Cleanup event listeners
    return () => {
      wsService.off('connected', handleConnect);
      wsService.off('disconnected', handleDisconnect);
      wsService.off('error', handleError);
      wsService.off('message', handleMessage);
      wsService.off('message_deleted', handleMessage);
      wsService.off('user_joined', handleMessage);
      wsService.off('user_left', handleMessage);
      wsService.off('online_users', handleMessage);
      wsService.off('reconnect_failed', handleReconnectFailed);
    };
  }, []);

  // Join group when groupId changes
  useEffect(() => {
    if (state.isConnected && groupId) {
      wsService.send('join_group', { groupId });
    }
  }, [state.isConnected, groupId]);

  // Send message function
  const sendMessage = useCallback((content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!state.isConnected || !groupId) {
      console.warn('WebSocket not connected or no group selected');
      return false;
    }

    wsService.send('send_message', {
      groupId,
      content,
      type
    });

    return true;
  }, [state.isConnected, groupId]);

  // Delete message function
  const deleteMessage = useCallback((messageId: string, forEveryone: boolean = false) => {
    if (!state.isConnected) {
      console.warn('WebSocket not connected');
      return false;
    }

    wsService.send('delete_message', {
      messageId,
      forEveryone
    });

    return true;
  }, [state.isConnected]);

  // Load message history
  const loadMessages = useCallback(async (limit: number = 50) => {
    if (!groupId) return;

    try {
      // This would typically call the media API to get message history
      // For now, we'll just clear existing messages
      setState(prev => ({ ...prev, messages: [] }));
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [groupId]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    sendMessage,
    deleteMessage,
    loadMessages,
    clearError
  };
}; 