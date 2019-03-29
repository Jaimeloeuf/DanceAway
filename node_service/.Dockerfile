# This is the Dockerfile for DanceAway's Node server.

# The base image used is the full Node JS image, technically, the alpine version can be used too
FROM node:latest

# Set the port used by this image. Only use "80" in production
# EXPOSE 80
# PORT 8080 is used for development only
EXPOSE 8080

# Create app directory and set as working directory
WORKDIR /app

# Bundle app source files over into the working directory
COPY . .

# A wildcard is used to ensure both package.json AND package-lock.json are copied where available (npm@5+)
COPY package*.json /app

# Install NPM dependencies and build code for development
RUN npm install
# Install NPM dependencies and build code for production only
# RUN npm install --only=production

# Run node server with "npm start" to use the start script specified in package.json file
# Shell form of ENTRYPOINT used to ignore any CMD or docker run command line arguments and run the image as a single executable
ENTRYPOINT npm start

# To build and run the image from this Dockerfile
# docker build -t DanceAway .
# docker run -it --rm --name DA DanceAway