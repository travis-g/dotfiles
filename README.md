dotfiles
========

Everything making my two computers pretty. 

Software
--------

Window manager-related:
+ bspwm - tiling WM
+ sxhkd - hotkey daemon for bspwm
+ bar - lightweight status bar/panel
+ conky - system stats in panel
+ xdo - moving floating windows via hotkeys

Overall appearance:
+ feh - sets wallpaper
+ compton - compositing, shadows & transparancy
+ dunst - notification daemon

Colors/Themes:
+ base16-eighties - modified to remove most of the grays
+ Spacegray - Sublime Text 2 theme
+ FlatStudio - GTK2/3 theme
+ Numix - icon theme

### Other
Things I'll forget I have unless I write them down:
+ homepage.py - simple, python-generated HTML homepage
+ ifstatus - network traffic monitor
+ vnstat - network traffic monitor
+ gbdfed - bitmap font editor
+ ranger - commandline filesystem browser


Hardware
--------
:memo: TODO


Techniques
----------
- Config files specify any differences between my two computers in `$HOSTNAME`-based case statements. Any code boils down to:
```bash
case $HOSTNAME in
    "ax-l")   ;;  # for my desktop,
    "ken-th") ;;  # for my netbook.
esac
```

- Master variable file at `/.vars-master`. Color definitions for bspwm and bar are both in there, as well as variables like `$PANEL_HEIGHT`, font definitions, &c. The `argb2rgb()` function is in there too.


MIT License
