#!/bin/zsh

# Source fonts
xset +fp /usr/share/fonts/local
xset +fp /usr/share/fonts/misc
xset +fp $HOME/.fonts
xset fp rehash

PATH=$PATH:~/bin

if [ -d /etc/X11/xinit/xinitrc.d ]; then
  for f in /etc/X11/xinit/xinitrc.d/*; do
    [ -x "$f" ] && . "$f"
  done
  unset f
fi

# Source .Xresources
[[ -f ~/.Xresources ]] && xrdb -merge ~/.Xresources

export BROWSER=firefox

#udiskie &
#dunst &
zsh ./.fehbg

compton &

xsetroot -cursor_name left_ptr &

wm bspwm
