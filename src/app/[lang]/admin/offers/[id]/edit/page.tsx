import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import OfferEditClient from './OfferEditClient';

export default async function EditOfferPage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: offer } = await supabase.from('offers').select('*').eq('id', params.id).single();

  if (!offer) notFound();

  return <OfferEditClient lang={params.lang} offer={offer} />;
}
