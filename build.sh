#!/usr/bin/env bash

bash compile.sh && \
mkdir -p dist
cp index.html dist/
cp index.js dist/
cp styles.css dist/
cp sandfall.wasm dist/
cp -R assets dist/

tree -L 1 dist
