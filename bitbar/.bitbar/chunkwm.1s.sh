#!/bin/sh
# <bitbar.title>Chunkwm Status</bitbar.title>
# <bitbar.author.github>travis-g</bitbar.author.github>
# <bitbar.version>v1.0</bitbar.version>
# <bitbar.desc>Plugin to display basic chunkwm status</bitbar.desc>

export PATH="/usr/local/bin:$PATH"
ID="$(chunkc tiling::query -d id)"
MODE="$(chunkc tiling::query -d mode)"
case $MODE in
    "bsp")
        ICON="﬿";;
    "monocle")
        ICON="";;
    "float")
        ICON="";;
esac

#echo "$ID:$ICON | font=\"Hack Nerd Font\""
echo "$ID:$MODE"
#echo "---"
#echo "$(chunkc tiling::query -d windows | grep -v invalid | cut -c-60)"
