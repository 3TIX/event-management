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
docker run -d -p 8080:8080 hack-fs-app
```