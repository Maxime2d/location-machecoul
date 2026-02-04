import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

// Hash du mot de passe (généré avec bcrypt)
// Le mot de passe en clair n'est JAMAIS stocké dans le code
export async function verifyCredentials(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error('Variables d\'environnement ADMIN_EMAIL et ADMIN_PASSWORD_HASH non configurées');
    return false;
  }

  if (email !== adminEmail) {
    return false;
  }

  // Vérification du mot de passe avec bcrypt
  const isValid = await bcrypt.compare(password, adminPasswordHash);
  return isValid;
}

export async function createToken(email) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

// Fonction utilitaire pour générer le hash du mot de passe
// À utiliser une seule fois pour créer le hash initial
export async function generatePasswordHash(password) {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}
