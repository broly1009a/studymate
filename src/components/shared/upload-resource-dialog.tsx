'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

interface UploadResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupSlug: string;
  onUploadSuccess: () => void;
}

export function UploadResourceDialog({
  open,
  onOpenChange,
  groupSlug,
  onUploadSuccess,
}: UploadResourceDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 50MB');
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file');
      return;
    }

    if (!fileName.trim()) {
      toast.error('Vui lòng nhập tên tài liệu');
      return;
    }

    try {
      setUploading(true);

      // Convert file to base64
      const base64 = await fileToBase64(selectedFile);

      // Get auth token
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      // Upload to Cloudinary
      const uploadResponse = await fetch('/api/upload/group-resource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          file: base64,
          fileName: selectedFile.name,
          groupId: groupSlug,
        }),
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      // Create resource record in database
      const resourceResponse = await fetch(`/api/groups/${groupSlug}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: fileName,
          type: 'file',
          fileUrl: uploadData.file.url,
          fileSize: selectedFile.size,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        }),
      });

      const resourceData = await resourceResponse.json();

      if (!resourceResponse.ok) {
        throw new Error(resourceData.message || 'Failed to create resource');
      }

      toast.success('Tải lên tài liệu thành công!');
      onUploadSuccess();
      handleClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải lên tài liệu. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName('');
    setTags('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Tài Liệu</DialogTitle>
          <DialogDescription>
            Tải lên file, tài liệu hoặc hình ảnh để chia sẻ với nhóm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            {!selectedFile ? (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Chọn file để tải lên
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, Images, Videos (Max 50MB)
                </p>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*,video/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  Chọn File
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* File Name */}
          <div className="space-y-2">
            <Label htmlFor="fileName">Tên Tài Liệu</Label>
            <Input
              id="fileName"
              placeholder="Nhập tên tài liệu..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
            <Input
              id="tags"
              placeholder="Ví dụ: toán học, bài giảng, chương 1"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tags giúp tìm kiếm tài liệu dễ dàng hơn
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={uploading}>
            Hủy
          </Button>
          <Button type="button" onClick={handleUpload} disabled={uploading || !selectedFile}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Tải Lên
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
