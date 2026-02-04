'use client';
import { useState } from 'react';

const photos = [
  { label: "Salle d'eau", src: "/images/salle-eau.jpg" },
  { label: "WC", src: "/images/wc.jpg" },
  { label: "Chambre", src: "/images/chambre1.jpg" },
  { label: "Chambre parentale", src: "/images/chambre2.jpg" },
  { label: "Chambre enfants", src: "/images/chambre3.jpg" },
  { label: "Séjour", src: "/images/sejour.jpg" },
  { label: "Cuisine équipée", src: "/images/cuisine.jpg" },
  { label: "Cuisine - Plaque gaz", src: "/images/cuisine-gaz.jpg" },
  { label: "Séjour avec escalier", src: "/images/sejour-escalier.jpg" }
];

const plans = [
  { label: "Plan du rez-de-chaussée", src: "/images/plan-rdc.png" },
  { label: "Plan du 1er étage", src: "/images/plan-etage.png" }
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlan, setIsPlan] = useState(false);
  const [formResult, setFormResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openLightbox = (index, plan = false) => {
    setCurrentPhoto(index);
    setIsPlan(plan);
    setLightboxOpen(true);
  };

  const currentImages = isPlan ? plans : photos;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/candidatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        setFormResult({ success: true, message: 'Candidature envoyée avec succès ! Vous recevrez une réponse rapidement.' });
        setTimeout(() => {
          setModalOpen(false);
          setFormResult(null);
          e.target.reset();
        }, 2500);
      } else {
        const error = await res.json();
        setFormResult({ success: false, message: error.error || 'Erreur lors de l\'envoi' });
      }
    } catch (error) {
      setFormResult({ success: false, message: 'Erreur de connexion' });
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-cream-50 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="relative h-[65vh] bg-primary-900">
        <img src="/images/sejour-escalier.jpg" className="w-full h-full object-cover" alt="Séjour avec escalier" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="inline-block bg-primary-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-3">Location vide</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Maison de ville T4 à Machecoul-Saint-Même</h1>
            <p className="text-cream-200 text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              44270 Machecoul-Saint-Même, Loire-Atlantique
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bar */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="font-bold text-xl text-primary-700">900 €/mois</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              <span>86,22 m²</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
              <span>3 chambres • 2 WC</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1"><span className="text-xs text-gray-500">DPE</span><span className="dpe-badge dpe-d">D</span></div>
              <div className="flex items-center gap-1"><span className="text-xs text-gray-500">GES</span><span className="ges-badge ges-b">B</span></div>
            </div>
          </div>
          <button onClick={() => setModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-md">
            Déposer ma candidature
          </button>
        </div>
      </div>

      {/* Photos */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Photos du bien</h2>
        <div className="photo-grid">
          {photos.map((photo, i) => (
            <div key={i} className="photo-item" onClick={() => openLightbox(i)}>
              <img src={photo.src} alt={photo.label} />
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Plans du bien</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-primary-800 mb-3 text-center">{i === 0 ? 'Rez-de-chaussée' : '1er étage'}</h3>
              <img src={plan.src} alt={plan.label} className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => openLightbox(i, true)} />
            </div>
          ))}
        </div>
      </div>

      {/* Description & Détails */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Description</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <p className="text-gray-700 leading-relaxed mb-4">Maison de ville T4 de 86,22 m² habitables sur 2 niveaux, située à proximité immédiate du centre-ville de Machecoul. Cette habitation offre un cadre de vie confortable avec un séjour lumineux, une cuisine équipée (four Bosch, plaque gaz), et 3 chambres spacieuses. Idéale pour une famille.</p>
              <p className="text-gray-700 leading-relaxed">Le bien dispose d'une salle d'eau moderne avec double vasque, 2 WC séparés, une buanderie de 11,50 m² et une véranda de 21 m². Terrain de 433 m².</p>
            </div>

            {/* Surfaces */}
            <div className="mt-8">
              <h3 className="font-serif text-2xl font-bold text-primary-900 mb-4">Surfaces habitables</h3>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-800 mb-3 text-lg">Rez-de-chaussée</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Séjour-salon</span><span className="font-medium text-primary-700">24,46 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Cuisine équipée</span><span className="font-medium text-primary-700">8,96 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Dégagement</span><span className="font-medium text-primary-700">0,97 m²</span></div>
                    <div className="flex justify-between py-2"><span className="text-gray-600">WC</span><span className="font-medium text-primary-700">1,36 m²</span></div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total RDC</span><span className="font-semibold text-primary-600">35,75 m²</span>
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-primary-800 mb-3 text-lg">1er étage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Palier</span><span className="font-medium text-primary-700">5,89 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Chambre 1</span><span className="font-medium text-primary-700">9,90 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Chambre 2</span><span className="font-medium text-primary-700">14,30 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Chambre 3</span><span className="font-medium text-primary-700">12,66 m²</span></div>
                    <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-gray-600">Salle d'eau</span><span className="font-medium text-primary-700">6,72 m²</span></div>
                    <div className="flex justify-between py-2"><span className="text-gray-600">WC 2</span><span className="font-medium text-primary-700">1 m²</span></div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between text-sm">
                    <span className="text-gray-500">Sous-total étage</span><span className="font-semibold text-primary-600">50,47 m²</span>
                  </div>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary-900 text-lg">Surface habitable totale (loi Boutin)</span>
                    <span className="font-bold text-primary-700 text-xl">86,22 m²</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Annexes */}
            <div className="mt-8">
              <h3 className="font-serif text-2xl font-bold text-gray-600 mb-4">Annexes (hors surface habitable)</h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Ces espaces ne sont pas comptabilisés dans la surface habitable car ils ne répondent pas aux critères de la loi Boutin.</p>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">Garage</span><span className="font-medium text-gray-600">23,50 m²</span></div>
                  <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-500">Buanderie</span><span className="font-medium text-gray-600">11,50 m²</span></div>
                  <div className="flex justify-between py-2"><span className="text-gray-500">Véranda</span><span className="font-medium text-gray-600">21 m²</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between">
                  <span className="font-semibold text-gray-600">Total annexes</span><span className="font-semibold text-gray-600">56 m²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Détails sidebar */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Détails</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4 sticky top-24">
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Type de location</span><span className="font-semibold">Location vide</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Type de bien</span><span className="font-semibold">Maison de ville T4</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Surface habitable</span><span className="font-semibold">86,22 m²</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Terrain</span><span className="font-semibold">433 m²</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Loyer mensuel HC</span><span className="font-semibold text-primary-700 text-lg">900 €</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Taxe ordures ménagères</span><span className="font-semibold">21 €/mois</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Charges (électricité)</span><span className="font-semibold">À la charge du locataire</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Dépôt de garantie</span><span className="font-semibold">900 €</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Honoraires</span><span className="font-semibold text-green-600">Aucun (particulier)</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Chambres</span><span className="font-semibold">3</span></div>
              <div className="flex justify-between py-3 border-b"><span className="text-gray-600">Salle d'eau</span><span className="font-semibold">1</span></div>
              <div className="flex justify-between py-3"><span className="text-gray-600">Disponibilité</span><span className="font-semibold text-primary-700">1er mars 2026</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Critères d'éligibilité */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Critères d'éligibilité</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-primary-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Conditions requises
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Revenus minimum</p>
                  <p className="text-sm text-gray-600">Revenus nets mensuels du foyer ≥ <strong className="text-primary-700">1 800 €</strong> (2× le loyer)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Situation professionnelle stable</p>
                  <p className="text-sm text-gray-600">CDI (hors période d'essai), Fonctionnaire, Retraité, ou Indépendant avec 2 ans d'ancienneté</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary-700 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Garant possible</p>
                  <p className="text-sm text-gray-600">Si revenus insuffisants : garant physique ou <a href="https://www.visale.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">garantie Visale</a> acceptée</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-amber-800 mb-4">Points importants</h3>
            <ul className="space-y-2 text-sm text-amber-900">
              <li className="flex items-start gap-2"><span>✓</span><span>Assurance habitation obligatoire à la remise des clés</span></li>
              <li className="flex items-start gap-2"><span>✓</span><span>Bail de 3 ans (location vide)</span></li>
              <li className="flex items-start gap-2"><span>✓</span><span>Animaux acceptés sous conditions</span></li>
              <li className="flex items-start gap-2"><span>✓</span><span>Entretien du jardin à la charge du locataire</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pièces justificatives */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Pièces à préparer si éligible</h2>
        <p className="text-gray-600 mb-6">Si vous remplissez les critères d'éligibilité, préparez les documents suivants pour constituer votre dossier :</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-primary-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Pour le(s) locataire(s)
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Pièce d'identité</strong> en cours de validité (CNI, passeport ou titre de séjour)</span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Justificatif de domicile</strong> : 3 dernières quittances de loyer ou attestation d'hébergement</span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Justificatif de situation professionnelle</strong> : contrat de travail ou attestation employeur</span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>3 derniers bulletins de salaire</strong></span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Dernier avis d'imposition</strong></span></li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg text-primary-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Pour le garant (si nécessaire)
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Pièce d'identité</strong> en cours de validité</span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Justificatif de domicile</strong> de moins de 3 mois</span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Justificatif de situation professionnelle</strong></span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>3 derniers bulletins de salaire</strong></span></li>
              <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Dernier avis d'imposition</strong></span></li>
            </ul>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800"><strong>Alternative :</strong> Garantie <a href="https://www.visale.fr" target="_blank" rel="noopener noreferrer" className="underline">Visale</a> (gratuit pour les moins de 30 ans)</p>
            </div>
          </div>
        </div>
      </div>

      {/* DPE Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-serif text-3xl font-bold text-primary-900 mb-6">Performance énergétique</h2>
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg text-primary-800 mb-4">Consommation énergétique</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="dpe-badge dpe-d text-2xl w-16 h-16">D</div>
                <div>
                  <p className="font-bold text-2xl text-gray-800">191 kWh/m²/an</p>
                  <p className="text-gray-500 text-sm">Énergie primaire</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-primary-800 mb-4">Émissions de gaz à effet de serre</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="ges-badge ges-b text-2xl w-16 h-16">B</div>
                <div>
                  <p className="font-bold text-2xl text-gray-800">7 kg CO₂/m²/an</p>
                  <p className="text-gray-500 text-sm">Soit 654 kg CO₂/an au total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-cream-100 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Coûts annuels d'électricité estimés</p>
                <p className="font-bold text-lg text-primary-800">1 530 € à 2 140 €</p>
              </div>
              <div className="bg-cream-100 rounded-lg p-4">
                <p className="text-gray-600 mb-1">N° DPE ADEME</p>
                <p className="font-bold text-primary-800">2644E0315595E</p>
              </div>
              <div className="bg-cream-100 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Chauffage</p>
                <p className="font-bold text-primary-800">Électrique</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-10 text-center text-white shadow-lg">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Intéressé par ce bien ?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">Déposez votre candidature en quelques minutes. Le propriétaire étudiera votre dossier avec attention.</p>
          <button onClick={() => setModalOpen(true)} className="bg-white text-primary-700 hover:bg-cream-100 px-10 py-4 rounded-lg font-bold text-lg transition-colors shadow-md">Déposer ma candidature</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-950 text-cream-200 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <p className="font-semibold text-lg mb-1">Location Particulier</p>
              <p className="text-cream-300 text-sm">Machecoul-Saint-Même, Loire-Atlantique</p>
            </div>
            <div className="flex gap-8">
              <a href="/admin" className="hover:text-white transition-colors">Administration</a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-primary-800 text-center text-cream-300 text-sm">
            <p className="mb-2">© 2025 - Tous droits réservés</p>
            <p className="text-xs">Les informations sur les risques sont disponibles sur <a href="https://www.georisques.gouv.fr" target="_blank" rel="noopener noreferrer" className="text-cream-100 hover:text-white underline">www.georisques.gouv.fr</a></p>
          </div>
        </div>
      </footer>

      {/* Modal Candidature */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-8 py-6 border-b flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold text-primary-900">Déposer ma candidature</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Nom et prénom <span className="text-red-500">*</span></label>
                  <input type="text" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Téléphone <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Situation professionnelle <span className="text-red-500">*</span></label>
                  <select name="situation" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none">
                    <option value="">-- Sélectionnez --</option>
                    <option>2 CDI</option>
                    <option>1 CDI + 1 CDD</option>
                    <option>1 CDI</option>
                    <option>2 CDD</option>
                    <option>1 CDD</option>
                    <option>Retraité(s)</option>
                    <option>Fonctionnaire(s)</option>
                    <option>Indépendant</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Revenus nets mensuels (foyer) <span className="text-red-500">*</span></label>
                  <input type="number" name="income" required placeholder="Ex: 2500" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                  <p className="text-sm text-gray-500 mt-1">Minimum recommandé: 1 800€ (2× le loyer)</p>
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Nombre de personnes <span className="text-red-500">*</span></label>
                  <input type="number" name="occupants" required min="1" placeholder="Ex: 3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="mb-5">
                  <label className="block text-gray-700 font-medium mb-2">Date d'entrée souhaitée <span className="text-red-500">*</span></label>
                  <input type="date" name="moveDate" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Message (optionnel)</label>
                  <textarea name="message" rows="4" placeholder="Présentez votre candidature..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"></textarea>
                </div>
                {formResult && (
                  <div className={`mb-4 px-4 py-3 rounded-lg ${formResult.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    {formResult.success ? '✓ ' : '✗ '}{formResult.message}
                  </div>
                )}
                <button type="submit" disabled={submitting} className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50">
                  {submitting ? 'Envoi en cours...' : 'Envoyer ma candidature'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100">&times;</button>
          <button onClick={() => setCurrentPhoto((currentPhoto - 1 + currentImages.length) % currentImages.length)} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100">‹</button>
          <img src={currentImages[currentPhoto].src} alt={currentImages[currentPhoto].label} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full">{currentImages[currentPhoto].label}</div>
          <button onClick={() => setCurrentPhoto((currentPhoto + 1) % currentImages.length)} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-gray-100">›</button>
        </div>
      )}
    </div>
  );
}
