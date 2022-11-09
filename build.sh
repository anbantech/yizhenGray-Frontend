
DATE=$(date -d today +"%Y-%m-%d %H:%M:%S")

log() {
  if [ "$1" = "WARNING" ]; then
    /bin/echo -e "\n[$DATE] \033[41;37m WARNING \033[0m \033[31m$2 \033[0m"
  else
    /bin/echo -e "\n[$DATE] \033[42;37m INFO \033[0m \033[32m$2 \033[0m"
  fi
}

if [ "$1" = "" ]; then
  log "WARNING" "please choose a dockerfile as first params!"
  exit 1
fi

if [ "$2" = "" ]; then
  log "WARNING" "please name a tag for image as second params!"
  exit 1
fi



dockerFile=$1
tag=$2
imageName=fe-image-yz:$tag
tarName=fe-image-yz-$tag.tar

npm run build

docker build -f $dockerFile -t $imageName .

docker save -o $tarName $imageName

chmod 777 $tarName
