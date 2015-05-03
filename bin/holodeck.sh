#!/usr/bin/env sh
# 
#   holodeck.sh - generate Star Trek holodeck background noise.
#     Requires SoX and relevant libraries.
#
play -n -c2 synth whitenoise lowpass -1 69 lowpass -1 50 lowpass -1 120 gain +15
