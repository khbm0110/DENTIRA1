import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import FaqEditClient from './FaqEditClient';

export default async function EditFaqPage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: faq } = await supabase.from('faqs').select('*').eq('id', params.id).single();

  if (!faq) notFound();

  return <FaqEditClient lang={params.lang} faq={faq} />;
}
