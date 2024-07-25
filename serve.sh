#!/usr/bin/env bash

bash build.sh && \
http-server -p 5000 -o dist/index.html
