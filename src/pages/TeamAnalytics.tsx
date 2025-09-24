import { Link, useParams } from "react-router-dom";
import { useTeam, useTeamAnalytics } from "@/hooks/useMatriApi";
import { useMatri, MatriConnectionStatus } from "@/contexts/MatriContext";
import { 
  ChevronLeft, 
  TrendingUp, 
  Clock, 
  MessageSquare, 
  Code, 
  CheckCircle, 
  Users,
  Calendar,
  Activity,
  Trophy,
  Target,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import MobileNavigation from "@/components/MobileNavigation";

const TeamAnalytics = () => {
  const { id } = useParams();

  const { isSocketConnected } = useMatri();

  // Use Matri API hooks
  const { data: teamData } = useTeam(id || '');
  const { data: analyticsData } = useTeamAnalytics(id || '');
  
  const team = teamData?.data;
  const analytics = analyticsData?.data || {};

  const teamStats = {
    totalCodingHours: 142,
    tasksCompleted: 18,
    messagesExchanged: 342,
    whiteboardSessions: 12,
    videoCallHours: 24
  };

  const memberStats = [
    {
      name: "Alex",
      avatar: "A",
      codingHours: 45,
      tasksCompleted: 6,
      messagesSent: 89,
      contribution: 85,
      streak: 7
    },
    {
      name: "Sarah", 
      avatar: "S",
      codingHours: 38,
      tasksCompleted: 5,
      messagesSent: 76,
      contribution: 78,
      streak: 5
    },
    {
      name: "Mike",
      avatar: "M", 
      codingHours: 32,
      tasksCompleted: 4,
      messagesSent: 92,
      contribution: 71,
      streak: 3
    },
    {
      name: "You",
      avatar: "Y",
      codingHours: 27,
      tasksCompleted: 3,
      messagesSent: 85,
      contribution: 68,
      streak: 4
    }
  ];

  const weeklyActivity = [
    { day: "Mon", coding: 8, tasks: 3, messages: 25 },
    { day: "Tue", coding: 12, tasks: 4, messages: 31 },
    { day: "Wed", coding: 6, tasks: 2, messages: 18 },
    { day: "Thu", coding: 15, tasks: 5, messages: 42 },
    { day: "Fri", coding: 10, tasks: 4, messages: 38 },
    { day: "Sat", coding: 3, tasks: 1, messages: 12 },
    { day: "Sun", coding: 5, tasks: 2, messages: 15 }
  ];

  const achievements = [
    { title: "Code Warrior", description: "100+ hours of coding", icon: Code, earned: true },
    { title: "Team Player", description: "500+ messages sent", icon: MessageSquare, earned: false },
    { title: "Task Master", description: "20+ tasks completed", icon: CheckCircle, earned: false },
    { title: "Meeting Champion", description: "50+ hours in calls", icon: Clock, earned: false }
  ];

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
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Team Analytics</h1>
                <p className="text-sm text-muted-foreground">Performance insights & statistics</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Live Data
            </Badge>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Code className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{teamStats.totalCodingHours}h</div>
              <p className="text-sm text-muted-foreground">Coding Hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold">{teamStats.tasksCompleted}</div>
              <p className="text-sm text-muted-foreground">Tasks Done</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-info" />
              <div className="text-2xl font-bold">{teamStats.messagesExchanged}</div>
              <p className="text-sm text-muted-foreground">Messages</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-warning" />
              <div className="text-2xl font-bold">{teamStats.whiteboardSessions}</div>
              <p className="text-sm text-muted-foreground">Whiteboard</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{teamStats.videoCallHours}h</div>
              <p className="text-sm text-muted-foreground">Video Calls</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Team Performance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyActivity.map((day) => (
                    <div key={day.day} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{day.day}</span>
                        <span className="text-muted-foreground">{day.coding}h coding</span>
                      </div>
                      <div className="flex gap-1 h-6">
                        <div 
                          className="bg-primary rounded-sm"
                          style={{ width: `${(day.coding / 15) * 100}%` }}
                          title="Coding Hours"
                        />
                        <div 
                          className="bg-success rounded-sm"
                          style={{ width: `${(day.tasks / 5) * 20}%` }}
                          title="Tasks Completed"
                        />
                        <div 
                          className="bg-info rounded-sm"
                          style={{ width: `${(day.messages / 50) * 30}%` }}
                          title="Messages Sent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Coding</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-success rounded"></div>
                    <span>Tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-info rounded"></div>
                    <span>Messages</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Member Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Member Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {memberStats.map((member) => (
                    <div key={member.name} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{member.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.streak} day streak
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {member.contribution}% contribution
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{member.codingHours}h</div>
                          <div className="text-muted-foreground">Coding</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{member.tasksCompleted}</div>
                          <div className="text-muted-foreground">Tasks</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{member.messagesSent}</div>
                          <div className="text-muted-foreground">Messages</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <Progress value={member.contribution} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Project Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>API Development</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Frontend</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Testing</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Team Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.earned ? 'bg-success/10 border border-success/20' : 'bg-muted/50'
                  }`}>
                    <achievement.icon className={`h-6 w-6 ${
                      achievement.earned ? 'text-success' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${
                        achievement.earned ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Most active day</span>
                  <span className="text-sm font-medium">Thursday</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Top contributor</span>
                  <span className="text-sm font-medium">Alex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Team velocity</span>
                  <span className="text-sm font-medium text-success">+12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg. response time</span>
                  <span className="text-sm font-medium">2.3 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;