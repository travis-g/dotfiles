#!/bin/sh

TMPFILE=/tmp/dotfiles.list

R=`tput setaf 1`
G=`tput setaf 2`
B=`tput setaf 6`
N=`tput sgr0`
b=`tput bold`

OK="[${G} OK ${N}]"
NO="[${R}FAIL${N}]"

listfiles() {
    cat <<EOF > $TMPFILE
##
## Here is an auto-generated file for linking
## config files to your \$HOME directory
##
## The $0 script will read filenames from that
## file in order to create ONLY the links you
## want.
##
## The following list lists every single file
## or directory. Just remove the line that you
## don't want to be linked.
## After, save the file and watch the magic.
##
EOF

    echo "listing the whole directory"
    ls $PWD >> $TMPFILE

    # don't show this script in file list
    sed -i "/`basename $0`/d" $TMPFILE
}

config() {
# Edit the tmp file
test -n "$EDITOR" && $EDITOR $TMPFILE || vi $TMPFILE
}

simulate() {
# Print what's going to happen
echo "the following files will be linked:"
for f in `grep -v '^#' $TEMPFILE`
do
    echo "~/.$f -> ${B}${PWD}/$f${N}"
done
}

link() {
    red -p "^C to abort..."
    for f in `grep -v '^#' $TMPFILE`
    do
        echo -n "${f} ... "
        ln -s $PWD/$f ~/.$f 2>/dev/null && echo $OK || echo $NO
    done
}

clean() {
    echo "removing tmp files"
    rm $TMPFILE
}

test -f $TMPFILE || listfiles
config
simulate
link
clean

exit 0
# vim: set ts=4 sw=4 sts=4 et:
