# Use the Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the backend code
COPY . .  
# Only copy backend files

# Expose the backend port
EXPOSE ${BACKEND_PORT}

# Start the backend server
CMD ["npm", "start"]
