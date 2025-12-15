'use client';

import { useState } from 'react';
import { Skill } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface SkillsManagerProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
}

export function SkillsManager({ skills, onSkillsChange }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState<{
    name: string;
    category: string;
    level: Skill['level'];
    yearsOfExperience: number;
  }>({
    name: '',
    category: 'Academic',
    level: 'beginner',
    yearsOfExperience: 0,
  });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      const skill: Skill = {
        id: Date.now().toString(),
        ...newSkill,
      };
      onSkillsChange([...skills, skill]);
      setNewSkill({
        name: '',
        category: 'Academic',
        level: 'beginner',
        yearsOfExperience: 0,
      });
    }
  };

  const handleRemoveSkill = (id: string) => {
    onSkillsChange(skills.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Existing Skills */}
      {skills.length > 0 && (
        <div className="space-y-2">
          <Label>Current Skills</Label>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill.id} variant="secondary" className="pl-3 pr-1 py-1">
                <span className="mr-2">
                  {skill.name} ({skill.level})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add New Skill */}
      <div className="space-y-4 p-4 border rounded-lg">
        <Label>Add New Skill</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="skillName">Skill Name</Label>
            <Input
              id="skillName"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="e.g., Mathematics"
            />
          </div>

          <div>
            <Label htmlFor="skillCategory">Category</Label>
            <Input
              id="skillCategory"
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
              placeholder="e.g., Academic, Technical"
            />
          </div>

          <div>
            <Label htmlFor="skillLevel">Level</Label>
            <Select
              value={newSkill.level}
              onValueChange={(value) =>
                setNewSkill({ ...newSkill, level: value as Skill['level'] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skillYears">Years of Experience</Label>
            <Input
              id="skillYears"
              type="number"
              min="0"
              value={newSkill.yearsOfExperience}
              onChange={(e) =>
                setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddSkill}
          disabled={!newSkill.name.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>
    </div>
  );
}

