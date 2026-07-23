'use client';

import { updatePricingPlan } from '@/app/actions/admin';
import PricingPlanForm from '@/components/admin/PricingPlanForm';

export default function PricingPlanEditClient({ lang, plan }: { lang: string; plan: any }) {
  return (
    <PricingPlanForm
      lang={lang}
      plan={plan}
      onSave={(data) => updatePricingPlan(plan.id, data)}
    />
  );
}
