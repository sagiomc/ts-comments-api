FROM node:14-alpine AS build
RUN npm i npm@latest -g
WORKDIR /opt/node_app
COPY package.json package-lock.json* ./
RUN npm install
ENV PATH /opt/node_app/node_modules/.bin:$PATH
WORKDIR /opt/node_app/app
COPY . .
RUN npm start build

FROM node:14-alpine AS release
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG PORT=5000
ENV PORT $PORT
ARG API_ROOT=/api
ENV API_ROOT $API_ROOT
ARG MODERATOR_API_KEY=moderator-key
ENV MODERATOR_API_KEY $MODERATOR_API_KEY
ARG MODERATOR_API_URL=moderator-url
ENV MODERATOR_API_URL $MODERATOR_API_URL
ARG SPAM_API_URL=spam-url
ENV SPAM_API_URL $SPAM_API_URL
ARG COMMENTS_API_DATABASE_URL=mongodb://localhost:27017
ENV COMMENTS_API_DATABASE_URL $COMMENTS_API_DATABASE_URL
ENV COMMENTS_API_DATABASE_NAME $COMMENTS_API_DATABASE_NAME
ARG COMMENTS_API_DATABASE_NAME=comments-api-db
RUN npm i npm@latest -g
RUN mkdir -p /opt/node_app/app && chown node:node /opt/node_app/app
WORKDIR /opt/node_app/app
USER node
COPY package.json package-lock.json* ./
RUN npm install --only=production --no-optional && npm cache clean --force
COPY --from=build /opt/node_app/app/dist .
EXPOSE $PORT
CMD ["node", "index.js"]
