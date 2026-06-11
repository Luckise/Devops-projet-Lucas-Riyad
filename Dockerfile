FROM node:22-alpine AS build

RUN npm install -g npm@11

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine AS run

WORKDIR /app

COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
