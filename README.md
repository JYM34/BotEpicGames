# 🤖 Bot Epic Games – Discord

Un bot Discord qui publie automatiquement les jeux gratuits disponibles sur l'Epic Games Store.

## 🚀 Fonctionnalités
- Récupère les jeux gratuits actuels et à venir via l'API Epic Games
- Envoie un embed stylisé avec image, description, dates de promotion
- Bouton « Ajouter à Epic Games » avec lien vers le store
- Statut dynamique du bot (temps restant pour la prochaine offre)
- Support des `Mystery Games` avec image spéciale personnalisée
- Logs console détaillés (à améliorer en prod)

## 🛠️ Installation
```bash
git clone https://github.com/votre-utilisateur/BotEpicGames.git
cd BotEpicGames/bot
npm install
```

## ⚙️ Configuration
- Créez un fichier `.env` contenant votre TOKEN Discord :
```env
TOKEN=VotreTokenDiscordIci
```
- Vérifiez que `config.js` contient les bons ID de salons (`GuildID`, `GuildID2`)

## 📦 Lancer le bot
```bash
node index.js
```

## 🧠 Structure du projet
- `bot/Fonctions/` : Fonctions réutilisables (`embeds`, `date`, etc.)
- `bot/Loaders/` : Chargement des données Epic Games
- `bot/Events/` : Gestion des événements Discord
- `bot/config.js` : Configuration des IDs de serveurs

## 🔐 Sécurité
- Ne versionnez **jamais** votre `.env`
- Créez un fichier `.env.example` pour la configuration par d'autres

## ✅ To-do / Améliorations suggérées
- Système de cache persistant pour les images / jeux
- Logger unifié avec niveaux `info`, `warn`, `error`
- Dashboard web minimal pour monitorer le bot

---
Développé avec ❤️ par JYM.
