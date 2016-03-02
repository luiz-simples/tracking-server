USER=server
IMAGE=tkg-image

build-image:
	docker build --rm --force-rm -t ${IMAGE} .

build-container:
	docker run \
		-v ${HOME}/.gitconfig:/${USER}/.gitconfig \
		-v ${HOME}/.ssh:/${USER}/.ssh \
		-v ${PWD}:/${USER}/tracking \
		-w /${USER}/tracking \
		-h dev \
		--dns=8.8.8.8 \
		-it \
		--rm \
		${IMAGE}
