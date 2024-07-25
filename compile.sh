#!/usr/bin/env bash

mkdir -p dist && \
wat2wasm sandfall.wat -o dist/sandfall.wasm && \
echo "+ dist/sandfall.wasm"
