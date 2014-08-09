dotfiles
========

Everything making my two computers pretty. 

Software
--------
:memo: TODO

Hardware
--------
:memo: TODO


Techniques
----------
- *consistency is key*, so to make configuring easier a number of the config files specify any differences in ``$HOSTNAME``-based case statements. Any code boils down to:
```bash
case $HOSTNAME in
    "ax-l")   ;;  # for my desktop,
    "ken-th") ;;  # for my netbook.
esac
```

- *Master variable file at `/.vars-master`.* Colors for bspwm and bar are both in there, as well as variables like `$PANEL_HEIGHT`, font definitions, &c. The ``argb2rgb()`` function is in there too.


MIT License
