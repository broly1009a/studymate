'use client';

import { ProfileImage } from '@/types/profile';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useState } from 'react';

interface ProfileImagesProps {
  images?: ProfileImage[];
  isOwnProfile?: boolean;
}

export function ProfileImages({ images, isOwnProfile }: ProfileImagesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Ảnh</h3>
            {isOwnProfile && (
              <button className="text-sm text-primary hover:underline flex items-center gap-1">
                <Camera className="h-4 w-4" />
                Chỉnh sửa
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((image, index) => (
              <div
                key={image.publicId}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={`Profile ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Profile"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
