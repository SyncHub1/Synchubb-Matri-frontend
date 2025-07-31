import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, Users, MapPin, Calendar, Star, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TeamDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "all", count: 8 },
    { id: "web-development", label: "Web Development", count: 3 },
    { id: "mobile-apps", label: "Mobile Apps", count: 2 },
    { id: "ai-ml", label: "AI/ML", count: 2 },
    { id: "blockchain", label: "Blockchain", count: 1 },
    { id: "iot", label: "IoT", count: 0 },
    { id: "game-dev", label: "Game Dev", count: 0 },
    { id: "design", label: "Design", count: 0 },
    { id: "data-science", label: "Data Science", count: 0 },
  ];

  const teams = [
    {
      id: "1",
      name: "EcoTrack Innovators",
      category: "Mobile Apps",
      description: "Building a comprehensive environmental tracking app for sustainable living. Join us to make a difference!",
      members: "3/5 members",
      location: "Remote",
      created: "Created 2 days ago",
      rating: 4.8,
      lookingFor: ["UI/UX Designer", "Backend Developer (Node.js)"],
      teamMembers: ["A", "S", "M"],
      isPublic: true
    },
    {
      id: "2", 
      name: "AI Study Buddy",
      category: "AI/ML",
      description: "Creating an AI-powered personalized learning assistant for students. Seeking passionate AI enthusiasts!",
      members: "2/4 members",
      location: "San Francisco, CA",
      created: "Created 1 week ago",
      rating: 4.6,
      lookingFor: ["ML Engineer (Python)", "Frontend Developer (React)"],
      teamMembers: ["E", "R"],
      isPublic: true
    },
    {
      id: "3",
      name: "CryptoTrade Analytics",
      category: "Blockchain",
      description: "Developing advanced analytics tools for cryptocurrency trading with real-time market insights.",
      members: "4/6 members", 
      location: "New York, NY",
      created: "Created 3 days ago",
      rating: 4.9,
      lookingFor: ["Blockchain Developer", "Data Scientist"],
      teamMembers: ["J", "K", "L", "M"],
      isPublic: false
    },
    {
      id: "4",
      name: "HealthTech Solutions",
      category: "Web Development",
      description: "Building a comprehensive health management platform connecting patients with healthcare providers.",
      members: "5/8 members",
      location: "Boston, MA", 
      created: "Created 5 days ago",
      rating: 4.7,
      lookingFor: ["Full Stack Developer", "DevOps Engineer", "Product Manager"],
      teamMembers: ["T", "U", "V", "W", "X"],
      isPublic: true
    }
  ];

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           team.category.toLowerCase().replace(/[^a-z0-9]/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-nav-foreground hover:text-nav-active">
              <ChevronLeft className="h-5 w-5" />
              <span className="text-lg font-semibold">SyncHubb</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Team Discovery
            </h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, users..."
                className="pl-10 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="hidden sm:flex">
              <Users className="h-4 w-4" />
            </Button>
            <Avatar className="hidden sm:flex">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Discover open teams or forge your own path to innovation.</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search open teams..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>

            {/* Create Team */}
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-2">Create Your Team</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to lead? Start your own project team now.
                </p>
                <Button variant="purple" className="w-full" asChild>
                  <Link to="/teams/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Filter Teams */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Filter Teams</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Refine your search for the perfect team.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Use the search bar and category badges above to find teams that match your interests and skills.
                </p>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                        <Badge variant="secondary" className="bg-team-badge text-team-badge-foreground">
                          {team.category}
                        </Badge>
                      </div>
                      {!team.isPublic && (
                        <Badge variant="outline" className="border-warning text-warning">
                          Private
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-4">{team.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {team.members}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {team.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {team.created}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-2">
                        {team.lookingFor.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Team Members:</p>
                      <div className="flex gap-2">
                        {team.teamMembers.map((member, index) => (
                          <Avatar key={index} className="h-8 w-8">
                            <AvatarFallback className="text-xs">{member}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{team.rating}</span>
                      </div>
                      <Button variant="team" asChild>
                        <Link to={`/teams/${team.id}/chat`}>
                          Join Team
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTeams.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No teams found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or category filters.
                </p>
                <Button variant="purple" asChild>
                  <Link to="/teams/create">Create Your Own Team</Link>
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TeamDiscovery;