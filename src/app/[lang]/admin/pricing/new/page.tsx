'use client';

import { useParams } from 'next/navigation';
import { addPricingPlan } from '@/app/actions/admin';
import PricingPlanForm from '@/components/admin/PricingPlanForm';

export default function NewPricingPlanPage() {
  const params = useParams();
  const lang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';

  return <PricingPlanForm lang={lang} onSave={addPricingPlan} />;
}
