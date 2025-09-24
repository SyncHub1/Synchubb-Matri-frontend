import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, Lock, Globe, Info, Search, Mail, UserPlus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useCreateTeam, useSearchUsers, useSendInvitations } from "@/hooks/useMatriApi";
import { useMatri, MatriConnectionStatus } from "@/contexts/MatriContext";

const CreateTeam = () => {
  const navigate = useNavigate();
  const { isConnected } = useMatri();
  
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "public" as "public" | "private",
    maxMembers: 5,
    location: "",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");
  
  // Member invitation states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [emailInvites, setEmailInvites] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  
  // Use the new Matri API hooks
  const createTeamMutation = useCreateTeam();
  const { data: userSearchData } = useSearchUsers(searchQuery);
  const sendInvitationsMutation = useSendInvitations();
  
  const isLoading = createTeamMutation.isPending || sendInvitationsMutation.isPending;

  const categories = [
    "Web Development",
    "Mobile Apps", 
    "AI/ML",
    "Blockchain",
    "IoT",
    "Game Dev",
    "Design",
    "Data Science"
  ];

  // Mock authenticated users for demonstration
  const mockUsers = [
    { id: 'user_1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ' },
    { id: 'user_2', name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC' },
    { id: 'user_3', name: 'Mike Rodriguez', email: 'mike@example.com', avatar: 'MR' },
    { id: 'user_4', name: 'Emma Wilson', email: 'emma@example.com', avatar: 'EW' },
    { id: 'user_5', name: 'David Kim', email: 'david@example.com', avatar: 'DK' },
    { id: 'user_6', name: 'Lisa Thompson', email: 'lisa@example.com', avatar: 'LT' },
  ];

  const addSkill = () => {
    if (skillInput && !teamData.skills.includes(skillInput)) {
      setTeamData({
        ...teamData,
        skills: [...teamData.skills, skillInput]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setTeamData({
      ...teamData,
      skills: teamData.skills.filter(s => s !== skill)
    });
  };

  // Update search results when user search data changes
  useEffect(() => {
    if (userSearchData?.data) {
      setSearchResults(userSearchData.data);
    } else if (searchQuery.trim()) {
      // Fallback to mock users if API is not available
      const filtered = mockUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [userSearchData, searchQuery]);

  // Add member to selected list
  const addMember = (user: any) => {
    if (!selectedMembers.find(m => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Remove member from selected list
  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== userId));
  };

  // Add email invite
  const addEmailInvite = () => {
    const email = emailInput.trim();
    if (email && !emailInvites.includes(email)) {
      setEmailInvites([...emailInvites, email]);
      setEmailInput("");
    }
  };

  // Remove email invite
  const removeEmailInvite = (email: string) => {
    setEmailInvites(emailInvites.filter(e => e !== email));
  };

  // Send email invitations using the mutation
  const sendEmailInvitations = async (teamId: string) => {
    if (emailInvites.length === 0) return;

    try {
      await sendInvitationsMutation.mutateAsync({
        teamId,
        invitationData: {
          emails: emailInvites,
          message: `You've been invited to join ${teamData.name}!`
        }
      });
      setEmailInvites([]);
    } catch (error) {
      console.error('Error sending invitations:', error);
      // Error handling is done in the mutation hook
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!teamData.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    if (!teamData.description.trim()) {
      toast.error("Team description is required");
      return;
    }
    
    if (!teamData.category) {
      toast.error("Please select a category");
      return;
    }
    
    if (!teamData.location.trim()) {
      toast.error("Location is required");
      return;
    }

    try {
      // Create the team
      const response = await createTeamMutation.mutateAsync(teamData);
      
      const createdTeam = response.data;
      
      // Send email invitations if any
      if (emailInvites.length > 0 && createdTeam._id) {
        await sendEmailInvitations(createdTeam._id);
      }
      
      // Navigate to teams page with refresh parameter
      navigate("/dashboard/maitri/teams", { state: { refresh: true } });
    } catch (error: any) {
      console.error("Error creating team:", error);
      // Error handling is done in the mutation hooks
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-4">
          <Link to="/dashboard/maitri/teams" className="flex items-center gap-1 sm:gap-2 text-nav-foreground hover:text-nav-active">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Back to Teams</span>
          </Link>
          <div className="h-4 sm:h-6 w-px bg-border" />
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create Your Team
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your team name"
                  value={teamData.name}
                  onChange={(e) => setTeamData({...teamData, name: e.target.value})}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your team's mission and goals"
                  value={teamData.description}
                  onChange={(e) => setTeamData({...teamData, description: e.target.value})}
                  rows={3}
                  required
                  disabled={isLoading}
                  className="min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 sm:p-3 rounded-md border border-input bg-background h-10 sm:h-11"
                    value={teamData.category}
                    onChange={(e) => setTeamData({...teamData, category: e.target.value})}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Remote, San Francisco, CA"
                    value={teamData.location}
                    onChange={(e) => setTeamData({...teamData, location: e.target.value})}
                    required
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="2"
                  max="20"
                  value={teamData.maxMembers}
                  onChange={(e) => setTeamData({...teamData, maxMembers: parseInt(e.target.value)})}
                  required
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Privacy */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Team Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={teamData.visibility}
                onValueChange={(value) => setTeamData({...teamData, visibility: value as "public" | "private"})}
                className="space-y-3 sm:space-y-4"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                      <Label htmlFor="public" className="font-medium text-sm sm:text-base">Public Team</Label>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Anyone can discover and join your team directly. Great for open collaboration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border">
                  <RadioGroupItem value="private" id="private" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      <Label htmlFor="private" className="font-medium text-sm sm:text-base">Private Team</Label>
                      <Badge className="bg-yellow-500 text-black font-medium text-xs">
                        Private
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Requires an access key to join. You'll need to share the key via email.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {teamData.visibility === "private" && (
                <div className="mt-4 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Private Team Notice</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        A unique access key will be generated for your team. You can share this key via Gmail to invite specific members.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Roles */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Required Skills & Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <Input
                  placeholder="Add required skills or roles"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  disabled={isLoading}
                  className="h-10 sm:h-11"
                />
                <Button type="button" onClick={addSkill} disabled={isLoading} className="h-10 sm:h-11">
                  Add
                </Button>
              </div>

              {teamData.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {teamData.skills.map(skill => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground text-xs sm:text-sm"
                      onClick={() => !isLoading && removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Member Invitation */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Invite Members</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search members by username "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                    disabled={isLoading || isSearching}
                    className="h-10 sm:h-11"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => setSearchQuery(searchQuery)}
                  disabled={isLoading || isSearching}
                  className="h-10 sm:h-11"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Members
                    </>
                  )}
                </Button>
              </div>

              {isSearching && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Searching for members...
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Search Results</h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.map(user => (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                        onClick={() => addMember(user)}
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                        </Avatar>
                        {user.name}
                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); removeMember(user.id); }} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMembers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Selected Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMembers.map(member => (
                      <Badge
                        key={member.id}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                        </Avatar>
                        {member.name}
                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); removeMember(member.id); }} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {emailInvites.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Email Invites</h4>
                  <div className="flex flex-wrap gap-2">
                    {emailInvites.map((email, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                        onClick={() => removeEmailInvite(email)}
                      >
                        <Mail className="h-3 w-3" />
                        {email}
                        <X className="h-3 w-3" onClick={(e) => { e.stopPropagation(); removeEmailInvite(email); }} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Add email addresses for invitations"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addEmailInvite())}
                    disabled={isLoading || isInviting}
                    className="h-10 sm:h-11"
                  />
                </div>
                <Button
                  type="button"
                  onClick={addEmailInvite}
                  disabled={isLoading || isInviting}
                  className="h-10 sm:h-11"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Inviting...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Invites
                    </>
                  )}
                </Button>
              </div>

              {emailInvites.length > 0 && (
                <Button
                  variant="purple"
                  type="button"
                  onClick={() => sendEmailInvitations('')}
                  disabled={isLoading || isInviting}
                  className="min-w-32 h-10 sm:h-11"
                >
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Invitations
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button variant="outline" type="button" asChild disabled={isLoading} className="h-10 sm:h-11">
              <Link to="/dashboard/maitri/teams">Cancel</Link>
            </Button>
            <Button 
              variant="purple" 
              type="submit" 
              className="min-w-32 h-10 sm:h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span className="hidden sm:inline">Creating...</span>
                  <span className="sm:hidden">Creating</span>
                </>
              ) : (
                <>
              <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Create Team</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;