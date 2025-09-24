import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matriServices } from '../lib/matri-api';
import { toast } from 'sonner';

// Query Keys
export const MATRI_QUERY_KEYS = {
  teams: ['matri', 'teams'],
  team: (id: string) => ['matri', 'teams', id],
  teamMembers: (id: string) => ['matri', 'teams', id, 'members'],
  messages: (teamId: string) => ['matri', 'chat', teamId, 'messages'],
  tasks: (teamId: string) => ['matri', 'tasks', teamId],
  task: (teamId: string, taskId: string) => ['matri', 'tasks', teamId, taskId],
  whiteboards: (teamId: string) => ['matri', 'whiteboards', teamId],
  whiteboard: (teamId: string, whiteboardId: string) => ['matri', 'whiteboards', teamId, whiteboardId],
  ideProjects: (teamId: string) => ['matri', 'ide', teamId],
  ideProject: (teamId: string, projectId: string) => ['matri', 'ide', teamId, projectId],
  videoCalls: (teamId: string) => ['matri', 'video', teamId],
  invitations: (teamId: string) => ['matri', 'invitations', teamId],
  analytics: (teamId: string, type: string) => ['matri', 'analytics', teamId, type],
  userSearch: (query: string) => ['matri', 'users', 'search', query]
};

// Team Hooks
export const useTeams = (params?: any) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.teams, params],
    queryFn: () => matriServices.teams.getTeams(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.team(teamId),
    queryFn: () => matriServices.teams.getTeam(teamId),
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.teamMembers(teamId),
    queryFn: () => matriServices.teams.getTeamMembers(teamId),
    enabled: !!teamId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: matriServices.teams.createTeam,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teams });
      toast.success('Team created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create team');
    }
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, updates }: { teamId: string; updates: any }) =>
      matriServices.teams.updateTeam(teamId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.team(variables.teamId) });
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teams });
      toast.success('Team updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update team');
    }
  });
};

export const useJoinTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: matriServices.teams.joinTeam,
    onSuccess: (data, teamId) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.team(teamId) });
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teamMembers(teamId) });
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teams });
      toast.success('Joined team successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join team');
    }
  });
};

export const useLeaveTeam = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: matriServices.teams.leaveTeam,
    onSuccess: (data, teamId) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.team(teamId) });
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teamMembers(teamId) });
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.teams });
      toast.success('Left team successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to leave team');
    }
  });
};




// Chat Hooks
export const useMessages = (teamId: string, params?: any) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.messages(teamId), params],
    queryFn: () => matriServices.messages.getMessages(teamId),
    enabled: !!teamId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, messageData }: { teamId: string; messageData: any }) =>
      matriServices.messages.sendMessage(teamId, messageData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MATRI_QUERY_KEYS.messages(variables.teamId)] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  });
};

export const useAddReaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, messageId, emoji }: { teamId: string; messageId: string; emoji: string }) =>
      matriServices.chat.addReaction(teamId, messageId, emoji),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.messages(variables.teamId) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add reaction');
    }
  });
};

// Task Hooks
export const useTasks = (teamId: string, params?: any) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.tasks(teamId), params],
    queryFn: () => matriServices.tasks.getTasks(teamId, params),
    enabled: !!teamId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, taskData }: { teamId: string; taskData: any }) =>
      matriServices.tasks.createTask(teamId, taskData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.tasks(variables.teamId) });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, taskId, updates }: { teamId: string; taskId: string; updates: any }) =>
      matriServices.tasks.updateTask(teamId, taskId, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.tasks(variables.teamId) });
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  });
};

export const useTaskStats = (teamId: string) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.tasks(teamId), 'stats'],
    queryFn: () => matriServices.tasks.getTaskStats(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Whiteboard Hooks
export const useWhiteboards = (teamId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.whiteboards(teamId),
    queryFn: () => matriServices.whiteboard.getWhiteboards(teamId),
    enabled: !!teamId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useWhiteboard = (teamId: string, whiteboardId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.whiteboard(teamId, whiteboardId),
    queryFn: () => matriServices.whiteboard.getWhiteboard(teamId, whiteboardId),
    enabled: !!teamId && !!whiteboardId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateWhiteboard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, whiteboardData }: { teamId: string; whiteboardData: any }) =>
      matriServices.whiteboard.createWhiteboard(teamId, whiteboardData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.whiteboards(variables.teamId) });
      toast.success('Whiteboard created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create whiteboard');
    }
  });
};

// IDE Hooks

export const useIDESession = (teamId: string) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.ideProjects(teamId), 'session'],
    queryFn: () => matriServices.ide.getSession(teamId),
    enabled: !!teamId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSaveFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, fileData }: { teamId: string; fileData: any }) =>
      matriServices.ide.saveFile(teamId, fileData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.ideProjects(variables.teamId) });
      toast.success('File saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save file');
    }
  });
};

