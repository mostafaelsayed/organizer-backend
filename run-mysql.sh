source remove-mysql.sh

docker run --name organizer-db \
    -v mysqldata:/var/lib/mysql \
    --mount type=bind,src="$(pwd)"/sql-creds,dst=/run/secrets/ \
    --mount type=bind,src="$(pwd)"/mysql-startup-scripts,dst=/docker-entrypoint-initdb.d \
    --mount type=bind,src="$(pwd)"/database/seed,dst=/var/lib/mysql-files/seed/ \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD_FILE=run/secrets/sql-root-credentials.txt \
    -e MYSQL_DATABASE=organizer \
    -e MYSQL_USER_FILE=run/secrets/sql-user.txt -e MYSQL_PASSWORD_FILE=run/secrets/sql-password.txt  \
    -t organizer/db