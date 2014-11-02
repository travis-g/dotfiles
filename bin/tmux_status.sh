#!/bin/zsh

version=1.1.0

function showHelp() {
echo "Usage: tmux_status.sh [options]
Command line system monitor script.

Located at: https://gist.github.com/travis-g/20daace4f4d19eb610f3
Author:     @travis-g (https://github.com/travis-g)
Version:    $version
License:    WTFPL 2 (http://wtfpl2.com/)
"
exit $1
}

# Exit with help if optionless
if [[ ! $@ ]] ; then showHelp 1; fi

function status_audio() {
	echo $(amixer get Master | tail -n1 | cut -d'[' -f4 | sed 's/]//')
}
function status_aux() {
	case $HOSTNAME in
		"ax-l") NUMID=43;;
		"ken-th") NUMID=15;;
	esac
	echo $(amixer -c 0 contents | grep $NUMID -A2 | awk 'NR==3 { print $2 }' | cut -d '=' -f 2)
}
function status_volume(){
	echo $(amixer get Master | tail -n1 | cut -d'[' -f2 | sed 's/%]//')
}
function status_signal() {
	if [[ $HOSTNAME == "ax-l" ]]; then exit; fi
	QUAL=`iwconfig wlp1s0 | grep 'Link Quality=' | awk '{gsub(/[=/]/," "); print $3}'`
	MAX=`iwconfig wlp1s0 | grep 'Link Quality=' | awk '{gsub(/[=/]/," "); print $4}'`
	SIG=`echo $QUAL*100/$MAX | bc`
	echo $SIG
}
function status_charge() {
	if [[ $HOSTNAME == "ax-l" ]]; then exit 0; fi
	echo "$(acpi --battery | cut -d' ' -f4 | sed 's/%//' | sed 's/,//')"
}
function status_battery() {
	if [[ $HOSTNAME == "ax-l" ]]; then exit 0; fi
	echo $(acpi --battery | cut -d' ' -f3 | sed 's/,//') # Full|Charging|Discharging
}
# function status_adapter() {
# 	echo $(acpi -Vf | egrep "Adapter" | cut -d' ' -f3) # on-line|off-line
# }
function status_clock() {
	date +"%a %-m/%-d %-I:%M" # Mon 10/27 12:40
}

function print_essid() {
	if [[ $HOSTNAME == "ax-l" ]]; then exit; fi
	ESSID=`iwgetid -r`
	SIG=`status_signal`
	if [[ $SIG -gt 64 ]]
		then echo "#[fg=green]$ESSID#[fg=default]"
	elif [[ $SIG -lt 65 ]] && [[ $SIG -gt 39 ]]
		then echo "#[fg=yellow]$ESSID#[fg=default]"
	elif [[ $SIG -lt 40 ]]
		then echo "#[fg=red]$ESSID#[fg=default]"
	else echo "#[fg=black]X#[fg=default]"
	fi
}
function print_battery() {
	if [[ $HOSTNAME == "ax-l" ]]; then exit; fi
	STAT=`status_battery`
	case $STAT in
		Full)	echo "#[fg=black]♥ $(status_charge)%#[fg=default]";;
		Charging)	echo "#[fg=green]♥ $(status_charge)%#[fg=default]";;
		Discharging)	echo "#[fg=red]♥ $(status_charge)%#[fg=default]";;
	esac
}
function print_volume() {
	if [[ $(status_audio) == "off" ]]; then
		echo "#[fg=black]♪ $(status_volume)%#[fg=default]"
	else echo "♪ $(status_volume)%"
	fi
}

function main() {
	case $1 in
		audio)		status_audio;;
		aux)		status_aux;;
		sig)		status_signal;;
		#adapter)	status_adapter;;
		charge)		status_charge;;
		clock)		status_clock;;
		essid)		print_essid;;
		bat)		print_battery;;
		vol)		print_volume;;
		help)		showHelp 0;
	esac
}

main "$@"
# vim: set ts=4:et