import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string;
  x: number;
  y: number;
  isActive: boolean;
}

interface CollaboratorCursorsProps {
  collaborators: Collaborator[];
}

export const CollaboratorCursors = ({ collaborators }: CollaboratorCursorsProps) => {
  return (
    <>
      {collaborators
        .filter(c => c.isActive && c.name !== "You")
        .map((collaborator) => (
          <div
            key={collaborator.id}
            className="absolute pointer-events-none z-50 transition-all duration-100"
            style={{
              left: `${collaborator.x}px`,
              top: `${collaborator.y}px`,
              transform: 'translate(-2px, -2px)'
            }}
          >
            {/* Cursor */}
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 16 16" className="absolute">
                <path
                  d="M0 0L16 6L6 16Z"
                  fill={collaborator.color}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Name Badge */}
              <div 
                className="ml-4 -mt-1 text-xs font-medium px-2 py-1 rounded shadow-lg text-white whitespace-nowrap"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.name}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

// Collaborator avatars for the bottom panel
export const CollaboratorAvatars = ({ collaborators }: { collaborators: Collaborator[] }) => {
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-2 flex items-center gap-2">
      {collaborators
        .filter(c => c.isActive)
        .map((collaborator) => (
          <div key={collaborator.id} className="relative">
            <Avatar 
              className="h-8 w-8 ring-2 ring-background" 
              style={{ backgroundColor: collaborator.color }}
            >
              <AvatarFallback 
                className="text-xs font-medium text-white"
                style={{ backgroundColor: collaborator.color }}
              >
                {collaborator.avatar}
              </AvatarFallback>
            </Avatar>
            <div 
              className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background"
              style={{ backgroundColor: collaborator.color }}
            />
          </div>
        ))}
    </div>
  );
};