#!/bin/bash
BIN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${BIN}")"

docker service create \
	--network frontend \
	--endpoint-mode vip \
	--publish 8080:8080 \
	--publish 50000:50000 \
	--mount "type=bind,source=${ROOT}/data/jenkins,target=/var/jenkins_home" \
	--replicas 1 \
	--name jenkins \
	jenkins:2.19.1-alpine
