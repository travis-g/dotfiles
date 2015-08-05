#!/bin/zsh

run() {
    . $HOME/.profile
    
    xset +fp /usr/share/fonts/{local,misc}
    xset +fp $HOME/.fonts
    xset fp rehash

    xrdb -load ~/.Xresources
    xrdb -merge ~/.config/theme/base16-google.dark

    xsetroot -cursor_name left_ptr &
    xsetroot -solid \#000

    urxvtd -q -o -f &

    test -f ~/.fehbg && sh ~/.fehbg
    which compton && compton &

    sxhkd &
    export PANEL_FIFO=/tmp/panel-fifo
    export WM_NAME="bspwm" && exec bspwm || break
}

run this circus
