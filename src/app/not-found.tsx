'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <div className="text-8xl font-bold text-primary mb-4">404</div>
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/search" className="block">
              <Button variant="outline" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-2">Popular Pages</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/forum">
                <Button variant="link" size="sm">Q&A Forum</Button>
              </Link>
              <Link href="/groups">
                <Button variant="link" size="sm">Study Groups</Button>
              </Link>
              <Link href="/competitions">
                <Button variant="link" size="sm">Competitions</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

