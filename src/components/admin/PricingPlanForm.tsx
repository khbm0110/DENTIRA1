'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import ImageUploader from '@/components/admin/ImageUploader';

const planSchema = z.object({
  name_fr: z.string().min(2, 'Name is required'),
  name_ar: z.string().min(2, 'Arabic name is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  currency: z.string().min(1),
  features_fr: z.string(), // one feature per line, converted to array on submit
  features_ar: z.string(),
  button_text_fr: z.string().optional(),
  button_text_ar: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type PlanFormValues = z.infer<typeof planSchema>;

const toLines = (val: any) => Array.isArray(val) ? val.join('\n') : '';
const toArray = (val: string) => val.split('\n').map((s) => s.trim()).filter(Boolean);

export default function PricingPlanForm({
  lang,
  plan,
  onSave,
}: {
  lang: string;
  plan?: any;
  onSave: (data: any) => Promise<any>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(plan?.image_url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema) as any,
    defaultValues: {
      name_fr: plan?.name_fr || '',
      name_ar: plan?.name_ar || '',
      price: plan?.price ?? 0,
      currency: plan?.currency || 'MAD',
      features_fr: toLines(plan?.features_fr),
      features_ar: toLines(plan?.features_ar),
      button_text_fr: plan?.button_text_fr || 'Choisir cette offre',
      button_text_ar: plan?.button_text_ar || 'اختر هذا العرض',
      display_order: plan?.display_order ?? 0,
      is_active: plan?.is_active ?? true,
    },
  });

  const onSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave({
        name_fr: data.name_fr,
        name_ar: data.name_ar,
        price: data.price,
        currency: data.currency,
        features_fr: toArray(data.features_fr),
        features_ar: toArray(data.features_ar),
        button_text_fr: data.button_text_fr,
        button_text_ar: data.button_text_ar,
        display_order: data.display_order,
        is_active: data.is_active,
        image_url: imageUrl,
      });
      router.push(`/${lang}/${ADMIN_SECRET_PATH}/pricing`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to save package');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/${ADMIN_SECRET_PATH}/pricing`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{plan ? 'Edit Package' : 'Add Package'}</h2>
          <p className="text-slate-500 text-sm mt-1">الباقات - shown to patients on the pricing section.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button type="button" onClick={() => setActiveTab('fr')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'fr' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇫🇷 French</button>
            <button type="button" onClick={() => setActiveTab('ar')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ar' ? 'border-primary text-primary bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>🇲🇦 Arabic</button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {activeTab === 'fr' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Package Name (FR)</label>
                    <input {...register('name_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    {errors.name_fr && <p className="text-red-500 text-xs mt-1">{errors.name_fr.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Features (one per line, FR)</label>
                    <textarea {...register('features_fr')} rows={6} placeholder={'Consultation gratuite\nDétartrage inclus\nSuivi 6 mois'} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Button Text (FR)</label>
                    <input {...register('button_text_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </>
              ) : (
                <div dir="rtl">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">اسم الباقة (AR)</label>
                    <input {...register('name_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">المميزات (سطر لكل ميزة)</label>
                    <textarea {...register('features_ar')} rows={6} placeholder={'استشارة مجانية\nتنظيف الأسنان مشمول\nمتابعة لمدة 6 أشهر'} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">نص الزر (AR)</label>
                    <input {...register('button_text_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ImageUploader folder="pricing" value={imageUrl} onChange={setImageUrl} label="Package Image (optional)" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Price</label>
                  <input type="number" step="0.01" {...register('price')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Currency</label>
                  <input {...register('currency')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <Link href={`/${lang}/${ADMIN_SECRET_PATH}/pricing`} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60">
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Package'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
