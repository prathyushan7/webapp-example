#!/bin/bash
BIN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${BIN}")"

docker service create \
        --network frontend \
        --endpoint-mode vip \
        --publish 80:80 \
        --mount "type=bind,source=${ROOT}/config/nginx/nginx.conf,target=/etc/nginx/nginx.conf" \
        --mount "type=bind,source=${ROOT}/config/nginx/conf.d/,target=/etc/nginx/conf.d/" \
        --mount "type=bind,source=${ROOT}/data/nginx/log/,target=/var/log/nginx/" \
        --replicas 1 \
        --restart-condition any \
        --restart-delay 5s \
        --name nginx \
        --constraint engine.labels.role==manager \
        nginx:1.11-alpine
