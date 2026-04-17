FROM node:24-alpine

WORKDIR /src

ENV NODE_ENV=production

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

EXPOSE 3000

CMD ["npm", "run" ,"start"]
