'use client';

import { updateOffer } from '@/app/actions/admin';
import OfferForm from '@/components/admin/OfferForm';

export default function OfferEditClient({ lang, offer }: { lang: string; offer: any }) {
  return (
    <OfferForm
      lang={lang}
      offer={offer}
      onSave={(data) => updateOffer(offer.id, data)}
    />
  );
}
