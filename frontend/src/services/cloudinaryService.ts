import axios from 'axios';
import { Cloudinary } from '@cloudinary/url-gen';
import { quality } from '@cloudinary/url-gen/actions/delivery';
import { scale } from '@cloudinary/url-gen/actions/resize';

import type { AttachmentMetadata } from '../types/types';

export class CloudinaryService {
  private static readonly CLOUD_NAME = 'dsmlevmjk';
  private static readonly UPLOAD_PRESET = 'chat-app';
  private static readonly cld = new Cloudinary({
    cloud: {
      cloudName: CloudinaryService.CLOUD_NAME,
    },
  });

  private static generateFullImageUrl(publicId: string): string {
    const fullImage = CloudinaryService.cld.image(publicId);
    fullImage.delivery(quality('auto'));
    return fullImage.toURL();
  }

  private static generateThumbnailUrl(publicId: string): string {
    const thumbnail = CloudinaryService.cld.image(publicId);
    thumbnail.resize(scale().width(150).height(150)).delivery(quality('auto'));
    return thumbnail.toURL();
  }

  private static async uploadSingleFile(file: File): Promise<{
    public_id: string;
    secure_url: string;
    original_filename: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
    created_at: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CloudinaryService.UPLOAD_PRESET);
    formData.append('folder', 'uploads');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CloudinaryService.CLOUD_NAME}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  }

  static async upload(files: File[]): Promise<AttachmentMetadata[]> {
    if (files.length === 0) return [];
    const uploadPromises = files.map(async (file) => {
      const cloudinaryResult = await CloudinaryService.uploadSingleFile(file);

      const fullImageUrl = CloudinaryService.generateFullImageUrl(
        cloudinaryResult.public_id,
      );
      const thumbnailUrl = CloudinaryService.generateThumbnailUrl(
        cloudinaryResult.public_id,
      );

      return {
        public_id: cloudinaryResult.public_id,
        original_url: cloudinaryResult.secure_url,
        full_image_url: fullImageUrl,
        thumbnail_url: thumbnailUrl,
        file_name: cloudinaryResult.original_filename,
        file_size: cloudinaryResult.bytes,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        cloudinary_created_at: cloudinaryResult.created_at,
      };
    });

    return Promise.all(uploadPromises);
  }
}
