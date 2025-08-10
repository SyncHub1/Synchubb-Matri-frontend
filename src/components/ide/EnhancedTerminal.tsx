import { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  X, 
  Maximize2, 
  Minimize2,
  Copy,
  Trash2,
  Plus,
  Settings,
  Play,
  Square,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface TerminalSession {
  id: string;
  name: string;
  output: string[];
  isRunning: boolean;
  currentDirectory: string;
}

interface EnhancedTerminalProps {
  expanded: boolean;
  onToggle: () => void;
  onClose?: () => void;
  className?: string;
}

export const EnhancedTerminal = ({ 
  expanded, 
  onToggle, 
  onClose,
  className = ""
}: EnhancedTerminalProps) => {
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: '1',
      name: 'Terminal 1',
      output: [
        '$ npm run dev',
        'Starting development server...',
        '✓ Compiled successfully',
        'Local: http://localhost:8080',
        'Network: http://192.168.1.100:8080',
        '$ '
      ],
      isRunning: true,
      currentDirectory: '~/project'
    }
  ]);
  
  const [activeSession, setActiveSession] = useState('1');
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentSession = sessions.find(s => s.id === activeSession);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [currentSession?.output]);

  // Focus input when terminal expands
  useEffect(() => {
    if (expanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded]);

  const addNewSession = () => {
    const newId = (sessions.length + 1).toString();
    const newSession: TerminalSession = {
      id: newId,
      name: `Terminal ${sessions.length + 1}`,
      output: ['$ '],
      isRunning: false,
      currentDirectory: '~/project'
    };
    
    setSessions([...sessions, newSession]);
    setActiveSession(newId);
  };

  const closeSession = (sessionId: string) => {
    if (sessions.length === 1) return; // Don't close last session
    
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    
    if (activeSession === sessionId) {
      setActiveSession(updatedSessions[0]?.id || '');
    }
  };

  const executeCommand = (cmd: string) => {
    if (!currentSession || !cmd.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Add command to output
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        const newOutput = [...session.output];
        // Remove the last prompt and add the command
        newOutput[newOutput.length - 1] = `$ ${cmd}`;
        
        // Simulate command execution
        const result = simulateCommand(cmd);
        newOutput.push(...result);
        newOutput.push('$ '); // Add new prompt
        
        return {
          ...session,
          output: newOutput,
          isRunning: cmd.includes('dev') || cmd.includes('start') || cmd.includes('serve')
        };
      }
      return session;
    });

    setSessions(updatedSessions);
    setCommand('');
  };

  const simulateCommand = (cmd: string): string[] => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (trimmedCmd.startsWith('npm run dev') || trimmedCmd.startsWith('npm start')) {
      return [
        'Starting development server...',
        '✓ Compiled successfully',
        'Local: http://localhost:8080',
        'Network: http://192.168.1.100:8080',
        'Ready in 1.2s'
      ];
    }
    
    if (trimmedCmd.startsWith('npm install') || trimmedCmd.startsWith('npm i')) {
      const pkg = trimmedCmd.split(' ').pop();
      return [
        `Installing ${pkg || 'dependencies'}...`,
        'added 1 package, and audited 2 packages in 3s',
        'found 0 vulnerabilities'
      ];
    }
    
    if (trimmedCmd === 'ls' || trimmedCmd === 'dir') {
      return [
        'node_modules    package.json    src',
        'public          README.md       vite.config.ts',
        'index.html      tailwind.config.ts'
      ];
    }
    
    if (trimmedCmd.startsWith('cd ')) {
      const dir = trimmedCmd.substring(3);
      return [`Changed directory to ${dir}`];
    }
    
    if (trimmedCmd === 'pwd') {
      return [currentSession?.currentDirectory || '~/project'];
    }
    
    if (trimmedCmd === 'clear' || trimmedCmd === 'cls') {
      // Clear will be handled differently
      return [];
    }
    
    if (trimmedCmd.startsWith('git ')) {
      return [
        'Git command executed successfully',
        'No changes to commit'
      ];
    }
    
    if (trimmedCmd === 'node --version' || trimmedCmd === 'node -v') {
      return ['v18.17.0'];
    }
    
    if (trimmedCmd === 'npm --version' || trimmedCmd === 'npm -v') {
      return ['9.6.7'];
    }
    
    // Default response for unknown commands
    return [`Command not found: ${cmd}`];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple autocomplete
      const suggestions = ['npm run dev', 'npm install', 'git status', 'ls', 'cd src'];
      const match = suggestions.find(s => s.startsWith(command));
      if (match) {
        setCommand(match);
      }
    }
  };

  const clearTerminal = () => {
    if (!currentSession) return;
    
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        return {
          ...session,
          output: ['$ ']
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
  };

  const stopProcess = () => {
    if (!currentSession) return;
    
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        const newOutput = [...session.output];
        newOutput[newOutput.length - 1] = '^C';
        newOutput.push('Process terminated');
        newOutput.push('$ ');
        
        return {
          ...session,
          output: newOutput,
          isRunning: false
        };
      }
      return session;
    });
    
    setSessions(updatedSessions);
  };

  const copyOutput = async () => {
    if (!currentSession) return;
    
    try {
      await navigator.clipboard.writeText(currentSession.output.join('\n'));
      toast({
        title: "Terminal output copied",
        description: "Terminal content has been copied to clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!expanded) return null;

  return (
    <div className={`border-t border-border bg-nav-background flex flex-col ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Terminal</span>
          {currentSession?.isRunning && (
            <Badge variant="default" className="text-xs bg-green-500">
              Running
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={addNewSession}
            className="h-7 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Settings className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyOutput}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Output
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearTerminal}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Terminal
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {currentSession?.isRunning ? (
                <DropdownMenuItem onClick={stopProcess}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Process
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => executeCommand('npm run dev')}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Dev Server
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-7 px-2"
          >
            <Minimize2 className="h-3 w-3" />
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Tabs */}
      <Tabs value={activeSession} onValueChange={setActiveSession} className="flex-1 flex flex-col">
        <div className="px-2 pt-2">
          <TabsList className="grid w-full grid-cols-auto">
            {sessions.map((session) => (
              <TabsTrigger 
                key={session.id} 
                value={session.id}
                className="relative group"
              >
                <span className="text-xs">{session.name}</span>
                {sessions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeSession(session.id);
                    }}
                    className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity"
                  >
                    <X className="h-2 w-2" />
                  </button>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {sessions.map((session) => (
          <TabsContent key={session.id} value={session.id} className="flex-1 flex flex-col m-0">
            {/* Terminal Output */}
            <div 
              ref={terminalRef}
              className="flex-1 bg-black text-green-400 p-3 font-mono text-sm overflow-y-auto"
            >
              {session.output.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
            </div>

            {/* Terminal Input */}
            <div className="bg-black border-t border-gray-700 p-3 flex items-center font-mono text-sm">
              <span className="text-green-400 mr-2">$</span>
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-green-400 outline-none"
                placeholder="Type a command..."
                autoComplete="off"
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};