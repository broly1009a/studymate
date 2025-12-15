'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function CreateTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [competition, setCompetition] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    skillsNeeded: [] as string[],
  });
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/competitions/${id}`);
        const data = await response.json();
        if (data.success) {
          setCompetition(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch competition:', error);
        toast.error('Failed to load competition');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetition();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!competition) {
    return <div className="w-full">Không tìm thấy cuộc thi</div>;
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skillsNeeded.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skillsNeeded: [...formData.skillsNeeded, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skillsNeeded: formData.skillsNeeded.filter(s => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/competitions/${id}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Đã tạo đội thành công!');
        router.push(`/competitions/${id}/teams`);
      } else {
        toast.error(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error('Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Link href={`/competitions/${id}`}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại cuộc thi
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Tạo đội cho {competition.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Tên đội *</Label>
              <Input
                placeholder="VD: Chiến binh code"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={submitting}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Mô tả *</Label>
              <Textarea
                placeholder="Mô tả về đội của bạn và những gì bạn đang tìm kiếm..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                disabled={submitting}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Kỹ năng cần thiết</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="VD: Quy hoạch động"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                  disabled={submitting}
                />
                <Button type="button" onClick={handleAddSkill} disabled={submitting} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Thêm
                </Button>
              </div>
              {formData.skillsNeeded.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.skillsNeeded.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        disabled={submitting}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Kích thước đội cho cuộc thi này: {competition.teamSize?.min || 1}-{competition.teamSize?.max || 5} thành viên
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Tạo đội
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={submitting}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

