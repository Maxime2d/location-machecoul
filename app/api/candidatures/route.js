import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { list, del } from '@vercel/blob';

const CANDIDATURES_KEY = 'candidatures';

// Chemins de stockage des pièces d'un dossier (stockage privé uniquement)
function documentPathnames(candidature) {
  const pathnames = [];
  for (const doc of Object.values(candidature.documents || {})) {
    let pathname = null;
    try {
      const url = new URL(String(doc && doc.url), 'http://local');
      if (url.pathname === '/api/document') pathname = url.searchParams.get('pathname');
    } catch (error) {
      pathname = null;
    }
    if (!pathname || !pathname.startsWith('candidatures/') || pathname.includes('..')) {
      throw new Error('Pièce au format inattendu, suppression annulée');
    }
    pathnames.push(pathname);
  }
  return pathnames;
}

// Supprime du stockage toutes les pièces d'un dossier, puis vérifie qu'il n'en reste aucune.
// En cas d'échec, une erreur est levée et le dossier n'est pas modifié.
async function deleteDocuments(candidature) {
  const pathnames = documentPathnames(candidature);
  if (pathnames.length === 0) return 0;

  const token = process.env.DOCS_READ_WRITE_TOKEN;
  if (!token) throw new Error('DOCS_READ_WRITE_TOKEN non configuré');

  const find = async (pathname) => {
    const { blobs } = await list({ prefix: pathname, token });
    return blobs.filter(blob => blob.pathname === pathname);
  };

  const found = (await Promise.all(pathnames.map(find))).flat();
  if (found.length > 0) {
    await del(found.map(blob => blob.url), { token });
  }

  const remaining = (await Promise.all(pathnames.map(find))).flat();
  if (remaining.length > 0) {
    throw new Error(remaining.length + ' pièce(s) encore présente(s) après suppression');
  }
  return found.length;
}

// Vérifier l'authentification admin
async function isAuthenticated() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

// GET - Récupérer les candidatures (admin uniquement)
export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const candidatures = await kv.get(CANDIDATURES_KEY) || [];
    return NextResponse.json(candidatures);
  } catch (error) {
    console.error('Erreur récupération candidatures:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Soumettre une nouvelle candidature (public)
export async function POST(request) {
  try {
    const data = await request.json();

    // Validation des champs obligatoires
    const requiredFields = ['name', 'email', 'phone', 'situation1', 'income', 'occupants', 'moveDate'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Créer la candidature
    const candidature = {
      id: Date.now(),
      date: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      situation1: data.situation1,
      situation2: data.situation2 || 'neant',
      income: data.income,
      occupants: data.occupants,
      moveDate: data.moveDate,
      message: data.message || '',
      hasGarant: data.hasGarant || false,
      documents: data.documents || {},
      status: 'new'
    };

    // Récupérer les candidatures existantes et ajouter la nouvelle
    const candidatures = await kv.get(CANDIDATURES_KEY) || [];
    candidatures.push(candidature);
    await kv.set(CANDIDATURES_KEY, candidatures);

    return NextResponse.json({ success: true, id: candidature.id });
  } catch (error) {
    console.error('Erreur soumission candidature:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PATCH - Mettre à jour le statut d'une candidature (admin uniquement)
export async function PATCH(request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 });
    }

    const validStatuses = ['new', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    const candidatures = await kv.get(CANDIDATURES_KEY) || [];
    const index = candidatures.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 });
    }

    candidatures[index].status = status;
    await kv.set(CANDIDATURES_KEY, candidatures);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour candidature:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une candidature et ses pièces (admin uniquement)
// Avec documentsOnly=1 : supprime seulement les pièces et conserve le dossier
export async function DELETE(request) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));

    if (!id) {
      return NextResponse.json({ error: 'ID requis' }, { status: 400 });
    }

    const documentsOnly = searchParams.get('documentsOnly') === '1';

    const candidatures = await kv.get(CANDIDATURES_KEY) || [];
    const target = candidatures.find(c => c.id === id);

    if (!target) {
      return NextResponse.json({ error: 'Candidature non trouvée' }, { status: 404 });
    }

    // Les pièces sont supprimées du stockage avant toute mise à jour du dossier
    const deletedFiles = await deleteDocuments(target);

    if (documentsOnly) {
      target.documents = {};
      await kv.set(CANDIDATURES_KEY, candidatures);
      return NextResponse.json({ success: true, deletedFiles });
    }

    const filtered = candidatures.filter(c => c.id !== id);
    await kv.set(CANDIDATURES_KEY, filtered);

    return NextResponse.json({ success: true, deletedFiles });
  } catch (error) {
    console.error('Erreur suppression candidature:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
