FROM node:18.17.0-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the Next.js app
CMD ["npm", "run", "dev"]
