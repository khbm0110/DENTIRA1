'use client';

import { updateFaq } from '@/app/actions/admin';
import FaqForm from '@/components/admin/FaqForm';

export default function FaqEditClient({ lang, faq }: { lang: string; faq: any }) {
  return <FaqForm lang={lang} faq={faq} onSave={(data) => updateFaq(faq.id, data)} />;
}
