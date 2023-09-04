#!/bin/bash
app="docker.waramity-main"
docker build -t ${app} .
docker run -d -p 56732:80 \
  --link waramity-mongo:mongo \
  --name=${app} \
  -v $PWD:/app ${app}
