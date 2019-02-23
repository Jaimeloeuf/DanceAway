### Hackathon Todo Plan
- Get the offline version, or the "non-editor" version of the game working with saved local files
- Fix the problem with the loading of images, due to cross origin request block.
- Design the game levels and the other game details like score and more
- Decide on how the multiplayer version is going to work
- Social media integration

- Write tests

- Dockerizing the application



Things falling down  (Disappear when hit and point change)
- Mineral Water bottle (+ 5)
- Sugary bottled drinks (- 5)   Disappear when hit , change to a cross and point change
- Apple (+ 3) Disappear when hit and point change
- Bread (- 3)


Random health/diabetes fact at the end of the game using the RapidAPI provided facts to spread awareness of diabetes.
The fact should correspond to how well your performance is in the game



### Multiplayer
- When both players are ready, when they sent the ready signal to the server.
- Print "waiting for opponents" before the start game signal is received
- The server will send the start game signal to the front-end.
	Upon receiving the signal on the front-end, start countdown to game.
	Start game and the server will just wait for results.


- Out of the 2 user playing, 1 must press play multiplayer.
	- After pressing, user must enter the opponent's userID
	- The multiplayer request will be shown on the opponent's screen with a accept/reject request menu
	- Once opponenet accepts, the service will create a "game room" for the players and establish 2
	  active connection with the 2 players like web sockets... (In this case a node js based server would be better)
	- The connection will send them a start signal at the same time, and the front-end will start a 3s countdown.
	- After countdown ends, the player starts playing their own game.
	- When one of the player "dies" the score is sent back to the server
	- The opponent will continue playing even when the other player "dies"
	- Will both players have finnished their games, and the server received both their score,
	  The scores will be compared and the result will be sent back to the users
	  But when one player dies, the front-end of the other player should be notified too thus can display u won immediately


	- Like the normal game, after the game ends, display the highscore/leader board of the game from the backend service
	- The service will always be keeping a copy of the highscore board in memeory, so when a new score comes in, it will
	  be checked and updated immediately if neccessary.







### DB
- DB Options
	- JSON file
	- MySQL
	- Redis



