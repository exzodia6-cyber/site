FROM node:20-alpine
WORKDIR /app
COPY . .
RUN node scripts/build-backend.mjs
EXPOSE 4000
CMD ["node", "apps/backend/dist/server.js"]
