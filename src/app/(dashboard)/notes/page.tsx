'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getNotes, getFolders, getNotesStats } from '@/lib/mock-data/notes';
import { Search, Plus, FileText, Pin, Star, Folder } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  
  const notes = getNotes({
    folderId: selectedFolder || undefined,
    search: searchQuery || undefined,
  });
  const folders = getFolders();
  const stats = getNotesStats();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground mt-2">Organize your study notes</p>
        </div>
        <Link href="/notes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pinned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.pinnedNotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.favoriteNotes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Folders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFolders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Folders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={selectedFolder === '' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedFolder('')}
              >
                <FileText className="h-4 w-4 mr-2" />
                All Notes
              </Button>
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name}
                  <Badge variant="outline" className="ml-auto">{folder.noteCount}</Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Try adjusting your search' : 'Create your first note to get started'}
                  </p>
                  <Link href="/notes/new">
                    <Button>Create Note</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                        <div className="flex gap-1">
                          {note.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                          {note.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {note.content.replace(/[#*]/g, '').substring(0, 100)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{note.subject}</Badge>
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

