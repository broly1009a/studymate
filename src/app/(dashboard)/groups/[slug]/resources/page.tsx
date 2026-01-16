'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Upload, FileText, Download, Loader2, File, Image as ImageIcon, Video } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { vi } from '@/lib/i18n/vi';
import { AUTH_TOKEN_KEY } from '@/lib/constants';
import { UploadResourceDialog } from '@/components/shared/upload-resource-dialog';

export default function GroupResourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [group, setGroup] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    fetchResourcesData();
  }, [slug]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const handleUploadSuccess = () => {
    // Refresh resources list
    fetchResourcesData();
  };

  const fetchResourcesData = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);
      const groupRes = await fetch(`/api/groups/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const groupData = await groupRes.json();

      if (!groupRes.ok) {
        if (groupRes.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          window.location.href = '/login';
          return;
        }
        throw new Error(groupData.message || 'Failed to fetch group');
      }

      if (groupData.success) {
        setGroup(groupData.data);

        const resourcesRes = await fetch(`/api/groups/${slug}/resources`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const resourcesData = await resourcesRes.json();
        
        if (resourcesData.success) setResources(resourcesData.data);
      }
    } catch (error) {
      console.error('Failed to fetch resources data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Group not found</h2>
        <p className="text-muted-foreground mt-2">The group you're looking for doesn't exist.</p>
        <Link href="/groups">
          <Button className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/groups/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Group
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{group.name} - Resources</h1>
            <p className="text-sm text-muted-foreground">
              Shared files and documents
            </p>
          </div>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Upload Dialog */}
      <UploadResourceDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        groupSlug={slug}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No resources yet</h3>
                <p className="text-muted-foreground mb-4">
                  Share files, documents, and resources with your group members.
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Resource
                </Button>
              </div>
            ) : (
              resources.map((resource: any) => (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded by {resource.uploaderName || 'Anonymous'} • {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                      </p>
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {resource.tags.map((tag: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {resource.fileSize && (
                      <Badge variant="outline">
                        {(resource.fileSize / 1024 / 1024).toFixed(1)} MB
                      </Badge>
                    )}
                    {resource.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(resource.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}