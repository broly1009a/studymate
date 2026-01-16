'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { vi } from '@/lib/i18n/vi';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';

export default function CreateGroupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    visibility: 'public',
    maxMembers: '30',
    autoApprove: true,
    avatar: '',
    coverImage: '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);

      // Upload to server
      const token = localStorage.getItem('studymate_auth_token');
      const response = await fetch('/api/upload/group-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: base64,
          type: 'avatar',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, avatar: data.image.url });
        toast.success('Đã tải lên ảnh đại diện');
      } else {
        toast.error('Tải ảnh thất bại');
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Tải ảnh thất bại');
      setAvatarPreview(null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setUploadingCover(true);
      const base64 = await fileToBase64(file);
      setCoverPreview(base64);

      // Upload to server
      const token = localStorage.getItem('studymate_auth_token');
      const response = await fetch('/api/upload/group-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: base64,
          type: 'cover',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, coverImage: data.image.url });
        toast.success('Đã tải lên ảnh bìa');
      } else {
        toast.error('Tải ảnh thất bại');
        setCoverPreview(null);
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Tải ảnh thất bại');
      setCoverPreview(null);
    } finally {
      setUploadingCover(false);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setFormData({ ...formData, avatar: '' });
  };

  const removeCover = () => {
    setCoverPreview(null);
    setFormData({ ...formData, coverImage: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Bạn cần đăng nhập để tạo nhóm');
      return;
    }

    if (!formData.name || !formData.description || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      const slug = generateSlug(formData.name);
      
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug,
          description: formData.description,
          category: formData.category,
          isPublic: formData.visibility === 'public',
          creatorId: user.id,
          creatorName: user.fullName,
          avatar: formData.avatar,
          coverImage: formData.coverImage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Đã tạo nhóm thành công!');
        router.push('/groups');
      } else {
        toast.error(data.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Link href="/groups">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại nhóm
        </Button>
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">{vi.groups.createGroup}</h1>
        <p className="text-muted-foreground mt-2">Bắt đầu một cộng đồng học tập mới</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin nhóm</CardTitle>
          <CardDescription>Điền thông tin cho nhóm học của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image */}
            <div>
              <Label>Ảnh bìa nhóm</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg overflow-hidden">
                {coverPreview ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                    {uploadingCover ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Nhấn để tải ảnh bìa (16:9, tối đa 5MB)
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div>
              <Label>Ảnh đại diện nhóm</Label>
              <div className="mt-2 flex items-center gap-4">
                {avatarPreview ? (
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2">
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-full cursor-pointer hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                    {uploadingAvatar ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <Upload className="h-6 w-6 text-muted-foreground" />
                    )}
                  </label>
                )}
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Tải lên ảnh đại diện cho nhóm (1:1, tối đa 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <Label>Tên nhóm *</Label>
              <Input
                placeholder="VD: Nhóm Thuật toán Nâng cao"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Description */}
            <div>
              <Label>Mô tả *</Label>
              <Textarea
                placeholder="Mô tả về nhóm của bạn, nội dung học tập và điều mà thành viên có thể mong đợi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="mt-2"
              />
            </div>

            {/* Category */}
            <div>
              <Label>Danh mục *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Khoa học máy tính">Khoa học máy tính</SelectItem>
                  <SelectItem value="Toán học">Toán học</SelectItem>
                  <SelectItem value="Vật lý">Vật lý</SelectItem>
                  <SelectItem value="Hóa học">Hóa học</SelectItem>
                  <SelectItem value="Sinh học">Sinh học</SelectItem>
                  <SelectItem value="Ngoại ngữ">Ngoại ngữ</SelectItem>
                  <SelectItem value="Kinh tế">Kinh tế</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Ôn thi THPT">Ôn thi THPT</SelectItem>
                  <SelectItem value="Thiết kế">Thiết kế</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visibility */}
            <div>
              <Label>Quyền riêng tư</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value) => setFormData({ ...formData, visibility: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Công khai - Bất kỳ ai cũng có thể tìm và tham gia</SelectItem>
                  <SelectItem value="private">Riêng tư - Chỉ tham gia theo lời mời</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Max Members */}
            <div>
              <Label>Số thành viên tối đa</Label>
              <Input
                type="number"
                min="5"
                max="100"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                className="mt-2"
              />
            </div>

            {/* Auto Approve */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label>Tự động duyệt yêu cầu tham gia</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Tự động chấp nhận thành viên mới mà không cần phê duyệt thủ công
                </p>
              </div>
              <Switch
                checked={formData.autoApprove}
                onCheckedChange={(checked) => setFormData({ ...formData, autoApprove: checked })}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Tạo nhóm
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

