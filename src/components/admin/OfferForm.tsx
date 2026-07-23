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

const offerSchema = z.object({
  title_fr: z.string().min(2, 'Title is required'),
  title_ar: z.string().min(2, 'Arabic title is required'),
  description_fr: z.string().optional(),
  description_ar: z.string().optional(),
  discount_percentage: z.coerce.number().min(0).max(100).optional(),
  original_price: z.coerce.number().min(0).optional(),
  discounted_price: z.coerce.number().min(0).optional(),
  valid_until: z.string().optional(),
  display_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type OfferFormValues = z.infer<typeof offerSchema>;

const toDateInput = (val: any) => {
  if (!val) return '';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

export default function OfferForm({
  lang,
  offer,
  onSave,
}: {
  lang: string;
  offer?: any;
  onSave: (data: any) => Promise<any>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(offer?.image_url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema) as any,
    defaultValues: {
      title_fr: offer?.title_fr || '',
      title_ar: offer?.title_ar || '',
      description_fr: offer?.description_fr || '',
      description_ar: offer?.description_ar || '',
      discount_percentage: offer?.discount_percentage ?? undefined,
      original_price: offer?.original_price ?? undefined,
      discounted_price: offer?.discounted_price ?? undefined,
      valid_until: toDateInput(offer?.valid_until),
      display_order: offer?.display_order ?? 0,
      is_active: offer?.is_active ?? true,
    },
  });

  const onSubmit = async (data: OfferFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave({
        title_fr: data.title_fr,
        title_ar: data.title_ar,
        description_fr: data.description_fr,
        description_ar: data.description_ar,
        discount_percentage: data.discount_percentage || null,
        original_price: data.original_price || null,
        discounted_price: data.discounted_price || null,
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        display_order: data.display_order,
        is_active: data.is_active,
        image_url: imageUrl,
      });
      router.push(`/${lang}/${ADMIN_SECRET_PATH}/offers`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to save offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/${ADMIN_SECRET_PATH}/offers`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{offer ? 'Edit Offer' : 'Add Offer'}</h2>
          <p className="text-slate-500 text-sm mt-1">العروض - time-limited promotions.</p>
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
                    <label className="block text-sm font-bold text-slate-700 mb-1">Offer Title (FR)</label>
                    <input {...register('title_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    {errors.title_fr && <p className="text-red-500 text-xs mt-1">{errors.title_fr.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description (FR)</label>
                    <textarea {...register('description_fr')} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </>
              ) : (
                <div dir="rtl">
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-slate-700 mb-1">عنوان العرض (AR)</label>
                    <input {...register('title_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                    {errors.title_ar && <p className="text-red-500 text-xs mt-1">{errors.title_ar.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">الوصف (AR)</label>
                    <textarea {...register('description_ar')} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ImageUploader folder="offers" value={imageUrl} onChange={setImageUrl} label="Offer Image" />
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Discount %</label>
                  <input type="number" {...register('discount_percentage')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Original Price</label>
                  <input type="number" step="0.01" {...register('original_price')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Sale Price</label>
                  <input type="number" step="0.01" {...register('discounted_price')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Valid Until</label>
                  <input type="date" {...register('valid_until')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Display Order</label>
                  <input type="number" {...register('display_order')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>
              <label className="flex items-center h-10 gap-2 cursor-pointer">
                <input type="checkbox" {...register('is_active')} className="w-5 h-5 rounded accent-primary" />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </label>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <Link href={`/${lang}/${ADMIN_SECRET_PATH}/offers`} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">Cancel</Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60">
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Offer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
