import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ServiceEditForm from './ServiceEditForm';

export default async function EditServicePage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: service } = await supabase.from('services').select('*').eq('id', params.id).single();

  if (!service) notFound();

  return <ServiceEditForm lang={params.lang} service={service} />;
}
