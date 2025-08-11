import { useState } from 'react';
import { Layers, ChevronDown, Star, Zap, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TechStack {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: any;
  color: string;
}

interface TechStackSelectorProps {
  selectedStack: string;
  onStackChange: (stack: string) => void;
  onEnvironmentSetup?: (stackId: string) => void;
}

const techStacks: TechStack[] = [
  {
    id: 'react',
    name: 'React + TypeScript',
    description: 'Modern React with TypeScript, Tailwind CSS, and Vite',
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'ESLint'],
    category: 'frontend',
    difficulty: 'intermediate',
    icon: Star,
    color: 'bg-blue-500'
  },
  {
    id: 'nextjs',
    name: 'Next.js Full-Stack',
    description: 'Full-stack React framework with API routes and SSR',
    technologies: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    category: 'fullstack',
    difficulty: 'advanced',
    icon: Rocket,
    color: 'bg-black'
  },
  {
    id: 'vue',
    name: 'Vue 3 + Composition API',
    description: 'Progressive Vue.js framework with modern tooling',
    technologies: ['Vue 3', 'TypeScript', 'Pinia', 'Vite', 'Vue Router'],
    category: 'frontend',
    difficulty: 'intermediate',
    icon: Zap,
    color: 'bg-green-500'
  },
  {
    id: 'angular',
    name: 'Angular Enterprise',
    description: 'Enterprise-grade Angular application',
    technologies: ['Angular 17', 'TypeScript', 'RxJS', 'Angular Material', 'NgRx'],
    category: 'frontend',
    difficulty: 'advanced',
    icon: Star,
    color: 'bg-red-500'
  },
  {
    id: 'express',
    name: 'Express.js API',
    description: 'RESTful API with Express and MongoDB',
    technologies: ['Express.js', 'MongoDB', 'JWT', 'Bcrypt', 'Nodemon'],
    category: 'backend',
    difficulty: 'intermediate',
    icon: Layers,
    color: 'bg-gray-600'
  },
  {
    id: 'fastapi',
    name: 'FastAPI + Python',
    description: 'High-performance Python API framework',
    technologies: ['FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Pydantic', 'Uvicorn'],
    category: 'backend',
    difficulty: 'intermediate',
    icon: Rocket,
    color: 'bg-green-600'
  },
  {
    id: 'django',
    name: 'Django Web App',
    description: 'Full-featured Python web framework',
    technologies: ['Django', 'PostgreSQL', 'Django REST', 'Celery', 'Redis'],
    category: 'fullstack',
    difficulty: 'advanced',
    icon: Star,
    color: 'bg-green-700'
  },
  {
    id: 'spring',
    name: 'Spring Boot',
    description: 'Enterprise Java application framework',
    technologies: ['Spring Boot', 'Spring Security', 'JPA', 'MySQL', 'Maven'],
    category: 'backend',
    difficulty: 'advanced',
    icon: Layers,
    color: 'bg-green-600'
  },
  {
    id: 'laravel',
    name: 'Laravel PHP',
    description: 'Elegant PHP framework for web artisans',
    technologies: ['Laravel', 'MySQL', 'Eloquent ORM', 'Blade', 'Composer'],
    category: 'fullstack',
    difficulty: 'intermediate',
    icon: Star,
    color: 'bg-red-600'
  },
  {
    id: 'svelte',
    name: 'SvelteKit',
    description: 'Cybernetically enhanced web apps',
    technologies: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Vite', 'Playwright'],
    category: 'frontend',
    difficulty: 'intermediate',
    icon: Zap,
    color: 'bg-orange-500'
  },
  {
    id: 'flutter',
    name: 'Flutter Mobile',
    description: 'Cross-platform mobile app development',
    technologies: ['Flutter', 'Dart', 'Provider', 'HTTP', 'Shared Preferences'],
    category: 'mobile',
    difficulty: 'intermediate',
    icon: Rocket,
    color: 'bg-blue-400'
  },
  {
    id: 'reactnative',
    name: 'React Native',
    description: 'Native mobile apps with React',
    technologies: ['React Native', 'TypeScript', 'Expo', 'React Navigation', 'AsyncStorage'],
    category: 'mobile',
    difficulty: 'intermediate',
    icon: Star,
    color: 'bg-cyan-500'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-500';
    case 'intermediate': return 'bg-yellow-500';
    case 'advanced': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'frontend': return Star;
    case 'backend': return Layers;
    case 'fullstack': return Rocket;
    case 'mobile': return Zap;
    case 'desktop': return Layers;
    default: return Star;
  }
};

export const TechStackSelector = ({ selectedStack, onStackChange, onEnvironmentSetup }: TechStackSelectorProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isSetupTriggered, setIsSetupTriggered] = useState(false);
  const currentStack = techStacks.find(stack => stack.id === selectedStack) || techStacks[0];
  const Icon = currentStack.icon;

  const handleStackSelection = (stackId: string) => {
    onStackChange(stackId);
    onEnvironmentSetup?.(stackId);
    setIsSetupTriggered(true);
    // Reset after a short delay to allow environment setup to be triggered
    setTimeout(() => setIsSetupTriggered(false), 100);
  };

  const groupedStacks = techStacks.reduce((acc, stack) => {
    if (!acc[stack.category]) {
      acc[stack.category] = [];
    }
    acc[stack.category].push(stack);
    return acc;
  }, {} as Record<string, TechStack[]>);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-2">
            <Icon className="h-3 w-3" />
            <span className="text-xs">{currentStack.name}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Choose Tech Stack
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(groupedStacks).map(([category, stacks]) => (
              <div key={category}>
                <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                  {category}
                </DropdownMenuLabel>
                {stacks.map((stack) => {
                  const StackIcon = stack.icon;
                  return (
                    <DropdownMenuItem
                      key={stack.id}
                      onClick={() => handleStackSelection(stack.id)}
                      className="flex items-center justify-between p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${stack.color} text-white`}>
                          <StackIcon className="h-3 w-3" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{stack.name}</div>
                          <div className="text-xs text-muted-foreground">{stack.description}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className={`${getDifficultyColor(stack.difficulty)} text-white text-xs border-none`}>
                              {stack.difficulty}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {stack.technologies.length} tools
                            </span>
                          </div>
                        </div>
                      </div>
                      {selectedStack === stack.id && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
              </div>
            ))}
          </div>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <Star className="h-4 w-4 mr-2" />
            View Stack Details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {currentStack.name} - Tech Stack Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Badge variant="secondary" className={`${currentStack.color} text-white border-none`}>
                    {currentStack.category}
                  </Badge>
                  <Badge variant="secondary" className={`${getDifficultyColor(currentStack.difficulty)} text-white border-none`}>
                    {currentStack.difficulty}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{currentStack.description}</p>
                
                <div>
                  <h4 className="font-medium mb-2">Included Technologies:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentStack.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};