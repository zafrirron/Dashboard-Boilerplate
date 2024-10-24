# Use a Debian-based Node.js image
FROM node:18-bullseye

# Set working directory
WORKDIR /opt/app

# Copy package.json and yarn.lock first to leverage Docker cache
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Strapi admin panel (if needed)
RUN npm run build

# Expose the default Strapi port
EXPOSE 1337

# Run Strapi
CMD ["npm", "run", "develop"]
