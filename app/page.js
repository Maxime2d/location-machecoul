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

// Liste des situations professionnelles
const situationsProfessionnelles = [
  { value: 'cdi', label: 'CDI' },
  { value: 'cdd', label: 'CDD' },
  { value: 'fonctionnaire', label: 'Fonctionnaire' },
  { value: 'retraite', label: 'Retraité(e)' },
  { value: 'independant', label: 'Indépendant' },
  { value: 'etudiant', label: 'Étudiant' },
  { value: 'autre', label: 'Autre' },
  { value: 'neant', label: 'Néant (pas de 2ème locataire)' },
];

// Documents requis selon la situation professionnelle
const getDocumentsForSituation = (situation, locataireNum) => {
  const prefix = `loc${locataireNum}_`;
  const suffix = locataireNum === 1 ? '' : ' (Locataire 2)';

  // Documents de base pour tous (sauf Néant)
  if (situation === 'neant') return [];

  const baseDocuments = [
    { id: `${prefix}identite`, label: `Pièce d'identité${suffix}`, required: true },
    { id: `${prefix}domicile`, label: `Justificatif de domicile${suffix}`, required: true },
  ];

  // Documents selon la situation
  switch (situation) {
    case 'cdi':
    case 'cdd':
      return [
        ...baseDocuments,
        { id: `${prefix}travail`, label: `Contrat de travail ou attestation employeur${suffix}`, required: true },
        { id: `${prefix}salaire1`, label: `Bulletin de salaire mois 1${suffix}`, required: true },
        { id: `${prefix}salaire2`, label: `Bulletin de salaire mois 2${suffix}`, required: true },
        { id: `${prefix}salaire3`, label: `Bulletin de salaire mois 3${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition${suffix}`, required: true },
      ];
    case 'fonctionnaire':
      return [
        ...baseDocuments,
        { id: `${prefix}travail`, label: `Arrêté de nomination ou attestation employeur${suffix}`, required: true },
        { id: `${prefix}salaire1`, label: `Bulletin de salaire mois 1${suffix}`, required: true },
        { id: `${prefix}salaire2`, label: `Bulletin de salaire mois 2${suffix}`, required: true },
        { id: `${prefix}salaire3`, label: `Bulletin de salaire mois 3${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition${suffix}`, required: true },
      ];
    case 'retraite':
      return [
        ...baseDocuments,
        { id: `${prefix}retraite`, label: `Attestation de retraite${suffix}`, required: true },
        { id: `${prefix}pension`, label: `Dernier relevé de pension${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition${suffix}`, required: true },
      ];
    case 'independant':
      return [
        ...baseDocuments,
        { id: `${prefix}kbis`, label: `Extrait Kbis ou inscription INSEE${suffix}`, required: true },
        { id: `${prefix}bilan1`, label: `Bilan comptable année N-1${suffix}`, required: true },
        { id: `${prefix}bilan2`, label: `Bilan comptable année N-2${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition${suffix}`, required: true },
      ];
    case 'etudiant':
      return [
        ...baseDocuments,
        { id: `${prefix}scolarite`, label: `Certificat de scolarité${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition (ou parents)${suffix}`, required: true },
      ];
    case 'autre':
    default:
      return [
        ...baseDocuments,
        { id: `${prefix}justificatif`, label: `Justificatif de revenus${suffix}`, required: true },
        { id: `${prefix}impots`, label: `Dernier avis d'imposition${suffix}`, required: true },
      ];
  }
};

// Liste des documents requis (conservé pour compatibilité mais plus utilisé directement)
const documentsLocataire = [
  { id: 'identite', label: "Pièce d'identité", required: true },
  { id: 'domicile', label: "Justificatif de domicile", required: true },
  { id: 'travail', label: "Contrat de travail ou attestation employeur", required: true },
  { id: 'salaire1', label: "Bulletin de salaire (mois 1)", required: true },
  { id: 'salaire2', label: "Bulletin de salaire (mois 2)", required: true },
  { id: 'salaire3', label: "Bulletin de salaire (mois 3)", required: true },
  { id: 'impots', label: "Dernier avis d'imposition", required: true },
];

