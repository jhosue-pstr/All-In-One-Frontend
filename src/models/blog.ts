export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface BlogCategory {
  id: number;
  site_id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogCategoryCreate {
  name: string;
  description?: string;
}

export interface BlogPost {
  id: number;
  site_id: number;
  category_id: number | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: PostStatus;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status?: PostStatus;
  published_at?: string;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface BlogPostUpdate {
  title?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status?: PostStatus;
  published_at?: string;
  category_id?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface BlogImageResponse {
  url: string;
}
