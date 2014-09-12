#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# ignore duplicates and entries starting with space
HISTCONTROL=ignoreboth


# Append to history file, don't overwrite it
shopt -s histappend

#case "$TERM" in
#	xterm-color) color_prompt=yes;;
#esac

# Color support
#alias ls='ls --color=auto'
alias dir='dir --color=auto'
alias grep='grep --color=auto'
alias fgrep='fgrep --color=auto'
alias egrep='egrep --color=auto'

# Alias definitions
if [ -f ~/.bash_aliases ]; then
	. ~/.bash_aliases
fi
