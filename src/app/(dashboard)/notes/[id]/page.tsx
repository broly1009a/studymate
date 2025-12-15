'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNoteById } from '@/lib/mock-data/notes';
import { ArrowLeft, Edit, Star, Pin, Trash } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const note = getNoteById(id);

  if (!note) {
    return (
      <div className="w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Note Not Found</h1>
          <Link href="/notes">
            <Button>Back to Notes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    toast.success(note.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleTogglePin = () => {
    toast.success(note.isPinned ? 'Unpinned note' : 'Pinned note');
  };

  const handleDelete = () => {
    toast.success('Note deleted');
  };

  return (
    <div className="w-full">
      <Link href="/notes">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{note.title}</CardTitle>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{note.subject}</Badge>
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Created {format(new Date(note.createdAt), 'MMM d, yyyy')} • 
                Updated {format(new Date(note.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleTogglePin}
              >
                <Pin className={`h-4 w-4 ${note.isPinned ? 'fill-blue-500 text-blue-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
              >
                <Star className={`h-4 w-4 ${note.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              </Button>
              <Link href={`/notes/${note.id}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleDelete}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans">{note.content}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

