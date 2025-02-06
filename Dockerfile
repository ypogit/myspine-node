# For Dev
FROM node:18 AS development
WORKDIR /poms
# Install dependencies
COPY package*.json ./
RUN yarn global add nodemon
# Copy necessary files
COPY nodemon.json ./
COPY . .
CMD ["sh", "-c", "cp /run/secrets/poms-env .env && nodemon --experimental-specifier-resolution=node"]

# For Prod
FROM node:18 AS production
WORKDIR /poms
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["sh", "-c", "cp /run/secrets/poms-env .env && node --experimental-specifier-resolution=node dist/src/server.js"]