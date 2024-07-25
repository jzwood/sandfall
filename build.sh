#!/usr/bin/env bash

bash compile.sh && \
mkdir -p dist
cp index.html dist/
deno fmt index.js
cp index.js dist/
cp styles.css dist/
cp -R assets dist/

tree -L 1 dist
