#
# From the top-level directory, run:
#
#   docker build -t cnrsunic/nar-browser -f deployment/Dockerfile .
#


FROM debian:stretch
MAINTAINER andrew.davison@unic.cnrs-gif.fr

RUN apt-get update --fix-missing; apt-get -y -q install supervisor nginx-extras

COPY deployment/nginx_default /etc/nginx/sites-enabled/default
COPY app /usr/share/nginx/html/app
COPY node_modules /usr/share/nginx/html/node_modules

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
