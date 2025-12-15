'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Save, Download, Sparkles, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SchedulePlannerPage() {
  const [selectedDay, setSelectedDay] = useState('monday');
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const [schedule, setSchedule] = useState({
    monday: [
      { id: '1', time: '09:00', duration: 2, subject: 'Mathematics', type: 'study', color: 'bg-blue-500' },
      { id: '2', time: '14:00', duration: 1.5, subject: 'Physics', type: 'study', color: 'bg-purple-500' },
    ],
    tuesday: [
      { id: '3', time: '10:00', duration: 2, subject: 'Computer Science', type: 'study', color: 'bg-green-500' },
    ],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  const aiSuggestions = [
    {
      day: 'Monday',
      time: '16:00',
      subject: 'Mathematics',
      reason: 'Based on your peak productivity hours',
      duration: 1.5,
    },
    {
      day: 'Wednesday',
      time: '10:00',
      subject: 'Physics',
      reason: 'Optimal spacing for retention',
      duration: 2,
    },
    {
      day: 'Friday',
      time: '14:00',
      subject: 'Computer Science',
      reason: 'Review before weekend',
      duration: 1,
    },
  ];

  const handleSaveSchedule = () => {
    toast.success('Schedule saved successfully!');
  };

  const handleExportSchedule = () => {
    toast.success('Schedule exported to calendar!');
  };

  const handleAddBlock = () => {
    toast.info('Click on a time slot to add a study block');
  };

  const handleDeleteBlock = (blockId: string) => {
    toast.success('Study block removed');
  };

  const handleApplySuggestion = (suggestion: any) => {
    toast.success(`Added ${suggestion.subject} to ${suggestion.day} at ${suggestion.time}`);
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Planner</h1>
          <p className="text-muted-foreground">Plan your weekly study schedule</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSchedule}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveSchedule}>
            <Save className="h-4 w-4 mr-2" />
            Save Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Drag and drop to organize your study blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? 'default' : 'outline'}
                    onClick={() => setSelectedDay(day)}
                    className="capitalize min-w-[100px]"
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>

              {/* Time Grid */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {timeSlots.map((time) => {
                  const blocks = schedule[selectedDay as keyof typeof schedule].filter(
                    (block) => block.time === time
                  );

                  return (
                    <div key={time} className="flex items-center gap-4 p-2 hover:bg-muted/50 rounded-lg">
                      <div className="w-16 text-sm text-muted-foreground font-medium">{time}</div>
                      <div className="flex-1 min-h-[40px] border-2 border-dashed border-muted rounded-lg p-2">
                        {blocks.map((block) => (
                          <div
                            key={block.id}
                            className={`${block.color} text-white p-3 rounded-lg flex items-center justify-between`}
                          >
                            <div>
                              <div className="font-semibold">{block.subject}</div>
                              <div className="text-xs opacity-90">{block.duration}h</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:bg-white/20"
                              onClick={() => handleDeleteBlock(block.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="w-full mt-4" variant="outline" onClick={handleAddBlock}>
                <Plus className="h-4 w-4 mr-2" />
                Add Study Block
              </Button>
            </CardContent>
          </Card>

          {/* Quick Add Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Study Block</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (hours)</Label>
                  <Input type="number" placeholder="2" min="0.5" step="0.5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add to Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>AI Suggestions</CardTitle>
                </div>
                <Switch checked={showAISuggestions} onCheckedChange={setShowAISuggestions} />
              </div>
              <CardDescription>Optimal study times based on your patterns</CardDescription>
            </CardHeader>
            {showAISuggestions && (
              <CardContent className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{suggestion.day}</Badge>
                      <span className="text-sm font-medium">{suggestion.time}</span>
                    </div>
                    <div className="font-semibold">{suggestion.subject}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.reason}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      {suggestion.duration}h
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Schedule Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Study Hours</span>
                <span className="font-semibold">12.5h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Study Days</span>
                <span className="font-semibold">5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Break Time</span>
                <span className="font-semibold">2.5h</span>
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="text-sm font-medium">Subjects</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Mathematics - 5h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Physics - 4h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Computer Science - 3.5h</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

