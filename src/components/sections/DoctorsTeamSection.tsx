'use client';

import { useParams } from 'next/navigation';
import dictionary from '@/lib/i18n/dictionary';

export default function DoctorsTeamSection() {
  const params = useParams();
  const lang = Array.isArray(params.lang) ? params.lang[0] : params.lang;
  const t = lang === 'ar' ? dictionary.ar : dictionary.fr;

  const doctors = [
    {
      name: "Dr. Laila El Amrani",
      title: "Chirurgien-dentiste en chef",
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
    },
    {
      name: "Dr. Karim Bennani",
      title: "Spécialiste en Orthodontie",
      img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80"
    },
    {
      name: "Dr. Yasmine Tazi",
      title: "Expert en Implantologie",
      img: "https://images.unsplash.com/photo-1594824436998-0522c83ff0c0?auto=format&fit=crop&q=80"
    },
    {
      name: "Dr. Omar Chraibi",
      title: "Pédodontiste",
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section id="team" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Notre Équipe Médicale
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Rencontrez nos spécialistes dévoués à vous offrir les meilleurs soins dentaires avec douceur et professionnalisme.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-surface rounded-3xl overflow-hidden group shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="aspect-[3/4] w-full overflow-hidden relative">
                <img
                  src={doctor.img}
                  alt={doctor.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-headline font-bold text-xl mb-1 text-on-surface">{doctor.name}</h3>
                <p className="text-primary text-sm font-semibold mb-4">
                  {doctor.title}
                </p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-on-surface hover:text-primary transition-colors shadow-sm">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <button className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg inline-flex items-center justify-center gap-2 shadow-[0_8px_25px_-5px_rgb(0,105,113,0.5)] hover:shadow-[0_12px_35px_-5px_rgb(0,105,113,0.6)] hover:-translate-y-1 transition-all duration-300">
            Voir tous les médecins
          </button>
        </div>
      </div>
    </section>
  );
}
