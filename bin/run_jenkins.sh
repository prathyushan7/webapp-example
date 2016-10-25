#!/bin/bash
BIN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${BIN}")"

docker service create \
	--network frontend \
	--endpoint-mode vip \
	--mount "type=bind,source=${ROOT}/data/jenkins/home,target=/var/jenkins_home" \
	--replicas 1 \
	--restart-condition any \
	--restart-delay 5s \
	--constraint engine.labels.role==manager \
	--name jenkins \
	jenkins:2.19.1-alpine
