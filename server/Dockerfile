FROM node:alpine as build

COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]