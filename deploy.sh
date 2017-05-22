server=ubuntu@52.59.71.133

# Frontend-Only deployment
if [ "${1}" == "fe" ]; then
  rsync -avz --delete -e 'ssh' "dist/" "${server}:tsmeandir/dist"
  exit 0
fi


# remove the old zip file if present, locally and on server
rm -f tsmean.zip
ssh ${server} "rm -f tsmean.zip"

# zip the required directories
zip -r tsmean.zip . -x \
./node_modules/**\* \
./dist/**\* >/dev/null

echo ""
echo "---------------------------------"
echo "Upload Zip"
echo "---------------------------------"

scp tsmean.zip "${server}:~"

#ssh ${server} "rm -rf tsmeandir"
ssh ${server} "unzip tsmean.zip -d tsmeandir"



ssh ${server} "cd tsmeandir && npm install && npm run build && npm run stopforever && npm run forever"

echo ""
echo "---------------------------------"
echo "Cleanup"
echo "---------------------------------"
rm tsmean.zip
