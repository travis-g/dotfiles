# ~/.bashrc

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# ignore dups & padded commands
HISTCONTROL=ignoreboth

# Append to history file
shopt -s histappend

# Source ~/.bash_aliases
[[ -f ~/.sh.d/aliases ]] && . ~/.sh.d/aliases

# bash prompt
PS1='─── '

[[ -f ~/.sh.d/style ]] && .~/.sh.d/style

