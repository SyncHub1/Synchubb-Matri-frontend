# 🚀 Matri Frontend-Backend Integration Guide

## Overview

This guide shows how to integrate the Synchubb-Matri-frontend with the matri-service backend for full-featured team collaboration.

## 🔧 Setup & Configuration

### 1. Environment Configuration

Update your `.env` file with the Matri service URLs:

```env
# Matri Backend Service
VITE_MATRI_API_URL=http://localhost:3003
VITE_MATRI_SOCKET_URL=http://localhost:3003

# Existing services
VITE_AUTH_SERVICE_URL=http://localhost:8000
VITE_MEDIA_API_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3002
```

### 2. Provider Setup

Wrap your app with the MatriProvider:

```tsx
// src/App.tsx or main.tsx
import { MatriProvider } from './contexts/MatriContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MatriProvider user={currentUser}>
        <YourAppComponents />
      </MatriProvider>
    </QueryClientProvider>
  );
}
```

## 📡 API Integration Examples

### Team Management

```tsx
import { useTeams, useCreateTeam, useJoinTeam } from '../hooks/useMatriApi';

function TeamsPage() {
  const { data: teams, isLoading } = useTeams();
  const createTeamMutation = useCreateTeam();
  const joinTeamMutation = useJoinTeam();

  const handleCreateTeam = async (teamData: any) => {
    try {
      await createTeamMutation.mutateAsync(teamData);
    } catch (error) {
      console.error('Failed to create team:', error);
    }
  };

  const handleJoinTeam = async (teamId: string) => {
    try {
      await joinTeamMutation.mutateAsync(teamId);
    } catch (error) {
      console.error('Failed to join team:', error);
    }
  };

  if (isLoading) return <div>Loading teams...</div>;

  return (
    <div>
      {teams?.data?.map((team: any) => (
        <div key={team._id}>
          <h3>{team.name}</h3>
          <p>{team.description}</p>
          <button onClick={() => handleJoinTeam(team._id)}>
            Join Team
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Real-time Chat

```tsx
import { useMessages, useSendMessage } from '../hooks/useMatriApi';
import { useMatri } from '../contexts/MatriContext';
import { useEffect, useState } from 'react';

