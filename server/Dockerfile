FROM node:16-alpine
WORKDIR /usr/prova-react/server
COPY package*.json .
RUN npm i
COPY . .
CMD ["npm", "run", "start"]
EXPOSE 8001