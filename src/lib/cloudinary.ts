import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload image to Cloudinary
 * @param file - Base64 encoded image or file buffer
 * @param folder - Folder name in Cloudinary
 * @param publicId - Optional public ID for the image
 * @returns Upload result with URL and public_id
 */
export async function uploadImage(
  file: string,
  folder: string = 'studymate/profiles',
  publicId?: string
) {
  try {
    const options: any = {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(file, options);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId - Public ID of the image to delete
 * @returns Deletion result
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Delete multiple images from Cloudinary
 * @param publicIds - Array of public IDs to delete
 * @returns Deletion results
 */
export async function deleteMultipleImages(publicIds: string[]) {
  try {
    const results = await Promise.all(
      publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
    );
    return results;
  } catch (error) {
    console.error('Error deleting multiple images from Cloudinary:', error);
    throw new Error('Failed to delete images');
  }
}

/**
 * Get optimized image URL
 * @param publicId - Public ID of the image
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  } = {}
) {
  const { width = 400, height = 400, crop = 'fill', quality = 'auto' } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: 'auto',
  });
}
