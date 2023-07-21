# SPŠ Chess

SPŠ Chess is my personal project of a online multiplayer chess game.
The app uses node/express.js as the BE, Vue as the FE, MongoDB as the DB, and Socket.io for WS communication. 
The app is a WIP proof of concept MVP. It doesn't hash passwords yet, stores JWT in localStorage and does not use refresh tokens *... yet*.

## How to run (Docker)

Just copy the files and run: `docker compose up --build`

## Todo:
* Add proper validation to endpoints (important !)
* Separate WS for lobby and game (big one)
* Rework WS handeling on the BE
* Use something like Redis for active game state
* Better storage of JWT and WS authentication
* Implement JWT refresh tokens
* Add password hashing
* Add timer to the chess game
* Add game history
* Add profile page
* Add "change password" page
* Add Pinia for auth and WS and move to Composition API
* BE code refactoring
* Add admin dashboard
* Implement elo system
* Complete UI redesign
* IP bans