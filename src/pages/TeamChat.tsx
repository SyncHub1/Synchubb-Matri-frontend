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
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuthContext } from "@/components/AuthProvider";
import { teamService } from "@/lib/api";
import { toast } from "sonner";

const TeamChat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthContext();
  const { messages, isConnected, sendMessage, deleteMessage, onlineUsers } = useWebSocket(id);
  const [team, setTeam] = useState<any>(null);

  // Load team information
  useEffect(() => {
    if (id) {
      teamService.getTeam(id).then((result) => {
        if ((result as any).data) {
          setTeam((result as any).data);
        }
      }).catch((error) => {
        console.error("Error loading team:", error);
        toast.error("Failed to load team information");
      });
    }
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const success = sendMessage(message.trim());
    if (success) {
      setMessage("");
      setShowEmojiPicker(false);
    } else {
      toast.error("Failed to send message. Please check your connection.");
    }
  };

  const handleDeleteMessage = (messageId: string, forEveryone: boolean = false) => {
    const success = deleteMessage(messageId, forEveryone);
    if (success) {
      toast.success("Message deleted successfully");
    } else {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard/maitri/teams" className="hidden sm:flex items-center gap-2 text-nav-foreground hover:text-nav-active">
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
                    {onlineUsers.length} online
                  </p>
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant="secondary" className={`text-xs ${isConnected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
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
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {/* Sidebar - Team Tools & Members */}
        <div className="hidden lg:block w-64 border-r border-border bg-muted/20 flex-shrink-0">
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
                  <Link to={`/dashboard/maitri/teams/${id}/ide`}>
                    <Code className="h-4 w-4 mr-2" />
                  Code Editor
                </Link>
              </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/dashboard/maitri/teams/${id}/video`}>
                    <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Link>
              </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/dashboard/maitri/teams/${id}/tasks`}>
                    <Calendar className="h-4 w-4 mr-2" />
                  Tasks
                </Link>
              </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/dashboard/maitri/teams/${id}/whiteboard`}>
                    <PaintBucket className="h-4 w-4 mr-2" />
                  Whiteboard
                </Link>
              </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to={`/dashboard/maitri/teams/${id}/analytics`}>
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
                <Link to={`/dashboard/maitri/teams/${id}/video`}>
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Link>
              </Button>
            </div>
          </div>
        </div>

          {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">No messages yet. Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-3 ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== user?.id && (
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs sm:text-sm">{msg.senderAvatar}</AvatarFallback>
                </Avatar>
                  )}
                  
                  <div className={`max-w-[75%] sm:max-w-[70%] ${msg.senderId === user?.id ? 'order-first' : ''}`}>
                    {msg.senderId !== user?.id && (
                      <p className="text-xs text-muted-foreground mb-1">{msg.senderName}</p>
                    )}
                    
                    <div className={`rounded-lg p-2 sm:p-3 ${
                      msg.senderId === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                    </div>
                    
                    {msg.senderId === user?.id && (
                      <div className="flex justify-end mt-1 gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2 text-xs"
                          onClick={() => handleDeleteMessage(msg.id, false)}
                        >
                          <span className="hidden sm:inline">Delete for me</span>
                          <span className="sm:hidden">Delete</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2 text-xs"
                          onClick={() => handleDeleteMessage(msg.id, true)}
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
          <div className="border-t border-border p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-4 w-4" />
              </Button>
              
              <label className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="pr-16 sm:pr-20 h-9 sm:h-10"
                  disabled={!isConnected}
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
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4" />
                </Button>
              
              <Button 
                type="submit" 
                size="sm" 
                className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                disabled={!message.trim() || !isConnected}
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