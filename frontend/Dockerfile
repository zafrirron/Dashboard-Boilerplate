# Use the Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# No need to EXPOSE the port here

# Start the React development server
CMD ["npm", "start"]
