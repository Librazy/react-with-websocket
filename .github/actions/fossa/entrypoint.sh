#!/bin/bash

set -euo pipefail

fossa init

exec "$@"
