#!/bin/sh
V="5"	# vol change increment
case $1 in
	"up") V=$V"+";;
	"down") V=$V"-";;
	"help") echo -e "Usage: $(basename $0) up|down"; exit 0;;
esac;
amixer set Master $V
