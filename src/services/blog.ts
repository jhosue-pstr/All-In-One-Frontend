import type {
  BlogPost,
  BlogPostCreate,
  BlogPostUpdate,
  BlogCategory,
  BlogCategoryCreate,
  BlogImageResponse,
} from '../models/blog';
import { fetchApi } from './api';

export const blogService = {
  async getPosts(siteId: number, onlyPublished = false): Promise<BlogPost[]> {
    const params = onlyPublished ? '?only_published=true' : '';
    return fetchApi<BlogPost[]>(`/modules/blog/${siteId}/posts${params}`);
  },

  async getPostBySlug(siteId: number, slug: string): Promise<BlogPost> {
    return fetchApi<BlogPost>(`/modules/blog/${siteId}/posts/${slug}`);
  },

  async createPost(siteId: number, data: BlogPostCreate): Promise<BlogPost> {
    return fetchApi<BlogPost>(`/modules/blog/${siteId}/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updatePost(
    siteId: number,
    postId: number,
    data: BlogPostUpdate
  ): Promise<BlogPost> {
    return fetchApi<BlogPost>(`/modules/blog/${siteId}/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deletePost(siteId: number, postId: number): Promise<void> {
    return fetchApi<void>(`/modules/blog/${siteId}/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  async createCategory(
    siteId: number,
    data: BlogCategoryCreate
  ): Promise<BlogCategory> {
    return fetchApi<BlogCategory>(`/modules/blog/${siteId}/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async uploadImage(
    siteId: number,
    file: File
  ): Promise<BlogImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/modules/blog/${siteId}/upload-image`,
      {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: 'Error al subir la imagen' }));
      throw new Error(error.detail || 'Error al subir la imagen');
    }

    return response.json();
  },
};
