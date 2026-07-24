import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Pulls the latest Google Maps reviews for the configured Place ID into the
 * testimonials table. Accepts any already-authorized Supabase client - the
 * caller decides whether that's a session-based admin client (from the
 * dashboard's "Sync Now" button) or a service-role client (from the
 * scheduled cron route).
 *
 * IMPORTANT Google API limitation (not something this code can work around):
 * the Places Details endpoint returns AT MOST 5 reviews per place, chosen
 * and ranked by Google - there is no official way to pull every review a
 * business has ever received.
 */
export async function runGoogleReviewsSync(supabase: SupabaseClient) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY is not set on the server. Add it to your environment variables first.');
  }

  const { data: settingRow } = await supabase
    .from('clinic_settings')
    .select('value')
    .eq('key', 'google_reviews')
    .single();
  const placeId = (settingRow?.value as any)?.place_id;
  if (!placeId) {
    throw new Error('No Google Place ID configured yet. Save your Place ID in the Testimonials admin page first.');
  }

  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.set('reviews_sort', 'newest');
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.status !== 'OK') {
    throw new Error(`Google Places API error: ${json.status} ${json.error_message || ''}`.trim());
  }

  const reviews = json.result?.reviews || [];
  if (reviews.length === 0) {
    return { success: true, imported: 0, total: 0, message: 'Google returned 0 reviews for this Place ID.' };
  }

  let imported = 0;
  for (const review of reviews) {
    // Google's legacy API doesn't give a stable review ID, so build a
    // deterministic pseudo-ID from author + timestamp to avoid duplicates
    // on repeated syncs.
    const googleReviewId = `${review.author_name}-${review.time}`;

    const { data: existing } = await supabase
      .from('testimonials')
      .select('id')
      .eq('google_review_id', googleReviewId)
      .maybeSingle();

    if (existing) {
      // Already imported before - refresh the text/rating in case it
      // changed, but NEVER touch is_published so a scheduled sync can't
      // silently un-publish a review the admin already approved.
      const { error } = await supabase
        .from('testimonials')
        .update({
          review_fr: review.text || '',
          review_ar: review.text || '',
          rating: review.rating || 5,
          relative_time_description: review.relative_time_description || null,
        })
        .eq('id', existing.id);
      if (!error) imported += 1;
    } else {
      const { error } = await supabase.from('testimonials').insert({
        google_review_id: googleReviewId,
        source: 'google',
        name_fr: review.author_name,
        name_ar: review.author_name,
        review_fr: review.text || '',
        review_ar: review.text || '',
        rating: review.rating || 5,
        photo_url: review.profile_photo_url || null,
        author_url: review.author_url || null,
        relative_time_description: review.relative_time_description || null,
        // New Google reviews come in unpublished so the admin can review
        // and approve them before they go live on the site.
        is_published: false,
      });
      if (!error) imported += 1;
    }
  }

  return {
    success: true,
    imported,
    total: reviews.length,
    placeName: json.result?.name,
    overallRating: json.result?.rating,
    totalReviewCount: json.result?.user_ratings_total,
  };
}
