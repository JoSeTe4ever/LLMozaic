# Use an official Node.js runtime as the base image
FROM node:18.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package.json ./

# Install project dependencies
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000
RUN npm config set fetch-timeout 1800000
RUN npm config set fetch-retries 5


RUN npm install  --legacy-peer-deps

# Copy the frontend application files into the working directory
COPY . .

# Build the frontend application (adjust this according to your project)
RUN npm run build

# Expose the port where the frontend application will run (adjust as needed)
EXPOSE 3000

# Command to start a web server for serving the frontend build (adjust as needed)
CMD [ "npm", "run", "start" ]
