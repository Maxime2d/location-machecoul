import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { get, BlobNotFoundError } from '@vercel/blob';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Seuls ces types sont renvoyés tels quels ; tout le reste part en téléchargement brut
const SAFE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

async function isAuthenticated() {
  const token = cookies().get('auth-token')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

// GET - Servir une pièce justificative (administrateur connecté uniquement)
export async function GET(request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = process.env.DOCS_READ_WRITE_TOKEN;
    if (!token) {
      console.error('DOCS_READ_WRITE_TOKEN non configuré');
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }

    const pathname = request.nextUrl.searchParams.get('pathname');
    if (!pathname || !pathname.startsWith('candidatures/') || pathname.includes('..')) {
      return NextResponse.json({ error: 'Document invalide' }, { status: 400 });
    }

    let result;
    try {
      result = await get(pathname, { access: 'private', token, useCache: false });
    } catch (error) {
      if (error instanceof BlobNotFoundError) {
        return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });
      }
      throw error;
    }

    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });
    }

    const contentType = SAFE_TYPES.includes(result.blob.contentType)
      ? result.blob.contentType
      : 'application/octet-stream';

    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentType === 'application/octet-stream' ? 'attachment' : 'inline',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Erreur lecture document:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
