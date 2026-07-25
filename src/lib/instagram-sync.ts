import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Pulls the admin's own Instagram media into the gallery_images table.
 * Uses the Instagram Graph API (graph.instagram.com), which requires a
 * long-lived access token for a Professional (Business/Creator) Instagram
 * account - see the admin Gallery page for the one-time setup steps.
 *
 * New photos are imported as unpublished (drafts) so the admin can pick
 * which ones actually appear on the website - re-syncing never touches
 * is_published on photos already imported, so nothing gets silently
 * hidden/shown again.
 */
export async function runInstagramSync(supabase: SupabaseClient) {
  const { data: settingRow } = await supabase
    .from('clinic_settings')
    .select('value')
    .eq('key', 'instagram')
    .single();

  const accessToken = (settingRow?.value as any)?.access_token;
  if (!accessToken) {
    throw new Error('No Instagram access token configured yet. Add it in the Gallery admin page first.');
  }

  const url = new URL('https://graph.instagram.com/me/media');
  url.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp');
  url.searchParams.set('access_token', accessToken);
  url.searchParams.set('limit', '25');

  const res = await fetch(url.toString());
  const json = await res.json();

  if (json.error) {
    throw new Error(`Instagram API error: ${json.error.message || 'Unknown error'} (your access token may have expired - generate a new one).`);
  }

  const items = json.data || [];
  if (items.length === 0) {
    return { success: true, imported: 0, total: 0, message: 'Instagram returned 0 photos for this account.' };
  }

  let imported = 0;
  for (const item of items) {
    // VIDEO posts don't have a usable still image via media_url in all
    // cases - fall back to thumbnail_url, and skip anything with neither.
    const mediaUrl = item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url;
    if (!mediaUrl) continue;

    const { data: existing } = await supabase
      .from('gallery_images')
      .select('id')
      .eq('instagram_media_id', item.id)
      .maybeSingle();

    if (existing) {
      // Refresh caption/url in case it changed, but never touch is_published.
      const { error } = await supabase
        .from('gallery_images')
        .update({ caption: item.caption || null, media_url: mediaUrl, permalink: item.permalink || null })
        .eq('id', existing.id);
      if (!error) imported += 1;
    } else {
      const { error } = await supabase.from('gallery_images').insert({
        instagram_media_id: item.id,
        media_url: mediaUrl,
        permalink: item.permalink || null,
        caption: item.caption || null,
        media_type: item.media_type || 'IMAGE',
        source: 'instagram',
        is_published: false,
      });
      if (!error) imported += 1;
    }
  }

  return { success: true, imported, total: items.length };
}
