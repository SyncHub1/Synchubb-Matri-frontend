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
  PaintBucket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";

const TeamChat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "Alex",
      avatar: "A",
      content: "Hey team! Just pushed the latest changes to the mobile app. The new UI components are looking great!",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: "2", 
      user: "Sarah",
      avatar: "S",
      content: "Awesome work! I've been working on the backend API. Should be ready for integration by tomorrow.",
      timestamp: "10:32 AM",
      isOwn: false
    },
    {
      id: "3",
      user: "You",
      avatar: "Y",
      content: "Perfect timing! I'll start working on connecting the frontend to the new endpoints.",
      timestamp: "10:35 AM",
      isOwn: true
    },
    {
      id: "4",
      user: "Mike",
      avatar: "M", 
      content: "Don't forget about our video call at 2 PM to discuss the upcoming demo!",
      timestamp: "10:40 AM",
      isOwn: false
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const teamMembers = [
    { name: "Alex", avatar: "A", status: "online" },
    { name: "Sarah", avatar: "S", status: "online" },
    { name: "Mike", avatar: "M", status: "away" },
    { name: "You", avatar: "Y", status: "online" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "Y",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNavigation />
            <Link to="/teams" className="hidden sm:flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-foreground">ET</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">EcoTrack Innovators</h1>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span className="text-sm text-muted-foreground">4 members online</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/teams/${id}/video`}>
                <Video className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-nav-background border-r border-border p-4 space-y-6 overflow-y-auto">
          {/* Team Tools */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Team Tools</h3>
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/teams/${id}/ide`}>
                  <Code className="h-4 w-4 mr-3" />
                  Code Editor
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/teams/${id}/video`}>
                  <Video className="h-4 w-4 mr-3" />
                  Video Call
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/teams/${id}/tasks`}>
                  <Calendar className="h-4 w-4 mr-3" />
                  Tasks
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/teams/${id}/whiteboard`}>
                  <PaintBucket className="h-4 w-4 mr-3" />
                  Whiteboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to={`/teams/${id}/analytics`}>
                  <Users className="h-4 w-4 mr-3" />
                  Analytics
                </Link>
              </Button>
            </nav>
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Team Members ({teamMembers.length})
            </h3>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-nav-hover">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-nav-background ${
                      member.status === 'online' ? 'bg-success' :
                      member.status === 'away' ? 'bg-warning' : 'bg-muted'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full text-xs" asChild>
                <Link to={`/teams/${id}/video`}>Start Video Call</Link>
              </Button>
              <Button variant="outline" className="w-full text-xs" asChild>
                <Link to={`/teams/${id}/whiteboard`}>Open Whiteboard</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                </Avatar>
                <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''} max-w-[70%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{msg.user}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <Card className={`${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                    <CardContent className="p-3">
                      <p className="text-sm">{msg.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 sm:p-6 border-t border-border">
            <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" type="button">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pr-12"
                />
                <Button variant="ghost" size="icon" type="button" className="absolute right-1 top-1/2 -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button type="submit" variant="purple" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamChat;