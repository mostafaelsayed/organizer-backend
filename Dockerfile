FROM node:23-alpine3.20
WORKDIR /usr/app
COPY ./ ./
RUN npm install
CMD ["node", "app.js"]