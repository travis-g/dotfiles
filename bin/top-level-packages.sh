#!/bin/sh
comm -23 <(pacman -Qqt | sort) <(pacman -Qqg base | sort)
