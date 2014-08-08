#	snow.sh
#
#   Snow ASCII snowflakes that accumulate at the bottom of the terminal
clear	# clear screen
while :	# while true...
do
	echo 51 170 $(($RANDOM%170)) $(printf "\u2743\n")
	sleep 0.1 	# wait 0.1s
done|	# exit while loop, pipe into gawk
gawk '{a[$3]=0;for(x in a) {o=a[x];a[x]=a[x]+1;printf "\033[%s;%sH ",o,x;printf "\033[%s;%sH%s \033[0;0H",a[x],x,$4;}}' # process output
