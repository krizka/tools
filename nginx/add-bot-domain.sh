#!/bin/bash 

DOMAIN=$1
PORT=$2

if [ "$DOMAIN" = "" -o "$PORT" = "" ]; then
  echo "usage: $0 <bot> <port>" && exit 1
fi

cp template-bot.conf $DOMAIN

sed -i "s/DOMAIN/$DOMAIN/g" $DOMAIN
sed -i "s/PORT/$PORT/g" $DOMAIN

DOM=$DOMAIN.tree.actor
NG=/etc/nginx
NAV=$NG/sites-available
NEN=$NG/sites-enabled
NDOMAIN=$NAV/$DOMAIN

mv $DOMAIN $NDOMAIN
ln -s $NDOMAIN $NEN/$DOMAIN

nginx -t || rm $NDOMAIN $NEN/$DOMAIN && exit 1
service nginx reload

