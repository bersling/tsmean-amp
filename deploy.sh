server=ubuntu@35.158.213.131

if [ "${1}" == "dev" ]; then
  npm run build
  rsync -avz --delete -e 'ssh' "dist/" "${server}:tsmeanampdev/dist"
elif [ "${1}" == "prod" ]; then
  npm run build
  rsync -avz --delete -e 'ssh' "dist/" "${server}:tsmeanamp/dist"
else
 echo "Expected dev or prod as arguments"
fi

exit 0

