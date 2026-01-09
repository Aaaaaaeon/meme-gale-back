# MemeGale Backend

Backend pour la gestion de memes utilisant Directus, Meilisearch et SQLite.

## 📋 Prérequis

- Node.js 18+
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet et installer les dépendances

```bash
git clone <votre-repo>
cd MemeGaleBack
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Directus
PORT=8055
PUBLIC_URL=http://localhost:8055

# Database
DB_CLIENT=sqlite3
DB_FILENAME=./data.db

# Security
KEY=your-random-key-here
SECRET=your-random-secret-here

# Meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-meilisearch-master-key
MEILISEARCH_INDEX_PREFIX=directus_

# Admin Account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

### 3. Installer Meilisearch

#### Option A : Téléchargement direct (Windows)

```bash
# Télécharger Meilisearch pour Windows
curl -L https://github.com/meilisearch/meilisearch/releases/latest/download/meilisearch-windows-amd64.exe -o meilisearch.exe
```

#### Option B : Autres systèmes

**Linux:**

```bash
curl -L https://install.meilisearch.com | sh
```

**macOS:**

```bash
brew install meilisearch
```

**Avec npm (toutes plateformes):**

```bash
npm install -g meilisearch
```

### 4. Démarrer les services

#### Terminal 1 : Meilisearch

**Windows:**

```bash
./meilisearch.exe --master-key="your-meilisearch-master-key"
```

**Linux/macOS:**

```bash
./meilisearch --master-key="your-meilisearch-master-key"
```

#### Terminal 2 : Directus

```bash
npx directus start
```

## 🏗️ Architecture

### Collections

- **memes** : Stockage des memes (titre, image, tags, statistiques)
- **tags** : Tags pour catégoriser les memes
- **memes_tags** : Table de liaison Many-to-Many
- **meme_likes** : Gestion des likes utilisateurs
- **notifications** : Notifications en temps réel

### Extensions

1. **meilisearch-sync** (Hook)

   - Synchronise automatiquement les memes avec Meilisearch
   - Gère CREATE, UPDATE, DELETE

2. **search** (Endpoint)

   - Recherche intelligente avec filtres
   - Autocomplétion
   - `/search/memes` et `/search/memes/suggest`

3. **search-setup** (Endpoint)
   - Configuration initiale de l'index Meilisearch
   - `/search-setup/meilisearch`

## 🔧 Configuration initiale

### 1. Appliquer le schéma de base de données

```bash
npx directus schema apply ./schema-snapshot.json
```

### 2. Initialiser l'index Meilisearch

Après avoir démarré Directus et Meilisearch, appelez :

```bash
curl -X POST http://localhost:8055/search-setup/meilisearch
```

## 📚 API Endpoints

### Authentification

- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/logout` - Déconnexion

### Memes

- `GET /items/memes` - Liste des memes
- `POST /items/memes` - Créer un meme
- `PATCH /items/memes/:id` - Modifier un meme
- `DELETE /items/memes/:id` - Supprimer un meme

### Recherche Meilisearch

- `GET /search/memes?q=...&tags=...&sort=...` - Recherche avancée
- `GET /search/memes/suggest?q=...` - Autocomplétion

### Likes

- `POST /like-manager/toggle` - Toggle un like

## 🧪 Tests

Une collection Insomnia/Postman est disponible pour tester tous les endpoints.

## 📝 Notes

- Le binaire `meilisearch.exe` n'est **pas versionné** dans Git (trop lourd ~126 Mo)
- Les données Meilisearch sont stockées dans `data.ms/` (ignoré par Git)
- Les uploads sont dans `uploads/` (ignoré par Git)
- La base SQLite est dans `data.db` (ignorée par Git)

## 🔗 Ressources

- [Documentation Directus](https://docs.directus.io)
- [Documentation Meilisearch](https://docs.meilisearch.com)
- [TP Original](https://cours.marill.dev/tp-directus)
