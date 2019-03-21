# DanceAway

## Repo description
A gamified solution to solve the medical challenge of diabetes faced by society.
This game will help to encourage and motivate people to exercise in order to stop diabetes and to raise awareness of diabetes.


## Tech Stack
The game itself is build with the p5.JS library for graphics rendering.
The backend web service for the game is built with Express on Node JS.

### Multiplayer
- Out of the 2 user playing, 1 must press play multiplayer.
- After pressing, user must enter the opponent's userID
- The multiplayer request will be shown on the opponent's screen with a accept/reject request menu
- Once opponent accepts, the service will create a "game room" for the players and establish 2
    active connection with the 2 players like web sockets... (In this case a node js based server would be better)
- The connection will send them a start signal at the same time, and the front-end will start a 3s countdown.
- After countdown ends, the player starts playing their own game.
- When one of the player "dies" the score is sent back to the server
- The opponent will continue playing even when the other player "dies"
- Will both players have finished their games, and the server received both their score,
    The scores will be compared and the result will be sent back to the users.
    But when one player dies, the front-end of the other player should be notified too thus can display u won immediately

- Like the normal game, after the game ends, display the high score/leaderboard of the game from the backend service
- The service will always be keeping a copy of the highscore board in memory, so when a new score comes in, it will be checked and updated immediately if necessary.