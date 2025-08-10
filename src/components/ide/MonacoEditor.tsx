import { useRef, useEffect, useState } from 'react';
import { 
  Loader2, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2,
  Settings,
  Palette,
  Type,
  Zap,
  Code,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { LanguageSelector } from './LanguageSelector';
import { TechStackSelector } from './TechStackSelector';
import { ThemeToggle } from './ThemeToggle';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  readOnly?: boolean;
  fileName?: string;
  onSave?: () => void;
  onLanguageChange?: (language: string) => void;
  onTechStackChange?: (stack: string) => void;
  selectedTechStack?: string;
  collaborators?: Array<{
    name: string;
    avatar: string;
    color: string;
    cursor: { line: number; column: number };
  }>;
}

export const MonacoEditor = ({
  value,
  onChange,
  language,
  theme = 'vs-dark',
  readOnly = false,
  fileName = 'untitled',
  onSave,
  onLanguageChange,
  onTechStackChange,
  selectedTechStack = 'react',
  collaborators = []
}: MonacoEditorProps) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [fontSize, setFontSize] = useState(14);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
        toast({
          title: "File saved",
          description: `${fileName} has been saved successfully.`,
        });
      }
      
      // Ctrl/Cmd + Space for AI suggestions
      if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
        e.preventDefault();
        triggerAISuggestions();
      }

      // F11 for fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Ctrl/Cmd + / for comment toggle
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        toggleComment();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fileName, onSave]);

  // Track cursor position
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleCursorChange = () => {
      const cursorPos = editor.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      setCursorPosition({ line, column });
    };

    editor.addEventListener('selectionchange', handleCursorChange);
    editor.addEventListener('click', handleCursorChange);
    editor.addEventListener('keyup', handleCursorChange);

    return () => {
      editor.removeEventListener('selectionchange', handleCursorChange);
      editor.removeEventListener('click', handleCursorChange);
      editor.removeEventListener('keyup', handleCursorChange);
    };
  }, [value]);

  const triggerAISuggestions = () => {
    setShowSuggestions(true);
    // Simulate AI suggestions based on current context
    const suggestions = [
      'console.log("Debug:", variable);',
      'const handleClick = () => {};',
      'try {\n  // Your code here\n} catch (error) {\n  console.error(error);\n}',
      'import { useState } from "react";'
    ];
    setAiSuggestions(suggestions);
    
    // Auto-hide suggestions after 5 seconds
    setTimeout(() => setShowSuggestions(false), 5000);
  };

  const applySuggestion = (suggestion: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const cursorPos = editor.selectionStart;
    const textBefore = value.substring(0, cursorPos);
    const textAfter = value.substring(cursorPos);
    const newValue = textBefore + suggestion + textAfter;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Focus back to editor
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(cursorPos + suggestion.length, cursorPos + suggestion.length);
    }, 0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleComment = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    if (language === 'javascript' || language === 'typescript') {
      if (selectedText.trim().startsWith('//')) {
        newText = selectedText.replace(/^\/\/ ?/, '');
      } else {
        newText = '// ' + selectedText;
      }
    } else if (language === 'css') {
      if (selectedText.trim().startsWith('/*')) {
        newText = selectedText.replace(/^\/\* ?/, '').replace(/ ?\*\/$/, '');
      } else {
        newText = `/* ${selectedText} */`;
      }
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast({
        title: "Code copied",
        description: "Code has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatCode = () => {
    // Simple formatting for demo purposes
    let formatted = value;
    if (language === 'javascript' || language === 'typescript') {
      // Basic indentation
      formatted = value
        .split('\n')
        .map(line => {
          const trimmed = line.trim();
          let indentLevel = 0;
          if (trimmed.includes('{')) indentLevel++;
          if (trimmed.includes('}')) indentLevel--;
          return '  '.repeat(Math.max(0, indentLevel)) + trimmed;
        })
        .join('\n');
    }
    onChange(formatted);
    toast({
      title: "Code formatted",
      description: "Code has been auto-formatted.",
    });
  };

  const getLanguageColor = () => {
    switch (language) {
      case 'javascript': return 'bg-yellow-500';
      case 'typescript': return 'bg-blue-500';
      case 'css': return 'bg-purple-500';
      case 'html': return 'bg-orange-500';
      case 'json': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div ref={containerRef} className={`relative h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-nav-background">
        <div className="flex items-center gap-2">
          <LanguageSelector 
            selectedLanguage={language} 
            onLanguageChange={onLanguageChange || (() => {})} 
          />
          <TechStackSelector 
            selectedStack={selectedTechStack} 
            onStackChange={onTechStackChange || (() => {})} 
          />
          <span className="text-sm text-muted-foreground">
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span className="text-xs text-muted-foreground">
            {value.length} chars
          </span>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-7 px-2"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="h-7 px-2"
          >
            <Zap className="h-3 w-3" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Settings className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setCurrentTheme(currentTheme === 'vs-dark' ? 'vs-light' : 'vs-dark')}>
                <Palette className="h-4 w-4 mr-2" />
                Toggle Editor Theme
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => setFontSize(prev => prev < 20 ? prev + 2 : 12)}>
                <Type className="h-4 w-4 mr-2" />
                Font Size: {fontSize}px
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={triggerAISuggestions}>
                <Zap className="h-4 w-4 mr-2" />
                AI Autocomplete (Ctrl+Space)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-7 px-2"
          >
            {isFullscreen ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative h-full">
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`w-full h-full resize-none border-none font-mono bg-background p-4 outline-none ${
            currentTheme === 'vs-dark' ? 'bg-gray-900 text-green-400' : 'bg-white text-gray-900'
          }`}
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.5',
            tabSize: 2
          }}
          spellCheck={false}
          placeholder="Start typing your code..."
        />

        {/* AI Suggestions Panel */}
        {showSuggestions && aiSuggestions.length > 0 && (
          <Card className="absolute top-4 right-4 w-80 max-h-64 overflow-y-auto z-10 border border-primary/20 shadow-lg">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Suggestions</span>
                <Badge variant="secondary" className="text-xs">Ctrl+Space</Badge>
              </div>
              
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full text-left p-2 rounded text-xs font-mono bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Collaboration Cursors */}
        {collaborators.map((collab) => (
          <div
            key={collab.name}
            className="absolute pointer-events-none"
            style={{
              top: `${collab.cursor.line * 1.5}rem`,
              left: `${collab.cursor.column * 0.6}rem`
            }}
          >
            <div className={`w-0.5 h-5 ${collab.color}`}></div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${collab.color} text-white border-none mt-1`}
            >
              {collab.name}
            </Badge>
          </div>
        ))}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-border bg-nav-background text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>LF</span>
          <span>{language}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Spaces: 2</span>
          <span>Tab Size: 2</span>
          {collaborators.length > 0 && (
            <span>{collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
};