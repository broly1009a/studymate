'use client';

import { useState, useEffect } from 'react';
import StudyTimer from '@/components/dashboard/study-timer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

interface Subject {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

export default function StudyNowPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchSubjects();
  }, [user?.id]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`/api/subjects?userId=${user?.id}`);
      const data = await response.json();

      if (data.success) {
        setSubjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleStart = () => {
    if (!selectedSubject || !topic.trim()) {
      toast.error('Please select a subject and enter a topic');
      return;
    }
    setIsStarted(true);
  };

  const handleComplete = () => {
    setIsStarted(false);
    setTopic('');
    toast.success('Great job! Your progress has been saved 🎉');
  };

  const selectedSubjectData = subjects.find(s => s._id === selectedSubject);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Study Now</h1>
        <p className="text-muted-foreground">Start a focused study session with Pomodoro timer</p>
      </div>

      {!isStarted ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Start New Study Session
            </CardTitle>
            <CardDescription>Choose what you want to study today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.icon && <span className="mr-2">{subject.icon}</span>}
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Chapter</Label>
              <Input
                id="topic"
                placeholder="e.g., Chapter 5: Calculus Derivatives"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <Button onClick={handleStart} className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Start Studying
            </Button>
          </CardContent>
        </Card>
      ) : (
        <StudyTimer
          subjectId={selectedSubject}
          subjectName={selectedSubjectData?.name || 'Unknown Subject'}
          topic={topic}
          onComplete={handleComplete}
        />
      )}

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Study Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use the Pomodoro technique: 25 minutes of focused study, 5 minutes break</li>
            <li>• Keep your phone away and minimize distractions</li>
            <li>• Rate your focus honestly to track your productivity</li>
            <li>• Take notes during your session for better retention</li>
            <li>• Complete study sessions daily to build your streak 🔥</li>
            <li>• Higher focus scores earn you more reputation points!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
