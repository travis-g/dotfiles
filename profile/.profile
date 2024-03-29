export PATH=$PATH:~/bin
export PATH=$PATH:.
export PATH=$PATH:~/.gem/ruby/2.2.0/bin
export PATH=$PATH:~/.gem/ruby/2.6.0/bin

#export XDG_HOME_DIR=$HOME/.config
#export XDG_CONFIG_DIR=$HOME/.config

export PAGER=/usr/bin/less
export EDITOR=/usr/bin/vim
export VISUAL=$EDITOR
export BROWSER="/Users/t/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome -incognito"

case "$TERM" in
    *kitty) export TERMCMD="kitty";;
esac

export GOPATH=~/go
export PATH=$PATH:$GOPATH/bin

export PATH=$PATH:~/.cargo/bin

export PATH="/usr/local/opt/ncurses/bin:$PATH"
export PATH="/usr/local/opt/openssl/bin:$PATH"
export PATH="/usr/local/bin:$PATH"
export PATH="/usr/local/opt/ruby/bin:$PATH"
export PATH="$PATH:~/Library/Python/3.9/bin"

export PATH="/usr/local/opt/terraform@0.13/bin:$PATH"

export HISTFILE="$HOME/.zsh_history"
setopt HIST_EXPIRE_DUPS_FIRST
export HISTSIZE=3000
export HISTFILESIZE=$HISTSIZE

export HISTIGNORE="(ls|clear|exit|fc *)"
export HISTORY_IGNORE=$HISTIGNORE

export FONT="Hack Nerd Font"

export HOMEBREW_CASK_OPTS="--appdir=~/Applications"

