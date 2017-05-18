#!/bin/bash

# excluding nupi big databases
mongo --eval "db.adminCommand( { listDatabases: 1 } )" | grep "name" | sed -r 's/.*: "(\w+).*/\1/' | grep -v nupi | xargs -n 1 mongodump -d
