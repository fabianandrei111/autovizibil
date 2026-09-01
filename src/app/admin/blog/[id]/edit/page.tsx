'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '../../BlogForm';

export default function EditBlogPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(posts => {
      const found = posts.find((p: any) => p.id === id);
      if (found) setPost({ ...found, published: !!found.published });
    });
  }, [id]);

  if (!post) return <div className="text-text-light">Se incarca...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Editeaza: {post.title}</h1>
      <BlogForm initial={post} />
    </div>
  );
}
