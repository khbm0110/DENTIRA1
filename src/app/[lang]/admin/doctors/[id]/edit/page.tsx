import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import DoctorEditForm from './DoctorEditForm';

export default async function EditDoctorPage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: doctor } = await supabase.from('doctors').select('*').eq('id', params.id).single();

  if (!doctor) notFound();

  return <DoctorEditForm lang={params.lang} doctor={doctor} />;
}
