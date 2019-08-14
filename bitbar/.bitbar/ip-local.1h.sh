#!/bin/sh
# <bitbar.title>Network Addresses</bitbar.title>
# <bitbar.author.github>travis-g</bitbar.author.github>
# <bitbar.version>v1.0</bitbar.version>
# <bitbar.desc>Plugin to display local IP and public IP lookup results</bitbar.desc>

export PATH="/usr/local/bin:$PATH"
LOCAL_IP="$(ifconfig | grep "inet " | grep broadcast | cut -d\  -f2)"

JSON="$(curl -s https://ipapi.co/json)"

REMOTE_IP="$(jq -r .ip <<<$JSON)"
ORG="$(jq -r .org <<<$JSON)"
COUNTRY="$(jq -r .country_name <<<$JSON)"
CITY="$(jq -r .city <<<$JSON)"
REGION="$(jq -r .region <<<$JSON)"
LAT="$(jq -r .latitude <<<$JSON)"
LONG="$(jq -r .longitude <<<$JSON)"

echo "$LOCAL_IP"
echo "---"
echo "$REMOTE_IP"
echo "$ORG | length=20"
echo "---"
echo "$LAT, $LONG"
echo "$CITY, $REGION"
echo "$COUNTRY"
