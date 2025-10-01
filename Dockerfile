# Node.js 18 for TypeScript
FROM node:18

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install base dev deps
RUN npm install

# Copy the source
COPY . .

# Build (optional, we’ll still run ts-node)
RUN npx tsc --project tsconfig.json || true

# Expose port
EXPOSE 3000

# Start app
CMD ["npx", "ts-node", "server.ts"]