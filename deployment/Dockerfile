#
# Build an image for deploying the Neuromorphic Platform job manager
#
# To build the image, from the parent directory:
#   docker build -t neo-viewer -f deployment/Dockerfile .
#
# To run the application:
#  docker run -d -p 443 neo-viewer
#

FROM debian:buster-slim
MAINTAINER Andrew Davison <andrew.davison@unic.cnrs-gif.fr>

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update --fix-missing; apt-get -y -q install python3-pip sqlite3 supervisor nginx-extras npm
RUN unset DEBIAN_FRONTEND

RUN pip3 install uwsgi

ENV BASEDIR /home/docker
ENV SITEDIR $BASEDIR/site

COPY requirements.txt $BASEDIR/requirements.txt
RUN pip3 install -r $BASEDIR/requirements.txt
ENV PYTHONPATH  /home/docker:/home/docker/site:/usr/local/lib/python3.6/dist-packages:/usr/lib/python3.6/dist-packages

COPY neural_activity_app $SITEDIR

WORKDIR $SITEDIR/app
RUN npm install

WORKDIR $SITEDIR
RUN if [ -f $SITEDIR/db.sqlite3 ]; then rm $SITEDIR/db.sqlite3; fi
RUN python3 manage.py check
RUN python3 manage.py migrate
#RUN python3 manage.py collectstatic --noinput
RUN unset PYTHONPATH

COPY deployment $BASEDIR/deployment
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default
RUN ln -s $BASEDIR/deployment/nginx-app.conf /etc/nginx/sites-enabled/
RUN ln -s $BASEDIR/deployment/supervisor-app.conf /etc/supervisor/conf.d/
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 443
#EXPOSE 80
CMD ["supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisor-app.conf"]

