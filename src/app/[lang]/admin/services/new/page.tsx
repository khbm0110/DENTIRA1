'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { addService } from '@/app/actions/admin';

const serviceSchema = z.object({
  name_fr: z.string().min(2, 'Name is required'),
  name_ar: z.string().min(2, 'Arabic name is required'),
  description_fr: z.string().min(10, 'Description is required'),
  description_ar: z.string().min(10, 'Arabic description is required'),
  icon_name: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function NewServicePage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      is_active: true,
    }
  });

  const onSubmit = async (data: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      await addService({
        name_fr: data.name_fr,
        name_ar: data.name_ar,
        description_fr: data.description_fr,
        description_ar: data.description_ar,
        icon_name: data.icon_name || null,
        is_active: data.is_active,
        image_url: null, // Placeholder for image upload
      });
      router.push(`/${lang}/admin/services`);
    } catch (error) {
      console.error(error);
      alert('Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/admin/services`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Add New Service</h2>
          <p className="text-slate-500 text-sm mt-1">Create a new service offering.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {activeTab === 'fr' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Service Name (FR)</label>
                      <input {...register('name_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.name_fr && <p className="text-red-500 text-xs mt-1">{errors.name_fr.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Description (FR)</label>
                      <textarea {...register('description_fr')} rows={6} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.description_fr && <p className="text-red-500 text-xs mt-1">{errors.description_fr.message}</p>}
                    </div>
                  </>
                ) : (
                  <div dir="rtl">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">اسم الخدمة (AR)</label>
                      <input {...register('name_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">وصف الخدمة (AR)</label>
                      <textarea {...register('description_ar')} rows={6} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.description_ar && <p className="text-red-500 text-xs mt-1">{errors.description_ar.message}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Featured Image</label>
                  <div className="w-full h-48 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-sm font-medium">Click to upload photo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Icon Name</label>
                    <input type="text" {...register('icon_name')} placeholder="e.g. HeartPulse" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <div className="flex items-center h-10">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input type="checkbox" {...register('is_active')} className="sr-only" />
                          <div className="block bg-slate-200 w-10 h-6 rounded-full"></div>
                          <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform peer-checked:translate-x-4 peer-checked:bg-primary"></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-slate-700">
                          Active
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <Link href={`/${lang}/admin/services`} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Save size={18} />
              Save Service
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
