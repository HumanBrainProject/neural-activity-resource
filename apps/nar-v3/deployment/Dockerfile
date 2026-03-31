# this two-stage build makes the final image much smaller
# as it contains only the final built app

# build environment
FROM docker-registry.ebrains.eu/neuralactivity/node:22-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY . ./
RUN npm run build

# production environment
FROM docker-registry.ebrains.eu/neuralactivity/nginx:stable-alpine

# Make nginx dirs writable for non-root user (UID 1001)
RUN chown -R 1001:0 /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chmod -R g+w /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    sed -i 's/^user  nginx;/#user  nginx;/' /etc/nginx/nginx.conf && \
    sed -i 's|/var/run/nginx.pid|/tmp/nginx.pid|' /etc/nginx/nginx.conf

COPY deployment/nginx_default /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
USER 1001
CMD ["nginx", "-g", "daemon off;"]
