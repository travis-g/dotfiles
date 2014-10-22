# ~/.bashrc

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# ignore dups & padded commands
HISTCONTROL=ignoreboth

# Append to history file
shopt -s histappend

# Source ~/.bash_aliases
[[ -f ~/.bash_aliases ]] && . ~/.bash_aliases
