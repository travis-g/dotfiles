#!/bin/sh
export PATH="$PATH:~/bin"
export PATH="$PATH:~/.local/bin"
export PATH="$PATH:."
export PATH=~/.rvm/gems/ruby-3.3.6/bin:$PATH

if command -v nvim >/dev/null 2>&1; then
  EDITOR="$(command -v nvim)"
elif command -v vim >/dev/null 2>&1; then
  EDITOR="$(command -v vim)"
else
  EDITOR=/bin/vi
fi
export EDITOR
export VISUAL=$EDITOR
export PAGER=/usr/bin/less

#export BROWSER="/Users/t/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome -incognito"
export BROWSER="/Applications/Firefox.app/Contents/MacOS/firefox --private-window"

case "$TERM" in
    *kitty) export TERMCMD="kitty";;
esac

export GOPATH="$HOME/go"
export PATH=$PATH:$GOPATH/bin

export PATH="/usr/local/opt/ncurses/bin:$PATH"
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="/usr/local/opt/ruby/bin:$PATH"
export PATH="$PATH:~/Library/Python/3.9/bin"

# shopt -s HIST_EXPIRE_DUPS_FIRST
export HISTSIZE=3000
export HISTFILESIZE=$HISTSIZE

# ignore dups & padded commands
export HISTCONTROL=ignoreboth
export HISTIGNORE="(ls|clear|exit|fc *)"
export HISTORY_IGNORE=$HISTIGNORE

export HOMEBREW_CASK_OPTS="--appdir=~/Applications"
export PATH=/usr/local/Cellar/:$PATH

# Add RVM to PATH for scripting. Make sure this is the last PATH variable change.
export PATH="$PATH:$HOME/.rvm/bin"
[ -s "$HOME/.rvm/scripts/rvm" ] && . "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
