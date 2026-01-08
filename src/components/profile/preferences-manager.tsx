'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface PreferencesManagerProps {
  learningNeeds: string[];
  learningGoals: string[];
  studyHabits: string[];
  onUpdate: (data: {
    learningNeeds: string[];
    learningGoals: string[];
    studyHabits: string[];
  }) => void;
}

export function PreferencesManager({
  learningNeeds,
  learningGoals,
  studyHabits,
  onUpdate,
}: PreferencesManagerProps) {
  const [needs, setNeeds] = useState<string[]>(learningNeeds);
  const [goals, setGoals] = useState<string[]>(learningGoals);
  const [habits, setHabits] = useState<string[]>(studyHabits);
  
  const [newNeed, setNewNeed] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newHabit, setNewHabit] = useState('');

  const addNeed = () => {
    if (newNeed.trim()) {
      const updated = [...needs, newNeed.trim()];
      setNeeds(updated);
      onUpdate({ learningNeeds: updated, learningGoals: goals, studyHabits: habits });
      setNewNeed('');
    }
  };

  const removeNeed = (index: number) => {
    const updated = needs.filter((_, i) => i !== index);
    setNeeds(updated);
    onUpdate({ learningNeeds: updated, learningGoals: goals, studyHabits: habits });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      const updated = [...goals, newGoal.trim()];
      setGoals(updated);
      onUpdate({ learningNeeds: needs, learningGoals: updated, studyHabits: habits });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
    onUpdate({ learningNeeds: needs, learningGoals: updated, studyHabits: habits });
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      const updated = [...habits, newHabit.trim()];
      setHabits(updated);
      onUpdate({ learningNeeds: needs, learningGoals: goals, studyHabits: updated });
      setNewHabit('');
    }
  };

  const removeHabit = (index: number) => {
    const updated = habits.filter((_, i) => i !== index);
    setHabits(updated);
    onUpdate({ learningNeeds: needs, learningGoals: goals, studyHabits: updated });
  };

  return (
    <div className="space-y-6">
      {/* Learning Needs */}
      <div>
        <Label className="mb-2 block">Learning Needs</Label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add learning need..."
            value={newNeed}
            onChange={(e) => setNewNeed(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNeed())}
          />
          <Button type="button" onClick={addNeed} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {needs.map((need, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
              {need}
              <button
                type="button"
                onClick={() => removeNeed(index)}
                className="ml-2 hover:bg-blue-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div>
        <Label className="mb-2 block">Learning Goals</Label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add learning goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
          />
          <Button type="button" onClick={addGoal} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {goals.map((goal, index) => (
            <Badge key={index} variant="secondary" className="bg-purple-50 text-purple-700">
              {goal}
              <button
                type="button"
                onClick={() => removeGoal(index)}
                className="ml-2 hover:bg-purple-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Study Habits */}
      <div>
        <Label className="mb-2 block">Study Habits</Label>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add study habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHabit())}
          />
          <Button type="button" onClick={addHabit} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {habits.map((habit, index) => (
            <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
              {habit}
              <button
                type="button"
                onClick={() => removeHabit(index)}
                className="ml-2 hover:bg-green-100 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
