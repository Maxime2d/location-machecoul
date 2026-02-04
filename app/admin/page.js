'use client';
import { useState, useEffect } from 'react';

const LOYER = 900;
const SEUIL_REVENUS = 1800;

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidatures, setCandidatures] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loginError, setLoginError] = useState('');
  const [detailModal, setDetailModal] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth');
      if (res.ok) {
        setAuthenticated(true);
        loadCandidatures();
      }
    } catch (error) {
      console.error('Erreur auth:', error);
    }
    setLoading(false);
  };

  const loadCandidatures = async () => {
    try {
      const res = await fetch('/api/candidatures');
      if (res.ok) {
        const data = await res.json();
        setCandidatures(data);
      }
    } catch (error) {
      console.error('Erreur chargement:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        setAuthenticated(true);
        loadCandidatures();
      } else {
        setLoginError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setLoginError('Erreur de connexion');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setAuthenticated(false);
    setCandidatures([]);
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/candidatures', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        loadCandidatures();
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error);
    }
  };

  const deleteCandidature = async (id) => {
    if (!confirm('Supprimer cette candidature ?')) return;
    try {
      const res = await fetch(`/api/candidatures?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadCandidatures();
        setDetailModal(null);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const getRefusalEmail = (c) => {
    const subject = encodeURIComponent('Location Maison T4 Machecoul - Réponse à votre candidature');
    const body = encodeURIComponent(`Bonjour ${c.name.split(' ')[0]},

Nous avons bien reçu votre candidature pour la location de la maison T4 située à Machecoul-Saint-Même et nous vous remercions de l'intérêt que vous avez porté à ce bien.

Après examen attentif de l'ensemble des dossiers reçus, nous avons le regret de vous informer que votre candidature n'a pas été retenue.

Nous vous souhaitons bonne chance dans vos recherches de logement.

Cordialement,
Le propriétaire`);
    return `mailto:${c.email}?subject=${subject}&body=${body}`;
  };

  const getAcceptanceEmail = (c) => {
    const subject = encodeURIComponent('Location Maison T4 Machecoul - Candidature retenue !');
    const body = encodeURIComponent(`Bonjour ${c.name.split(' ')[0]},

Nous avons le plaisir de vous informer que votre candidature pour la location de la maison T4 située à Machecoul-Saint-Même a été retenue !

Nous vous proposons de nous rencontrer afin de :
- Effectuer une visite du bien (si ce n'est pas déjà fait)
- Constituer le dossier définitif
- Signer le bail

Merci de nous recontacter rapidement pour convenir d'un rendez-vous.

Pour rappel :
- Loyer : 900 €/mois HC
- Taxe ordures ménagères : 21 €/mois
- Dépôt de garantie : 900 €
- Disponibilité : 1er mars 2026

Cordialement,
Le propriétaire`);
    return `mailto:${c.email}?subject=${subject}&body=${body}`;
  };

  const acceptWithEmail = (c) => {
    window.open(getAcceptanceEmail(c), '_blank');
    updateStatus(c.id, 'accepted');
  };

  const rejectWithEmail = (c) => {
    window.open(getRefusalEmail(c), '_blank');
    updateStatus(c.id, 'rejected');
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const getStatusLabel = (s) => ({ new: 'Nouvelle', reviewing: 'En cours', accepted: 'Acceptée', rejected: 'Refusée' }[s] || s);

  const filteredCandidatures = filter === 'all' ? candidatures : candidatures.filter(c => c.status === filter);
  const stats = {
    total: candidatures.length,
    new: candidatures.filter(c => c.status === 'new').length,
    accepted: candidatures.filter(c => c.status === 'accepted').length,
    rejected: candidatures.filter(c => c.status === 'rejected').length
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Chargement...</p></div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-950">
        <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h1 className="font-serif text-2xl font-bold text-primary-900">Administration</h1>
            <p className="text-gray-500 mt-1">Maison T4 Machecoul-Saint-Même</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="votre@email.fr" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Mot de passe</label>
              <input type="password" name="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" placeholder="••••••••" />
            </div>
            {loginError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{loginError}</div>}
            <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors">Se connecter</button>
          </form>
          <p className="text-center text-gray-400 text-xs mt-6">Accès réservé au propriétaire</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 font-sans text-gray-800 min-h-screen">
      <header className="bg-primary-900 text-white py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl font-bold">Administration</h1>
            <p className="text-primary-200 text-sm">Gestion des candidatures - Maison T4 Machecoul</p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="bg-primary-700 hover:bg-primary-600 px-4 py-2 rounded-lg text-sm transition-colors">← Retour</a>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              </div>
              <div><p className="text-2xl font-bold text-gray-800">{stats.total}</p><p className="text-gray-500 text-sm">Total</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-2xl font-bold text-yellow-600">{stats.new}</p><p className="text-gray-500 text-sm">Nouvelles</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-2xl font-bold text-green-600">{stats.accepted}</p><p className="text-gray-500 text-sm">Acceptées</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div><p className="text-2xl font-bold text-red-600">{stats.rejected}</p><p className="text-gray-500 text-sm">Refusées</p></div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-gray-600 font-medium">Filtrer :</span>
            {['all', 'new', 'reviewing', 'accepted', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`filter-btn px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'active' : ''}`}>
                {f === 'all' ? 'Toutes' : getStatusLabel(f)}
              </button>
            ))}
          </div>
        </div>

        {/* Liste */}
        <div className="space-y-4">
          {filteredCandidatures.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-500">
              <p className="text-lg font-medium mb-2">Aucune candidature</p>
            </div>
          ) : (
            filteredCandidatures.sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => (
              <div key={c.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <span className={`status-badge status-${c.status}`}>{getStatusLabel(c.status)}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><p className="text-gray-500">Email</p><p className="font-medium"><a href={`mailto:${c.email}`} className="text-primary-600">{c.email}</a></p></div>
                      <div><p className="text-gray-500">Téléphone</p><p className="font-medium"><a href={`tel:${c.phone}`} className="text-primary-600">{c.phone}</a></p></div>
                      <div><p className="text-gray-500">Revenus</p><p className={`font-medium ${parseInt(c.income) >= SEUIL_REVENUS ? 'text-green-600' : 'text-orange-600'}`}>{parseInt(c.income).toLocaleString('fr-FR')} €</p></div>
                      <div><p className="text-gray-500">Date</p><p className="font-medium">{formatDate(c.date)}</p></div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setDetailModal(c)} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg" title="Voir détails">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    </button>
                    {c.status !== 'accepted' && (
                      <button onClick={() => acceptWithEmail(c)} className="bg-green-100 hover:bg-green-200 p-2 rounded-lg" title="Accepter + envoyer email">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      </button>
                    )}
                    {c.status !== 'rejected' && (
                      <button onClick={() => rejectWithEmail(c)} className="bg-red-100 hover:bg-red-200 p-2 rounded-lg" title="Refuser + envoyer email">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    )}
                    <button onClick={() => deleteCandidature(c.id)} className="bg-gray-100 hover:bg-red-100 p-2 rounded-lg" title="Supprimer">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal détail */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-8 py-6 border-b flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold text-primary-900">Détail candidature</h3>
              <button onClick={() => setDetailModal(null)} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold">{detailModal.name}</h4>
                  <p className="text-gray-500">Reçue le {formatDate(detailModal.date)}</p>
                </div>
                <span className={`status-badge status-${detailModal.status} text-base px-4 py-2`}>{getStatusLabel(detailModal.status)}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Email</p><p className="font-medium"><a href={`mailto:${detailModal.email}`} className="text-primary-600">{detailModal.email}</a></p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Téléphone</p><p className="font-medium"><a href={`tel:${detailModal.phone}`} className="text-primary-600">{detailModal.phone}</a></p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Situation</p><p className="font-medium">{detailModal.situation}</p></div>
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Personnes</p><p className="font-medium">{detailModal.occupants}</p></div>
              </div>

              <div className={`bg-${parseInt(detailModal.income) >= SEUIL_REVENUS ? 'green' : 'orange'}-50 rounded-lg p-4`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Revenus nets mensuels</p>
                    <p className={`font-bold text-2xl ${parseInt(detailModal.income) >= SEUIL_REVENUS ? 'text-green-600' : 'text-orange-600'}`}>{parseInt(detailModal.income).toLocaleString('fr-FR')} €</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Ratio revenus/loyer</p>
                    <p className={`font-bold text-xl ${(parseInt(detailModal.income) / LOYER) >= 2 ? 'text-green-600' : 'text-orange-600'}`}>{(parseInt(detailModal.income) / LOYER).toFixed(1)}x</p>
                    <p className="text-xs text-gray-500">(recommandé: 2x)</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-sm">Date d'entrée souhaitée</p>
                <p className="font-medium">{detailModal.moveDate ? new Date(detailModal.moveDate).toLocaleDateString('fr-FR') : 'Non précisée'}</p>
              </div>

              {detailModal.message && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Message</p>
                  <p className="whitespace-pre-wrap">{detailModal.message}</p>
                </div>
              )}

              {/* Documents du locataire */}
              {detailModal.documents && Object.keys(detailModal.documents).length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Documents fournis ({Object.keys(detailModal.documents).length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(detailModal.documents).map(([key, doc]) => (
                      <a
                        key={key}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        <span className="truncate text-gray-700">{doc.name || key}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Indicateur garant */}
              {detailModal.hasGarant && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-purple-800 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    Garant physique déclaré
                  </p>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">Actions avec envoi d'email automatique :</p>
                <div className="flex gap-3">
                  {detailModal.status !== 'accepted' && (
                    <button onClick={() => { acceptWithEmail(detailModal); setDetailModal(null); }} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      Accepter + Email
                    </button>
                  )}
                  {detailModal.status !== 'rejected' && (
                    <button onClick={() => { rejectWithEmail(detailModal); setDetailModal(null); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                      Refuser + Email
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

