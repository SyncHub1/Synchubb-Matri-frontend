import { useState } from 'react';
import { Code, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface Language {
  id: string;
  name: string;
  extension: string;
  color: string;
  icon?: string;
}

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages: Language[] = [
  { id: 'javascript', name: 'JavaScript', extension: '.js', color: 'bg-yellow-500' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', color: 'bg-blue-500' },
  { id: 'python', name: 'Python', extension: '.py', color: 'bg-green-500' },
  { id: 'java', name: 'Java', extension: '.java', color: 'bg-orange-500' },
  { id: 'cpp', name: 'C++', extension: '.cpp', color: 'bg-purple-500' },
  { id: 'c', name: 'C', extension: '.c', color: 'bg-gray-500' },
  { id: 'csharp', name: 'C#', extension: '.cs', color: 'bg-indigo-500' },
  { id: 'go', name: 'Go', extension: '.go', color: 'bg-cyan-500' },
  { id: 'rust', name: 'Rust', extension: '.rs', color: 'bg-red-500' },
  { id: 'php', name: 'PHP', extension: '.php', color: 'bg-violet-500' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', color: 'bg-red-400' },
  { id: 'html', name: 'HTML', extension: '.html', color: 'bg-orange-400' },
  { id: 'css', name: 'CSS', extension: '.css', color: 'bg-blue-400' },
  { id: 'json', name: 'JSON', extension: '.json', color: 'bg-gray-400' },
  { id: 'xml', name: 'XML', extension: '.xml', color: 'bg-green-400' },
  { id: 'markdown', name: 'Markdown', extension: '.md', color: 'bg-gray-600' },
  { id: 'yaml', name: 'YAML', extension: '.yml', color: 'bg-red-300' },
  { id: 'sql', name: 'SQL', extension: '.sql', color: 'bg-blue-600' },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const currentLanguage = languages.find(lang => lang.id === selectedLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Badge variant="secondary" className={`${currentLanguage.color} text-white text-xs border-none`}>
            {currentLanguage.name}
          </Badge>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          Select Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="max-h-60 overflow-y-auto">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.id}
              onClick={() => onLanguageChange(language.id)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={`${language.color} text-white text-xs border-none`}>
                  {language.extension}
                </Badge>
                <span>{language.name}</span>
              </div>
              {selectedLanguage === language.id && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};