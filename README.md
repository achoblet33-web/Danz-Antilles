# Amicale DANZ Antilles

Application web privée pour les amicalistes de la DANZ Antilles. Le site utilise **React + Vite**, **Supabase Auth** et un déploiement **GitHub Pages**.

## Inclus dans cette V1

- connexion e-mail / mot de passe sans inscription publique ;
- toutes les pages du site protégées par authentification ;
- accueil, actualités, agenda, documents, galerie, présentation de l'amicale et profil ;
- documents dans un bucket Supabase privé avec liens signés temporaires ;
- règles RLS : lecture réservée aux utilisateurs connectés, écriture réservée aux administrateurs ;
- interface responsive mobile, tablette et ordinateur ;
- workflow GitHub Actions pour GitHub Pages.

> Une protection React seule ne sécurise pas des données. Les contenus privés doivent rester dans Supabase et sont protégés côté serveur par les règles RLS de `supabase/schema.sql`.

## 1 — Préparer Supabase

1. Créer un projet Supabase.
2. Ouvrir **SQL Editor** et exécuter `supabase/schema.sql`.
3. Dans **Authentication > Providers > Email**, conserver la connexion e-mail activée.
4. Dans **Authentication > Users**, créer les comptes des amicalistes autorisés. L'application ne propose volontairement aucun formulaire d'inscription.

Pour rendre un compte administrateur :

```sql
update public.profiles
set role = 'admin'
where id = 'UUID_DU_COMPTE';
```

## 2 — Variables d'environnement

En local, copier `.env.example` vers `.env` puis renseigner :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-publique
```

La clé publique Supabase est destinée au navigateur. **Ne jamais mettre la clé `service_role` dans cette application.**

## 3 — Lancer localement

```bash
npm install
npm run dev
```

## 4 — Déployer sur GitHub Pages

Dans GitHub, ouvrir **Settings > Secrets and variables > Actions** et créer :

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Puis ouvrir **Settings > Pages** et sélectionner **GitHub Actions** comme source. Chaque push sur `main` déclenchera `.github/workflows/deploy-pages.yml`.

Le site utilise `HashRouter`, compatible avec GitHub Pages sans réécriture serveur.

### Dépôt privé

La disponibilité de GitHub Pages pour un dépôt privé dépend de l'offre GitHub du compte. Si Pages n'est pas disponible, le frontend peut être rendu public sans rendre publiques les données : celles-ci restent dans Supabase et sont protégées par RLS.

## 5 — Ajouter du contenu

Pour cette première version, le bureau peut utiliser **Supabase > Table Editor** :

- `news` pour les actualités ;
- `events` pour l'agenda ;
- `gallery` pour la galerie ;
- `documents` pour les métadonnées des documents.

Pour un document : téléverser le fichier dans **Storage > documents**, puis créer une ligne dans `documents` avec son chemin dans `storage_path`.

## Étape suivante

Ajouter un espace d'administration dans le site afin que les membres du bureau puissent publier actualités, événements et documents sans ouvrir Supabase.
