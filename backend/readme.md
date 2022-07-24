Build jar
```shell
./gradlew clean build shadowJar
```

Build docker image
```shell
docker build -t gcr.io/<gcp_project_id>/hack-fs-app .
docker push gcr.io/<gcp_project_id>/hack-fs-app
```

Run app from docker image
```shell
docker run -d -p 8080:8080 \
--env HACK_FS_DATABASE_URL='' \
--env HACK_FS_DATABASE_USER='' \
--env HACK_FS_DATABASE_PASSWORD='' \
--env HACK_FS_EMAIL_USERNAME='' \
--env HACK_FS_EMAIL_PASSWORD='' \
--env HACK_FS_POAP_API_KEY='' \
hack-fs-app
```

Run with db (update `docker-compose.yml` with user and password for email):
```shell
docker-compose up --build
```