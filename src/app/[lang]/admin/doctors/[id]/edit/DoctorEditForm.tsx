'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateDoctor } from '@/app/actions/admin';
import { ADMIN_SECRET_PATH } from '@/config/admin-path';
import ImageUploader from '@/components/admin/ImageUploader';

const doctorSchema = z.object({
  name_fr: z.string().min(2, 'Name is required'),
  name_ar: z.string().min(2, 'Arabic name is required'),
  specialty_fr: z.string().min(2, 'Specialty is required'),
  specialty_ar: z.string().min(2, 'Arabic specialty is required'),
  bio_fr: z.string(),
  bio_ar: z.string(),
  experience_years: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

type DoctorFormValues = z.infer<typeof doctorSchema>;

export default function DoctorEditForm({ lang, doctor }: { lang: string; doctor: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'fr' | 'ar'>('fr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(doctor.image_url || null);

  const { register, handleSubmit, formState: { errors } } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema) as any,
    defaultValues: {
      name_fr: doctor.name_fr,
      name_ar: doctor.name_ar,
      specialty_fr: doctor.specialty_fr,
      specialty_ar: doctor.specialty_ar,
      bio_fr: doctor.bio_fr || '',
      bio_ar: doctor.bio_ar || '',
      experience_years: doctor.experience_years || 0,
      is_active: doctor.is_active,
    },
  });

  const onSubmit = async (data: DoctorFormValues) => {
    setIsSubmitting(true);
    try {
      await updateDoctor(doctor.id, { ...data, image_url: imageUrl });
      router.push(`/${lang}/${ADMIN_SECRET_PATH}/doctors`);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Failed to save doctor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/${lang}/${ADMIN_SECRET_PATH}/doctors`} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Edit Doctor</h2>
          <p className="text-slate-500 text-sm mt-1">Update this doctor profile.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {activeTab === 'fr' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Full Name (FR)</label>
                      <input {...register('name_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.name_fr && <p className="text-red-500 text-xs mt-1">{errors.name_fr.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Specialty (FR)</label>
                      <input {...register('specialty_fr')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.specialty_fr && <p className="text-red-500 text-xs mt-1">{errors.specialty_fr.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Biography (FR)</label>
                      <textarea {...register('bio_fr')} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>
                  </>
                ) : (
                  <div dir="rtl">
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">الاسم الكامل (AR)</label>
                      <input {...register('name_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar.message}</p>}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">التخصص (AR)</label>
                      <input {...register('specialty_ar')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                      {errors.specialty_ar && <p className="text-red-500 text-xs mt-1">{errors.specialty_ar.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">نبذة (AR)</label>
                      <textarea {...register('bio_ar')} rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <ImageUploader folder="doctors" value={imageUrl} onChange={setImageUrl} label="Profile Photo" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Experience (Years)</label>
                    <input type="number" {...register('experience_years')} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <label className="flex items-center h-10 gap-2 cursor-pointer">
                      <input type="checkbox" {...register('is_active')} className="w-5 h-5 rounded accent-primary" />
                      <span className="text-sm font-medium text-slate-700">Active Profile</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <Link href={`/${lang}/${ADMIN_SECRET_PATH}/doctors`} className="px-6 py-2.5 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-60">
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
