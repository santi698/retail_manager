FROM node:12-slim

WORKDIR /app

ARG REACT_APP_API_URL
ARG REACT_APP_DOMAIN
ARG PORT=3000
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
ENV REACT_APP_DOMAIN=${REACT_APP_DOMAIN}
ENV PORT=${PORT}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD npx serve build -s -p ${PORT}
