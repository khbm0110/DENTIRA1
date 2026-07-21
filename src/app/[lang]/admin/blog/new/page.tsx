'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const postSchema = z.object({
  title_fr: z.string().min(2, 'Title is required'),
  title_ar: z.string().min(2, 'Arabic title is required'),
  content_fr: z.string().min(10, 'Content is required'),
  content_ar: z.string().min(10, 'Arabic content is required'),
  slug: z.string().min(2, 'Slug is required'),
  status: z.enum(['draft', 'published']),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function NewPostPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');

  const { register, handleSubmit, formState: { errors } } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      status: 'draft',
    }
  });

  const onSubmit = async (data: PostFormValues) => {
    console.log('Form data:', data);
    alert('Post saved successfully! (Mock)');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/admin/blog`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Write New Post</h2>
          <p className="text-slate-500 text-sm mt-1">Create an article for your clinic blog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button 
                  type="button"
                  onClick={() => setActiveTab('fr')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fr' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  🇫🇷 French (Default)
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ar' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  🇲🇦 Arabic
                </button>
              </div>

              <div className="p-6 space-y-6">
                {activeTab === 'fr' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Title (FR)</label>
                      <input {...register('title_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" placeholder="Enter post title..." />
                      {errors.title_fr && <p className="text-red-500 text-xs mt-1">{errors.title_fr.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Content (FR)</label>
                      <textarea {...register('content_fr')} rows={15} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm" placeholder="Write your post content here (Markdown or HTML format)..." />
                      {errors.content_fr && <p className="text-red-500 text-xs mt-1">{errors.content_fr.message}</p>}
                    </div>
                  </>
                ) : (
                  <div dir="rtl">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">عنوان المقال (AR)</label>
                      <input {...register('title_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" placeholder="أدخل عنوان المقال..." />
                      {errors.title_ar && <p className="text-red-500 text-xs mt-1">{errors.title_ar.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">المحتوى (AR)</label>
                      <textarea {...register('content_ar')} rows={15} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm" placeholder="اكتب محتوى المقال هنا..." />
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
                  <input {...register('slug')} placeholder="my-post-url" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Save size={18} />
                  Save Post
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Featured Image</h3>
              <div className="w-full h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                <ImageIcon size={32} className="mb-2" />
                <span className="text-sm font-medium">Click to upload</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
