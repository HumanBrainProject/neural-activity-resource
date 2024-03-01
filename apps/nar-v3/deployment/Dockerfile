# this two-stage build makes the final image much smaller
# as it contains only the final built app

# build environment
FROM docker-registry.ebrains.eu/neuralactivity/node:20-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent --legacy-peer-deps
COPY . ./
RUN npm run build

# production environment
FROM docker-registry.ebrains.eu/neuralactivity/nginx:stable-alpine
COPY deployment/nginx_default /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
