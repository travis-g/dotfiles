# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Source POSIX-level configs
[[ -f ~/.profile ]] && source ~/.profile

# Bash-specific
[[ -f ~/.bash.d/rc ]] && source ~/.bash.d/rc
