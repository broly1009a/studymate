'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getPopularTags } from '@/lib/mock-data/forum';
import { Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function TagsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const tags = getPopularTags();

  const filteredTags = tags.filter(({ tag }) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Browse Tags</h1>
        <p className="text-muted-foreground mt-2">Explore questions by topic</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Tags Found</h3>
              <p className="text-muted-foreground">
                Try a different search term
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTags.map(({ tag, count }) => (
            <Link key={tag} href={`/forum?tag=${tag}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {tag}
                    </Badge>
                    <span className="text-2xl font-bold text-muted-foreground">
                      {count}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {count} {count === 1 ? 'question' : 'questions'} tagged
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Popular Categories */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Popular Categories</CardTitle>
          <CardDescription>Most active topic areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Mathematics', count: 45 },
              { name: 'Computer Science', count: 38 },
              { name: 'Physics', count: 28 },
              { name: 'Chemistry', count: 22 },
              { name: 'Biology', count: 19 },
              { name: 'English', count: 15 },
              { name: 'History', count: 12 },
              { name: 'Other', count: 8 },
            ].map((category) => (
              <div key={category.name} className="text-center p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="text-2xl font-bold">{category.count}</div>
                <div className="text-sm text-muted-foreground mt-1">{category.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

