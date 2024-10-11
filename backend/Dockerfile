# Use the Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# No need to EXPOSE the port, as Docker Compose will handle this

# Start the backend service
CMD ["npm", "start"]
