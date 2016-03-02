USER=server

IMAGE_DATABASE=tkg-database
IMAGE_DEVELOPMENT=tkg-image

CONTAINER_DATABASE=tkg-db-run

DB_USER_DEVELOPMENT=tracking
DB_HOST_DEVELOPMENT=trackingHostDB
DB_PASS_DEVELOPMENT=s9SwY2Ak7eQ6xZ

build-image: build-image-db
	docker build --rm --force-rm -t ${IMAGE_DEVELOPMENT} .

build-image-db:
	docker build -f ./DockerfileDB --rm --force-rm -t ${IMAGE_DATABASE} .

build-container-database:
	( ( docker stop ${CONTAINER_DATABASE} && docker rm ${CONTAINER_DATABASE} ) || echo "Container not found: ${CONTAINER_DATABASE}" ) && \
	docker run \
		-d \
		--dns=8.8.8.8 \
		-h db \
		-e POSTGRES_USER=$(DB_USER_DEVELOPMENT) \
		-e POSTGRES_PASSWORD=$(DB_PASS_DEVELOPMENT) \
	  --name $(CONTAINER_DATABASE) \
		--memory-swap=-1 \
		$(IMAGE_DATABASE)

build-container: build-container-database
	docker run \
		-v ${HOME}/.gitconfig:/${USER}/.gitconfig \
		-v ${HOME}/.ssh:/${USER}/.ssh \
		-v ${PWD}:/${USER}/tracking \
		-w /${USER}/tracking \
		--link ${CONTAINER_DATABASE}:${DB_HOST_DEVELOPMENT} \
		-h dev \
		-p 8080:8080 \
		--dns=8.8.8.8 \
		-it \
		--rm \
		${IMAGE_DEVELOPMENT}
