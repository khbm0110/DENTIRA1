import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PricingPlanEditClient from './PricingPlanEditClient';

export default async function EditPricingPlanPage({ params }: { params: { lang: string; id: string } }) {
  const supabase = createClient();
  const { data: plan } = await supabase.from('pricing_plans').select('*').eq('id', params.id).single();

  if (!plan) notFound();

  return <PricingPlanEditClient lang={params.lang} plan={plan} />;
}
