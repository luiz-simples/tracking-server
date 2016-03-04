# tracking-server
Tracking Server

* [DEMO](https://tracking-server.herokuapp.com/)
* [GEM](https://rubygems.org/gems/tracking-api)
* [CONSUME](https://tracking-pages.herokuapp.com/)


## How to contribute?

Environment with:

* [Docker](https://docs.docker.com/)
* [Debian](https://www.debian.org/releases/stable/)
* [Make](http://www.gnu.org/software/make/manual/make.html#Running)
* [NodeJS](https://nodejs.org/dist/latest-v4.x/docs/api/)
* [PostgreSQL](http://www.postgresql.org/docs/9.4/static/)


Make tasks of environment (Makefile commands)

* Build docker image - ```$ make build-image```
* Run docker container - ```$ make build-container```


First steps after environment success (nodeJS and Postgres, with or without docker)
The first step is to configure the ```server.json``` file, include the database crendentials in this file.

```sh
server@dev/tracking$ npm install
server@dev/tracking$ npm test
server@dev/tracking$ node server.js
```
