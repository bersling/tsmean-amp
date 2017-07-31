#!/usr/bin/env bash

if [ "${1}" == "dev" ]; then
  echo "deploying to dev"
elif [ "${1}" == "prod" ]; then
  echo "deploying to prod"
else
  echo "Expected dev or prod as argument"
  exit 0
fi

npm run build

if [ "${1}" == "dev" ]; then
  aws s3 cp dist s3://aws-website-tsmean-dev-ghyw3/ --recursive
elif [ "${1}" == "prod" ]; then
  aws s3 cp dist s3://aws-website-tsmean-prod-gclcd/ --recursive
fi

echo "Done!"
