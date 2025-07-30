import { useState } from "react";
import { Search, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const QuickActions = () => {
  const [notifications] = useState([
    { id: 1, title: "New team member joined", time: "2m ago", unread: true },
    { id: 2, title: "Task deadline approaching", time: "1h ago", unread: true },
    { id: 3, title: "Meeting starts in 15 minutes", time: "15m ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="flex items-center gap-3">
      {/* Quick Search */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Search teams, tasks, or messages..." className="w-full" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Recent Searches</h4>
              <div className="space-y-1">
                <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">Carbon Calculator API</div>
                <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">Team Analytics</div>
                <div className="text-sm p-2 rounded hover:bg-muted cursor-pointer">Mobile App Design</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-popover/95 backdrop-blur-sm">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex-col items-start p-3">
              <div className="flex items-center gap-2 w-full">
                <div className={`h-2 w-2 rounded-full ${notification.unread ? 'bg-primary' : 'bg-muted'}`} />
                <span className="font-medium text-sm">{notification.title}</span>
              </div>
              <span className="text-xs text-muted-foreground ml-4">{notification.time}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center text-primary">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-sm">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">Your Name</p>
              <p className="text-xs text-muted-foreground">your.email@example.com</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default QuickActions;