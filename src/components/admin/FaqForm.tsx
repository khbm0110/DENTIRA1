'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';

const faqSchema = z.object({
  question_fr: z.string().min(4, 'Question is required'),
  question_ar: z.string().min(4, 'Arabic question is required'),
  answer_fr: z.string().min(4, 'Answer is required'),
  answer_ar: z.string().min(4, 'Arabic answer is required'),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FaqFormValues = z.infer<typeof faqSchema>;

export default function FaqForm({
  lang,
  faq,
  onSave,
}: {
  lang: string;
  faq?: any;
  onSave: (data: any) => Promise<any>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema) as any,
    defaultValues: {
      question_fr: faq?.question_fr || '',
      question_ar: faq?.question_ar || '',
      answer_fr: faq?.answer_fr || '',
      answer_ar: faq?.answer_ar || '',
      display_order: faq?.display_order ?? 0,
      is_active: faq?.is_active ?? true,
    },
  });

  const onSubmit = async (data: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      router.push(`/${lang}/${ADMIN_SECRET_PATH}/faqs`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to save question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/${ADMIN_SECRET_PATH}/faqs`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{faq ? 'Edit Question' : 'Add Question'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button type="button" onClick={() => setActiveTab('fr')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fr' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇫🇷 French</button>
            <button type="button" onClick={() => setActiveTab('ar')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ar' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇲🇦 Arabic</button>
          </div>

          <div className="p-6 space-y-4">
            {activeTab === 'fr' ? (
              <>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Question (FR)</label>
                  <input {...register('question_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  {errors.question_fr && <p className="text-red-500 text-xs mt-1">{errors.question_fr.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Answer (FR)</label>
                  <textarea {...register('answer_fr')} rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  {errors.answer_fr && <p className="text-red-500 text-xs mt-1">{errors.answer_fr.message}</p>}
                </div>
              </>
            ) : (
              <div dir="rtl">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-slate-700 mb-1">السؤال (AR)</label>
                  <input {...register('question_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  {errors.question_ar && <p className="text-red-500 text-xs mt-1">{errors.question_ar.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">الجواب (AR)</label>
                  <textarea {...register('answer_ar')} rows={5} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  {errors.answer_ar && <p className="text-red-500 text-xs mt-1">{errors.answer_ar.message}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Display Order</label>
                <input type="number" {...register('display_order')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <label className="flex items-center h-10 gap-2 cursor-pointer">
                  <input type="checkbox" {...register('is_active')} className="w-5 h-5 rounded accent-primary" />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <Link href={`/${lang}/${ADMIN_SECRET_PATH}/faqs`} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60">
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
