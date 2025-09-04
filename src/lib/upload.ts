import { apiService } from './api';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface UploadChunkRequest {
  chunk: File;
  filename: string;
  chunk_index: number;
  total_chunks: number;
  upload_uuid: string;
}

export interface UploadRecordRequest {
  title: string;
  description?: string;
  category_id: string;
  user_id: string;
  media_type: string;
  upload_uuid: string;
  filename: string;
  total_chunks: number;
  latitude?: number;
  longitude?: number;
  release_rights: string;
  language: string;
  use_uid_filename?: boolean;
}

export interface UploadRecordResponse {
  title: string;
  description: string;
  media_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
  reviewed: boolean;
  reviewed_by: string;
  reviewed_at: string;
  release_rights: string;
  language: string;
  uid: string;
  user_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  duration_seconds: number;
}

class UploadService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async uploadChunk(data: UploadChunkRequest): Promise<any> {
    const formData = new FormData();
    formData.append('chunk', data.chunk);
    formData.append('filename', data.filename);
    formData.append('chunk_index', data.chunk_index.toString());
    formData.append('total_chunks', data.total_chunks.toString());
    formData.append('upload_uuid', data.upload_uuid);

    const response = await fetch(`${API_BASE_URL}/api/v1/records/upload/chunk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to upload chunk');
    }

    return response.json();
  }

  async uploadRecord(data: UploadRecordRequest): Promise<UploadRecordResponse> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/v1/records/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail?.[0]?.msg || 'Failed to upload record');
    }

    return response.json();
  }

  // Helper method to upload large files in chunks
  async uploadFileInChunks(
    file: File,
    recordData: Omit<UploadRecordRequest, 'upload_uuid' | 'filename' | 'total_chunks'>,
    chunkSize: number = 1024 * 1024, // 1MB chunks
    onProgress?: (progress: number) => void
  ): Promise<UploadRecordResponse> {
    const uploadUuid = crypto.randomUUID();
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    // Upload chunks
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      await this.uploadChunk({
        chunk: new File([chunk], file.name),
        filename: file.name,
        chunk_index: i,
        total_chunks: totalChunks,
        upload_uuid: uploadUuid,
      });

      if (onProgress) {
        onProgress(((i + 1) / totalChunks) * 100);
      }
    }

    // Finalize upload
    return this.uploadRecord({
      ...recordData,
      upload_uuid: uploadUuid,
      filename: file.name,
      total_chunks: totalChunks,
    });
  }
}

export const uploadService = new UploadService();