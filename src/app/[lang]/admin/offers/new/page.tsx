'use client';

import { useParams } from 'next/navigation';
import { addOffer } from '@/app/actions/admin';
import OfferForm from '@/components/admin/OfferForm';

export default function NewOfferPage() {
  const params = useParams();
  const lang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';

  return <OfferForm lang={lang} onSave={addOffer} />;
}
