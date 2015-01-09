source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Enable command completion
autoload -U compinit promptinit
compinit
promptinit

PROMPT="─── "
RPROMPT=""

#setopt AUTO_CD
setopt completealiases
setopt append_history
setopt hist_verify
setopt hist_ignore_all_dups

export PATH=$PATH:~/bin
export EDITOR=vim

source $HOME/etc/sh.d/aliases
