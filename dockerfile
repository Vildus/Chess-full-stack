# Build image
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN cd client && npm ci && npm run build

# Production
FROM node:18-alpine as production
WORKDIR /app
COPY --from=build /app .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

CMD ["npm", "start"]