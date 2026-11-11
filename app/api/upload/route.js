import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

// Types acceptés et extension imposée (on ne se fie pas au nom du fichier envoyé)
const ALLOWED_TYPES = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

// Ne garder que des caractères sûrs dans les éléments du chemin
function safeSegment(value, fallback) {
  const cleaned = String(value || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60);
  return cleaned || fallback;
}

export async function POST(request) {
  try {
    // Stockage privé dédié aux pièces des candidats.
    // Sans ce jeton, on refuse l'envoi plutôt que d'écrire dans un stockage public.
    const token = process.env.DOCS_READ_WRITE_TOKEN;
    if (!token) {
      console.error('DOCS_READ_WRITE_TOKEN non configuré : envoi de document refusé');
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const candidatureId = safeSegment(formData.get('candidatureId'), 'sans-id');
    const fileType = safeSegment(formData.get('fileType'), 'document');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return NextResponse.json({
        error: 'Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG'
      }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        error: 'Fichier trop volumineux. Taille maximum: 5 Mo'
      }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = `candidatures/${candidatureId}/${fileType}_${timestamp}.${extension}`;

    const blob = await put(filename, file, {
      access: 'private',
      addRandomSuffix: true,
      contentType: file.type,
      token,
    });

    // Le fichier n'a pas d'adresse publique : il n'est lisible que par
    // l'administrateur connecté, via /api/document.
    return NextResponse.json({
      success: true,
      url: '/api/document?pathname=' + encodeURIComponent(blob.pathname),
      filename: blob.pathname
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({
      error: 'Erreur lors de l\'upload du fichier'
    }, { status: 500 });
  }
}
