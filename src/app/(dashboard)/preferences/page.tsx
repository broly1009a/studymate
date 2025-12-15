'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { vi } from '@/lib/i18n/vi';

export default function PreferencesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionLength, setSessionLength] = useState([60]);
  const [breakFrequency, setBreakFrequency] = useState([25]);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(vi.success.saved);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.preferences.title}</h1>
        <p className="text-muted-foreground mt-2">{vi.preferences.subtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Study Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Study Methods</CardTitle>
            <CardDescription>Configure your preferred study methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Learning Style (select all that apply)</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="visual" defaultChecked />
                  <label htmlFor="visual" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Visual (diagrams, charts, images)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="auditory" />
                  <label htmlFor="auditory" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Auditory (lectures, discussions)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="kinesthetic" />
                  <label htmlFor="kinesthetic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Kinesthetic (hands-on, practice)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reading" defaultChecked />
                  <label htmlFor="reading" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Reading/Writing (notes, textbooks)
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label>Preferred Session Length: {sessionLength[0]} minutes</Label>
              <Slider
                value={sessionLength}
                onValueChange={setSessionLength}
                min={15}
                max={180}
                step={15}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Break Frequency: {breakFrequency[0]} minutes</Label>
              <Slider
                value={breakFrequency}
                onValueChange={setBreakFrequency}
                min={5}
                max={60}
                step={5}
                className="mt-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pomodoro Mode</Label>
                <p className="text-sm text-muted-foreground">Use Pomodoro technique for study sessions</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Focus Music</Label>
                <p className="text-sm text-muted-foreground">Play background music during sessions</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Study Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded to start study sessions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Study Reminders</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Goal Deadlines</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Partner Sessions</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Group Events</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Competition Updates</Label>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <Label>Achievement Unlocked</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Weekly Report</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Monthly Report</Label>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Preferences</CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Let others see when you're online</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Study Activity</Label>
                <p className="text-sm text-muted-foreground">Display your study sessions publicly</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Goal Progress</Label>
                <p className="text-sm text-muted-foreground">Make your goals visible to others</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Data Sharing</Label>
                <p className="text-sm text-muted-foreground">Share anonymized data for research</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Analytics</Label>
                <p className="text-sm text-muted-foreground">Help us improve with usage analytics</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Default Views */}
        <Card>
          <CardHeader>
            <CardTitle>Default Views</CardTitle>
            <CardDescription>Set your preferred default views</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Dashboard Layout</Label>
              <Select defaultValue="comfortable">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Calendar View</Label>
              <Select defaultValue="week">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Session List View</Label>
              <Select defaultValue="list">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes View</Label>
              <Select defaultValue="grid">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}

