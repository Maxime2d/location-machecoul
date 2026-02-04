import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const CANDIDATURES_KEY = 'candidatures';

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
    const requiredFields = ['name', 'email', 'phone', 'situation', 'income', 'occupants', 'moveDate'];
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
      situation: data.situation,
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

// DELETE - Supprimer une candidature (admin uniquement)
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

    const candidatures = await kv.get(CANDIDATURES_KEY) || [];
    const filtered = candidatures.filter(c => c.id !== id);
    await kv.set(CANDIDATURES_KEY, filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression candidature:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