const documentsGarant = [
  { id: 'garant_identite', label: "Pièce d'identité du garant", required: false },
  { id: 'garant_domicile', label: "Justificatif de domicile du garant", required: false },
  { id: 'garant_travail', label: "Justificatif professionnel du garant", required: false },
  { id: 'garant_salaire1', label: "Bulletin de salaire garant (mois 1)", required: false },
  { id: 'garant_salaire2', label: "Bulletin de salaire garant (mois 2)", required: false },
  { id: 'garant_salaire3', label: "Bulletin de salaire garant (mois 3)", required: false },
  { id: 'garant_impots', label: "Avis d'imposition du garant", required: false },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isPlan, setIsPlan] = useState(false);
  const [formResult, setFormResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 = infos, 2 = documents locataire, 3 = documents garant
  const [hasGarant, setHasGarant] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({});
  const [situation1, setSituation1] = useState('');
  const [situation2, setSituation2] = useState('neant');

  // Calculer les documents requis dynamiquement
  const documentsLocataire1 = getDocumentsForSituation(situation1, 1);
  const documentsLocataire2 = getDocumentsForSituation(situation2, 2);
  const allDocumentsLocataires = [...documentsLocataire1, ...documentsLocataire2];

  const openLightbox = (index, plan = false) => {
    setCurrentPhoto(index);
    setIsPlan(plan);
    setLightboxOpen(true);
  };

  const currentImages = isPlan ? plans : photos;

  const handleFileChange = async (e, docId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format non autorisé. Utilisez PDF, JPG ou PNG.');
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Fichier trop volumineux. Maximum 5 Mo.');
      return;
    }

    setUploadProgress(prev => ({ ...prev, [docId]: 'uploading' }));

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('candidatureId', 'temp_' + Date.now());
      formDataUpload.append('fileType', docId);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (res.ok) {
        const data = await res.json();
        setUploadedFiles(prev => ({ ...prev, [docId]: { url: data.url, name: file.name } }));
        setUploadProgress(prev => ({ ...prev, [docId]: 'done' }));
      } else {
        const error = await res.json();
        alert(error.error || 'Erreur lors de l\'upload');
        setUploadProgress(prev => ({ ...prev, [docId]: 'error' }));
      }
    } catch (error) {
      alert('Erreur de connexion');
      setUploadProgress(prev => ({ ...prev, [docId]: 'error' }));
    }
  };

  const removeFile = (docId) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();

    // Vérifier que situation1 est sélectionné
    if (!situation1) {
      alert('Veuillez sélectionner la situation professionnelle du Locataire 1.');
      return;
    }

    const data = new FormData(e.target);
    const formEntries = Object.fromEntries(data.entries());
    // Ajouter les situations au formData
    formEntries.situation1 = situation1;
    formEntries.situation2 = situation2;
    setFormData(formEntries);
    setFormStep(2);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    // Vérifier que tous les documents requis sont uploadés pour les deux locataires
    const missingDocs = allDocumentsLocataires.filter(doc => doc.required && !uploadedFiles[doc.id]);
    if (missingDocs.length > 0) {
      alert('Veuillez fournir tous les documents obligatoires des locataires.');
      return;
    }
    if (hasGarant) {
      setFormStep(3);
    } else {
      submitCandidature();
    }
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    submitCandidature();
  };

  const submitCandidature = async () => {
    setSubmitting(true);

    const candidatureData = {
      ...formData,
      hasGarant,
      documents: uploadedFiles,
      submittedAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/candidatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidatureData)
      });

      if (res.ok) {
        setFormResult({ success: true, message: 'Candidature envoyée avec succès ! Vous recevrez une réponse rapidement.' });
        setTimeout(() => {
          setModalOpen(false);
          setFormResult(null);
          setFormStep(1);
          setUploadedFiles({});
          setUploadProgress({});
          setFormData({});
          setHasGarant(false);
          setSituation1('');
          setSituation2('neant');
        }, 3000);
      } else {
        const error = await res.json();
        setFormResult({ success: false, message: error.error || 'Erreur lors de l\'envoi' });
      }
    } catch (error) {
      setFormResult({ success: false, message: 'Erreur de connexion' });
    }
    setSubmitting(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormStep(1);
    setFormResult(null);
    setSituation1('');
    setSituation2('neant');
  };

  const FileUploadItem = ({ doc }) => (
    <div className="border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">
            {doc.label} {doc.required && <span className="text-red-500">*</span>}
          </label>
          {uploadedFiles[doc.id] ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm truncate max-w-[200px]">{uploadedFiles[doc.id].name}</span>
              <button type="button" onClick={() => removeFile(doc.id)} className="ml-2 text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, doc.id)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadProgress[doc.id] === 'uploading'}
              />
              <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${uploadProgress[doc.id] === 'uploading' ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}>
                {uploadProgress[doc.id] === 'uploading' ? (
                  <div className="flex items-center justify-center gap-2 text-primary-600">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Upload en cours...</span>
                  </div>
                ) : (
                  <div className="text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm">Cliquez ou glissez un fichier (PDF, JPG, PNG - max 5Mo)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
              <h3 className="font-semibold text-primary-800 mb-3 text-center">{i === 0 ? '1er étage' : 'Rez-de-chaussée'}</h3>
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
              <p className="text-gray-700 leading-relaxed">Le bien dispose d'une salle d'eau moderne avec double vasque, 2 WC séparés, une buanderie de 11,50 m² et une véranda de 21 m². Terrain de 433 m² (Pièces Garage, buanderie et véranda non isolés et non chauffées.</p>
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
        <p className="text-gray-600 mb-6">Si vous remplissez les critères d'éligibilité, préparez les documents suivants selon votre situation professionnelle :</p>

        {/* Documents de base pour tous */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-lg text-primary-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Documents communs à tous les locataires
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Pièce d'identité</strong> en cours de validité (CNI, passeport ou titre de séjour)</span></li>
            <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Justificatif de domicile</strong> : 3 dernières quittances de loyer ou attestation d'hébergement</span></li>
            <li className="flex items-start gap-2"><span className="text-primary-600 font-bold">•</span><span><strong>Dernier avis d'imposition</strong></span></li>
          </ul>
        </div>

        {/* Documents selon situation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* CDI / CDD */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">CDI / CDD</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-green-600">✓</span>Contrat de travail ou attestation employeur</li>
              <li className="flex items-start gap-2"><span className="text-green-600">✓</span>3 derniers bulletins de salaire</li>
            </ul>
          </div>

          {/* Fonctionnaire */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">Fonctionnaire</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>Arrêté de nomination ou attestation employeur</li>
              <li className="flex items-start gap-2"><span className="text-blue-600">✓</span>3 derniers bulletins de salaire</li>
            </ul>
          </div>

          {/* Retraité */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">Retraité(e)</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-purple-600">✓</span>Attestation de retraite</li>
              <li className="flex items-start gap-2"><span className="text-purple-600">✓</span>Dernier relevé de pension</li>
            </ul>
          </div>

          {/* Indépendant */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">Indépendant</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-orange-600">✓</span>Extrait Kbis ou inscription INSEE</li>
              <li className="flex items-start gap-2"><span className="text-orange-600">✓</span>Bilans comptables N-1 et N-2</li>
            </ul>
          </div>

          {/* Étudiant */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-cyan-500">
            <h4 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
              <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded">Étudiant</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-cyan-600">✓</span>Certificat de scolarité</li>
              <li className="flex items-start gap-2"><span className="text-cyan-600">✓</span>Avis d'imposition (ou des parents)</li>
            </ul>
          </div>

          {/* Autre */}
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-gray-400">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Autre situation</span>
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-gray-500">✓</span>Justificatif de revenus</li>
              <li className="flex items-start gap-2"><span className="text-gray-500">✓</span>Tout document attestant de votre situation</li>
            </ul>
          </div>
        </div>

        {/* Garant */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-semibold text-lg text-amber-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Pour le garant (si nécessaire)
          </h3>
          <p className="text-sm text-amber-700 mb-3">Mêmes documents que le locataire selon sa situation professionnelle.</p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800"><strong>💡 Alternative :</strong> Garantie <a href="https://www.visale.fr" target="_blank" rel="noopener noreferrer" className="underline font-medium">Visale</a> (gratuit pour les moins de 30 ans ou salariés de moins de 12 mois d'ancienneté)</p>
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

      {/* Modal Candidature Multi-étapes */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-8 py-6 border-b flex justify-between items-center z-10">
              <div>
                <h3 className="font-serif text-2xl font-bold text-primary-900">Déposer ma candidature</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-8 h-1 rounded ${formStep >= 1 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-8 h-1 rounded ${formStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-8 h-1 rounded ${formStep >= 3 ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm text-gray-500 ml-2">Étape {formStep}/{hasGarant ? 3 : 2}</span>
                </div>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
            </div>
            <div className="p-8">
              {formResult ? (
                <div className={`text-center py-8 ${formResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${formResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {formResult.success ? (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <p className="text-lg font-medium">{formResult.message}</p>
                </div>
              ) : (
                <>
                  {/* Étape 1: Informations personnelles */}
                  {formStep === 1 && (
                    <form onSubmit={handleStep1Submit}>
                      <h4 className="font-semibold text-lg text-primary-800 mb-4">Vos informations</h4>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Nom et prénom <span className="text-red-500">*</span></label>
                        <input type="text" name="name" required defaultValue={formData.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Email <span className="text-red-500">*</span></label>
                        <input type="email" name="email" required defaultValue={formData.email} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Téléphone <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" required defaultValue={formData.phone} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 text-sm mb-3 font-medium">💡 Les documents demandés seront adaptés à chaque situation professionnelle.</p>

                        <label className="block text-gray-700 font-medium mb-2">Situation professionnelle - Locataire 1 <span className="text-red-500">*</span></label>
                        <select
                          name="situation1"
                          required
                          value={situation1}
                          onChange={(e) => setSituation1(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none mb-4"
                        >
                          <option value="">-- Sélectionnez --</option>
                          {situationsProfessionnelles.filter(s => s.value !== 'neant').map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>

                        <label className="block text-gray-700 font-medium mb-2">Situation professionnelle - Locataire 2</label>
                        <select
                          name="situation2"
                          value={situation2}
                          onChange={(e) => setSituation2(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                          {situationsProfessionnelles.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        <p className="text-gray-500 text-xs mt-1">Sélectionnez "Néant" si vous êtes seul(e)</p>
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Revenus nets mensuels (foyer) <span className="text-red-500">*</span></label>
                        <input type="number" name="income" required defaultValue={formData.income} placeholder="Ex: 2500" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                        <p className="text-sm text-gray-500 mt-1">Minimum recommandé: 1 800€ (2× le loyer)</p>
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Nombre de personnes <span className="text-red-500">*</span></label>
                        <input type="number" name="occupants" required min="1" defaultValue={formData.occupants} placeholder="Ex: 3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Date d'entrée souhaitée <span className="text-red-500">*</span></label>
                        <input type="date" name="moveDate" required defaultValue={formData.moveDate} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                      </div>
                      <div className="mb-5">
                        <label className="block text-gray-700 font-medium mb-2">Message (optionnel)</label>
                        <textarea name="message" rows="3" defaultValue={formData.message} placeholder="Présentez votre candidature..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"></textarea>
                      </div>
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={hasGarant} onChange={(e) => setHasGarant(e.target.checked)} className="w-5 h-5 text-primary-600 rounded" />
                          <span className="text-gray-700">J'ai un garant physique (non obligatoire)</span>
                        </label>
                      </div>
                      <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold text-lg transition-colors">
                        Continuer vers les documents
                      </button>
                    </form>
                  )}

                  {/* Étape 2: Documents des locataires */}
                  {formStep === 2 && (
                    <form onSubmit={handleStep2Submit}>
                      <p className="text-gray-500 text-sm mb-6">Formats acceptés: PDF, JPG, PNG (max 5 Mo par fichier)</p>

                      {/* Documents Locataire 1 */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-lg text-primary-800 mb-3 pb-2 border-b border-primary-200">
                          📄 Locataire 1 - {situationsProfessionnelles.find(s => s.value === situation1)?.label || 'Non défini'}
                        </h4>
                        {documentsLocataire1.length > 0 ? (
                          documentsLocataire1.map(doc => (
                            <FileUploadItem key={doc.id} doc={doc} />
                          ))
                        ) : (
                          <p className="text-gray-500 italic">Veuillez sélectionner une situation professionnelle</p>
                        )}
                      </div>

                      {/* Documents Locataire 2 (si applicable) */}
                      {situation2 !== 'neant' && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-lg text-primary-800 mb-3 pb-2 border-b border-primary-200">
                            📄 Locataire 2 - {situationsProfessionnelles.find(s => s.value === situation2)?.label || 'Non défini'}
                          </h4>
                          {documentsLocataire2.map(doc => (
                            <FileUploadItem key={doc.id} doc={doc} />
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => setFormStep(1)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-lg font-bold transition-colors">
                          Retour
                        </button>
                        <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold transition-colors">
                          {hasGarant ? 'Continuer' : 'Envoyer la candidature'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Étape 3: Documents du garant */}
                  {formStep === 3 && (
                    <form onSubmit={handleStep3Submit}>
                      <h4 className="font-semibold text-lg text-primary-800 mb-2">Documents du garant</h4>
                      <p className="text-gray-500 text-sm mb-6">Ces documents sont facultatifs mais recommandés pour renforcer votre dossier.</p>

                      {documentsGarant.map(doc => (
                        <FileUploadItem key={doc.id} doc={doc} />
                      ))}

                      <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => setFormStep(2)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 rounded-lg font-bold transition-colors">
                          Retour
                        </button>
                        <button type="submit" disabled={submitting} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-lg font-bold transition-colors disabled:opacity-50">
                          {submitting ? 'Envoi en cours...' : 'Envoyer la candidature'}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
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
