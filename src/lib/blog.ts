import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: string;
  tags?: string[];
  readingTime?: number;
}

export interface BlogPostWithContent extends BlogPost {
  content: string; // Raw MDX content
}

// Get all blog post slugs
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Get a single blog post by slug
export async function getPostBySlug(slug: string): Promise<BlogPostWithContent | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Blog post file not found: ${fullPath}`);
      console.error(`Posts directory: ${postsDirectory}`);
      console.error(`Current working directory: ${process.cwd()}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      author: data.author || '',
      tags: data.tags || [],
      readingTime: calculateReadingTime(content),
      content, // Return raw content for RSC serialization
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

// Get all blog posts sorted by date
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getPostSlugs();
  const posts: BlogPost[] = [];

  for (const slug of slugs) {
    try {
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      posts.push({
        slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || '',
        author: data.author || '',
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
      });
    } catch (error) {
      console.error(`Error reading post ${slug}:`, error);
    }
  }

  // Sort by date, newest first
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
