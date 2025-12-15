'use client';

import { use, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';

export default function EditCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Mock existing competition data
  const [formData, setFormData] = useState({
    title: 'ACM ICPC Programming Contest 2025',
    description: 'International Collegiate Programming Contest for university students',
    category: 'programming',
    difficulty: 'advanced',
    startDate: '2025-11-15T09:00',
    endDate: '2025-11-15T17:00',
    registrationDeadline: '2025-11-10T23:59',
    maxParticipants: '200',
    teamSize: '3',
    allowTeams: true,
    prizes: 'First place: $5000\nSecond place: $3000\nThird place: $1000',
    rules: 'Standard ACM ICPC rules apply...',
    requirements: 'Must be currently enrolled university student',
    contactEmail: 'acm@university.edu',
    status: 'published' as 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    toast.success('Đã cập nhật cuộc thi thành công');
    router.push(`/competitions/${id}`);
  };

  const handleDelete = () => {
    if (confirm('Bạn có chắc chắn muốn xóa cuộc thi này?')) {
      toast.success('Đã xóa cuộc thi');
      router.push('/competitions');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href={`/competitions/${id}`}>
            <Button variant="ghost" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {vi.common.back}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Chỉnh sửa cuộc thi</h1>
          <p className="text-muted-foreground">Cập nhật thông tin cuộc thi</p>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Xóa cuộc thi
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
              <CardDescription>Quản lý trạng thái cuộc thi</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="status">Trạng thái hiện tại</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="published">Đã công bố</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="completed">Đã kết thúc</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin cơ bản về cuộc thi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên cuộc thi *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tên cuộc thi..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Mô tả *</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả chi tiết về cuộc thi..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Lập trình</SelectItem>
                      <SelectItem value="math">Toán học</SelectItem>
                      <SelectItem value="science">Khoa học</SelectItem>
                      <SelectItem value="language">Ngôn ngữ</SelectItem>
                      <SelectItem value="design">Thiết kế</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Người mới</SelectItem>
                      <SelectItem value="intermediate">Trung bình</SelectItem>
                      <SelectItem value="advanced">Nâng cao</SelectItem>
                      <SelectItem value="expert">Chuyên gia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Lịch trình</CardTitle>
              <CardDescription>Thiết lập thời gian cho cuộc thi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Ngày bắt đầu</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">Ngày kết thúc</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="registrationDeadline">Hạn đăng ký</Label>
                <Input
                  id="registrationDeadline"
                  type="datetime-local"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Người tham gia</CardTitle>
              <CardDescription>Cấu hình về người tham gia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="maxParticipants">Số lượng tối đa</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="Không giới hạn"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="teamSize">Kích thước nhóm</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    placeholder="1 (cá nhân)"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowTeams">Cho phép thi đấu theo nhóm</Label>
                  <p className="text-sm text-muted-foreground">
                    Người tham gia có thể tạo và tham gia nhóm
                  </p>
                </div>
                <Switch
                  id="allowTeams"
                  checked={formData.allowTeams}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowTeams: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết</CardTitle>
              <CardDescription>Thông tin bổ sung về cuộc thi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prizes">Giải thưởng</Label>
                <Textarea
                  id="prizes"
                  placeholder="Mô tả các giải thưởng..."
                  value={formData.prizes}
                  onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rules">Thể lệ</Label>
                <Textarea
                  id="rules"
                  placeholder="Quy định và thể lệ cuộc thi..."
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="requirements">Yêu cầu</Label>
                <Textarea
                  id="requirements"
                  placeholder="Yêu cầu đối với người tham gia..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email liên hệ</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
            <Link href={`/competitions/${id}`}>
              <Button type="button" variant="ghost">
                {vi.common.cancel}
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

