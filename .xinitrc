#!/bin/zsh

run() {
    . $HOME/.profile
    
    xset +fp /usr/share/fonts/{local,misc}
    xset +fp $HOME/.fonts
    xset fp rehash

    xrdb -load ~/.Xresources
    xrdb -merge ~/.theme/base16-google.dark

    xsetroot -cursor_name left_ptr &
    xsetroot -solid \#198844

    unclutter -grab -noevents -root &
    urxvtd -q -o -f &

    test -f ~/.fehbg && sh ~/.fehbg

    sxhkd &
    exec bspwm || break
}

run this circus
