import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { to, name, type } = await request.json();

    if (!to || !name) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    let subject, html;

    if (type === 'refusal') {
      subject = 'Location Maison T4 Machecoul - Réponse à votre candidature';
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e3a5f;">Location Maison T4 - Machecoul-Saint-Même</h2>

          <p>Bonjour ${name.split(' ')[0]},</p>

          <p>Nous avons bien reçu votre candidature pour la location de la maison T4 située à Machecoul-Saint-Même et nous vous remercions de l'intérêt que vous avez porté à ce bien.</p>

          <p>Après examen attentif de l'ensemble des dossiers reçus, nous avons le regret de vous informer que <strong>votre candidature n'a pas été retenue</strong>.</p>

          <p>Nous vous souhaitons bonne chance dans vos recherches de logement.</p>

          <p style="margin-top: 30px;">Cordialement,<br>Le propriétaire</p>

          <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #888;">Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
      `;
    } else {
      return NextResponse.json({ error: 'Type d\'email non reconnu' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Location Machecoul <noreply@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
