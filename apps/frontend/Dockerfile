FROM node:20-alpine
WORKDIR /app
COPY . .
RUN node scripts/build-frontend.mjs
EXPOSE 5173
CMD ["node", "scripts/dev-frontend.mjs"]
