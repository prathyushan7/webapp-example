#!/bin/bash
IMAGE=""

if [ -z "${1}" ]
then
    printf >&2 "You must provide the webapp image to run.\n"
    exit 1
else
    IMAGE="${1}"
fi

docker service create \
        --network frontend \
        --network backend \
        --endpoint-mode vip \
        --replicas 3 \
        --name webapp \
        "${IMAGE}"
