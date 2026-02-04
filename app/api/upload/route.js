import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const candidatureId = formData.get('candidatureId');
    const fileType = formData.get('fileType');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
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
    const extension = file.name.split('.').pop();
    const filename = `candidatures/${candidatureId}/${fileType}_${timestamp}.${extension}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json({
      error: 'Erreur lors de l\'upload du fichier'
    }, { status: 500 });
  }
}
