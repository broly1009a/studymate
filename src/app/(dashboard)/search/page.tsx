'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Users, MessageSquare, Trophy, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = {
    notes: [
      { id: '1', title: 'Binary Search Trees', subject: 'Data Structures', type: 'note' },
      { id: '2', title: 'Calculus Derivatives', subject: 'Mathematics', type: 'note' },
    ],
    users: [
      { id: '1', name: 'Alex Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', reputation: 1250 },
      { id: '2', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', reputation: 980 },
    ],
    questions: [
      { id: '1', title: 'How to implement binary search?', answers: 5, votes: 12 },
      { id: '2', title: 'Understanding recursion in programming', answers: 8, votes: 23 },
    ],
    groups: [
      { id: '1', name: 'Algorithm Masters', members: 45, category: 'Computer Science' },
      { id: '2', name: 'Math Olympiad Prep', members: 32, category: 'Mathematics' },
    ],
    competitions: [
      { id: '1', title: 'Algorithm Challenge 2025', participants: 156, status: 'upcoming' },
    ],
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-2">Find notes, users, questions, and more</p>
      </div>

      {/* Search Input */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
              autoFocus
            />
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {/* Notes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle className="text-lg">Notes ({searchResults.notes.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {searchResults.notes.map((note) => (
                <Link key={note.id} href={`/notes/${note.id}`}>
                  <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{note.title}</div>
                    <Badge variant="secondary" className="mt-2">{note.subject}</Badge>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Users */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle className="text-lg">Users ({searchResults.users.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {searchResults.users.map((user) => (
                <Link key={user.id} href={`/users/${user.id}`}>
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.reputation} reputation</div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <CardTitle className="text-lg">Questions ({searchResults.questions.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {searchResults.questions.map((question) => (
                <Link key={question.id} href={`/forum/${question.id}`}>
                  <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="font-medium">{question.title}</div>
                    <div className="flex gap-3 mt-2 text-sm text-muted-foreground">
                      <span>{question.answers} answers</span>
                      <span>•</span>
                      <span>{question.votes} votes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Search results for notes</CardDescription>
            </CardHeader>
            <CardContent>
              {searchResults.notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No notes found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.notes.map((note) => (
                    <Link key={note.id} href={`/notes/${note.id}`}>
                      <div className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="font-medium">{note.title}</div>
                        <Badge variant="secondary" className="mt-2">{note.subject}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Search results for users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchResults.users.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`}>
                    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.reputation} reputation</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs similar structure */}
      </Tabs>
    </div>
  );
}

