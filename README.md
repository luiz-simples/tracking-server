# tracking-server
Tracking Server

## How to install?
```sh
$ npm install
```

## How to contribute?

Environment with:

* [Docker](https://docs.docker.com/)
* [Debian](https://www.debian.org/releases/stable/)
* [Make](http://www.gnu.org/software/make/manual/make.html#Running)
* [NodeJS](https://nodejs.org/dist/latest-v4.x/docs/api/)


Make tasks of environment

* Build docker image - ```$ make build-image```
* Create docker container - ```$ make build-container```
* Run docker container - ```$ make attach-container```


First steps after environment builded
```sh
server@dev/tracking$ npm install
server@dev/tracking$ npm test
```
