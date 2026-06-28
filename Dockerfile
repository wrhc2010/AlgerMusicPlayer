# syntax=docker/dockerfile:1

FROM node:24-slim AS deps
WORKDIR /app

ENV HUSKY=0

COPY package*.json ./
RUN npm install

FROM deps AS build
WORKDIR /app

ARG VITE_API=/api
ARG VITE_API_MUSIC=/music
ENV VITE_API=${VITE_API}
ENV VITE_API_MUSIC=${VITE_API_MUSIC}

COPY . .
RUN printf "VITE_API=%s\nVITE_API_MUSIC=%s\n" "$VITE_API" "$VITE_API_MUSIC" > .env.production.local \
  && npm run build

FROM deps AS production-deps
WORKDIR /app

RUN npm prune --omit=dev \
  && npm cache clean --force

FROM node:24-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
  PORT=4488 \
  NCM_API_PORT=30488 \
  MUSIC_SOURCES=migu,kugou,kuwo,pyncmd

COPY --chown=node:node --from=production-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/out/renderer ./out/renderer
COPY --chown=node:node package.json ./
COPY --chown=node:node docker ./docker

EXPOSE 4488

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const p=process.env.PORT||4488; fetch('http://127.0.0.1:'+p+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

USER node

CMD ["node", "docker/server.js"]
