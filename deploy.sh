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
  aws s3 cp dist s3://aws-website-tsmean-dev-ghyw3/ --recursive # --cache-control max-age=86400,public
  aws cloudfront create-invalidation --distribution-id E1L4LCQDU1DD5Q --paths "/*"
elif [ "${1}" == "prod" ]; then
  aws s3 cp dist s3://aws-website-tsmean-prod-gclcd/ --recursive # --cache-control max-age=86400,public
  aws cloudfront create-invalidation --distribution-id E17836BQ15BE93 --paths "/*"
fi

echo "Done!"
