#!/bin/bash

version=0.0.1

function help() {
echo "...
"
exit $1
}

function getopt() {
	case "$1" in
		help) help 0;;
		battery) battery;;
		charge) charge;;
		adapter) adapter;;
		mute) mute;;
		volume) volume;;
		signal) signal;;
		essid) essid;;
		*) help 1;;
	esac

}

# Exit with help if no parameters
if [[ ! $@ ]]; then help 1; fi

getopt "$@"

battery() {
	
}
