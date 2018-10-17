#!/bin/bash
npm install --no-optional --allow-root
nodemon server.js
while true; do foo; sleep 2; done