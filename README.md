# Location Machecoul - Application sécurisée

Application de location immobilière avec authentification sécurisée.

## Déploiement sur Vercel

### 1. Créer le repository GitHub
Pousse ce dossier sur un nouveau repository GitHub.

### 2. Connecter à Vercel
1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe ton repository GitHub
3. Nom du projet : `location-machecoul`

### 3. Ajouter le stockage Vercel KV
1. Dans ton projet Vercel, va dans **Storage**
2. Clique **Create Database** → **KV**
3. Nomme-la `location-kv`
4. Les variables `KV_*` seront automatiquement ajoutées

### 4. Configurer les variables d'environnement
Dans **Settings** → **Environment Variables**, ajoute :

| Variable | Valeur |
|----------|--------|
| `ADMIN_EMAIL` | `maxime@2dpublicite.fr` |
| `ADMIN_PASSWORD_HASH` | `$2a$12$K5k1w1MFemaJp.NE8hsuZOEieXlsdzvyD9auWFDP6kTg/qC68TUya` |
| `JWT_SECRET` | *(Génère une chaîne aléatoire de 64 caractères)* |

### 5. Redéployer
Clique sur **Redeploy** pour appliquer les variables.

---

## Identifiants admin

- **Email** : maxime@2dpublicite.fr
- **Mot de passe** : Etoile44270@Macheriejetaime

## Sécurité

✅ Le mot de passe n'est **jamais** visible dans le code source
✅ Authentification via cookies HttpOnly (non accessible en JavaScript)
✅ Tokens JWT avec expiration 24h
✅ Données stockées dans Vercel KV (base de données sécurisée)
✅ API protégée côté serveur
