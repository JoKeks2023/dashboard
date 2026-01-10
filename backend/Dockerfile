FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (express, cors, ws)
RUN npm install express cors ws

# Copy server
COPY server.js ./

EXPOSE 3001

CMD ["node", "server.js"]
