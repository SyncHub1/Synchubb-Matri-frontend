import { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Play, 
  Save, 
  Settings, 
  FolderOpen,
  File,
  Plus,
  Search,
  Users,
  MessageSquare,
  Download,
  Terminal,
  Maximize2,
  Minimize2,
  Menu,
  X,
  PanelLeft,
  PanelRight,
  Zap,
  Brain,
  Sparkles,
  Code2,
  Globe,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileNavigation from "@/components/MobileNavigation";
import { MonacoEditor } from "@/components/ide/MonacoEditor";
import { EnhancedTerminal } from "@/components/ide/EnhancedTerminal";
import { FileExplorer } from "@/components/ide/FileExplorer";
import { toast } from "@/hooks/use-toast";

const TeamIDE = () => {
  const { id } = useParams();
  const [activeFile, setActiveFile] = useState("app.js");
  const [terminalExpanded, setTerminalExpanded] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("editor");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [selectedTemplate, setSelectedTemplate] = useState("react");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedTechStack, setSelectedTechStack] = useState("react");
  const [previewUrl, setPreviewUrl] = useState("http://localhost:8080");
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const editorRef = useRef(null);
  const [code, setCode] = useState(`// Welcome to SyncHubb Team IDE
// Collaborative coding environment for your team

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EcoTracker = () => {
  const [carbonFootprint, setCarbonFootprint] = useState(0);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch user's carbon tracking data
    fetchCarbonData();
  }, []);

  const fetchCarbonData = async () => {
    try {
      const response = await axios.get('/api/carbon-data');
      setCarbonFootprint(response.data.totalCarbon);
      setActivities(response.data.activities);
    } catch (error) {
      console.error('Error fetching carbon data:', error);
    }
  };

  const addActivity = async (activity) => {
    try {
      const response = await axios.post('/api/activities', activity);
      setActivities([...activities, response.data]);
      setCarbonFootprint(prev => prev + activity.carbonImpact);
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <div className="eco-tracker">
      <h1>EcoTrack - Carbon Footprint Monitor</h1>
      <div className="carbon-display">
        <h2>Total Carbon Footprint: {carbonFootprint} kg CO2</h2>
      </div>
      {/* Add more components here */}
    </div>
  );
};

export default EcoTracker;`);

  const files = [
    { 
      id: "1", 
      name: "app.js", 
      type: "file" as const, 
      path: "/app.js",
      size: 2840,
      modified: new Date(),
      language: "javascript"
    },
    { 
      id: "2",
      name: "components", 
      type: "folder" as const, 
      path: "/components",
      children: [
        { id: "3", name: "EcoTracker.jsx", type: "file" as const, path: "/components/EcoTracker.jsx", size: 1256, language: "javascript" },
        { id: "4", name: "ActivityForm.jsx", type: "file" as const, path: "/components/ActivityForm.jsx", size: 892, language: "javascript" },
        { id: "5", name: "CarbonChart.jsx", type: "file" as const, path: "/components/CarbonChart.jsx", size: 1504, language: "javascript" }
      ]
    },
    { 
      id: "6",
      name: "styles", 
      type: "folder" as const, 
      path: "/styles",
      children: [
        { id: "7", name: "main.css", type: "file" as const, path: "/styles/main.css", size: 456, language: "css" },
        { id: "8", name: "components.css", type: "file" as const, path: "/styles/components.css", size: 678, language: "css" }
      ]
    },
    { 
      id: "9",
      name: "utils", 
      type: "folder" as const, 
      path: "/utils",
      children: [
        { id: "10", name: "api.js", type: "file" as const, path: "/utils/api.js", size: 234, language: "javascript" },
        { id: "11", name: "calculations.js", type: "file" as const, path: "/utils/calculations.js", size: 567, language: "javascript" }
      ]
    },
    { id: "12", name: "package.json", type: "file" as const, path: "/package.json", size: 890, language: "json" },
    { id: "13", name: "README.md", type: "file" as const, path: "/README.md", size: 1234, language: "markdown" }
  ];

  const templates = [
    { id: "react", name: "React", description: "Modern React with Hooks" },
    { id: "nextjs", name: "Next.js", description: "Full-stack React framework" },
    { id: "vue", name: "Vue 3", description: "Progressive JavaScript framework" },
    { id: "angular", name: "Angular", description: "Platform for mobile & desktop" },
    { id: "express", name: "Express", description: "Fast Node.js web framework" },
    { id: "fastapi", name: "FastAPI", description: "Modern Python web framework" }
  ];

  const collaborators = [
    { name: "Alex", avatar: "A", color: "bg-blue-500", cursor: { line: 15, column: 23 } },
    { name: "Sarah", avatar: "S", color: "bg-green-500", cursor: { line: 8, column: 45 } },
    { name: "Mike", avatar: "M", color: "bg-purple-500", cursor: { line: 32, column: 12 } }
  ];

  const runCode = () => {
    console.log("Running code...");
    setTerminalExpanded(true);
    toast({
      title: "Code execution started",
      description: "Your code is being compiled and executed.",
    });
  };

  const saveFile = () => {
    console.log("Saving file:", activeFile);
    localStorage.setItem(`ide_file_${activeFile}`, code);
    toast({
      title: "File saved",
      description: `${activeFile} has been saved successfully.`,
    });
  };

  const handleFileSelect = (file: any) => {
    if (file.type === 'file') {
      setActiveFile(file.name);
      setShowFileExplorer(false); // Close mobile file explorer
      
      // Load file content (in real app, this would fetch from server)
      const savedCode = localStorage.getItem(`ide_file_${file.name}`);
      if (savedCode) {
        setCode(savedCode);
      }
    }
  };

  const deployProject = () => {
    toast({
      title: "Deployment started",
      description: "Your project is being deployed to production.",
    });
  };

  const openAIAssistant = () => {
    setIsAiAssistantOpen(true);
    toast({
      title: "AI Assistant activated",
      description: "Ask me anything about your code!",
    });
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`ide_file_${activeFile}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [activeFile]);

  const renderFileTree = (files: any[], level = 0) => {
    return files.map((file, index) => (
      <div key={index} style={{ marginLeft: level * 16 }}>
        <div className={`flex items-center gap-2 p-1 hover:bg-nav-hover rounded cursor-pointer ${
          file.active ? 'bg-nav-active text-nav-active' : ''
        }`} onClick={() => {
          if (file.type !== 'folder') {
            setActiveFile(file.name);
            setShowFileExplorer(false); // Close mobile file explorer
          }
        }}>
          {file.type === 'folder' ? (
            <FolderOpen className="h-4 w-4 text-yellow-500" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm">{file.name}</span>
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  const FileExplorerContent = () => (
    <FileExplorer
      files={files}
      activeFile={activeFile}
      onFileSelect={handleFileSelect}
      onFileCreate={(path, type) => {
        console.log(`Creating ${type} at ${path}`);
      }}
      onFileDelete={(file) => {
        console.log(`Deleting ${file.name}`);
      }}
      onFileRename={(file, newName) => {
        console.log(`Renaming ${file.name} to ${newName}`);
      }}
    />
  );

  const RightPanelContent = () => (
    <Tabs defaultValue="ai-assistant" className="h-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="ai-assistant">AI</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ai-assistant" className="space-y-4 mt-4">
        {/* Enhanced AI Assistant */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Code Assistant
              <Badge variant="default" className="text-xs">GPT-4</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-background rounded p-3 text-sm border border-primary/20">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground text-xs">💡 Smart Suggestion:</p>
                  <p className="text-sm">Consider adding error handling for the API calls using try-catch blocks. This will improve user experience and debugging.</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Apply Fix
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                Explain
              </Button>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI about your code..."
                  className="flex-1 px-2 py-1 text-xs border border-input rounded"
                />
                <Button size="sm" className="px-2 py-1 h-auto">
                  <Zap className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Code2 className="h-4 w-4 mr-2" />
              Format Code
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Auto-complete
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Find & Replace
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="chat" className="space-y-4 mt-4">
        {/* Enhanced Live Chat */}
        <Card className="h-80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Team Chat
              <Badge variant="secondary" className="text-xs">{collaborators.length} online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 h-full flex flex-col">
            <div className="flex-1 space-y-2 overflow-y-auto">
              <div className="text-xs flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">A</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Alex</div>
                  <div>Working on the carbon calculation logic. The API integration is almost done!</div>
                </div>
              </div>
              <div className="text-xs flex items-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">S</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Sarah</div>
                  <div>Great! I've added some error handling in the utils folder.</div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-2 py-1 text-xs border border-input rounded"
              />
              <Button size="sm" className="px-2 py-1 h-auto">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="preview" className="space-y-4 mt-4">
        {/* Live Preview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Live Preview
              <Badge variant="secondary" className="text-xs">Auto-refresh</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Preview will appear here</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Globe className="h-3 w-3 mr-1" />
                Open
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Deploy
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Project Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Project Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-xs">
              <span className="font-medium">Lines:</span> {code.split('\n').length}
            </div>
            <div className="text-xs">
              <span className="font-medium">Characters:</span> {code.length}
            </div>
            <div className="text-xs">
              <span className="font-medium">Files:</span> 8
            </div>
            <div className="text-xs">
              <span className="font-medium">Template:</span> {selectedTemplate}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile File Explorer Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-8 w-8 p-0"
              onClick={() => setShowFileExplorer(!showFileExplorer)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            
            {/* Back Button - Show on mobile */}
            <Link to={`/dashboard/maitri/teams/${id}/chat`} className="lg:hidden flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-primary-foreground">IDE</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-semibold truncate">Team IDE - EcoTrack</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Collaborative coding environment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Collaborators - Hide on very small screens */}
            <div className="hidden xs:flex items-center gap-1 mr-2 sm:mr-4">
              {collaborators.map((collab) => (
                <div key={collab.name} className="relative">
                  <Avatar className={`h-5 w-5 sm:h-6 sm:w-6 border-2 ${collab.color}`}>
                    <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
            
            {/* Desktop Action Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={saveFile}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="purple" size="sm" onClick={runCode}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="sm:hidden flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 px-2" onClick={saveFile}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="purple" size="sm" className="h-8 px-2" onClick={runCode}>
                <Play className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Right Panel Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              onClick={() => setShowRightPanel(!showRightPanel)}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile File Explorer Overlay */}
        {showFileExplorer && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFileExplorer(false)} />
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-nav-background border-r border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold">File Explorer</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowFileExplorer(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4">
                <FileExplorerContent />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Right Panel Overlay */}
        {showRightPanel && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowRightPanel(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-nav-background border-l border-border">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="font-semibold">Tools & Chat</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowRightPanel(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto h-full">
                <RightPanelContent />
              </div>
            </div>
          </div>
        )}

        {/* Desktop File Explorer */}
        <aside className="hidden lg:block w-64 bg-nav-background border-r border-border p-4 overflow-y-auto">
          <FileExplorerContent />
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Editor Tabs */}
          <div className="bg-nav-background border-b border-border px-3 sm:px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1 bg-background rounded px-2 sm:px-3 py-1">
                <File className="h-3 w-3" />
                <span className="text-xs sm:text-sm truncate">{activeFile}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 sm:h-8 px-2 sm:px-3"
                onClick={() => setTerminalExpanded(!terminalExpanded)}
              >
                <Terminal className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Terminal</span>
              </Button>
            </div>
          </div>

          {/* Editor and Terminal Split */}
          <div className="flex-1 flex flex-col">
            {/* Enhanced Monaco Editor */}
            <div className={`${terminalExpanded ? 'flex-1' : 'flex-1'} relative`}>
              <MonacoEditor
                value={code}
                onChange={setCode}
                language={selectedLanguage}
                theme={editorTheme}
                fileName={activeFile}
                onSave={saveFile}
                onLanguageChange={setSelectedLanguage}
                onTechStackChange={setSelectedTechStack}
                selectedTechStack={selectedTechStack}
                collaborators={collaborators}
              />
            </div>

            {/* Enhanced Terminal */}
            <EnhancedTerminal
              expanded={terminalExpanded}
              onToggle={() => setTerminalExpanded(!terminalExpanded)}
              className="h-48 sm:h-64"
            />
          </div>
        </main>

        {/* Desktop Right Sidebar */}
        <aside className="hidden xl:block w-80 bg-nav-background border-l border-border p-4 space-y-4 overflow-y-auto">
          <RightPanelContent />
        </aside>
      </div>
    </div>
  );
};

export default TeamIDE;