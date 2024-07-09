FROM node:20 AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:20 AS server
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js .
RUN npm install express
EXPOSE 3000
CMD ["node", "server.js"]