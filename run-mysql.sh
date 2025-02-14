docker stop mysql-organizer && docker rm mysql-organizer
docker run --name mysql-organizer -v mysql-data:/var/lib/mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 -t mysql-organizer