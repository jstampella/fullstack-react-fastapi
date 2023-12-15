FROM node:16.15-alpine AS builder
ARG VITE_API_BACKEND
WORKDIR /home/node/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.19-alpine AS server
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./home/node/app/dist /usr/share/nginx/html