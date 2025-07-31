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
  Minimize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import MobileNavigation from "@/components/MobileNavigation";

const TeamIDE = () => {
  const { id } = useParams();
  const [activeFile, setActiveFile] = useState("app.js");
  const [terminalExpanded, setTerminalExpanded] = useState(false);
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
    { name: "app.js", type: "javascript", active: true },
    { name: "components/", type: "folder", children: [
      { name: "EcoTracker.jsx", type: "javascript" },
      { name: "ActivityForm.jsx", type: "javascript" },
      { name: "CarbonChart.jsx", type: "javascript" }
    ]},
    { name: "styles/", type: "folder", children: [
      { name: "main.css", type: "css" },
      { name: "components.css", type: "css" }
    ]},
    { name: "utils/", type: "folder", children: [
      { name: "api.js", type: "javascript" },
      { name: "calculations.js", type: "javascript" }
    ]},
    { name: "package.json", type: "json" },
    { name: "README.md", type: "markdown" }
  ];

  const collaborators = [
    { name: "Alex", avatar: "A", color: "bg-blue-500", cursor: { line: 15, column: 23 } },
    { name: "Sarah", avatar: "S", color: "bg-green-500", cursor: { line: 8, column: 45 } },
    { name: "Mike", avatar: "M", color: "bg-purple-500", cursor: { line: 32, column: 12 } }
  ];

  const runCode = () => {
    console.log("Running code...");
    setTerminalExpanded(true);
  };

  const saveFile = () => {
    console.log("Saving file:", activeFile);
    localStorage.setItem(`ide_file_${activeFile}`, code);
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`ide_file_${activeFile}`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [activeFile]);

  const renderFileTree = (files, level = 0) => {
    return files.map((file, index) => (
      <div key={index} style={{ marginLeft: level * 16 }}>
        <div className={`flex items-center gap-2 p-1 hover:bg-nav-hover rounded cursor-pointer ${
          file.active ? 'bg-nav-active text-nav-active' : ''
        }`} onClick={() => file.type !== 'folder' && setActiveFile(file.name)}>
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
                <span className="text-sm font-semibold text-primary-foreground">IDE</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Team IDE - EcoTrack Project</h1>
                <p className="text-sm text-muted-foreground">Collaborative coding environment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 mr-4">
              {collaborators.map((collab) => (
                <div key={collab.name} className="relative">
                  <Avatar className={`h-6 w-6 border-2 ${collab.color}`}>
                    <AvatarFallback className="text-xs">{collab.avatar}</AvatarFallback>
                  </Avatar>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={saveFile}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="purple" size="sm" onClick={runCode}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <aside className="hidden lg:block w-64 bg-nav-background border-r border-border p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Explorer</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files..."
                className="w-full pl-7 pr-2 py-1 text-xs bg-background border border-input rounded"
              />
            </div>

            <div className="space-y-1">
              {renderFileTree(files)}
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="bg-nav-background border-b border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-background rounded px-3 py-1">
                <File className="h-3 w-3" />
                <span className="text-sm">{activeFile}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTerminalExpanded(!terminalExpanded)}
              >
                <Terminal className="h-4 w-4 mr-2" />
                Terminal
              </Button>
            </div>
          </div>

          {/* Editor and Terminal Split */}
          <div className="flex-1 flex flex-col">
            {/* Code Editor */}
            <div className={`${terminalExpanded ? 'flex-1' : 'flex-1'} relative bg-background`}>
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full resize-none border-none font-mono text-sm bg-background p-4 outline-none"
                style={{ 
                  minHeight: "100%",
                  lineHeight: "1.5",
                  tabSize: 2
                }}
                spellCheck={false}
              />
              
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
                  <Badge variant="secondary" className={`text-xs ${collab.color} text-white border-none`}>
                    {collab.name}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Terminal Section */}
            {terminalExpanded && (
              <div className="h-64 border-t border-border bg-nav-background flex flex-col">
                <div className="flex items-center justify-between p-2 border-b border-border">
                  <h3 className="text-sm font-medium">Terminal</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setTerminalExpanded(false)}
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1 bg-black text-green-400 p-4 font-mono text-sm overflow-y-auto">
                  <div>$ npm run dev</div>
                  <div>Starting development server...</div>
                  <div className="text-green-500">✓ Compiled successfully</div>
                  <div>Local: http://localhost:3000</div>
                  <div>Network: http://192.168.1.100:3000</div>
                  <div className="mt-2">$ </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 bg-nav-background border-l border-border p-4 space-y-4 overflow-y-auto">
          {/* AI Assistant */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">AI Code Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-background rounded p-3 text-sm">
                <p className="text-muted-foreground">💡 Suggestion:</p>
                <p>Consider adding error handling for the API calls using try-catch blocks.</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Apply Suggestion
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 max-h-32 overflow-y-auto">
                <div className="text-xs">
                  <span className="font-medium">Alex:</span> Working on the carbon calculation logic
                </div>
                <div className="text-xs">
                  <span className="font-medium">Sarah:</span> API integration looks good!
                </div>
              </div>
              <div className="flex gap-2">
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

          {/* Project Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs">
                <span className="font-medium">Lines:</span> {code.split('\n').length}
              </div>
              <div className="text-xs">
                <span className="font-medium">Characters:</span> {code.length}
              </div>
              <div className="text-xs">
                <span className="font-medium">Language:</span> JavaScript
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">A</AvatarFallback>
                </Avatar>
                <span>Alex edited <code>app.js</code></span>
              </div>
              <div className="text-xs flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">S</AvatarFallback>
                </Avatar>
                <span>Sarah added <code>api.js</code></span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default TeamIDE;