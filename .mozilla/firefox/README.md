Firefox Tweaks
===============
_via the [ArchWiki](https://wiki.archlinux.org/index.php/firefox_tweaks)_


Remove antiphishing
-------------------
- Under *Security* tab disable: "Block reported attack sites" and "Block reported web forgeries".
- Delete all `urlclassifier` files in profile: `$ rm -i ~/.mozilla/firefox/<profile_dir>/urlclassifier*`

Write-protect `urlclassifier3.sqlite`:

```bash
$ cd ~/.mozilla/firefox/<profile_dir>
$ echo "" > urlclassifier3.sqlite
$ chmod 400 urlclassifier3.sqlite
```

Disable disk cache
------------------
Under *Network - Validation*, turn on *"Override automatic cache management"* and limit cache to zero.


Stop creating ~/Desktop
-----------------------
Make `~/.config/user-dirs.dirs`:

```
XDG_DESKTOP_DIR="/home/user/"
XDG_DOWNLOAD_DIR="/home/user/dir"
XDG_TEMPLATES_DIR="/home/user/dir"
XDG_PUBLICSHARE_DIR="/home/user/dir"
XDG_DOCUMENTS_DIR="/home/user/dir"
XDG_MUSIC_DIR="/home/user/dir"
XDG_PICTURES_DIR="/home/user/dir"
XDG_VIDEOS_DIR="/home/user/dir"
```


Dark GTK input workaround
-------------------------
In `userContent.css`:

```css
input {
    -moz-appearance: none !important;
    background-color: white;
    color: black;
}

textarea {
    -moz-appearance: none !important;
    background-color: white;
    color: black;
}

select {
    -moz-appearance: none !important;
    background-color: white;
    color: black;
}
```


View source code externally
---------------------------

| Key | Value |
|-----|-------|
|view_source.editor.external|true|
|view_source.editor.path|/usr/bin/vim|


More `about:config` changes
---------------------------
| Description | Key | Value |
|-------------|-----|-------|
|Enable pipelining|network.http.pipelining|true|
|Disable tab re-order preview|nglayout.enable_drag_images|false|
|Render pages immediately|nglayout.initialpaint.delay|0|
|Save the session less-frequently|browser.sessionstore.interval|300000|


###See also

- basic adblocker via `userContent.css`: [floppymoose.com](http://www.floppymoose.com/)
- disable *"Use hardware acceleration when available"* under *Advanced - General*
