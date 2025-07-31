import { useState, useEffect } from "react";
import { Users, UserPlus, Copy, Share2, Crown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  isOnline: boolean;
  cursor?: { x: number; y: number; color: string };
}

interface CollaborationPanelProps {
  roomId: string;
  currentUser: Collaborator;
}

export const CollaborationPanel = ({ roomId, currentUser }: CollaborationPanelProps) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: "1",
      name: "Alex Thompson",
      avatar: "",
      email: "alex@example.com",
      role: "owner",
      isOnline: true,
      cursor: { x: 200, y: 150, color: "#3b82f6" }
    },
    {
      id: "2", 
      name: "Sarah Chen",
      avatar: "",
      email: "sarah@example.com",
      role: "editor",
      isOnline: true,
      cursor: { x: 350, y: 200, color: "#10b981" }
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "",
      email: "mike@example.com", 
      role: "viewer",
      isOnline: false
    },
    {
      id: "4",
      name: "You",
      avatar: "",
      email: "you@example.com",
      role: "editor",
      isOnline: true,
      cursor: { x: 0, y: 0, color: "#6366f1" }
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const collaborationUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(collaborationUrl);
    toast.success("Collaboration link copied to clipboard!");
  };

  const handleInviteByEmail = () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    // Simulate sending invitation
    toast.success(`Invitation sent to ${inviteEmail}!`);
    setInviteEmail("");
  };

  const handleKickUser = (userId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== userId));
    toast.success("User removed from whiteboard");
  };

  const handleChangeRole = (userId: string, newRole: 'editor' | 'viewer') => {
    setCollaborators(prev => 
      prev.map(c => c.id === userId ? { ...c, role: newRole } : c)
    );
    toast.success("User role updated");
  };

  // Simulate real-time collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => 
        prev.map(collaborator => {
          if (collaborator.isOnline && collaborator.cursor && collaborator.id !== currentUser.id) {
            return {
              ...collaborator,
              cursor: {
                ...collaborator.cursor,
                x: Math.max(0, Math.min(window.innerWidth, collaborator.cursor.x + (Math.random() - 0.5) * 20)),
                y: Math.max(0, Math.min(window.innerHeight, collaborator.cursor.y + (Math.random() - 0.5) * 20))
              }
            };
          }
          return collaborator;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [currentUser.id]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-3 w-3" />;
      case 'editor': return <UserPlus className="h-3 w-3" />;
      case 'viewer': return <Eye className="h-3 w-3" />;
      default: return null;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default' as const;
      case 'editor': return 'secondary' as const;
      case 'viewer': return 'outline' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="shadow-md gap-2">
          <Users className="h-4 w-4" />
          Live Collaboration
          <Badge variant="secondary" className="ml-1">
            {collaborators.filter(c => c.isOnline).length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Collaborate ({collaborators.filter(c => c.isOnline).length} online)
          </DialogTitle>
          <DialogDescription>
            Invite team members to collaborate on this whiteboard in real-time.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Share Link Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Share Link</h4>
            <div className="flex gap-2">
              <Input
                value={collaborationUrl}
                readOnly
                className="text-xs"
              />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Invite by Email Section */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Invite by Email</h4>
            <div className="flex gap-2">
              <Input
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleInviteByEmail()}
              />
              <Button size="sm" onClick={handleInviteByEmail}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Collaborators */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Current Collaborators</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-xs">
                          {collaborator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {collaborator.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {collaborator.name}
                        {collaborator.id === currentUser.id && " (You)"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {collaborator.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant={getRoleBadgeVariant(collaborator.role)} className="text-xs gap-1">
                      {getRoleIcon(collaborator.role)}
                      {collaborator.role}
                    </Badge>
                    {collaborator.role !== 'owner' && collaborator.id !== currentUser.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleKickUser(collaborator.id)}
                        title="Remove user"
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Features Info */}
          <div className="p-3 bg-muted rounded-lg">
            <h5 className="text-xs font-medium mb-1">Real-time Features</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Live cursor tracking</li>
              <li>• Instant shape updates</li>
              <li>• Collaborative editing</li>
              <li>• Auto-save every 30 seconds</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};