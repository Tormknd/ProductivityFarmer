FROM node:18-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base as build
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma/schema.prisma ./prisma/schema.prisma
ENV PORT=4000
CMD ["node", "dist/index.js"]
