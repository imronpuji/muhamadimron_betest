# Use Node.js as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code into the container
COPY . .

# Expose the application port
EXPOSE 3000

# Specify the command to run the application
CMD ["npm", "start"]