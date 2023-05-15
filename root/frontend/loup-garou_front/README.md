# Application expo projet web isi g3
L'achritecture des dossiers a été inspirée du projet réalisé dans le ce tutoriel de react native expo avec router. https://www.youtube.com/watch?v=mJ3bGvy0WAY&t=5342s
Le code de cette architecture est disponible sur lien suivant : https://github.com/adrianhajdin/project_react_native_jobs

Le dossier app contient les pages du jeu.
Le dossier components contient les composants utilisées par les pages du jeu.
Le dossier assests contient les images et les fonts 
Le dossier constants contient les differents constantes utilisés dans le jeu.
Les dossiers helperFunctions et customhooks contient des méthodes utiles.

Explication des differents page dans le doddier app:
WelcomePage.js
index.js : la page initial qui nous redirige vers la welcome page 
RegisterPage.js : la page au quel on crée un comtpe 
LoginPage.js ; la page qu'on utilise pour se connecter 
home.js : la premier au quel nous dirrigée aprés avoir connectée utiliser pour rejoindre une partie et crée une partie
configGame.js : Page qu'on entre qu'on on veut crée un jeu, dans cette page on pourra configurer le jeu
GamePage.js : la page principalement dans la gestion du jeu ce cette page nous rediregera vers differents pages du jeu selon l'etat du jeu qui est recu du backend
Les pages suiantes dont les pages possible du seront appellée par la game page
EnAttentePage.js
jourPage.js
nuitPage.js
finJeuPage.js



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
