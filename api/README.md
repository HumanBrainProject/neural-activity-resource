# Neo Viewer Service

The Neo Viewer Service is a Django app that provides a REST API for reading electrophysiology data
from any file format supported by [Neo](http://neuralensemble.org/neo) and exposing it in JSON format.

## API Documentation

TODO

## Deployment

The easiest way to deploy the web service is as a Docker container.

Clone the Git repository using:
```
git clone https://github.com/NeuralEnsemble/neo-viewer.git
```

Obtain an SSL certificate using LetsEncrypt, and then modify `api/deployment/nginx-app.conf` to set the 
correct values of `server_name`, `ssl_certificate` and `ssl_certificate_key` for your server.

Set the appropriate value for `ALLOWED_HOSTS` in `api/neural_activity_app/settings.py`.

Change to the `src/neural-activity-visualizer/api` directory, then build the Docker image using:
```
docker build -t neo-viewer -f deployment/Dockerfile .
```

Run the Docker container using 
```
docker run -d -p 443:443 --name neo-viewer -v /etc/letsencrypt:/etc/letsencrypt neo-viewer
```

To check everything has worked, run
```
docker logs neo-viewer
```
