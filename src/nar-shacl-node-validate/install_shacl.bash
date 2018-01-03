#!/bin/bash
# Edit NODE_PATH accordingly
export NODE_PATH=/usr/bin/nodejs:/usr/local/lib/node_modules:/usr/share/javascript
# install modules
npm install shacl-js
npm install command-line-args
# remove junk
rm -rf node_modules package-lock.json
