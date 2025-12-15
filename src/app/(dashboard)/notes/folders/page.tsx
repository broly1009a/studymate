'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getFolders } from '@/lib/mock-data/notes';
import { Folder, Plus, Edit, Trash, FileText } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NoteFoldersPage() {
  const folders = getFolders();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    toast.success('Folder created successfully!');
    setNewFolderName('');
    setShowCreateForm(false);
  };

  const handleDeleteFolder = (folderId: string) => {
    toast.success('Folder deleted');
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Note Folders</h1>
          <p className="text-muted-foreground mt-2">Organize your notes into folders</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
              <Button onClick={handleCreateFolder}>Create</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {folders.reduce((sum, f) => sum + f.noteCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Notes/Folder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(folders.reduce((sum, f) => sum + f.noteCount, 0) / folders.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder) => (
          <Card key={folder.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: folder.color + '20' }}
                >
                  <Folder className="h-6 w-6" style={{ color: folder.color }} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2">{folder.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{folder.noteCount} notes</span>
              </div>

              <Link href={`/notes?folder=${folder.id}`}>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Notes
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {folders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Folders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create folders to organize your notes
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Folder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

