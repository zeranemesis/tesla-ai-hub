# Tesla AI Hub — V2.1

Tableau de bord Web **statique** conçu pour le navigateur d'une Tesla Model 3. Interface tactile, raccourcis vers ChatGPT et GitHub, prompts copiables et projets personnalisables.

## Ce que l'application fait vraiment

- Ouvre **chatgpt.com**, où vous vous connectez avec votre abonnement ChatGPT Plus habituel.
- Pour **Work** : une fois ChatGPT ouvert, sélectionnez *Work*, puis démarrez le mode vocal si le navigateur le permet.
- Crée des raccourcis vers **vos propres liens ChatGPT de projets** et dépôts GitHub.
- Propose des prompts prêts à copier pour vos séances de programmation.
- Enregistre projets et thème dans le **stockage local du navigateur** ; export/import JSON disponibles.
- Permet de tester si l'API standard `getUserMedia` donne l'autorisation microphone **à AI Hub uniquement**.
- Prend en charge les navigateurs pouvant utiliser PWA/service worker, sans garantir une installation PWA sur Tesla.

## Connexion ChatGPT Plus : conserver la session sans sauvegarder le mot de passe

**Important : ce tableau de bord ne mémorise jamais les identifiants ChatGPT.** Il ouvre `https://chatgpt.com/` directement dans le navigateur de la Tesla, sur son domaine officiel et dans le même onglet. La connexion est authentifiée par ChatGPT, et les **cookies/sessions** peuvent être conservés par le navigateur du véhicule. C'est la seule manière raisonnablement sûre de rester connecté sans API OpenAI ni serveur.

À l'arrêt :

1. Ouvrir AI Hub, puis **Ouvrir ChatGPT** ; vérifier que l'adresse affichée est `https://chatgpt.com/`.
2. Se connecter soi-même à son compte Plus sur le site officiel (avec la méthode habituelle : e-mail, Google, Apple, etc.). Aucun mot de passe n'est saisi dans AI Hub.
3. Fermer puis rouvrir le navigateur Tesla et tester si ChatGPT est resté connecté ; refaire le test après la mise en veille du véhicule.
4. Si la session disparaît : **AI Hub ne peut pas l'empêcher**. La durée de session et la persistance des cookies sont déterminées par Tesla et OpenAI. Ne pas effacer les cookies/données du navigateur si l'on souhaite rester connecté.

Les projets, raccourcis et réglages d'AI Hub, eux, sont conservés séparément dans `localStorage` du domaine GitHub Pages, s'il est disponible. **Jamais** de mot de passe, cookie OpenAI, jeton d'accès ou code 2FA en JavaScript, dans le dépôt, dans le JSON d'export, ni dans le stockage d'AI Hub. Il n'est pas possible de connaître depuis AI Hub l'état réel de connexion sur `chatgpt.com` à cause de l'isolation des sites Web.

## Limites importantes

Ce n'est **pas** une application native Tesla OS. Le navigateur Tesla ne fournit pas de méthode officielle permettant l'installation de cette PWA dans le lanceur de la voiture. AI Hub n'intègre pas ChatGPT dans son propre code et ne peut ni déclencher automatiquement le mode vocal/Work, ni contrôler Grok, le volant, ou les fonctions du véhicule. Le fonctionnement de ChatGPT Voice/Work dans le navigateur Tesla reste à tester sur le véhicule. Aucune conversation ou authentification OpenAI n'est conservée dans cette application.

## Déploiement gratuit avec GitHub Pages

1. Sur GitHub, créez un dépôt **public** nommé `tesla-ai-hub` et cochez **Add a README file** afin d’initialiser la branche `main` (GitHub Pages est disponible gratuitement sur les dépôts publics).
2. Publiez **tout le contenu** de ce dossier à la racine du dépôt : `index.html`, `styles.css`, `app.js`, `manifest.webmanifest`, `service-worker.js`, `icons/`. Le `README.md` du dépôt peut être remplacé par celui-ci. Si l’application GitHub connectée a accès au dépôt, ChatGPT peut y pousser ces fichiers après la création du dépôt.
3. Dans le dépôt, ouvrez **Settings → Pages → Build and deployment**. Choisissez **Deploy from a branch**, puis branche `main`, dossier `/ (root)` et enregistrez.
4. Patientez que Pages soit prêt puis ouvrez `https://VOTRE-PSEUDO.github.io/tesla-ai-hub/` dans le navigateur Tesla.
5. Ajoutez l'adresse aux favoris du navigateur. Aucun firmware ou accès administrateur Tesla nécessaire.

GitHub Pages est un hébergement **public** : ne mettez jamais de mots de passe, identifiants Tesla, jetons ou clés API dans les fichiers. AI Hub ne requiert aucun secret.

## Tester localement

Utilisez un serveur local (les service workers et tests micro sont limités sur `file://`) :

```bash
cd tesla-ai-hub
python -m http.server 8765
```

Puis ouvrez `http://localhost:8765/` dans un navigateur sur votre ordinateur. Pour la Tesla, utilisez GitHub Pages en HTTPS.

## Personnalisation

Dans « Mes projets », ajoutez ou modifiez un projet, puis collez l'URL de la conversation ou du projet ChatGPT de votre choix. La sauvegarde locale dépend des permissions et du nettoyage de données du navigateur Tesla ; exportez votre configuration si nécessaire.

## Sécurité et conduite

- Ne naviguez pas dans les réglages ou les projets pendant la conduite.
- Aucun accès aux API du véhicule, aucune fonction de contrôle ni surveillance Tesla.
- Pas de serveur tiers, de suivi publicitaire, d'API OpenAI payante ou d'authentification personnalisée.
- Le site externe ChatGPT requiert Internet et peut être soumis aux limites de votre abonnement.
- Non affilié à Tesla ou OpenAI.

## Fichiers

- `index.html` : structure des quatre écrans
- `styles.css` : interface tactile sombre/claire, responsive
- `app.js` : projets, navigation, prompts, tests et préférences locales
- `manifest.webmanifest`, `service-worker.js`, `icons/` : prise en charge PWA lorsque possible

### Vérification préalable à la publication

Les contrôles UI de développement ont été validés sur les formats 1440×900 et 390×844. Ils ne remplacent pas un test réel dans le navigateur Tesla, surtout pour le microphone, la session ChatGPT et le mode Work.