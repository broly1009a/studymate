import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-muted-foreground">Please wait while we load your content</p>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container max-w-6xl py-8 animate-pulse">
      <div className="h-8 bg-accent rounded w-1/3 mb-4" />
      <div className="h-4 bg-accent rounded w-1/2 mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-accent rounded" />
        ))}
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-accent rounded" />
        ))}
      </div>
    </div>
  );
}

