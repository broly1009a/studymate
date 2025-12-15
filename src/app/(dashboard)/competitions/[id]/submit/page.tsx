'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCompetitionById } from '@/lib/mock-data/competitions';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SubmitSolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const competition = getCompetitionById(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repositoryUrl: '',
    demoUrl: '',
  });

  if (!competition) {
    return <div className="w-full">Competition not found</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Solution submitted successfully!');
    router.push(`/competitions/${id}`);
  };

  return (
    <div className="w-full">
      <Link href={`/competitions/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Competition
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Submit Solution</CardTitle>
          <CardDescription>{competition.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Solution Title *</Label>
              <Input
                placeholder="e.g., Optimized Binary Search Implementation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe your solution approach..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Repository URL</Label>
              <Input
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Demo URL (Optional)</Label>
              <Input
                type="url"
                placeholder="https://demo.example.com"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Upload Files</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Button type="button" variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-medium text-yellow-500 mb-1">⚠️ Submission Guidelines</h4>
              <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                <li>• Ensure your code is well-documented</li>
                <li>• Include a README with setup instructions</li>
                <li>• Test your solution thoroughly before submitting</li>
                <li>• You can resubmit before the deadline</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Submit Solution</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

