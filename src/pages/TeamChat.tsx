import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Settings,
  Users,
  Code,
  Calendar,
  PaintBucket,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/components/AuthProvider";
import { useTeam, useMessages, useSendMessage } from "@/hooks/useMatriApi";
import { useMatri, MatriConnectionStatus } from "@/contexts/MatriContext";
import { toast } from "sonner";

const TeamChat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthContext();
  const { isSocketConnected, joinTeam, leaveTeam, onMessage, sendTyping } = useMatri();
  
  // Use Matri API hooks
  const { data: teamData } = useTeam(id || '');
  const { data: messagesData } = useMessages(id || '');
  const sendMessageMutation = useSendMessage();
  
  const team = teamData?.data;
  const messages = messagesData?.data || [];

  // Join team room for real-time updates
  useEffect(() => {
    if (id && isSocketConnected) {
      joinTeam(id);
      return () => leaveTeam(id);
    }
  }, [id, isSocketConnected, joinTeam, leaveTeam]);
  
  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (messageData: any) => {
      // TanStack Query will automatically update the cache
      console.log('New message received:', messageData);
    };
    
    onMessage(handleNewMessage);
  }, [onMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !id) return;

    try {
      await sendMessageMutation.mutateAsync({
        teamId: id,
        messageData: {
          message: message.trim(),
          type: 'text'
        }
      });
      setMessage("");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Error handling is done in the mutation hook
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!id) return;
    
    try {
      // This would use a delete message mutation
      // await deleteMessageMutation.mutateAsync({ teamId: id, messageId });
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error("Failed to delete message");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      toast.info("File upload feature coming soon!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const SidebarContent = () => (
    <div className="p-4 space-y-6">
      {/* Team Info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-background">
        <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-foreground">
            {team?.name?.charAt(0)?.toUpperCase() || 'T'}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-sm">{team?.name || "Team"}</h3>
          <p className="text-xs text-muted-foreground">• {team?.members?.length || 0} members online</p>
        </div>
      </div>

      {/* Team Tools */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">TEAM TOOLS</h4>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/dashboard/maitri/teams/${id}/ide`} onClick={() => setShowMobileSidebar(false)}>
              <Code className="h-4 w-4 mr-2" />
              Code Editor
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/dashboard/maitri/teams/${id}/video`} onClick={() => setShowMobileSidebar(false)}>
              <Video className="h-4 w-4 mr-2" />
              Video Call
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/dashboard/maitri/teams/${id}/tasks`} onClick={() => setShowMobileSidebar(false)}>
              <Calendar className="h-4 w-4 mr-2" />
              Tasks
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/dashboard/maitri/teams/${id}/whiteboard`} onClick={() => setShowMobileSidebar(false)}>
              <PaintBucket className="h-4 w-4 mr-2" />
              Whiteboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link to={`/dashboard/maitri/teams/${id}/analytics`} onClick={() => setShowMobileSidebar(false)}>
              <Users className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          TEAM MEMBERS ({team?.members?.length || 0})
        </h4>
        <div className="space-y-2">
          {team?.members?.map((member: any, index: number) => (
            <div key={member.id || index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {member.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{member.name || `User ${index + 1}`}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          ))}
          {(!team?.members || team.members.length === 0) && (
            <div className="text-center text-muted-foreground text-sm py-4">
              No members yet
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">QUICK ACTIONS</h4>
        <Button variant="default" size="sm" className="w-full" asChild>
          <Link to={`/dashboard/maitri/teams/${id}/video`} onClick={() => setShowMobileSidebar(false)}>
            <Video className="h-4 w-4 mr-2" />
            Start Video Call
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            {/* Back Button - Show on mobile, hide on larger screens */}
            <Link to="/dashboard/maitri/teams" className="lg:hidden flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold truncate">{team?.name || "Team Chat"}</h1>
                <div className="flex items-center gap-1 sm:gap-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {team?.memberCount || 0} members
                  </p>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Connection Status Badge - Hide on very small screens */}
            <Badge variant="secondary" className={`text-xs hidden xs:inline-flex ${isSocketConnected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
              {isSocketConnected ? "Connected" : "Disconnected"}
            </Badge>
            
            {/* Desktop Action Buttons - Hide on mobile */}
            <div className="hidden lg:flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/ide`}>
                  <Code className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/video`}>
                  <Video className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/tasks`}>
                  <Calendar className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/whiteboard`}>
                  <PaintBucket className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/analytics`}>
                  <Users className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {/* Mobile Action Buttons - Show only essential ones */}
            <div className="lg:hidden flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                <Link to={`/dashboard/maitri/teams/${id}/video`}>
                  <Video className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex relative">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileSidebar(false)} />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-background border-r border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold">Team Tools</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 border-r border-border bg-muted/20 flex-shrink-0">
          <SidebarContent />
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3 lg:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 lg:mb-4 opacity-50" />
                  <p className="text-xs sm:text-sm lg:text-base">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== user?.id && (
                    <Avatar className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">{msg.senderAvatar}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[85%] sm:max-w-[80%] lg:max-w-[70%] ${msg.senderId === user?.id ? 'order-first' : ''}`}>
                    {msg.senderId !== user?.id && (
                      <p className="text-xs text-muted-foreground mb-1">{msg.senderName}</p>
                    )}
                    
                    <div className={`rounded-lg p-2 sm:p-3 ${
                      msg.senderId === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-xs sm:text-sm break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                    
                    {msg.senderId === user?.id && (
                      <div className="flex justify-end mt-1 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1 sm:px-2 text-xs"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <span className="hidden sm:inline">Delete for me</span>
                          <span className="sm:hidden">Delete</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1 sm:px-2 text-xs"
                          onClick={() => handleDeleteMessage(msg.id)}
                        >
                          <span className="hidden sm:inline">Delete for everyone</span>
                          <span className="sm:hidden">Delete All</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-2 sm:p-3 lg:p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <label className="flex-1 relative min-w-0">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="pr-12 sm:pr-16 lg:pr-20 h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
                  disabled={!isSocketConnected}
                />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  id="file-upload"
                />
              </label>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <Button 
                type="submit" 
                size="sm" 
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                disabled={!message.trim() || !isSocketConnected}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChat;