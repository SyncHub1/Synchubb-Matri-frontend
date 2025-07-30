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
  MoreVertical,
  Trash2,
  Edit2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileNavigation from "@/components/MobileNavigation";
import FloatingActionButton from "@/components/FloatingActionButton";
import QuickActions from "@/components/QuickActions";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import StatusIndicator from "@/components/StatusIndicator";

const TeamTasks = () => {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState("board");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "You",
    dueDate: "",
    tags: []
  });

  const [tasks, setTasks] = useState([
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
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in-progress": return "bg-primary text-primary-foreground";
      case "todo": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: "todo",
      priority: newTask.priority,
      assignee: { name: newTask.assignee, avatar: newTask.assignee[0] },
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      tags: newTask.tags,
      progress: 0
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "You",
      dueDate: "",
      tags: []
    });
    setIsAddingTask(false);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === "completed" ? "todo" : 
                         task.status === "todo" ? "in-progress" : "completed";
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const StatusColumn = ({ status, title, tasks }) => (
    <div className="flex-1 space-y-4 min-w-[280px]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {title} ({tasks.length})
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
        <Card key={task.id} className="bg-gradient-card border-border/30 hover:shadow-card hover:scale-[1.02] transition-all duration-200 cursor-pointer group backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm line-clamp-2 text-foreground">{task.title}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
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
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <MobileNavigation />
            <Link to={`/teams/${id}/chat`} className="hidden sm:flex items-center gap-2 text-nav-foreground hover:text-nav-active">
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

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-10 w-full sm:w-64" />
            </div>
            <Button variant="outline" size="icon" className="hidden sm:flex border-primary/30 hover:bg-primary/10">
              <Filter className="h-4 w-4" />
            </Button>
            <QuickActions />
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button variant="purple" className="hidden sm:flex">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addTask}>
                      Create Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="purple" size="icon" className="sm:hidden" onClick={() => setIsAddingTask(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="board">Kanban Board</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-4 sm:space-y-6">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-6">
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
                <Card key={task.id} className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toggleTaskStatus(task.id)}
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
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card className="bg-gradient-card border-border/30 shadow-card">
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary">Task Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium px-3">January 2024</span>
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-primary border-b border-border/30">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    const currentDate = new Date();
                    const isToday = currentDate.getDate() === day;
                    const tasksForDay = tasks.filter(task => {
                      const taskDate = new Date(task.dueDate);
                      return taskDate.getDate() === day && taskDate.getMonth() === currentDate.getMonth();
                    });
                    
                    return (
                      <div 
                        key={i} 
                        className={`min-h-[120px] p-3 border border-border/30 rounded-lg hover:bg-card/50 transition-all duration-200 cursor-pointer ${
                          isToday ? 'bg-primary/10 border-primary/30 shadow-glow' : 'bg-card/20'
                        }`}
                      >
                        <div className={`text-sm font-medium mb-2 flex items-center justify-between ${
                          isToday ? 'text-primary' : 'text-foreground'
                        }`}>
                          <span>{day}</span>
                          {tasksForDay.length > 0 && (
                            <Badge variant="secondary" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                              {tasksForDay.length}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          {tasksForDay.slice(0, 3).map((task) => (
                            <div 
                              key={task.id} 
                              className={`text-xs p-2 rounded-md ${getStatusColor(task.status)} truncate shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                              title={task.title}
                            >
                              <div className="flex items-center gap-1">
                                <div className={`h-1.5 w-1.5 rounded-full ${getPriorityColor(task.priority)} bg-current`} />
                                {task.title}
                              </div>
                            </div>
                          ))}
                          {tasksForDay.length > 3 && (
                            <div className="text-xs text-muted-foreground px-2 py-1">
                              +{tasksForDay.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="mt-6 pt-4 border-t border-border/30">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Task Status</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-muted"></div>
                      <span className="text-xs text-muted-foreground">To Do</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-primary"></div>
                      <span className="text-xs text-muted-foreground">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-success"></div>
                      <span className="text-xs text-muted-foreground">Completed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <FloatingActionButton />
      <KeyboardShortcuts />
      <StatusIndicator />
    </div>
  );
};

export default TeamTasks;