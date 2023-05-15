# Test-Projet-CAWEB

## Setup

1. Go to project folder(the folder at which the read me is written)

> cd Backend

2. Install Dependencies

> npm run setup

3. Create .env with following content
The mongo env is already pre buit but is you want to change the database you can do 
by changing the mongo url 
````
MONGO_URL=

PORT=3000
SECRET=AAA
TOKENSECRET=BBBBBB
````

## Run

1. Start Server

> npm start 

> npm run startdev 

2. Open in url or using an Endpoint tester (postman)

> http://127.0.0.1:3000/

3. Start server in dev mode :

> npm run startdev

4. To access swagger docs : 

http://localhost:3000/doc


## FILE STRUCTURE

The project follows a folder structure as outlined below:

### `src/`

This folder contains the main folders of this branch.

### `src/models/`

This folder contains the database schemas related to the project.

### `src/controllers/`

This folder contains the files that are responsible for the API connection, such as "partie," "token," and "user." The folder also contains files related to the game logic, such as "game context" and the different game states.

### `src/server.js`

This file launches the server, and the sockets are defined in this folder. When we receive a new request, we find which game it belongs to and propagate the request to the context that calls the method associated with the current state.

### `src/routes/`

This folder contains the API routes.