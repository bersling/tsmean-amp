#!/usr/bin/env bash

functionName="tsmean-mailchimp-subscribe"

rm -rf ./dist && mkdir dist
cp -r ./src/* ./dist
cp package.json package-lock.json ./dist
cd dist
npm install --only=prod
zip -r ./${functionName}.zip .
aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${functionName}.zip
cd ..
