FROM node:18.9.0 AS BUILD_IMAGE

# Create app directory
WORKDIR /build

# Bundle app source
COPY src ./src
COPY package*.json tsconfig.json ./

# Install app dependencies and build
RUN npm install && npm run build

FROM node:18.9.0-slim

WORKDIR /usr/server

# copy from build image
COPY --from=BUILD_IMAGE /build .

# Expose port
EXPOSE 8081

# Launch automation
ENTRYPOINT [ "node", "src/index.js" ]