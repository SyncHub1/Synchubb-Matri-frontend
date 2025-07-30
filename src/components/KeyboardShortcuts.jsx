import { useEffect, useState } from "react";
import { Command, Kbd } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "⌘ + K", action: "Quick search", category: "Navigation" },
    { key: "⌘ + N", action: "New task", category: "Tasks" },
    { key: "⌘ + B", action: "Toggle sidebar", category: "Navigation" },
    { key: "⌘ + /", action: "Show shortcuts", category: "Help" },
    { key: "⌘ + S", action: "Save whiteboard", category: "Whiteboard" },
    { key: "⌘ + Z", action: "Undo", category: "Whiteboard" },
    { key: "⌘ + Shift + Z", action: "Redo", category: "Whiteboard" },
    { key: "P", action: "Pen tool", category: "Whiteboard" },
    { key: "R", action: "Rectangle tool", category: "Whiteboard" },
    { key: "C", action: "Circle tool", category: "Whiteboard" },
    { key: "E", action: "Eraser tool", category: "Whiteboard" },
    { key: "Del", action: "Delete selected", category: "Whiteboard" },
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-primary mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <span className="text-sm">{shortcut.action}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border/30">
          Press <Kbd className="inline mx-1">⌘ + /</Kbd> to toggle this dialog
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;