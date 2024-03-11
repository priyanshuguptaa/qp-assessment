# stage 1 building the code
FROM node as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# stage 2 Production build
FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production

COPY  --from=builder /usr/app/dist ./
COPY  --from=builder /usr/app/prisma/ ./prisma/
COPY .env ./
EXPOSE 8000
RUN npx prisma generate
CMD node server.js

