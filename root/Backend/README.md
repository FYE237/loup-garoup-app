# Test-Projet-CAWEB

## Setup

1. Go to project folder

> cd Backend

2. Install Dependencies

> npm run setup

3. Create .env with following content

````
MONGO_URL=

PORT=3000
SECRET=AAA
TOKENSECRET=BBBBBB
````

## Run

1. Start Server

> npm start

2. Open in url or using an Endpoint tester (postman)

> http://127.0.0.1:3000/

3. Start server in dev mode :

> npm run startdev

4. To access swagger docs : 

http://localhost:3000/doc


I try as much as possible to describe what object must be send by the frontend to the backend at each endpoint.
 So respect the JSON structure object please :)

I also put a lot of comments in my code. It may be helpful if you have an issue with a request on an endpoint