import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ChevronLeft, 
  Plus, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertCircle,
  Filter,
  Search,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TeamTasks = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("board");

  const tasks = [
    {
      id: "1",
      title: "Implement Carbon Calculator API",
      description: "Create REST API endpoints for carbon footprint calculations with different activity types",
      status: "in-progress",
      priority: "high",
      assignee: { name: "Alex", avatar: "A" },
      dueDate: "2024-01-25",
      tags: ["backend", "api"],
      progress: 60
    },
    {
      id: "2", 
      title: "Design Mobile App UI",
      description: "Create wireframes and mockups for the mobile application interface",
      status: "completed",
      priority: "medium",
      assignee: { name: "Sarah", avatar: "S" },
      dueDate: "2024-01-20",
      tags: ["design", "mobile"],
      progress: 100
    },
    {
      id: "3",
      title: "Set up Database Schema",
      description: "Design and implement the MongoDB schema for user data and activity tracking",
      status: "todo",
      priority: "high",
      assignee: { name: "Mike", avatar: "M" },
      dueDate: "2024-01-28",
      tags: ["database", "backend"],
      progress: 0
    },
    {
      id: "4",
      title: "User Authentication System",
      description: "Implement secure user registration and login functionality",
      status: "in-progress",
      priority: "high",
      assignee: { name: "You", avatar: "Y" },
      dueDate: "2024-01-26",
      tags: ["auth", "security"],
      progress: 75
    },
    {
      id: "5",
      title: "Data Visualization Components",
      description: "Create charts and graphs to display carbon footprint trends",
      status: "todo",
      priority: "low",
      assignee: { name: "Sarah", avatar: "S" },
      dueDate: "2024-02-01",
      tags: ["frontend", "charts"],
      progress: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in-progress": return "bg-primary text-primary-foreground";
      case "todo": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const StatusColumn = ({ status, title, tasks }: { status: string; title: string; tasks: any[] }) => (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {title} ({tasks.length})
        </h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                    </Avatar>
                    <AlertCircle className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                
                {task.status === "in-progress" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div 
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/teams/${id}/chat`} className="flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Task Management</h1>
                <p className="text-sm text-muted-foreground">EcoTrack Innovators Project</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="purple">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="board">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-6">
            <div className="flex gap-6 overflow-x-auto pb-6">
              <StatusColumn 
                status="todo" 
                title="To Do" 
                tasks={tasks.filter(t => t.status === "todo")} 
              />
              <StatusColumn 
                status="in-progress" 
                title="In Progress" 
                tasks={tasks.filter(t => t.status === "in-progress")} 
              />
              <StatusColumn 
                status="completed" 
                title="Completed" 
                tasks={tasks.filter(t => t.status === "completed")} 
              />
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                      >
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </Button>
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace("-", " ")}
                          </Badge>
                          
                          <div className="flex items-center gap-1">
                            <AlertCircle className={`h-3 w-3 ${getPriorityColor(task.priority)}`} />
                            <span className="text-sm text-muted-foreground capitalize">{task.priority}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{task.assignee.avatar}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{task.assignee.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    const hasTasks = day <= 31 && Math.random() > 0.7;
                    
                    return (
                      <div key={i} className={`
                        p-2 h-24 border border-border rounded-lg
                        ${day <= 31 ? 'hover:bg-muted/50 cursor-pointer' : 'bg-muted/20'}
                      `}>
                        {day <= 31 && (
                          <>
                            <div className="text-sm font-medium mb-1">{day}</div>
                            {hasTasks && (
                              <div className="space-y-1">
                                <div className="h-1 bg-primary rounded"></div>
                                <div className="h-1 bg-success rounded"></div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeamTasks;