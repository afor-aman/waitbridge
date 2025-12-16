import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { NavBar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Allow dynamic rendering in dev mode
export const dynamicParams = true;

// Generate metadata for each blog post
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Waitbridge Blog`,
    description: post.excerpt || '',
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      console.error(`Post not found for slug: ${slug}`);
      notFound();
    }

    // Get related posts (excluding current post)
    const allPosts = await getAllPosts();
    const relatedPosts = allPosts
      .filter((p) => p.slug !== post.slug)
      .slice(0, 3);

    return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <article className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <Link href="/blog">
              <Button 
                variant="ghost" 
                className="mb-8 -ml-2 hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            {/* Header */}
            <header className="mb-12 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                  {post.date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  )}
                  {post.readingTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Separator />
            </header>

            {/* Content */}
            <div className="blog-content prose prose-lg dark:prose-invert max-w-none
              [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-12 [&_h1]:text-foreground [&_h1]:leading-tight
              [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-foreground [&_h2]:leading-tight
              [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-foreground
              [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-6 [&_h4]:text-foreground
              [&_p]:mb-6 [&_p]:leading-8 [&_p]:text-foreground [&_p]:text-base
              [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_a]:font-medium
              [&_strong]:font-semibold [&_strong]:text-foreground
              [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-foreground
              [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-foreground
              [&_li]:mb-2 [&_li]:text-foreground [&_li]:leading-7
              [&_code]:text-sm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-foreground [&_code]:before:content-[''] [&_code]:after:content-['']
              [&_pre]:bg-muted [&_pre]:p-5 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:mb-6 [&_pre]:border [&_pre]:border-border
              [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:py-2
              [&_hr]:border-border [&_hr]:my-10 [&_hr]:border-t
              [&_img]:rounded-xl [&_img]:my-8 [&_img]:shadow-lg [&_img]:w-full
              [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:rounded-lg [&_table]:overflow-hidden
              [&_th]:border [&_th]:border-border [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-muted
              [&_td]:border [&_td]:border-border [&_td]:p-3 [&_td]:text-foreground">
              <MDXRemote source={post.content} />
            </div>

            <Separator className="my-12" />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                        <CardHeader>
                          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </CardTitle>
                          {relatedPost.excerpt && (
                            <CardDescription className="line-clamp-2 text-sm">
                              {relatedPost.excerpt}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {relatedPost.date && (
                              <time dateTime={relatedPost.date}>
                                {new Date(relatedPost.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </time>
                            )}
                            {relatedPost.readingTime && (
                              <span>• {relatedPost.readingTime} min</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
    );
  } catch (error) {
    console.error('Error rendering blog post:', error);
    notFound();
  }
}
