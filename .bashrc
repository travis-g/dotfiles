# ~/.bashrc

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# ignore duplicates and entries starting with space
HISTCONTROL=ignoreboth


# Append to history file, don't overwrite it
shopt -s histappend


# Alias definitions
if [ -f ~/.bash_aliases ]; then
	. ~/.bash_aliases
fi
