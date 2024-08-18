FROM node:alpine

WORKDIR /app
COPY package.json .
# dont install dev dependencies
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]