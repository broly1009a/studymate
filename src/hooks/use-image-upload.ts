import { useState } from 'react';
import { toast } from 'sonner';

interface ProfileImage {
  url: string;
  publicId: string;
  file?: File;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Convert file to base64
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  /**
   * Upload image to Cloudinary
   */
  const uploadImage = async (
    file: File,
    index: number,
    oldPublicId?: string
  ): Promise<ProfileImage | null> => {
    try {
      setIsUploading(true);

      // Convert file to base64
      const base64 = await fileToBase64(file);

      // Get auth token
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Upload to server
      const response = await fetch('/api/upload/profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image: base64,
          oldPublicId,
          index,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      return {
        url: data.image.url,
        publicId: data.image.publicId,
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete image from Cloudinary
   */
  const deleteImage = async (publicId: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('studymate_auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `/api/upload/profile-image?publicId=${encodeURIComponent(publicId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Không thể xóa ảnh. Vui lòng thử lại.');
      return false;
    }
  };

  /**
   * Validate image file
   */
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)',
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Kích thước ảnh không được vượt quá 5MB',
      };
    }

    return { valid: true };
  };

  return {
    isUploading,
    uploadImage,
    deleteImage,
    validateImage,
    fileToBase64,
  };
}
