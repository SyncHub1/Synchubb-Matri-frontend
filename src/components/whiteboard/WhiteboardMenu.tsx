import { useState } from "react";
import {
  FolderOpen,
  Download,
  Image as ImageIcon,
  Users,
  Palette,
  Search,
  HelpCircle,
  RotateCcw,
  Github,
  MessageCircle,
  UserPlus,
  Sun,
  Moon,
  Monitor,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface WhiteboardMenuProps {
  onExportImage: () => void;
  onClearCanvas: () => void;
  onImageUpload: (file: File) => void;
  fabricCanvas: any;
}

export const WhiteboardMenu = ({ 
  onExportImage, 
  onClearCanvas, 
  onImageUpload,
  fabricCanvas 
}: WhiteboardMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      setIsOpen(false);
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleFileInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
      setIsOpen(false);
      toast.success("Image uploaded successfully!");
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleSaveAs = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    
    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataURL;
    link.click();
    
    setIsOpen(false);
    toast.success("Canvas saved successfully!");
  };

  const handleInviteCollaborators = () => {
    // Simulate copying collaboration link
    const collaborationLink = `${window.location.origin}${window.location.pathname}?invite=true`;
    navigator.clipboard.writeText(collaborationLink);
    toast.success("Collaboration link copied to clipboard!");
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: FolderOpen,
      label: "Open",
      shortcut: "Ctrl+O",
      action: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = handleFileInput;
        input.click();
      }
    },
    {
      icon: Download,
      label: "Save to...",
      action: handleSaveAs
    },
    {
      icon: ImageIcon,
      label: "Export image...",
      shortcut: "Ctrl+Shift+E",
      action: onExportImage
    },
    {
      icon: Users,
      label: "Live collaboration...",
      action: handleInviteCollaborators
    },
    {
      icon: Palette,
      label: "Command palette",
      shortcut: "Ctrl+/",
      action: () => toast.info("Command palette coming soon!")
    },
    {
      icon: Search,
      label: "Find on canvas",
      shortcut: "Ctrl+F",
      action: () => toast.info("Search functionality coming soon!")
    }
  ];

  const bottomMenuItems = [
    {
      icon: HelpCircle,
      label: "Help",
      shortcut: "?",
      action: () => toast.info("Help documentation coming soon!")
    },
    {
      icon: RotateCcw,
      label: "Reset the canvas",
      action: () => {
        onClearCanvas();
        setIsOpen(false);
        toast.success("Canvas reset successfully!");
      }
    },
    {
      icon: Github,
      label: "GitHub",
      action: () => window.open("https://github.com", "_blank")
    },
    {
      icon: MessageCircle,
      label: "Discord chat",
      action: () => toast.info("Join our Discord community!")
    },
    {
      icon: UserPlus,
      label: "Sign up",
      action: () => toast.info("Sign up functionality coming soon!")
    }
  ];

  const themeOptions = [
    { icon: Sun, label: "Light", value: "light" },
    { icon: Moon, label: "Dark", value: "dark" },
    { icon: Monitor, label: "System", value: "system" }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-md">
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 bg-current rounded-full" />
            ))}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 max-h-screen">
        <div className="h-full bg-background border-r flex flex-col">
          <SheetHeader className="p-4 pb-2 flex-shrink-0">
            <SheetTitle className="text-left">Whiteboard Menu</SheetTitle>
            <SheetDescription className="text-left">
              Access tools and settings for your collaborative whiteboard
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto whiteboard-menu-scroll">
            <div className="px-4 space-y-1 whiteboard-menu-content">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                  onClick={item.action}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {item.shortcut}
                    </kbd>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="px-4 space-y-1">
              {bottomMenuItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-10"
                  onClick={item.action}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.shortcut && (
                    <kbd className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {item.shortcut}
                    </kbd>
                  )}
                </Button>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="px-4">
              <h4 className="text-sm font-medium mb-2">Theme</h4>
              <div className="flex gap-1">
                {themeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={theme === option.value ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTheme(option.value)}
                    title={option.label}
                  >
                    <option.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div className="px-4 pb-8">
              <h4 className="text-sm font-medium mb-2">Upload Image</h4>
              <label htmlFor="image-upload">
                <Button variant="outline" className="w-full gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Choose Image File
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};