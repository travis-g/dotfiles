#!/bin/sh

# Source fonts
xset +fp /usr/share/fonts/local
xset +fp /usr/share/fonts/misc
xset +fp $HOME/.fonts
xset fp rehash


# Make ~/bin files executable
PATH=$PATH:~/bin

# Make gem files executable
PATH=$PATH:$(ruby -rubygems -e "puts Gem.user_dir")/bin

if [ -d /etc/X11/xinit/xinitrc.d ]; then
  for f in /etc/X11/xinit/xinitrc.d/*; do
    [ -x "$f" ] && . "$f"
  done
  unset f
fi

# Set Xresources to be sourced
[[ -f ~/.Xresources ]] && xrdb -merge ~/.Xresources

# Host-specific startups:
case $HOSTNAME in
	"ax-l")
		# Export env variables
		export BROWSER=chromium

		# Start background programs/daemons
		compton &
		dropboxd &
		udiskie &
        hsetroot -solid \#2d2d2d -tile ~/Dropbox/Photos/iPhone\ Sync/Wallpaper.simple/wLrSjPe.png
		;;
	"ken-th")
		# Export env variables
		export BROWSER=firefox
		
		# Start daemons
		compton &
		dropboxd &
		udiskie &
		
		# Start notification daemon
		dunst &
        ./.fehsh 0 &
		;;
esac

# Normal cursor
xsetroot -cursor_name left_ptr &

# Start bspwm
export PATH=$PATH:~/.config/bspwm
export DESKTOP_SESSION=bspwm
sxhkd &
[ -e "$PANEL_FIFO" ] && rm "$PANEL_FIFO"
mkfifo "$PANEL_FIFO"
exec bspwm "$PANEL_FIFO" -p W
