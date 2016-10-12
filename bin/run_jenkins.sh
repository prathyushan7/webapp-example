#!/bin/bash
BIN="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${BIN}")"

docker run -d -p 8080:8080 -p 50000:50000 -v "${ROOT}/data/jenkins:/var/jenkins_home" --name jenkins jenkins:2.19.1-alpine
