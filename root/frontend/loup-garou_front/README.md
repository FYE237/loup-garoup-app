Voici une proposition d'amélioration du read me :

# Application Expo Projet Web ISI G3

Ce dépôt contient le code d'une application mobile réalisée avec React Native et Expo. L'architecture des dossiers s'inspire du tutoriel de React Native Expo avec Router disponible sur (https://www.youtube.com/watch?v=mJ3bGvy0WAY&t=5342s). Le code de cette architecture est disponible sur le dépôt Github suivant : https://github.com/adrianhajdin/project_react_native_jobs.

Voici une brève description des différents dossiers de ce projet :

- Le dossier `app` contient les pages du jeu.
- Le dossier `components` contient les composants utilisés par les pages du jeu.
- Le dossier `assets` contient les images et les polices de caractères utilisées dans le jeu.
- Le dossier `constants` contient les différentes constantes utilisées dans le jeu.
- Les dossiers `helperFunctions` et `customhooks` contiennent des méthodes utiles.

Voici une description des différentes pages présentes dans le dossier `app` :

- `WelcomePage.js` : la page de bienvenue qui nous redirige vers la page d'accueil.
- `index.js` : la page d'accueil qui redirige vers la page de connexion ou la page d'inscription.
- `RegisterPage.js` : la page qui permet de créer un compte utilisateur.
- `LoginPage.js` : la page qui permet de se connecter à un compte utilisateur.
- `home.js` : la page principale qui s'affiche une fois que l'utilisateur est connecté. Cette page permet de rejoindre une partie existante ou de créer une nouvelle partie.
- `configGame.js` : la page à laquelle on accède lorsqu'on souhaite créer une nouvelle partie. Cette page permet de configurer les paramètres de la partie.
- `GamePage.js` : la page principale de gestion du jeu. Cette page redirige vers différentes pages du jeu en fonction de l'état de la partie reçu du backend.
- `EnAttentePage.js` : la page qui s'affiche lorsque la partie est en attente de joueurs.
- `jourPage.js` : la page qui s'affiche lorsque quand nous sommes dnas le état jour .
- `nuitPage.js` : la page qui s'affiche lorsque quand nous sommes dnas le état nuit.
- `finJeuPage.js` : la page qui s'affiche lorsque la partie est terminée.

## 🚀 Comment utiliser

Pour innstaller les differents fichiers il suffit de faire un 
```sh
npm install
```
Pour lancer l'application localement (utilisé principalement pour la version web), il faut faire :
```sh
npm expo start 
```
Pour lancer l'application sur le net (utilisé pour la version Android généralement), il faut faire :
```sh
npm expo start --tunnel```
