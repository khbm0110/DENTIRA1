import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import BlogEditForm from './BlogEditForm';

export default async function EditBlogPostPage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', params.id).single();

  if (!post) notFound();

  return <BlogEditForm lang={params.lang} post={post} />;
}
