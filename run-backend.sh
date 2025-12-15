source remove-backend.sh

docker run --name organizer-backend \
    -p 4000:4000 \
    -e JAWSDB_URL=mysql://root:testoha@172.17.0.2:3306/organizer \
    -t organizer/backend