import { useState } from 'react';
import { 
  Github, 
  GitBranch, 
  Upload, 
  Plus, 
  Settings, 
  Check, 
  AlertCircle,
  Loader2,
  User,
  Book,
  Lock,
  Unlock,
  Star,
  GitCommit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  branches: string[];
  lastCommit: {
    message: string;
    author: string;
    date: string;
  };
}

interface GitHubUser {
  login: string;
  name: string;
  avatar: string;
  email: string;
}

interface GitHubIntegrationProps {
  currentCode: string;
  fileName: string;
  projectName?: string;
}

export const GitHubIntegration = ({ 
  currentCode, 
  fileName, 
  projectName = "my-project" 
}: GitHubIntegrationProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [commitMessage, setCommitMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateRepo, setShowCreateRepo] = useState(false);
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  
  // New repo creation form
  const [newRepoName, setNewRepoName] = useState(projectName);
  const [newRepoDescription, setNewRepoDescription] = useState('');
  const [newRepoPrivate, setNewRepoPrivate] = useState(false);
  const [newRepoReadme, setNewRepoReadme] = useState(true);

  // Mock data for demo - in real implementation, this would come from GitHub API
  const mockUser: GitHubUser = {
    login: 'johndoe',
    name: 'John Doe',
    avatar: 'https://github.com/johndoe.png',
    email: 'john@example.com'
  };

  const mockRepositories: Repository[] = [
    {
      id: '1',
      name: 'my-awesome-project',
      fullName: 'johndoe/my-awesome-project',
      private: false,
      defaultBranch: 'main',
      branches: ['main', 'develop', 'feature/auth'],
      lastCommit: {
        message: 'Add authentication system',
        author: 'johndoe',
        date: '2024-01-15T10:30:00Z'
      }
    },
    {
      id: '2',
      name: 'react-dashboard',
      fullName: 'johndoe/react-dashboard',
      private: true,
      defaultBranch: 'main',
      branches: ['main', 'staging'],
      lastCommit: {
        message: 'Update dashboard components',
        author: 'johndoe',
        date: '2024-01-14T15:20:00Z'
      }
    }
  ];

  const handleGitHubAuth = async () => {
    setIsLoading(true);
    try {
      // In real implementation, this would initiate OAuth flow
      // For now, simulate successful authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUser(mockUser);
      setRepositories(mockRepositories);
      setIsAuthenticated(true);
      
      toast({
        title: "Connected to GitHub",
        description: "Successfully authenticated with your GitHub account.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Unable to connect to GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRepository = async () => {
    if (!newRepoName.trim()) {
      toast({
        title: "Repository name required",
        description: "Please enter a name for your repository.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // In real implementation, this would call GitHub API to create repository
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newRepo: Repository = {
        id: Date.now().toString(),
        name: newRepoName,
        fullName: `${user?.login}/${newRepoName}`,
        private: newRepoPrivate,
        defaultBranch: 'main',
        branches: ['main'],
        lastCommit: {
          message: 'Initial commit',
          author: user?.login || '',
          date: new Date().toISOString()
        }
      };

      setRepositories(prev => [newRepo, ...prev]);
      setSelectedRepo(newRepo.id);
      setSelectedBranch('main');
      setShowCreateRepo(false);
      
      // Reset form
      setNewRepoName(projectName);
      setNewRepoDescription('');
      setNewRepoPrivate(false);
      setNewRepoReadme(true);
      
      toast({
        title: "Repository created",
        description: `Successfully created ${newRepo.fullName}`,
      });
    } catch (error) {
      toast({
        title: "Failed to create repository",
        description: "Unable to create repository. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToGitHub = async () => {
    if (!selectedRepo) {
      setPushError('Please select a repository');
      return;
    }

    if (!commitMessage.trim()) {
      setPushError('Please enter a commit message');
      return;
    }

    setIsLoading(true);
    setPushError(null);

    try {
      // In real implementation, this would push code to GitHub
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const repo = repositories.find(r => r.id === selectedRepo);
      
      setShowPushDialog(false);
      setCommitMessage('');
      
      toast({
        title: "Code pushed successfully",
        description: `Pushed to ${repo?.fullName}:${selectedBranch}`,
      });
    } catch (error) {
      setPushError('Failed to push code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsAuthenticated(false);
    setUser(null);
    setRepositories([]);
    setSelectedRepo('');
    setSelectedBranch('main');
    setCommitMessage('');
    
    toast({
      title: "Disconnected from GitHub",
      description: "Your GitHub account has been disconnected.",
    });
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub Integration
            <Badge variant="secondary" className="text-xs">Not Connected</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Connect your GitHub account to push code directly to your repositories.
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3 w-3 text-green-500" />
              <span>Push code to existing repositories</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3 w-3 text-green-500" />
              <span>Create new repositories</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Check className="h-3 w-3 text-green-500" />
              <span>Manage branches and commits</span>
            </div>
          </div>

          <Button 
            onClick={handleGitHubAuth}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Github className="h-4 w-4 mr-2" />
            )}
            Connect with GitHub
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Github className="h-4 w-4 text-green-600" />
          GitHub Integration
          <Badge variant="default" className="text-xs bg-green-600">Connected</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3 p-2 bg-muted rounded">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-muted-foreground truncate">@{user?.login}</div>
          </div>
          <Button variant="ghost" size="sm" onClick={disconnect}>
            <Settings className="h-3 w-3" />
          </Button>
        </div>

        {/* Repository Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Repository</Label>
            <Dialog open={showCreateRepo} onOpenChange={setShowCreateRepo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Repository</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input
                      id="repo-name"
                      value={newRepoName}
                      onChange={(e) => setNewRepoName(e.target.value)}
                      placeholder="my-awesome-project"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="repo-description">Description (optional)</Label>
                    <Textarea
                      id="repo-description"
                      value={newRepoDescription}
                      onChange={(e) => setNewRepoDescription(e.target.value)}
                      placeholder="A brief description of your project"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {newRepoPrivate ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      <Label htmlFor="private-repo">Private repository</Label>
                    </div>
                    <Switch
                      id="private-repo"
                      checked={newRepoPrivate}
                      onCheckedChange={setNewRepoPrivate}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <Label htmlFor="add-readme">Add README.md</Label>
                    </div>
                    <Switch
                      id="add-readme"
                      checked={newRepoReadme}
                      onCheckedChange={setNewRepoReadme}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateRepo(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRepository} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Create Repository
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Select value={selectedRepo} onValueChange={setSelectedRepo}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select repository" />
            </SelectTrigger>
            <SelectContent>
              {repositories.map((repo) => (
                <SelectItem key={repo.id} value={repo.id}>
                  <div className="flex items-center gap-2">
                    {repo.private ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    <span>{repo.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branch Selection */}
        {selectedRepo && (
          <div className="space-y-2">
            <Label className="text-xs font-medium">Branch</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repositories
                  .find(r => r.id === selectedRepo)
                  ?.branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-3 w-3" />
                        <span>{branch}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Push Button */}
        <Dialog open={showPushDialog} onOpenChange={setShowPushDialog}>
          <DialogTrigger asChild>
            <Button 
              className="w-full" 
              disabled={!selectedRepo}
            >
              <Upload className="h-4 w-4 mr-2" />
              Push to GitHub
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Push to GitHub</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {pushError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{pushError}</AlertDescription>
                </Alert>
              )}
              
              <div className="text-sm text-muted-foreground">
                Push {fileName} to {repositories.find(r => r.id === selectedRepo)?.fullName}:{selectedBranch}
              </div>
              
              <div>
                <Label htmlFor="commit-message">Commit Message</Label>
                <Textarea
                  id="commit-message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Update code via SyncHubb IDE"
                  rows={3}
                />
              </div>
              
              <div className="text-xs text-muted-foreground">
                {currentCode.split('\n').length} lines • {currentCode.length} characters
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPushDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePushToGitHub} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <GitCommit className="h-4 w-4 mr-2" />
                )}
                Push Code
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Repository Info */}
        {selectedRepo && (
          <div className="border-t pt-3 space-y-2">
            <div className="text-xs font-medium">Repository Info</div>
            {(() => {
              const repo = repositories.find(r => r.id === selectedRepo);
              return repo ? (
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3" />
                    <span>Last commit: {repo.lastCommit.message}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>by {repo.lastCommit.author}</span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};