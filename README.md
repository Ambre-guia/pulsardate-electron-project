# Pulsardate

Il s'agit d'une application de calendrier construite avec Electron pour gérer des événements et importer des données de calendrier à partir de fichiers ICS.

## Fonctionnalités

- Afficher, créer, mettre à jour et supprimer des événements dans une interface conviviale.
- Importer des événements à partir de fichiers ICS.
- Vue calendrier avec navigation par mois et par année.
- Conception responsive pour différentes tailles d'écran.

## Mise en route

Pour commencer avec l'application, suivez ces étapes :

### Prérequis

- Node.js et npm installés sur votre machine.

### Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Ambre-guia/pulsardate-electron-project.git
   ```

2. Acccédez au répertoire du projet: 

    ```bash
    cd pulsardate-electron-project
    ```

3. Installez les dépendances:

    ```bash 
    npm install 
    ```

4. Modifiez le fichier src/back/bdd/log.ts:

    ```bash 
    host: XXXX,
    user: XXXX,
    port: XXXX,
    database: XXXX, 
    ```

5. Exécutez l'application

    ```bash
    npm start
    ```

### Utilisation

- **Vue Calendrier** : Naviguez à travers les mois et les années pour afficher les événements sur le calendrier.

- **Créer un Événement** : Cliquez sur "Créer un événement" pour ajouter un nouvel événement avec des détails.

- **Mettre à Jour un Événement** : Sélectionnez un événement et cliquez sur "Mettre à Jour" pour modifier les détails de l'événement.

- **Importer un Fichier ICS** : Utilisez l'option "Importer un fichier ICS" pour importer des événements à partir d'un fichier ICS.