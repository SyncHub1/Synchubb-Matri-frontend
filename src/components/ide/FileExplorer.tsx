import { useState } from 'react';
import { 
  FolderOpen, 
  Folder,
  File, 
  Plus, 
  Search, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Zap,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  isExpanded?: boolean;
  size?: number;
  modified?: Date;
  language?: string;
}

interface FileExplorerProps {
  files: FileNode[];
  activeFile?: string;
  onFileSelect: (file: FileNode) => void;
  onFileCreate?: (path: string, type: 'file' | 'folder') => void;
  onFileDelete?: (file: FileNode) => void;
  onFileRename?: (file: FileNode, newName: string) => void;
  className?: string;
}

export const FileExplorer = ({
  files: initialFiles,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  className = ""
}: FileExplorerProps) => {
  const [files, setFiles] = useState<FileNode[]>(initialFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.id) ? FolderOpen : Folder;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    return File; // Could be expanded with specific file type icons
  };

  const getFileColor = (file: FileNode) => {
    if (file.type === 'folder') return 'text-blue-400';
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return 'text-yellow-400';
      case 'ts': case 'tsx': return 'text-blue-500';
      case 'css': case 'scss': return 'text-purple-400';
      case 'html': return 'text-orange-400';
      case 'json': return 'text-green-400';
      case 'md': return 'text-gray-400';
      default: return 'text-muted-foreground';
    }
  };

  const getFileLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'css': case 'scss': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'c': return 'cpp';
      default: return 'text';
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  };

  const filteredFiles = (nodes: FileNode[]): FileNode[] => {
    if (!searchQuery) return nodes;
    
    return nodes.filter(node => {
      if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      if (node.children) {
        const hasMatchingChild = filteredFiles(node.children).length > 0;
        return hasMatchingChild;
      }
      return false;
    }).map(node => ({
      ...node,
      children: node.children ? filteredFiles(node.children) : undefined
    }));
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
    } else {
      onFileSelect(file);
    }
  };

  const handleRename = (file: FileNode) => {
    setEditingFile(file.id);
    setNewFileName(file.name);
  };

  const confirmRename = (file: FileNode) => {
    if (newFileName && newFileName !== file.name) {
      onFileRename?.(file, newFileName);
      toast({
        title: "File renamed",
        description: `${file.name} renamed to ${newFileName}`,
      });
    }
    setEditingFile(null);
    setNewFileName('');
  };

  const handleCreateFile = (parentPath: string) => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      onFileCreate?.(parentPath, 'file');
      toast({
        title: "File created",
        description: `${fileName} has been created`,
      });
    }
  };

  const handleCreateFolder = (parentPath: string) => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      onFileCreate?.(parentPath, 'folder');
      toast({
        title: "Folder created",
        description: `${folderName} has been created`,
      });
    }
  };

  const handleDelete = (file: FileNode) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      onFileDelete?.(file);
      toast({
        title: "File deleted",
        description: `${file.name} has been deleted`,
      });
    }
  };

  const renderFileTree = (nodes: FileNode[], level: number = 0): React.ReactNode => {
    return filteredFiles(nodes).map((file) => {
      const Icon = getFileIcon(file);
      const isActive = activeFile === file.path;
      const isExpanded = expandedFolders.has(file.id);
      
      return (
        <div key={file.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 p-1 hover:bg-nav-hover rounded cursor-pointer transition-colors ${
                  isActive ? 'bg-nav-active text-nav-active' : ''
                }`}
                style={{ paddingLeft: `${level * 16 + 8}px` }}
                onClick={() => handleFileClick(file)}
              >
                {file.type === 'folder' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(file.id);
                    }}
                    className="p-0.5 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </button>
                )}
                
                <Icon className={`h-4 w-4 ${getFileColor(file)} flex-shrink-0`} />
                
                {editingFile === file.id ? (
                  <Input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={() => confirmRename(file)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') confirmRename(file);
                      if (e.key === 'Escape') setEditingFile(null);
                    }}
                    className="h-6 text-xs"
                    autoFocus
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-sm truncate">{file.name}</span>
                    {file.type === 'file' && file.size && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {formatFileSize(file.size)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </ContextMenuTrigger>
            
            <ContextMenuContent>
              {file.type === 'folder' && (
                <>
                  <ContextMenuItem onClick={() => handleCreateFile(file.path)}>
                    <File className="h-4 w-4 mr-2" />
                    New File
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleCreateFolder(file.path)}>
                    <Folder className="h-4 w-4 mr-2" />
                    New Folder
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                </>
              )}
              
              <ContextMenuItem onClick={() => handleRename(file)}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </ContextMenuItem>
              
              <ContextMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy Path
              </ContextMenuItem>
              
              {file.type === 'file' && (
                <ContextMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </ContextMenuItem>
              )}
              
              <ContextMenuSeparator />
              
              <ContextMenuItem 
                onClick={() => handleDelete(file)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          
          {file.children && isExpanded && (
            <div>
              {renderFileTree(file.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={`bg-nav-background h-full flex flex-col ${className}`}>
      {/* Explorer Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Explorer</h3>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCreateFile('/')}>
              <File className="h-4 w-4 mr-2" />
              New File
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateFolder('/')}>
              <Folder className="h-4 w-4 mr-2" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-8 text-xs"
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {renderFileTree(files)}
      </div>

      {/* Explorer Footer */}
      <div className="p-2 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{files.length} items</span>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Zap className="h-3 w-3 mr-1" />
            AI Assistant
          </Button>
        </div>
      </div>
    </div>
  );
};