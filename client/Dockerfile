FROM node:16-alpine
WORKDIR /usr/prova-react/client
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
EXPOSE 3000