#!/bin/bash

set -euo pipefail

fossa init

cat .fossa.yml

fossa analyze -o

exec "$@"
