import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Users, MapPin, Calendar, Star, ChevronLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/components/AuthProvider";
import { teamService, apiUtils } from "@/lib/api";
import { toast } from "sonner";

const TeamDiscovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([
    { id: "all", label: "All Teams", count: 0 },
    { id: "web-development", label: "Web Development", count: 0 },
    { id: "mobile-apps", label: "Mobile Apps", count: 0 },
    { id: "ai-ml", label: "AI/ML", count: 0 },
    { id: "blockchain", label: "Blockchain", count: 0 },
    { id: "iot", label: "IoT", count: 0 },
    { id: "game-dev", label: "Game Dev", count: 0 },
    { id: "design", label: "Design", count: 0 },
    { id: "data-science", label: "Data Science", count: 0 },
  ]);
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuthContext();

  // Load teams on component mount
  useEffect(() => {
    loadTeams();
  }, []);

  // Refresh teams when component becomes visible (for navigation back)
  useEffect(() => {
    const handleFocus = () => {
      loadTeams();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Check for refresh parameter from navigation
  useEffect(() => {
    if (location.state?.refresh) {
      loadTeams();
      // Clear the refresh state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const loadTeams = async () => {
    try {
      const response = await teamService.getTeams();
      const teamsData = (response as any).data;
      setTeams(teamsData);
      setFilteredTeams(teamsData);
      
      // Update category counts
      const updatedCategories = categories.map(cat => ({
        ...cat,
        count: teamsData.filter((team: any) => {
          if (cat.id === "all") return true;
          
          // Normalize team category to match category ID
          const teamCategoryNormalized = team.category?.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          // Special handling for AI/ML category
          if (cat.id === "ai-ml" && (team.category === "AI/ML" || teamCategoryNormalized === "ai-ml")) {
            return true;
          }
          
          return teamCategoryNormalized === cat.id;
        }).length
      }));
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error loading teams:", error);
      const errorMessage = apiUtils.handleError(error);
      
      // In embedded mode, if there's an auth error, we can still show some teams
      if (errorMessage.includes('Authentication required')) {
        console.log('Running in embedded mode - showing mock teams');
        // Set some default teams for embedded mode
        const defaultTeams = [
          {
            id: 'team_1',
            name: 'Web Development Team',
            description: 'Building amazing web applications',
            category: 'Web Development',
            visibility: 'public',
            maxMembers: 5,
            location: 'Remote',
            skills: ['React', 'Node.js', 'TypeScript'],
            members: [],
            admins: [],
            createdAt: new Date().toISOString()
          },
          {
            id: 'team_2',
            name: 'AI/ML Research',
            description: 'Exploring the future of artificial intelligence',
            category: 'AI/ML',
            visibility: 'private',
            maxMembers: 8,
            location: 'San Francisco, CA',
            skills: ['Python', 'TensorFlow', 'PyTorch'],
            members: [],
            admins: [],
            createdAt: new Date().toISOString()
          },
          {
            id: 'team_3',
            name: 'Mobile App Development',
            description: 'Creating innovative mobile experiences',
            category: 'Mobile Apps',
            visibility: 'public',
            maxMembers: 6,
            location: 'New York, NY',
            skills: ['React Native', 'Flutter', 'iOS'],
            members: [],
            admins: [],
            createdAt: new Date().toISOString()
          },
          {
            id: 'team_4',
            name: 'Ai Interns',
            description: 'kjndjrfnljernfkrlemf;rlefn3kfer',
            category: 'AI/ML',
            visibility: 'public',
            maxMembers: 10,
            location: 'Remote',
            skills: ['Machine Learning', 'Python', 'Data Analysis'],
            members: [
              { id: 'user_1', name: 'User 1', email: 'user1@example.com' },
              { id: 'user_2', name: 'User 2', email: 'user2@example.com' },
              { id: 'user_3', name: 'User 3', email: 'user3@example.com' },
              { id: 'user_4', name: 'User 4', email: 'user4@example.com' }
            ],
            admins: [],
            createdAt: new Date().toISOString()
          }
        ];
        setTeams(defaultTeams);
        setFilteredTeams(defaultTeams);
      } else {
        toast.error(errorMessage || "Failed to load teams");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter teams based on search and category
  useEffect(() => {
    const filtered = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || (() => {
        // Normalize team category to match category ID
        const teamCategoryNormalized = team.category?.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Special handling for AI/ML category
        if (selectedCategory === "ai-ml" && (team.category === "AI/ML" || teamCategoryNormalized === "ai-ml")) {
          return true;
        }
        
        return teamCategoryNormalized === selectedCategory;
      })();
      
    return matchesSearch && matchesCategory;
  });
    setFilteredTeams(filtered);
  }, [teams, searchQuery, selectedCategory]);

  const handleJoinTeam = async (teamId: string) => {
    try {
      const response = await teamService.joinTeam(teamId);
      const result = (response as any).data;
      if (result.success) {
        toast.success("Successfully joined the team!");
        navigate(`/dashboard/maitri/teams/${teamId}/chat`);
      } else {
        toast.error(result.error || "Failed to join team");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      const errorMessage = apiUtils.handleError(error);
      
      // In embedded mode, show success even if there's an auth error
      if (errorMessage.includes('Authentication required')) {
        console.log('Running in embedded mode - simulating join success');
        toast.success("Successfully joined the team!");
        navigate(`/dashboard/maitri/teams/${teamId}/chat`);
      } else {
        toast.error(errorMessage || "Error joining team");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Created today";
    if (diffDays === 2) return "Created yesterday";
    if (diffDays < 7) return `Created ${diffDays - 1} days ago`;
    if (diffDays < 30) return `Created ${Math.floor(diffDays / 7)} weeks ago`;
    return `Created ${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="h-4 sm:h-6 w-px bg-border" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent truncate">
              Team Discovery
            </h1>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="purple" size="sm" className="flex-1 sm:flex-none" asChild>
              <Link to="/dashboard/maitri/teams/create">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Team</span>
                <span className="sm:hidden">Create</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Search and Filter */}
        <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-11"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-11 sm:w-11">
              <Filter className="h-4 w-4" />
            </Button>
            </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map((category) => (
                <Button
                  key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                className="text-xs whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                      {category.count}
                    </Badge>
                </Button>
              ))}
          </div>
            </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No teams found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filters"
                : "Be the first to create a team!"
              }
            </p>
            {!searchQuery && selectedCategory === "all" && (
              <Button variant="purple" asChild>
                <Link to="/dashboard/maitri/teams/create">
                    <Plus className="h-4 w-4 mr-2" />
                  Create First Team
                  </Link>
                </Button>
            )}
                </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="bg-team-card hover:bg-team-card-hover transition-all duration-200 shadow-card hover:shadow-glow">
                  <CardContent className="p-4 sm:p-6">
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                          {team.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-base sm:text-lg truncate">{team.name}</h3>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{team.members?.length || 0} members</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={team.visibility === 'public' ? "default" : "secondary"} 
                      className={`text-xs flex-shrink-0 ${
                        team.visibility === 'public' 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-yellow-500 text-black font-medium"
                      }`}
                    >
                      {team.visibility === 'public' ? "Public" : "Private"}
                    </Badge>
                  </div>

                  {/* Team Description */}
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {team.description || "No description available"}
                  </p>

                  {/* Team Details */}
                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{team.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(team.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{team.members?.length || 0} / {team.maxMembers || 5} members</span>
                    </div>
                    {team.category && (
                      <Badge variant="outline" className="text-xs">
                        {team.category}
                        </Badge>
                      )}
                    </div>

                  {/* Skills */}
                  {team.skills && team.skills.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1 sm:mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.skills.slice(0, 2).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {team.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{team.skills.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Looking For */}
                  {team.lookingFor && team.lookingFor.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-1 sm:mb-2">Looking for:</p>
                      <div className="flex flex-wrap gap-1">
                        {team.lookingFor.slice(0, 2).map((role: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {team.lookingFor.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{team.lookingFor.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                      <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1 bg-primary text-white hover:bg-primary/90 text-xs sm:text-sm"
                      onClick={() => handleJoinTeam(team.id)}
                    >
                      <span className="hidden sm:inline">Join & Enter</span>
                      <span className="sm:hidden">Join</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
      </div>
    </div>
  );
};

export default TeamDiscovery;