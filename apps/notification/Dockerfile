# Development mode
FROM node:19.6.0 as development

RUN corepack enable && corepack prepare pnpm@latest-8 --activate

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml tsconfig.build.json tsconfig.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production mode
FROM node:19.6.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN corepack enable && corepack prepare pnpm@latest-8 --activate

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml tsconfig.build.json tsconfig.json ./
RUN pnpm install --frozen-lockfile --prod
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD ["node", "dist/apps/notification/main"]