export const useRunCode = () => {
  return useMutation({
    mutationFn: ({ teamId, codeData }: { teamId: string; codeData: any }) =>
      matriServices.ide.runCode(teamId, codeData),
    onSuccess: () => {
      toast.success('Code executed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to execute code');
    }
  });
};

// Video Call Hooks
export const useVideoCall = (teamId: string) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.teams, teamId, 'video-call'],
    queryFn: () => matriServices.videoCall.getCall(teamId),
    enabled: !!teamId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

export const useJoinCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, callData }: { teamId: string; callData: any }) =>
      matriServices.videoCall.joinCall(teamId, callData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MATRI_QUERY_KEYS.teams, variables.teamId, 'video-call'] });
      toast.success('Joined video call!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join call');
    }
  });
};

export const useLeaveCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId }: { teamId: string }) =>
      matriServices.videoCall.leaveCall(teamId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [...MATRI_QUERY_KEYS.teams, variables.teamId, 'video-call'] });
      toast.success('Left video call!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to leave call');
    }
  });
};

// Whiteboard Additional Hooks
export const useSaveWhiteboard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, whiteboardId, whiteboardData }: { teamId: string; whiteboardId: string; whiteboardData: any }) =>
      matriServices.whiteboard.saveWhiteboard(teamId, whiteboardId, whiteboardData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.whiteboard(variables.teamId, variables.whiteboardId) });
      toast.success('Whiteboard saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save whiteboard');
    }
  });
};

// Removed duplicate hooks - using the ones defined above

export const useIdeProject = (teamId: string, projectId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.ideProject(teamId, projectId),
    queryFn: () => matriServices.ide.getProject(teamId, projectId),
    enabled: !!teamId && !!projectId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreateIdeProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, projectData }: { teamId: string; projectData: any }) =>
      matriServices.ide.createProject(teamId, projectData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.ideProjects(variables.teamId) });
      toast.success('IDE project created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create IDE project');
    }
  });
};

// Video Hooks
export const useVideoCalls = (teamId: string, params?: any) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.videoCalls(teamId), params],
    queryFn: () => matriServices.video.getCalls(teamId, params),
    enabled: !!teamId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateVideoCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, callData }: { teamId: string; callData: any }) =>
      matriServices.video.createCall(teamId, callData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.videoCalls(variables.teamId) });
      toast.success('Video call created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create video call');
    }
  });
};

export const useJoinVideoCall = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, callId }: { teamId: string; callId: string }) =>
      matriServices.video.joinCall(teamId, callId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.videoCalls(variables.teamId) });
      toast.success('Joined video call!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join video call');
    }
  });
};

// Invitation Hooks
export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.userSearch(query),
    queryFn: () => matriServices.invitations.searchUsers(query),
    enabled: query.length > 2,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useSendInvitations = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ teamId, invitationData }: { teamId: string; invitationData: any }) =>
      matriServices.invitations.sendInvitations(teamId, invitationData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: MATRI_QUERY_KEYS.invitations(variables.teamId) });
      toast.success('Invitations sent successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send invitations');
    }
  });
};



export const useMessageAnalytics = (teamId: string, params?: any) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.analytics(teamId, 'messages'), params],
    queryFn: () => matriServices.analytics.getMessageAnalytics(teamId, params),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeamAnalytics = (teamId: string) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.teams, teamId, 'analytics'],
    queryFn: () => matriServices.analytics.getTeamAnalytics(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAnalytics = (teamId: string) => {
  return useTeamAnalytics(teamId);
};

export const useTeamStats = (teamId: string) => {
  return useQuery({
    queryKey: [...MATRI_QUERY_KEYS.teams, teamId, 'stats'],
    queryFn: () => matriServices.analytics.getTeamStats(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMemberAnalytics = (teamId: string) => {
  return useQuery({
    queryKey: MATRI_QUERY_KEYS.analytics(teamId, 'members'),
    queryFn: () => matriServices.analytics.getMemberAnalytics(teamId),
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Health Check Hook
export const useMatriHealth = () => {
  return useQuery({
    queryKey: ['matri', 'health'],
    queryFn: matriServices.health.checkHealth,
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: 1000,
  });
};

// Socket Hook
export const useMatriSocket = () => {
  const socket = matriServices.socket;

  const connect = (token?: string) => {
    return socket.connect(token);
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const joinTeam = (teamId: string) => {
    socket.joinTeam(teamId);
  };

  const leaveTeam = (teamId: string) => {
    socket.leaveTeam(teamId);
  };

  const sendTyping = (teamId: string, isTyping: boolean) => {
    socket.sendTyping(teamId, isTyping);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socket.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socket.off(event, callback);
  };

  const emit = (event: string, data: any) => {
    socket.emit(event, data);
  };

  return {
    socket: socket.getSocket(),
    connect,
    disconnect,
    joinTeam,
    leaveTeam,
    sendTyping,
    on,
    off,
    emit,
    isConnected: socket.getSocket()?.connected || false
  };
};
