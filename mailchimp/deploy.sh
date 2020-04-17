#!/usr/bin/env bash

rm -rf ./dist && mkdir dist
cp -r ./src/* ./dist
cp package.json package-lock.json ./dist
cd dist
npm install --only=prod
zip -r ./tutorial-function.zip .
aws lambda update-function-code --function-name tutorial-function --zip-file fileb://tutorial-function.zip
cd ..
