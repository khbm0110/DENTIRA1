'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { runGoogleReviewsSync } from '@/lib/google-reviews-sync';
import { runInstagramSync } from '@/lib/instagram-sync';
import { slugify } from '@/lib/utils/slugify';

// A tiny guard used at the top of every mutating action. RLS already blocks
// non-admins at the database level, but failing fast here gives a clear
// error message instead of a confusing Postgres permission error.
async function assertAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') throw new Error('Not authorized');
  return supabase;
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
export async function addService(data: any) {
  const supabase = await assertAdmin();
  const slug = data.slug || slugify(data.name_fr || 'service');
  const { error } = await supabase.from('services').insert([{ ...data, slug }]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/services', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function updateService(id: string, data: any) {
  const supabase = await assertAdmin();
  const slug = data.slug || slugify(data.name_fr || 'service');
  const { error } = await supabase.from('services').update({ ...data, slug }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/services', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteService(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/services', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// DOCTORS
// ---------------------------------------------------------------------------
export async function addDoctor(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('doctors').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/doctors', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function updateDoctor(id: string, data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('doctors').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/doctors', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteDoctor(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('doctors').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/doctors', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// BLOG POSTS
// ---------------------------------------------------------------------------
export async function addBlogPost(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('blog_posts').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/blog', 'page');
  revalidatePath('/[lang]/blog', 'page');
  return { success: true };
}

export async function updateBlogPost(id: string, data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('blog_posts').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/blog', 'page');
  revalidatePath('/[lang]/blog', 'page');
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/blog', 'page');
  revalidatePath('/[lang]/blog', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// PRICING PLANS (الباقات)
// ---------------------------------------------------------------------------
export async function addPricingPlan(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('pricing_plans').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/pricing', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function updatePricingPlan(id: string, data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('pricing_plans').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/pricing', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deletePricingPlan(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('pricing_plans').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/pricing', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// OFFERS (العروض)
// ---------------------------------------------------------------------------
export async function addOffer(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('offers').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/offers', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function updateOffer(id: string, data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('offers').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/offers', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteOffer(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('offers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/offers', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// APPOINTMENTS
// ---------------------------------------------------------------------------
export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/appointments', 'page');
  return { success: true };
}

export async function deleteAppointment(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/appointments', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// MEDIA LIBRARY
// ---------------------------------------------------------------------------
export async function deleteMediaFile(path: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.storage.from('media').remove([path]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/media', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// CONTENT SECTIONS (homepage Hero text override)
// ---------------------------------------------------------------------------
export async function saveHeroContent(data: {
  title_fr: string;
  title_ar: string;
  subtitle_fr: string;
  subtitle_ar: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('content_sections').upsert(
    {
      section_key: 'hero',
      title_fr: data.title_fr,
      title_ar: data.title_ar,
      description_fr: data.subtitle_fr,
      description_ar: data.subtitle_ar,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'section_key' }
  );
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/content', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// CLINIC SETTINGS (contact info, working hours, social links)
// ---------------------------------------------------------------------------
export async function saveContactInfo(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('clinic_settings')
    .upsert({ key: 'contact_info', value: data }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/settings', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function saveWorkingHours(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('clinic_settings')
    .upsert({ key: 'working_hours', value: data }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/settings', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function saveSocialLink(platform: string, url: string, isActive: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('social_media')
    .upsert({ platform, url, is_active: isActive }, { onConflict: 'platform' });
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/settings', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteSocialLink(platform: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('social_media').delete().eq('platform', platform);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/settings', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------
export async function addFaq(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('faqs').insert([data]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/faqs', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function updateFaq(id: string, data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('faqs').update(data).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/faqs', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('faqs').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/faqs', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function setFaqActive(id: string, isActive: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('faqs').update({ is_active: isActive }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/faqs', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
export async function setTestimonialPublished(id: string, isPublished: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('testimonials').update({ is_published: isPublished }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/testimonials', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/testimonials', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function addTestimonial(data: any) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('testimonials').insert([{ ...data, source: 'manual' }]);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/testimonials', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// INSTAGRAM GALLERY
// ---------------------------------------------------------------------------
export async function saveInstagramToken(accessToken: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('clinic_settings')
    .upsert({ key: 'instagram', value: { access_token: accessToken } }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/gallery', 'page');
  return { success: true };
}

export async function syncInstagramGallery() {
  const supabase = await assertAdmin();
  const result = await runInstagramSync(supabase);
  revalidatePath('/[lang]/admin/gallery', 'page');
  revalidatePath('/[lang]', 'page');
  return result;
}

export async function setGalleryImagePublished(id: string, isPublished: boolean) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('gallery_images').update({ is_published: isPublished }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/gallery', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

export async function deleteGalleryImage(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/gallery', 'page');
  revalidatePath('/[lang]', 'page');
  return { success: true };
}

// ---------------------------------------------------------------------------
// GOOGLE REVIEWS SYNC
// Pulls real reviews from the clinic's Google Business Profile (via the
// Google Places API) into the testimonials table, so the public
// TestimonialsSection shows genuine patient reviews.
//
// IMPORTANT Google API limitation (not something this code can work around):
// the Places Details endpoint returns AT MOST 5 reviews per place, chosen
// and ranked by Google - there is no official way to pull every review a
// business has ever received. This is the same limit every embedded Google
// reviews widget on the web runs into.
// ---------------------------------------------------------------------------
export async function saveGooglePlaceId(placeId: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase
    .from('clinic_settings')
    .upsert({ key: 'google_reviews', value: { place_id: placeId } }, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  revalidatePath('/[lang]/admin/testimonials', 'page');
  return { success: true };
}

export async function getGooglePlaceId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.from('clinic_settings').select('value').eq('key', 'google_reviews').single();
  return (data?.value as any)?.place_id || null;
}

export async function syncGoogleReviews() {
  const supabase = await assertAdmin();
  const result = await runGoogleReviewsSync(supabase);
  revalidatePath('/[lang]/admin/testimonials', 'page');
  revalidatePath('/[lang]', 'page');
  return result;
}
