# frontend/Dockerfile
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose frontend development server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
