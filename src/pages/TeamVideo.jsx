import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  Settings, 
  Users, 
  MessageSquare,
  ScreenShare,
  MoreVertical,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MobileNavigation from "@/components/MobileNavigation";

const TeamVideo = () => {
  const { id } = useParams();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);

  const participants = [
    { 
      id: "1", 
      name: "You", 
      avatar: "Y", 
      isVideoOn: true, 
      isMicOn: true, 
      isSpeaking: false,
      isPresenting: false
    },
    { 
      id: "2", 
      name: "Alex", 
      avatar: "A", 
      isVideoOn: true, 
      isMicOn: true, 
      isSpeaking: true,
      isPresenting: false
    },
    { 
      id: "3", 
      name: "Sarah", 
      avatar: "S", 
      isVideoOn: false, 
      isMicOn: true, 
      isSpeaking: false,
      isPresenting: false
    },
    { 
      id: "4", 
      name: "Mike", 
      avatar: "M", 
      isVideoOn: true, 
      isMicOn: false, 
      isSpeaking: false,
      isPresenting: true
    }
  ];

  const chatMessages = [
    { id: "1", user: "Alex", message: "Can everyone see the screen share?", time: "2:15 PM" },
    { id: "2", user: "Sarah", message: "Yes, looks clear!", time: "2:16 PM" },
    { id: "3", user: "Mike", message: "Let me show the latest mockups", time: "2:17 PM" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MobileNavigation />
            <Link to={`/teams/${id}/chat`} className="hidden sm:flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Video className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Team Video Call</h1>
                <p className="text-sm text-muted-foreground">EcoTrack Innovators • {participants.length} participants</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Live
            </Badge>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Area */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {participants.map((participant) => (
              <Card key={participant.id} className={`relative overflow-hidden ${
                participant.isPresenting ? 'sm:col-span-2' : ''
              } ${participant.isSpeaking ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-0 h-full">
                  {participant.isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center relative">
                      {/* Simulated video feed */}
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="text-2xl">{participant.avatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-4">
                          <AvatarFallback className="text-2xl">{participant.avatar}</AvatarFallback>
                        </Avatar>
                        <p className="text-muted-foreground">Camera is off</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Participant info overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium text-sm bg-black/50 px-2 py-1 rounded">
                        {participant.name}
                      </span>
                      {participant.isPresenting && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground">
                          Presenting
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!participant.isMicOn && (
                        <div className="bg-destructive p-1 rounded-full">
                          <MicOff className="h-3 w-3 text-destructive-foreground" />
                        </div>
                      )}
                      {participant.isSpeaking && (
                        <div className="bg-success p-1 rounded-full animate-pulse">
                          <Mic className="h-3 w-3 text-success-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Controls Bar */}
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-nav-background border border-border rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-lg">
            <Button
              variant={isMicOn ? "secondary" : "destructive"}
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-3 w-3 sm:h-4 sm:w-4" /> : <MicOff className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            
            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="h-3 w-3 sm:h-4 sm:w-4" /> : <VideoOff className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>

            <Button
              variant={isScreenSharing ? "purple" : "secondary"}
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <ScreenShare className="h-4 w-4" />
            </Button>

            <Button
              variant={isSpeakerOn ? "secondary" : "destructive"}
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10"
              asChild
            >
              <Link to={`/teams/${id}/chat`}>
                <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </Button>

            <div className="h-4 sm:h-6 w-px bg-border mx-1 sm:mx-2 hidden sm:block" />

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:hidden"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hidden sm:flex"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </main>

        {/* Chat Sidebar */}
        {showChat && (
          <aside className="hidden lg:block w-80 bg-nav-background border-l border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Meeting Chat</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* Participants List */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 rounded hover:bg-nav-hover">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{participant.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{participant.name}</span>
                    <div className="flex items-center gap-1">
                      {!participant.isMicOn && <MicOff className="h-3 w-3 text-muted-foreground" />}
                      {!participant.isVideoOn && <VideoOff className="h-3 w-3 text-muted-foreground" />}
                      {participant.isPresenting && (
                        <ScreenShare className="h-3 w-3 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Chat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2 border-t border-border">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 text-sm border border-input rounded-md bg-background"
                  />
                  <Button size="sm">Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full text-sm" asChild>
                <Link to={`/teams/${id}/whiteboard`}>
                  Open Whiteboard
                </Link>
              </Button>
              <Button variant="outline" className="w-full text-sm" asChild>
                <Link to={`/teams/${id}/ide`}>
                  Code Together
                </Link>
              </Button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default TeamVideo;