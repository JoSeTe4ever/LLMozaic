# Use a Node.js base image
FROM node:18.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the backend application files into the working directory
COPY . .

# Expose the port where the application will run (adjust this according to your project)
EXPOSE 9000

# Command to start the backend application (adjust this according to your project)
CMD [ "npm", "run", "start" ]
