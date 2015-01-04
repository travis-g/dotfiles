#!/bin/zsh
xrdb ~/.Xresources
xset +fp /usr/share/fonts/{local,misc}
xset +fp $HOME/.fonts
xset fp rehash

if [ -d /etc/X11/xinit/xinitrc.d ]; then
  for f in /etc/X11/xinit/xinitrc.d/*; do
    [ -x "$f" ] && . "$f"
  done
  unset f
fi

xsetroot -cursor_name left_ptr &
unclutter -grab -noevents -root &
urxvtd &

export BROWSER=luakit
export PATH=$PATH:~/bin

zsh ./.fehbg

compton &

wm
