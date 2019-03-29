# DanceAway
A gamified solution to solve medical challenge of diabetes in society through elements such as, Point Scoring, Player Lives, Score Leaderboard and multiplayer mode to further encourage engagement with the game and serve as a form of motivation for people to exercise with diabetes-prevention knowledge passed on to them. This helps to encourage a more active nation and also raises diabetes awareness through the subconcious hinting build into the elements of the game.


## Tech Stack
The game itself is build with the p5.JS library for graphics rendering.
The backend web service for the game is built with Express on Node JS.
Will be building the backend into a Docker image that can be run be Cloud Services like Google App Engine, but am also considering building the data related backend code to use Firebase with the integrated databases through the Cloud Functions.

## To run the game
Either clone the repo to play on your own machine with your own computer acting as the server for the game data, or by accessing the offical game website [here](https://dancingchair-a4810.firebaseapp.com/)
To run on your local machine, you can either choose to run the app with the provided Docker image, or run it natively.
Native code running requires Node.JS v10 and above. Run "npm install" before running "npm start"

## Multiplayer (To be built)
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

## Future features
- Add the authentication page with a login and logout feature to secure the user data.
- Share your highscore on social media.
- Multiplayer mode as mentioned above.
- Invite your friends to play and compete against you.
- Expand the diabetes related knowledge base in the app, so that user can see more different trivias and stuff