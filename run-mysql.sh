source remove-mysql.sh

docker run --name mysql-organizer \
    -v mysqldata:/var/lib/mysql \
    --mount type=bind,src="$(pwd)"/sql-creds,dst=/run/secrets/ \
    --mount type=bind,src="$(pwd)"/mysql-startup-scripts,dst=/docker-entrypoint-initdb.d \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD_FILE=run/secrets/sql-root-credentials \
    -e MYSQL_DATABASE=the-organizer \
    -e MYSQL_USER_FILE=run/secrets/sql-user \
    -e MYSQL_PASSWORD_FILE=run/secrets/sql-password \
    -t mysql-organizer