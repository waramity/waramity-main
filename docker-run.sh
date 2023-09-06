#!/bin/bash
app="docker.waramity-main"
docker build -t ${app} .
docker run -d -p 56732:80 \
  --name=${app} \
  -v $PWD:/app ${app}
