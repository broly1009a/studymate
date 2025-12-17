// Blog API Service
import { BlogPost, BlogComment, BlogCategory } from '@/lib/mock-data/blog';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_BASE_URL =  '/api';
// Helper function for API calls
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('🔍 Fetching:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Data received:', data);
    return data;
  } catch (error) {
    console.error('❌ API call failed:', error);
    console.error('URL was:', url);
    throw error;
  }
}

// Blog Posts API
export async function getBlogPosts(filters?: {
  category?: string;
  tag?: string;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  authorId?: string;
}): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  
  if (filters?.category) params.append('category', filters.category);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
  if (filters?.authorId) params.append('authorId', filters.authorId);
  
  const queryString = params.toString();
  const endpoint = `/blog-posts${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetchAPI<{ success: boolean; data: BlogPost[]; pagination?: any }>(endpoint);
  let posts = response.data || [];
  
  // Client-side filtering for tags (json-server doesn't support array filtering)
  if (filters?.tag) {
    posts = posts.filter(post => post.tags.includes(filters.tag!));
  }
  
  // Sort by publishedAt descending
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetchAPI<{ success: boolean; data: BlogPost }>(`/blog-posts/${id}`);
    return response.data || null;
  } catch (error) {
    console.error(`Failed to fetch post ${id}:`, error);
    return null;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetchAPI<{ success: boolean; data: BlogPost[] }>(`/blog-posts?slug=${slug}`);
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch post by slug ${slug}:`, error);
    return null;
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const response = await fetchAPI<{ success: boolean; data: BlogPost }>('/blog-posts', {
    method: 'POST',
    body: JSON.stringify(post),
  });
  return response.data;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
  const response = await fetchAPI<{ success: boolean; data: BlogPost }>(`/blog-posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(post),
  });
  return response.data;
}

export async function deleteBlogPost(id: string): Promise<void> {
  await fetchAPI(`/blog-posts/${id}`, {
    method: 'DELETE',
  });
}

// Blog Comments API
export async function getBlogComments(postId: string): Promise<BlogComment[]> {
  const response = await fetchAPI<{ success: boolean; data: BlogComment[] }>(`/blog-comments?postId=${postId}`);
  const comments = response.data || [];
  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createBlogComment(comment: Omit<BlogComment, 'id'>): Promise<BlogComment> {
  const response = await fetchAPI<{ success: boolean; data: BlogComment }>('/blog-comments', {
    method: 'POST',
    body: JSON.stringify(comment),
  });
  return response.data;
}

export async function updateBlogComment(id: string, comment: Partial<BlogComment>): Promise<BlogComment> {
  const response = await fetchAPI<{ success: boolean; data: BlogComment }>(`/blog-comments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(comment),
  });
  return response.data;
}

export async function deleteBlogComment(id: string): Promise<void> {
  await fetchAPI(`/blog-comments/${id}`, {
    method: 'DELETE',
  });
}

// Blog Categories API
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const response = await fetchAPI<{ success: boolean; data: BlogCategory[] }>('/blog-categories');
  return response.data || [];
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  try {
    const response = await fetchAPI<{ success: boolean; data: BlogCategory[] }>(`/blog-categories?slug=${slug}`);
    return response.data?.[0] || null;
  } catch (error) {
    console.error(`Failed to fetch category by slug ${slug}:`, error);
    return null;
  }
}

// Blog Stats API
export async function getBlogStats() {
  const response = await fetchAPI<{ success: boolean; data: BlogPost[]; pagination?: any }>('/blog-posts?status=published');
  const posts = response.data || [];
  
  return {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: posts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: posts.reduce((sum, post) => sum + post.commentsCount, 0),
  };
}

// Increment view count
export async function incrementBlogPostViews(id: string): Promise<void> {
  try {
    const post = await getBlogPostById(id);
    if (post) {
      await updateBlogPost(id, { views: post.views + 1 });
    }
  } catch (error) {
    console.error(`Failed to increment views for post ${id}:`, error);
  }
}

// Toggle like
export async function toggleBlogPostLike(id: string, increment: boolean): Promise<void> {
  try {
    const post = await getBlogPostById(id);
    if (post) {
      await updateBlogPost(id, { likes: post.likes + (increment ? 1 : -1) });
    }
  } catch (error) {
    console.error(`Failed to toggle like for post ${id}:`, error);
  }
}

