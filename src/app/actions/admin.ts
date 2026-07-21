'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addService(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('services').insert([data]);
  if (error) {
    console.error('Error adding service:', error);
    throw new Error(error.message);
  }
  revalidatePath('/[lang]/admin/services', 'page');
  return { success: true };
}

export async function addDoctor(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('doctors').insert([data]);
  if (error) {
    console.error('Error adding doctor:', error);
    throw new Error(error.message);
  }
  revalidatePath('/[lang]/admin/doctors', 'page');
  return { success: true };
}

export async function addBlogPost(data: any) {
  const supabase = createClient();
  const { error } = await supabase.from('blog_posts').insert([data]);
  if (error) {
    console.error('Error adding blog post:', error);
    throw new Error(error.message);
  }
  revalidatePath('/[lang]/admin/blog', 'page');
  return { success: true };
}
