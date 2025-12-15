'use client';

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getGroupById, getGroupResources } from '@/lib/mock-data/groups';
import { ArrowLeft, Upload, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';

export default function GroupResourcesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const group = getGroupById(id);
  const resources = group ? getGroupResources(group.id) : [];

  if (!group) {
    return <div className="w-full">Không tìm thấy nhóm</div>;
  }

  return (
    <div className="w-full">
      <Link href={`/groups/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Group
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Resources ({resources.length})</CardTitle>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No resources yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{resource.uploaderName}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(resource.uploadedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{resource.type}</Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

