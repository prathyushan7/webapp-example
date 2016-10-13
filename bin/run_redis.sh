#!/bin/bash
BIN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${BIN}")"

docker service create \
        --network backend \
        --endpoint-mode vip \
        --mount "type=bind,source=${ROOT}/data/redis/,target=/data/" \
        --replicas 1 \
        --restart-max-attempts 3 \
        --restart-condition any \
        --restart-delay 5s \
        --name redis \
        redis:3.0.7-alpine \
        redis-server --appendonly yes
