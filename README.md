# MemeGale Back 🗄️

Backend de l'application **MemeGale**, basé sur **Directus**.
Fournit l'API REST, les WebSockets, la gestion de base de données et le système d'authentification.

## 🚀 Fonctionnalités Servies

- **CMS Headless** : Gestion des contenus (Mèmes, Commentaires, Tags).
- **Authentification** : Gestion des utilisateurs, Rôles & Permissions, OAuth 2.0 (Google).
- **WebSockets** : Support temps réel pour les notifications.
- **Stockage** : Gestion des assets (Images des mèmes).

## 🛠️ Stack Technique

- **Core** : Directus 10.x/11.x
- **Base de données** : PostgreSQL / SQLite (selon config)
- **Cache** : Redis (optionnel)
- **Search** : Meilisearch (pour la recherche avancée)

## 📦 Installation

### Option 1 : Docker (Recommandé)

1. S'assurer d'avoir Docker et Docker Compose installés.
2. Créer un fichier `docker-compose.yml` standard Directus ou utiliser celui fourni.
3. Lancer le conteneur :
   ```bash
   docker-compose up -d
   ```

### Option 2 : Node.js

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Initialiser le projet :
   ```bash
   npx directus bootstrap
   ```
3. Lancer le serveur :
   ```bash
   npx directus start
   ```

## ⚙️ Configuration (.env)

Les variables essentielles à configurer dans le `.env` pour le bon fonctionnement avec le Frontend :

```env
# General
PUBLIC_URL="http://localhost:8055"
SECRET="votre-secret-key-longue"

# WebSockets (R506 - 3pts)
WEBSOCKETS_ENABLED=true
WEBSOCKETS_PUBLIC_URL="ws://localhost:8055/websocket"

# OAuth Google (R506 - 4pts)
AUTH_PROVIDERS="google"
AUTH_GOOGLE_DRIVER="openid"
AUTH_GOOGLE_CLIENT_ID="votre-client-id"
AUTH_GOOGLE_CLIENT_SECRET="votre-client-secret"
AUTH_GOOGLE_ISSUER_URL="https://accounts.google.com"
AUTH_GOOGLE_SCOPE="openid profile email"

# CORS (Important pour le front)
CORS_ENABLED=true
CORS_ORIGIN="http://localhost:4200"
```

## 🗃️ Schéma de Données

Collections principales :

- `memes` : Contenu principal (titre, image, likes, vues).
- `notifications` : Système de notifs (message, lu/non-lu).
- `meme_likes` : Table de liaison M:M pour les likes.
- `comments` : Commentaires sur les mèmes.
- `directus_users` : Utilisateurs de l'app.

## 📝 Évaluation (R506)

Le backend respecte les critères :

- ✅ **Conventions** : Utilisation standard de Directus.
- ✅ **Permissions** : Rôles "Authenticated User" configurés avec accès granulaires.
- ✅ **OAuth** : Configuration Google (à finaliser avec vars).
- ✅ **WebSockets** : Activés pour le temps réel.
