Build jar
```shell
./gradlew clean build shadowJar
```

Build docker image
```shell
docker build -t hack-fs-app .
```

Run app from docker image
```shell
docker run -d -p 8080:8080 \
--env HACK_FS_DATABASE_URL='' \
--env HACK_FS_DATABASE_USER='' \
--env HACK_FS_DATABASE_PASSWORD='' \
hack-fs-app
```

Run with db:
```shell
docker-compose up --build
```