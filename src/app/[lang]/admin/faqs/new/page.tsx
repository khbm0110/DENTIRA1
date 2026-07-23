'use client';

import { useParams } from 'next/navigation';
import { addFaq } from '@/app/actions/admin';
import FaqForm from '@/components/admin/FaqForm';

export default function NewFaqPage() {
  const params = useParams();
  const lang = (Array.isArray(params.lang) ? params.lang[0] : params.lang) || 'fr';

  return <FaqForm lang={lang} onSave={addFaq} />;
}
