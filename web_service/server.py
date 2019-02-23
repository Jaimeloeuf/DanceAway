""" Dependencies """
# Server dependencies
from flask import Flask, render_template, redirect, url_for, request, abort, jsonify


""" Server:

Username: UUID for every user


User (Obj)
	userID (string Prop)
	highscore (Int Prop)

Routes:

GET:
	/highscore/:userID
		Get the user object with userID and extract the highscore
		Get the user with "userID"'s highscore

POST:
	/highscore/:userID/:score
		Use route "/highscore/:userID" to get highscore
		If score higher than highscore, update DB and respond with true, else respond with false


	/user/create/:userID
		Creates a user with "userID" if userID does not exists
		returns true or false based on the user stat



	What is a url for the user to play with in multiplayer mode?
	Build in the API to share the highscore to social media

"""


# 'Global' object for Flask server
app = Flask(__name__)


@app.route('/', methods=['GET'])
@app.route('/home', methods=['GET'])
def home_page():
    # Check if the user logged in already by looking for a valid JWT.
    # Use put user data into home page and send it back
    return render_template('./index.html')


# Server Route to test if remote server is online
@app.route('/ping', methods=['GET'])
def ping():
    # Default 200 status code will be sent back
    return

@app.route('/highscore/<userID>', methods=['GET'])
def get_highscore():
	# Read from DB the score and return to user
    return

@app.route('/highscore/<userID>/<score>', methods=['POST'])
def new_highscore():
	# Call the get_highscore function to get the highscore. If highscore less than score, update highscore.
    return


if __name__ == "__main__":
    # To get environmental variables avail to the process
    from os import environ
    # Use PORT from the environment if defined, otherwise default to 5000.
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)

    # Add the SIGINT handler to end/terminate the process when caught