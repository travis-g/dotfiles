# ~/.bashrc

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# ignore dups & padded commands
HISTCONTROL=ignoreboth

# Append to history file
shopt -s histappend

# Source ~/.bash_aliases
if [ -f ~/.bash_aliases ]; then
	. ~/.bash_aliases
fi
