import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Users, Lock, Globe, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CreateTeam = () => {
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "public",
    maxMembers: 5,
    location: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");

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

  const addSkill = () => {
    if (skillInput && !teamData.skills.includes(skillInput)) {
      setTeamData({
        ...teamData,
        skills: [...teamData.skills, skillInput]
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setTeamData({
      ...teamData,
      skills: teamData.skills.filter(s => s !== skill)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate team creation
    toast.success("Team created successfully!");
    navigate("/teams");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-nav-background border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/teams" className="flex items-center gap-2 text-nav-foreground hover:text-nav-active">
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Teams</span>
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create Your Team
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your team name"
                  value={teamData.name}
                  onChange={(e) => setTeamData({...teamData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your team's mission and goals"
                  value={teamData.description}
                  onChange={(e) => setTeamData({...teamData, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={teamData.category}
                    onChange={(e) => setTeamData({...teamData, category: e.target.value})}
                    required
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Team Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={teamData.visibility}
                onValueChange={(value) => setTeamData({...teamData, visibility: value})}
                className="space-y-4"
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border">
                  <RadioGroupItem value="public" id="public" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5 text-success" />
                      <Label htmlFor="public" className="font-medium">Public Team</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Anyone can discover and join your team directly. Great for open collaboration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 rounded-lg border">
                  <RadioGroupItem value="private" id="private" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-5 w-5 text-warning" />
                      <Label htmlFor="private" className="font-medium">Private Team</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Requires an access key to join. You'll need to share the key via email.
                    </p>
                  </div>
                </div>
              </RadioGroup>

              {teamData.visibility === "private" && (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-warning mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Private Team Notice</p>
                      <p className="text-sm text-muted-foreground mt-1">
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
            <CardHeader>
              <CardTitle>Required Skills & Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add required skills or roles"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill}>Add</Button>
              </div>

              {teamData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {teamData.skills.map(skill => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSkill(skill)}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" asChild>
              <Link to="/teams">Cancel</Link>
            </Button>
            <Button variant="purple" type="submit" className="min-w-32">
              <Users className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;