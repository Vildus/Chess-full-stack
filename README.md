# SPŠ Chess

SPŠ Chess is my personal project of a online multiplayer chess game.
The app uses node/express.js as the BE, Vue as the FE and Socket.io for WS communication. 
The app is a WIP proof of concept MVP. It doesn't hash passwords yet, stores JWT in localStorage and does not use refresh tokens *... yet*.

## Docker

Just copy the files and run: `docker compose up --build`

## Dev server

Run `npm run build` in the client folder and then run `npm run dev` in the root folder

## Frontend dev

Run the server as well as `npm run dev` in the client folder for the Vue.js developement server

## Todo:
* Add proper validation to endpoints (important !)
* Better storage of JWT and websocket authentication
* Implement JWT refresh tokens
* Add password hashing
* Add timer to the chess game
* Add game history
* Add profile page
* Add "change password" page
* Add Pinia for auth and sockets and move to Composition API
* BE code refactoring
* Add admin dashboard
* Implement elo system
* Complete UI redesign
* IP bans