import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageUpload } from '@/hooks/use-image-upload';
import { toast } from 'sonner';

interface ProfileImage {
  url: string;
  publicId: string;
}

interface ImageUploadGridProps {
  images: ProfileImage[];
  onImagesChange: (images: ProfileImage[]) => void;
  maxImages?: number;
  className?: string;
}

export function ImageUploadGrid({
  images,
  onImagesChange,
  maxImages = 6,
  className,
}: ImageUploadGridProps) {
  const { uploadImage, deleteImage, validateImage, isUploading } = useImageUpload();

  const handleImageSelect = async (index: number, file: File) => {
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
      newImages[index] = result;
      onImagesChange(newImages);
      toast.success('Ảnh đã được tải lên thành công!');
    }
  };

  const triggerFileInput = (index: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/webp';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageSelect(index, file);
      }
    };
    input.click();
  };

  const handleRemoveImage = async (index: number, e: React.MouseEvent) => {
    e.stopPropagation();

    const image = images[index];
    if (!image) return;

    // Delete from Cloudinary
    const success = await deleteImage(image.publicId);

    if (success) {
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);
      toast.success('Ảnh đã được xóa!');
    }
  };

  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {Array.from({ length: maxImages }).map((_, index) => {
        const hasImage = images[index];

        return (
          <div
            key={index}
            className={cn(
              'relative aspect-square rounded-xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden group',
              hasImage ? 'border-blue-500' : 'border-gray-300 hover:border-blue-400',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => !hasImage && !isUploading && triggerFileInput(index)}
          >
            {hasImage ? (
              <>
                <img
                  src={hasImage.url}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => handleRemoveImage(index, e)}
                  disabled={isUploading}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-lg"
                  aria-label="Xóa ảnh"
                >
                  <X className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    !isUploading && triggerFileInput(index);
                  }}
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-lg"
                  aria-label="Thay đổi ảnh"
                >
                  <Upload className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-pink-500 animate-spin" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-pink-500 hover:bg-pink-600 flex items-center justify-center transition-colors">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
