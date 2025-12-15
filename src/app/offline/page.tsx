'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-8 text-center">
          <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">You're Offline</h1>
          <p className="text-muted-foreground mb-8">
            Please check your internet connection and try again.
          </p>

          <Button
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>

          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium mb-2">Offline Features</h3>
            <p className="text-sm text-muted-foreground">
              Some features may still be available offline:
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• View cached study notes</li>
              <li>• Access downloaded resources</li>
              <li>• Review saved questions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