function TeamChat({ teamId }: { teamId: string }) {
  const { data: messages } = useMessages(teamId);
  const sendMessageMutation = useSendMessage();
  const { onMessage, sendTyping } = useMatri();
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Listen for real-time messages
  useEffect(() => {
    const handleNewMessage = (message: any) => {
      // TanStack Query will automatically update the cache
      console.log('New message received:', message);
    };

    const handleTyping = (data: any) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.userName), data.userName]);
      } else {
        setTypingUsers(prev => prev.filter(u => u !== data.userName));
      }
    };

    onMessage(handleNewMessage);
    onTyping(handleTyping);
  }, [onMessage, onTyping]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({
        teamId,
        messageData: {
          message: newMessage,
          type: 'text'
        }
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    sendTyping(teamId, isTyping);
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages?.data?.map((message: any) => (
          <div key={message._id} className="message">
            <strong>{message.userName}:</strong> {message.message}
          </div>
        ))}
      </div>
      
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      
      <div className="message-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onFocus={() => handleTyping(true)}
          onBlur={() => handleTyping(false)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
```

### Task Management

```tsx
import { useTasks, useCreateTask, useUpdateTask } from '../hooks/useMatriApi';

function TaskBoard({ teamId }: { teamId: string }) {
  const { data: tasks } = useTasks(teamId);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTaskMutation.mutateAsync({ teamId, taskData });
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await updateTaskMutation.mutateAsync({
        teamId,
        taskId,
        updates: { status }
      });
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return (
    <div className="task-board">
      <div className="task-columns">
        {['todo', 'in_progress', 'review', 'done'].map(status => (
          <div key={status} className="task-column">
            <h3>{status.replace('_', ' ').toUpperCase()}</h3>
            {tasks?.data
              ?.filter((task: any) => task.status === status)
              ?.map((task: any) => (
                <div key={task._id} className="task-card">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Video Conferencing

```tsx
import { useVideoCalls, useCreateVideoCall, useJoinVideoCall } from '../hooks/useMatriApi';
import { useMatri } from '../contexts/MatriContext';

function VideoCallsPage({ teamId }: { teamId: string }) {
  const { data: calls } = useVideoCalls(teamId);
  const createCallMutation = useCreateVideoCall();
  const joinCallMutation = useJoinVideoCall();
  const { onVideoCallUpdate } = useMatri();

  useEffect(() => {
    const handleCallUpdate = (data: any) => {
      console.log('Video call update:', data);
      // Handle call updates (participant joined/left, call ended, etc.)
    };

    onVideoCallUpdate(handleCallUpdate);
  }, [onVideoCallUpdate]);

  const handleCreateCall = async () => {
    try {
      await createCallMutation.mutateAsync({
        teamId,
        callData: {
          title: 'Team Meeting',
          description: 'Weekly team sync',
          type: 'meeting'
        }
      });
    } catch (error) {
      console.error('Failed to create call:', error);
    }
  };

  const handleJoinCall = async (callId: string) => {
    try {
      await joinCallMutation.mutateAsync({ teamId, callId });
      // Redirect to video call interface
    } catch (error) {
      console.error('Failed to join call:', error);
    }
  };

  return (
    <div className="video-calls">
      <button onClick={handleCreateCall}>Start New Call</button>
      
      <div className="active-calls">
        {calls?.data?.map((call: any) => (
          <div key={call._id} className="call-card">
            <h3>{call.title}</h3>
            <p>Status: {call.status}</p>
            <p>Participants: {call.participantCount}</p>
            {call.status === 'active' && (
              <button onClick={() => handleJoinCall(call._id)}>
                Join Call
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔄 Real-time Features

### Socket.IO Integration

```tsx
import { useMatri } from '../contexts/MatriContext';
import { useEffect } from 'react';

function RealtimeComponent({ teamId }: { teamId: string }) {
  const { 
    isSocketConnected, 
    joinTeam, 
    leaveTeam,
    onMessage,
    onUserJoined,
    onUserLeft,
    onTaskUpdate,
    onWhiteboardUpdate 
  } = useMatri();

  useEffect(() => {
    if (isSocketConnected) {
      // Join team room for real-time updates
      joinTeam(teamId);

      // Set up event listeners
      const handleMessage = (message: any) => {
        console.log('New message:', message);
        // Update UI or trigger notifications
      };

      const handleUserJoined = (user: any) => {
        console.log('User joined:', user);
        // Show notification or update member list
      };

      const handleTaskUpdate = (task: any) => {
        console.log('Task updated:', task);
        // Update task board or show notification
      };

      onMessage(handleMessage);
      onUserJoined(handleUserJoined);
      onTaskUpdate(handleTaskUpdate);

      // Cleanup on unmount
      return () => {
        leaveTeam(teamId);
      };
    }
  }, [isSocketConnected, teamId]);

  return (
    <div>
      <div className="connection-status">
        {isSocketConnected ? (
          <span className="text-green-500">🟢 Connected</span>
        ) : (
          <span className="text-red-500">🔴 Disconnected</span>
        )}
      </div>
      {/* Your component content */}
    </div>
  );
}
```

## 📊 Analytics Integration

```tsx
import { useTeamAnalytics, useMessageAnalytics } from '../hooks/useMatriApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TeamAnalytics({ teamId }: { teamId: string }) {
  const { data: overview } = useTeamAnalytics(teamId, '30d');
  const { data: messageStats } = useMessageAnalytics(teamId, { period: '7d' });

  return (
    <div className="analytics-dashboard">
      <div className="overview-cards">
        <div className="stat-card">
          <h3>Total Messages</h3>
          <p>{overview?.data?.overview?.totalMessages || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Members</h3>
          <p>{overview?.data?.team?.memberCount || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p>{overview?.data?.overview?.completedTasks || 0}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>Message Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={messageStats?.data?.timeline || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalMessages" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
```

## 🎨 UI Components Integration

### Connection Status Component

```tsx
import { MatriConnectionStatus } from '../contexts/MatriContext';

function AppHeader() {
  return (
    <header>
      <MatriConnectionStatus />
      {/* Other header content */}
    </header>
  );
}
```

### Error Handling

```tsx
import { useMatriHealth } from '../hooks/useMatriApi';
import { toast } from 'sonner';

function ErrorBoundary() {
  const { data: health, error, isError } = useMatriHealth();

  useEffect(() => {
    if (isError) {
      toast.error('Matri service is unavailable. Some features may be limited.');
    }
  }, [isError]);

  if (isError) {
    return (
      <div className="error-banner">
        <p>⚠️ Some features are currently unavailable</p>
        <button onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return null;
}
```

## 🚀 Getting Started

### 1. Start the Backend Services

```bash
# Start Matri service
cd matri-service
npm run dev

# Verify it's running
curl http://localhost:3003/health
```

### 2. Start the Frontend

```bash
# Start frontend
cd Synchubb-Matri-frontend
npm run dev
```

### 3. Test Integration

1. **Team Management**: Create and join teams
2. **Real-time Chat**: Send messages and see live updates
3. **Task Management**: Create and update tasks
4. **Video Calls**: Start and join video conferences
5. **Analytics**: View team activity and insights

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure CORS is configured in the backend
2. **Authentication**: Check JWT tokens are being sent
3. **Socket Connection**: Verify WebSocket connection is established
4. **API Endpoints**: Confirm backend routes match frontend calls

### Debug Tools

```tsx
// Add to your component for debugging
const { isConnected, isSocketConnected } = useMatri();

console.log('Matri Connection Status:', {
  api: isConnected,
  socket: isSocketConnected
});
```

## 📝 Best Practices

1. **Error Handling**: Always wrap API calls in try-catch
2. **Loading States**: Show loading indicators for better UX
3. **Optimistic Updates**: Update UI immediately, rollback on error
4. **Real-time Events**: Clean up event listeners on unmount
5. **Caching**: Use TanStack Query's caching effectively

## 🎯 Next Steps

1. **Authentication**: Integrate with SynchubbAuth service
2. **File Uploads**: Connect to media-api-service for file handling
3. **Notifications**: Add push notifications for real-time events
4. **Mobile Support**: Ensure responsive design works on mobile
5. **Performance**: Optimize for large teams and high message volumes

Your Matri frontend is now fully integrated with the backend! 🎉
