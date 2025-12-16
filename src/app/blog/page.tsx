import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NavBar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { Clock, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Blog | Waitbridge',
  description: 'Read our latest articles about waitlists, product launches, and growth strategies.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Hero Section */}
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Insights, tips, and stories about building waitlists and launching products that people love.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 overflow-hidden">
                    <CardHeader className="space-y-3">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
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
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors text-xl">
                        {post.title}
                      </CardTitle>
                      {post.excerpt && (
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                          {post.excerpt}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        {post.date && (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <time dateTime={post.date}>
                              {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                        )}
                        {post.readingTime && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{post.readingTime} min read</span>
                          </div>
                        )}
                        {post.author && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{post.author}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-sm text-primary font-medium group-hover:underline">
                          Read more →
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
