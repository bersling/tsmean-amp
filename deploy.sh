server=ubuntu@35.158.213.131

npm run build

if [ "${1}" == "dev" ]; then
  rsync -avz --delete -e 'ssh' "dist/" "${server}:tsmeanampdev/dist"
elif [ "${1}" == "prod" ]; then
  rsync -avz --delete -e 'ssh' "dist/" "${server}:tsmeanamp/dist"
else
 echo "Expected dev or prod as arguments"
fi

exit 0

