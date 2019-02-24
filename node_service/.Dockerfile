FROM node:latest

# Copy files from this repo into the "/usr/app" directory
COPY . /usr/app

# Install all the dependencies specified by the package.json file
RUN npm install

# Set working directory to the app directory
WORKDIR /usr/app

# Start the app using the entry point defined in package.json file
ENTRYPOINT ["npm", "start"]