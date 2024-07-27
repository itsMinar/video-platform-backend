# Use a lightweight Node.js image
FROM node:20-alpine

# Create and Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 8000 for the Express app
EXPOSE 8000

# Start the app using npm start
CMD [ "npm", "start" ]