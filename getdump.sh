#!/bin/sh

HOST=$1
DB=$2

if [ -z $HOST -o -z $DB ]; then
    echo "usage: $0 <host> <db>" && exit 1
fi

RAND=`head /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | head -c 13 ; echo ''`
ssh $HOST "mkdir $RAND && cd $RAND && mongodump -d $DB && tar zcf $DB.tgz dump/$DB"
scp $HOST:$RAND/$DB.tgz ./
tar zxf $DB.tgz
ssh $HOST "rm -rf $RAND"