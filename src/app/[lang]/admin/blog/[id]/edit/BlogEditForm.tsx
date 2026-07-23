'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateBlogPost } from '@/app/actions/admin';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import ImageUploader from '@/components/admin/ImageUploader';

const postSchema = z.object({
  title_fr: z.string().min(2, 'Title is required'),
  title_ar: z.string().min(2, 'Arabic title is required'),
  content_fr: z.string().min(10, 'Content is required'),
  content_ar: z.string().min(10, 'Arabic content is required'),
  slug: z.string().min(2, 'Slug is required'),
  status: z.enum(['draft', 'published']),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function BlogEditForm({ lang, post }: { lang: string; post: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(post.image_url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title_fr: post.title_fr,
      title_ar: post.title_ar,
      content_fr: post.content_fr || '',
      content_ar: post.content_ar || '',
      slug: post.slug,
      status: post.is_published ? 'published' : 'draft',
    },
  });

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true);
    try {
      await updateBlogPost(post.id, {
        title_fr: data.title_fr,
        title_ar: data.title_ar,
        content_fr: data.content_fr,
        content_ar: data.content_ar,
        slug: data.slug,
        is_published: data.status === 'published',
        image_url: imageUrl,
      });
      router.push(`/${lang}/${ADMIN_SECRET_PATH}/blog`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to save post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/${ADMIN_SECRET_PATH}/blog`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Edit Post</h2>
          <p className="text-slate-500 text-sm mt-1">Update this article.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button type="button" onClick={() => setActiveTab('fr')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fr' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  🇫🇷 French (Default)
                </button>
                <button type="button" onClick={() => setActiveTab('ar')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ar' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                  🇲🇦 Arabic
                </button>
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'fr' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Title (FR)</label>
                      <input {...register('title_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" />
                      {errors.title_fr && <p className="text-red-500 text-xs mt-1">{errors.title_fr.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Content (FR)</label>
                      <textarea {...register('content_fr')} rows={15} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm" />
                      {errors.content_fr && <p className="text-red-500 text-xs mt-1">{errors.content_fr.message}</p>}
                    </div>
                  </>
                ) : (
                  <div dir="rtl">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">عنوان المقال (AR)</label>
                      <input {...register('title_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" />
                      {errors.title_ar && <p className="text-red-500 text-xs mt-1">{errors.title_ar.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">المحتوى (AR)</label>
                      <textarea {...register('content_ar')} rows={15} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm" />
                      {errors.content_ar && <p className="text-red-500 text-xs mt-1">{errors.content_ar.message}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Publishing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select {...register('status')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">URL Slug</label>
                  <input {...register('slug')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button type="submit" disabled={isSubmitting} className="w-full py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save size={18} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Featured Image</h3>
              <ImageUploader folder="blog" value={imageUrl} onChange={setImageUrl} label="" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
