#!/bin/sh

usage() {
  cat<<EOF
usage: $(basename $0) [-h] dev

Useful for getting around timed public WiFi sessions. Your wireless device may
need to be restarted after running for the changes to apply.
EOF
}

test "$1" = '-h' && usage && exit 0

DEFAULT_DEV=eth0
DEFAULT_ADDR=ether

dev=${1:-$DEFAULT_DEV}
addr=${2:-$DEFAULT_ADDR}

openssl rand -hex 6 | sed 's/\(..\)/\1:/g; s/.$//' | xargs sudo ifconfig $dev $addr || exit 1
