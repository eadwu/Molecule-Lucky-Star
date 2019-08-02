#!/usr/bin/env bash
mkdir -p build

pug src/index.pug -o build/
babel src/main.js -o build/main.js
