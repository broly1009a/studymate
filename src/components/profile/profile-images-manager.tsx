'use client';

import { useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/hooks/use-image-upload';

interface ProfileImage {
  url: string;
  publicId: string;
  order: number;
}

interface ProfileImagesManagerProps {
  images: ProfileImage[];
  onImagesChange: (images: ProfileImage[]) => void;
  maxImages?: number;
}

export function ProfileImagesManager({
  images = [],
  onImagesChange,
  maxImages = 6,
}: ProfileImagesManagerProps) {
  const { uploadImage, deleteImage, validateImage, isUploading } = useImageUpload();

  const handleUploadImage = async (file: File, index: number) => {
    // Validate image
    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    // Get old public ID if replacing
    const oldPublicId = images[index]?.publicId;

    // Upload image
    const result = await uploadImage(file, index, oldPublicId);

    if (result) {
      const newImages = [...images];
      newImages[index] = {
        url: result.url,
        publicId: result.publicId,
        order: index,
      };
      onImagesChange(newImages);
      toast.success('Ảnh đã được tải lên thành công!');
    }
  };

  const handleRemoveImage = async (index: number) => {
    const image = images[index];
    if (!image) return;

    const success = await deleteImage(image.publicId);
    if (success) {
      const newImages = images.filter((_, i) => i !== index);
      // Reorder remaining images
      const reordered = newImages.map((img, i) => ({ ...img, order: i }));
      onImagesChange(reordered);
      toast.success('Ảnh đã được xóa');
    } else {
      toast.error('Không thể xóa ảnh');
    }
  };

  const triggerFileInput = (index: number) => {
    if (isUploading) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadImage(file, index);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Ảnh hồ sơ ({images.length}/{maxImages})</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Tối thiểu 2 ảnh. Thêm nhiều ảnh để hồ sơ của bạn nổi bật hơn.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: maxImages }).map((_, index) => {
          const image = images[index];

          return (
            <div
              key={index}
              className={cn(
                'relative aspect-square rounded-lg border-2 border-dashed overflow-hidden transition-all',
                image
                  ? 'border-primary bg-primary/5 hover:border-primary/70'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50',
                isUploading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {image ? (
                <>
                  <img
                    src={image.url}
                    alt={`Profile ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => triggerFileInput(index)}
                      disabled={isUploading}
                      className="h-8"
                    >
                      <Upload className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(index)}
                      disabled={isUploading}
                      className="h-8"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerFileInput(index)}
                  disabled={isUploading}
                  className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500">Thêm ảnh</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {images.length < 2 && (
        <p className="text-sm text-amber-600 flex items-center gap-2">
          <span className="text-amber-600">⚠</span>
          Vui lòng thêm ít nhất 2 ảnh
        </p>
      )}
    </div>
  );
}
